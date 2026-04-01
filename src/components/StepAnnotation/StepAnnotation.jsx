import { annotateStep } from "../../utils/recipeUtils.js";
import "./StepAnnotation.css";

export function StepAnnotation({ stepText, ingredients, scale, isDone }) {
  return annotateStep(stepText, ingredients, scale).map((segment, index) =>
    segment.ingredient && segment.formattedAmount ? (
      <span key={index}>
        {segment.text}
        <span
          className={`step-annotation__amount${isDone ? " step-annotation__amount--muted" : ""}`}
        >
          ({segment.formattedAmount})
        </span>
      </span>
    ) : (
      <span key={index}>{segment.text}</span>
    )
  );
}
