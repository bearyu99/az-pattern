import { useState, useEffect, useCallback } from 'react';
import '../App.css';
import keySfx from '../assets/sfx/key.mp3';
import failSfx from '../assets/sfx/fail.mp3';
import successSfx from '../assets/sfx/success.mp3';

export const Playground = (props) => {
  const [keys, setKeys] = useState([]);
  const [currentKeysIndex, setCurrentKeysIndex] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [fail, setFail] = useState(false);
  const [waiting, setWaiting] = useState(false);
  const [remainTime, setRemainTime] = useState('');
  const [timeOver, setTimeOver] = useState(false);
  const [progress, setProgress] = useState(320);

  // 랜덤 키 배열 생성, 리셋
  const reset = useCallback(() => {
    if (!props.keysRange) return;

    const newKeys = [];
    for (let i = 0; i < 8; i++) {
      newKeys.push(
        props.keysRange[Math.floor(Math.random() * props.keysRange.length)]
      );
    }

    setKeys(newKeys);
    setCurrentKeysIndex(0);
    setShowSuccess(false);
    setFail(false);
    setWaiting(false);
    setTimeOver(false);
  }, [props.keysRange]);

  // 타이머, 남은 시간
  useEffect(() => {
    let record = 0;
    let reverse_record = props.goalTime;
    const timer = setInterval(() => {
      record += 0.1;
      reverse_record = parseFloat((reverse_record - 0.1).toFixed(1));
      setRemainTime(reverse_record.toFixed(1));
      setProgress((record / props.goalTime) * 320);
      if (record >= props.goalTime || reverse_record <= 0) {
        setTimeOver(true);
        clearInterval(timer);
      }
    }, 100);

    if (waiting || fail || showSuccess) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [props.goalTime, waiting, fail, showSuccess, timeOver, reset]);

  // Dependency List에 있는 값이 바뀔 때 reset() 실행
  useEffect(() => {
    reset();
  }, [props.keysRange, timeOver, reset]);

  // Key Press 핸들러
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!keys[currentKeysIndex]) return;
      if (waiting) return;
      if (props.keyPressRef.current.contains(e.target)) return;
      if (e.key.toLowerCase() === keys[currentKeysIndex].toLowerCase()) {
        setCurrentKeysIndex((prev) => prev + 1);
        if (currentKeysIndex < keys.length - 1) {
          const keyAudio = new Audio(keySfx);
          keyAudio.volume = props.sfxToggle ? 0.2 : 0;
          keyAudio.play();
        } else {
          setWaiting(true);
          const successAudio = new Audio(successSfx);
          successAudio.volume = props.sfxToggle ? 0.4 : 0;
          successAudio.play();
          setShowSuccess(true);
          setTimeout(() => reset(), 1500);
        }
      } else {
        setWaiting(true);
        const failAudio = new Audio(failSfx);
        failAudio.volume = props.sfxToggle ? 0.3 : 0;
        failAudio.play();
        setFail(true);
        setTimeout(() => reset(), 1500);
      }
    };

    document.addEventListener('keypress', handleKeyPress);

    return () => {
      document.removeEventListener('keypress', handleKeyPress);
    };
  }, [
    keys,
    currentKeysIndex,
    reset,
    waiting,
    props.keyPressRef,
    props.sfxToggle,
  ]);

  return (
    <div
      id="playground"
      className="flex flex-col items-center justify-center h-[100vh] w-full"
    >
      <div id="result" className="relative w-full">
        {showSuccess ? (
          <span className="absolute flex justify-center -top-24 w-full text-4xl">
            성공
          </span>
        ) : null}
      </div>

      <div
        id="key-group"
        className={`relative flex justify-center items-center gap-2 mb-6 w-full  ${
          props.reverse ? '-scale-100' : null
        }`}
      >
        {keys.map((item, index) => {
          return (
            <div
              id="key"
              key={index}
              className={`${
                currentKeysIndex > index ? 'bg-gray-600' : 'bg-gray-400'
              } 
              ${
                index === currentKeysIndex
                  ? props.reverse
                    ? 'current-reverse'
                    : 'current'
                  : null
              } ${
                index === currentKeysIndex ? (fail ? 'fail' : null) : null
              } w-12 h-12 rounded-lg transition-transform`}
            >
              <span
                className={`flex justify-center items-center w-full h-full text-2xl font-bold rounded-lg ${
                  currentKeysIndex > index ? 'bg-gray-500' : 'bg-gray-300'
                } ${props.reverse ? 'translate-y-1' : '-translate-y-1'}`}
              >
                {item.toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>
      <div
        id="timer"
        className="relative w-80 h-6 border-2 rounded-full overflow-hidden"
      >
        <div
          id="bar"
          className="w-full h-full bg-amber-400 origin-left transition-transform"
          style={{
            transform: `translateX(-${progress}px)`,
          }}
        ></div>
        <p
          className="absolute text-center text-sm z-30"
          style={{
            top: '0',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {remainTime}
        </p>
      </div>
    </div>
  );
};
