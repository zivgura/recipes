import { useState, useEffect, useRef } from "react";
import "./StepTimer.css";

export function StepTimer({ stepId, seconds }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    setTimeLeft(seconds);
    setRunning(false);
    clearInterval(ref.current);
  }, [stepId]);
  useEffect(() => {
    if (running && timeLeft > 0) {
      ref.current = setInterval(
        () =>
          setTimeLeft((t) => {
            if (t <= 1) {
              clearInterval(ref.current);
              setRunning(false);
              return 0;
            }
            return t - 1;
          }),
        1000
      );
    }
    return () => clearInterval(ref.current);
  }, [running]);
  const mins = Math.floor(timeLeft / 60),
    secs = timeLeft % 60;
  const done = timeLeft === 0,
    pct = timeLeft / seconds,
    circ = 2 * Math.PI * 13;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`step-timer${done ? " step-timer--complete" : ""}`}
    >
      <svg width="30" height="30">
        <circle
          cx="15"
          cy="15"
          r="13"
          fill="none"
          stroke={done ? "var(--color-accent)" : "var(--color-brand-light)"}
          strokeWidth="2.5"
        />
        {!done && (
          <circle
            cx="15"
            cy="15"
            r="13"
            fill="none"
            stroke="var(--color-brand)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={`${pct * circ} ${circ}`}
            strokeDashoffset={circ * 0.25}
            className="step-timer__svg-progress"
          />
        )}
        {done ? (
          <text
            x="15"
            y="20"
            textAnchor="middle"
            fontSize="13"
            fill="var(--color-accent)"
            fontWeight="600"
          >
            ✓
          </text>
        ) : (
          <text
            x="15"
            y="19.5"
            textAnchor="middle"
            fontSize="7.5"
            fill="var(--color-brand)"
            fontFamily="inherit"
            fontWeight="600"
          >
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </text>
        )}
      </svg>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          if (!done) setRunning((r) => !r);
        }}
        disabled={done}
        className={`step-timer__btn-main${done ? " step-timer__btn-main--done" : ""}${running && !done ? " step-timer__btn-main--running" : ""}`}
      >
        {done ? "הסתיים ✓" : running ? "השהה" : "התחל"}
      </button>
      {!done && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            clearInterval(ref.current);
            setTimeLeft(seconds);
            setRunning(false);
          }}
          className="step-timer__btn-reset"
        >
          ↺
        </button>
      )}
    </div>
  );
}
