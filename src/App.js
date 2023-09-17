import { useState, useRef } from 'react';
import { Playground } from './components/Playground';
import './App.css';

function App() {
  const [keysRange, setKeysRange] = useState('qwerasdf');
  const [reverse, setReverse] = useState(false);
  const [goalTime, setGoalTime] = useState(8);
  const [sfxToggle, setSfxToggle] = useState(true);
  const keyPressRef = useRef();

  return (
    <div>
      <div className="flex justify-center items-center h-[100vh] md:hidden">
        <span>PC에서만 지원되는 사이트입니다.</span>
      </div>
      <div className="hidden md:block">
        <div
          ref={keyPressRef}
          id="setting"
          className="fixed left-2 bottom-2 flex flex-col gap-2 w-56"
        >
          <div className="flex items-center">
            <span className="shrink-0">범위: </span>
            <input
              type="text"
              placeholder="keys"
              maxLength={8}
              value={keysRange}
              onChange={({ target }) => {
                setKeysRange(target.value);
              }}
              className="px-2 w-full border-b-2 border-gray-300 "
            />
          </div>
          <div className="flex items-center">
            <span className="shrink-0">시간(초): </span>
            <input
              type="number"
              placeholder="keys"
              min={1}
              max={30}
              value={goalTime}
              onChange={({ target }) => {
                setGoalTime(parseInt(target.value));
              }}
              className="px-2 w-full border-b-2 border-gray-300 "
              data-tooltip-target="time-tooltip"
              data-tooltip-placement="right"
            />
          </div>
          <div className="flex items-center select-none">
            <input
              id="reverse"
              type="checkbox"
              checked={reverse}
              onChange={() => {
                setReverse(!reverse);
              }}
              className="w-4 h-4 accent-blue-800 cursor-pointer"
            ></input>
            <label htmlFor="reverse" className="ml-1 cursor-pointer">
              상하좌우 반전
              <span className="ml-1 text-blue-800 font-bold">(카멘)</span>
            </label>
            <input
              id="sfx"
              type="checkbox"
              checked={sfxToggle}
              onChange={() => {
                setSfxToggle(!sfxToggle);
              }}
              className="ml-2 w-4 h-4 accent-blue-800 cursor-pointer"
            ></input>
            <label htmlFor="sfx" className="ml-1 cursor-pointer">
              효과음
            </label>
          </div>
        </div>
        <Playground
          reverse={reverse}
          sfxToggle={sfxToggle}
          keysRange={keysRange}
          keyPressRef={keyPressRef}
          goalTime={goalTime}
        />
      </div>
    </div>
  );
}

export default App;
