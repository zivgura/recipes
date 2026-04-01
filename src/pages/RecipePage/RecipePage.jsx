import { useState } from "react";
import { ArrowRight, Heart, RotateCcw } from "lucide-react";
import { fmtAmt } from "../../utils/recipeUtils.js";
import { Section } from "../../components/Section/Section.jsx";
import { Step } from "../../components/Step/Step.jsx";
import { RecipeDone } from "../../components/RecipeDone/RecipeDone.jsx";
import "./RecipePage.css";

export function RecipePage({ recipe, onBack, favs, toggleFav }) {
  const [scale, setScale] = useState(1);
  const [done, setDone] = useState({});
  const [checkedIngs, setCheckedIngs] = useState({});
  const toggleStepDone = (id) => setDone((d) => ({ ...d, [id]: !d[id] }));
  const toggleIngredientChecked = (id) => setCheckedIngs((d) => ({ ...d, [id]: !d[id] }));
  const totalSteps = recipe.sections.reduce((a, s) => a + s.steps.length, 0);
  const doneCount = Object.values(done).filter(Boolean).length;
  const progress = doneCount / totalSteps;
  const checkedIngCount = Object.values(checkedIngs).filter(Boolean).length;
  const isFav = favs.includes(recipe.id);

  return (
    <div className="recipe-page">
      <div className="recipe-page__toolbar">
        <button type="button" onClick={onBack} className="recipe-page__back">
          <ArrowRight size={17} strokeWidth={2.5} /> כל המתכונים
        </button>

        {doneCount > 0 && (
          <div className="recipe-page__progress-wrap">
            <div className="recipe-page__progress-track">
              <div className="recipe-page__progress-fill" style={{ width: `${progress * 100}%` }} />
            </div>
            <span className="recipe-page__progress-label">
              {doneCount}/{totalSteps}
            </span>
          </div>
        )}

        <button type="button" onClick={() => toggleFav(recipe.id)} className="recipe-page__fav">
          <Heart
            size={18}
            className={`recipe-page__fav-icon${isFav ? " recipe-page__fav-icon--on" : ""}`}
            fill={isFav ? "currentColor" : "none"}
            strokeWidth={2.5}
          />
        </button>
      </div>

      <div className="recipe-page__content" dir="rtl">
        <div className="recipe-page__card recipe-page__card--hero">
          <div className="recipe-page__emoji">{recipe.emoji}</div>
          <h1 className="recipe-page__title">{recipe.title}</h1>

          <div className="recipe-page__tags">
            <span className="recipe-page__tag recipe-page__tag--primary">{recipe.category}</span>
            <span className="recipe-page__tag recipe-page__tag--muted">⏱ {recipe.cookTime}</span>
            <span className="recipe-page__tag recipe-page__tag--muted">
              👤 {recipe.servings} מנות
            </span>
            {recipe.tags.map((t) => (
              <span key={t} className="recipe-page__tag recipe-page__tag--muted">
                {t}
              </span>
            ))}
          </div>

          <div className="recipe-page__scale">
            <span className="recipe-page__scale-label">מנות:</span>
            <button
              type="button"
              className="recipe-page__scale-btn"
              onClick={() => setScale((s) => Math.max(0.5, s - 0.5))}
            >
              −
            </button>
            <span className="recipe-page__scale-value">{fmtAmt(recipe.servings, scale)}</span>
            <button type="button" className="recipe-page__scale-btn" onClick={() => setScale((s) => s + 0.5)}>
              +
            </button>
          </div>
        </div>

        <div className="recipe-page__card recipe-page__card--block">
          <div className="recipe-page__block-header">
            <h2 className="recipe-page__h2">
              <span className="recipe-page__h2-icon">🛒</span>
              מצרכים
              {checkedIngCount > 0 && (
                <span className="recipe-page__count">
                  {checkedIngCount}/{recipe.ingredients.length}
                </span>
              )}
            </h2>
            {checkedIngCount > 0 && (
              <button type="button" className="recipe-page__reset" onClick={() => setCheckedIngs({})}>
                <RotateCcw size={12} /> איפוס
              </button>
            )}
          </div>
          <div className="recipe-page__ing-list">
            {recipe.ingredients.map((ing) => {
              const isChecked = checkedIngs[ing.id];
              return (
                <div
                  key={ing.id}
                  onClick={() => toggleIngredientChecked(ing.id)}
                  className={`recipe-page__ing${isChecked ? " recipe-page__ing--checked" : ""}`}
                >
                  <div className="recipe-page__ing-left">
                    <div
                      className={`recipe-page__ing-check${isChecked ? " recipe-page__ing-check--on" : ""}`}
                    >
                      {isChecked && <span className="recipe-page__ing-check-mark">✓</span>}
                    </div>
                    <span
                      className={`recipe-page__ing-name${isChecked ? " recipe-page__ing-name--checked" : ""}`}
                    >
                      {ing.name}
                    </span>
                  </div>
                  {ing.amount > 0 && (
                    <span
                      className={`recipe-page__ing-amt${isChecked ? " recipe-page__ing-amt--checked" : ""}`}
                    >
                      {fmtAmt(ing.amount, scale)} {ing.unit}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="recipe-page__card recipe-page__card--steps">
          <div className="recipe-page__block-header">
            <h2 className="recipe-page__h2">
              <span className="recipe-page__h2-icon">👨‍🍳</span>
              הכנה
            </h2>
            {doneCount > 0 && (
              <button type="button" className="recipe-page__reset" onClick={() => setDone({})}>
                <RotateCcw size={12} /> איפוס
              </button>
            )}
          </div>
          <div className="recipe-page__steps-list">
            {recipe.sections.map((sec, secIdx) => {
              const showSectionHeading =
                recipe.sections.length > 1 && !(secIdx === 0 && sec.title === "הכנה");
              const headingText = sec.title && sec.title.trim();
              return (
                <Section
                  key={`sec-${secIdx}`}
                  showHeading={showSectionHeading}
                  headingText={headingText}
                  secIndex={secIdx}
                >
                  {sec.steps.map((step) => (
                    <Step
                      key={step.id}
                      step={step}
                      displayNumber={secIdx + 1}
                      isDone={!!done[step.id]}
                      onToggleStep={toggleStepDone}
                      ingredients={recipe.ingredients}
                      scale={scale}
                    />
                  ))}
                </Section>
              );
            })}
          </div>

          {progress === 1 && <RecipeDone recipeTitle={recipe.title} />}
        </div>
      </div>
    </div>
  );
}
