import React, { useState, useEffect, useRef } from "react";

const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;

export default function StudyClock() {
  const [time, setTime] = useState(FOCUS_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [sessions, setSessions] = useState(0);

  const intervalRef = useRef(null);
  const audioRef = useRef(null);

  // Load from localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("StudyClock"));
    if (saved) {
      setTime(saved.time);
      setIsBreak(saved.isBreak);
      setSessions(saved.sessions);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(
      "StudyClock",
      JSON.stringify({ time, isBreak, sessions })
    );
  }, [time, isBreak, sessions]);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setTime((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            playSound();

            if (!isBreak) setSessions((s) => s + 1);

            const next = !isBreak;
            setIsBreak(next);
            return next ? BREAK_TIME : FOCUS_TIME;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, isBreak]);

  const playSound = () => audioRef.current?.play();

  const handleStartPause = () => setIsRunning(!isRunning);

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setIsRunning(false);
    setIsBreak(false);
    setTime(FOCUS_TIME);
    setSessions(0);
    localStorage.removeItem("StudyClock");
  };

  const formatTime = (t) => {
    const m = Math.floor(t / 60);
    const s = t % 60;
    return `${m.toString().padStart(2, "0")}:${s
      .toString()
      .padStart(2, "0")}`;
  };

  // Circular Progress
  const total = isBreak ? BREAK_TIME : FOCUS_TIME;
  const progress = ((total - time) / total) * 283;

  return (
    <div className="container">
      <h2 className="mode">{isBreak ? "☕ Break" : "🔥Focus"}</h2>

      <div className="circle">
        <svg>
          <circle cx="68" cy="68" r="45" />
          <circle
            cx="68"
            cy="68"
            r="45"
            style={{ strokeDashoffset: 283 - progress }}
          />
        </svg>
        <div className="timer">{formatTime(time)}</div>
      </div>

      <div className="buttons">
        <button onClick={handleStartPause}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>

      <p className="sessions">Completed Sessions: {sessions}</p>

      <audio
        ref={audioRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
      />
    </div>
  );
}
