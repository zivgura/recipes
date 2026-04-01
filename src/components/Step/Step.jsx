import { StepTimer } from "../StepTimer/StepTimer.jsx";
import { StepAnnotation } from "../StepAnnotation/StepAnnotation.jsx";
import { StepWarning } from "../StepWarning/StepWarning.jsx";

import "./Step.css";

export function Step({ step, displayNumber, isDone, onToggleStep, ingredients, scale }) {
  return (
    <div onClick={() => onToggleStep(step.id)} className={`recipe-step${isDone ? " recipe-step--done" : ""}`}>
      <div className="recipe-step__row">
        <div className={`recipe-step__badge${isDone ? " recipe-step__badge--done" : ""}`}>
          {isDone ? "✓" : displayNumber}
        </div>
        <div className="recipe-step__body">
          <p className={`recipe-step__text${isDone ? " recipe-step__text--done" : ""}`}>
            <StepAnnotation
              stepText={step.text}
              ingredients={ingredients}
              scale={scale}
              isDone={isDone}
            />
          </p>
          {step.warning && !isDone && <StepWarning>{step.warning}</StepWarning>}
          {step.timer && !isDone && <StepTimer stepId={step.id} seconds={step.timer} />}
        </div>
      </div>
    </div>
  );
}
