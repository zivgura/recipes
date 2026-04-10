import { StepTimer } from '../StepTimer/StepTimer.jsx'
import { StepAnnotation } from '../StepAnnotation/StepAnnotation.jsx'
import { StepWarning } from '../StepWarning/StepWarning.jsx'

import checkIcon from '../../assets/check-icon.svg'
import './Step.css'
export function Step({
  step,
  displayNumber,
  isDone,
  onToggleStep,
  ingredients,
  scale
}) {
  return (
    <div
      onClick={() => onToggleStep(step.id)}
      className={`recipe-step${isDone ? ' recipe-step--done' : ''}`}
    >
      <div className='recipe-step__row'>
        <div
          className={`recipe-step__badge${isDone ? ' recipe-step__badge--done' : ''}`}
        >
          {isDone ? (
            <img
              src={checkIcon}
              alt='checkmark'
              className='recipe-step__badge-icon'
            />
          ) : (
            displayNumber
          )}
        </div>
        <div className={`recipe-step__body${isDone ? ' recipe-step__body--done' : ''}`}>
          <p
            className={`recipe-step__text${isDone ? ' recipe-step__text--done' : ''}`}
          >
            <StepAnnotation
              stepText={step.text}
              ingredients={ingredients}
              scale={scale}
              isDone={isDone}
            />
          </p>
          {step.warning && !isDone && <StepWarning>{step.warning}</StepWarning>}
          {step.timer && !isDone && (
            <StepTimer key={step.id} seconds={step.timer} />
          )}
        </div>
      </div>
    </div>
  )
}
