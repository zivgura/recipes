import "./RecipeDone.css";

export function RecipeDone({ recipeTitle }) {
  return (
    <div className="recipe-done">
      <div className="recipe-done__emoji">🎉</div>
      <p className="recipe-done__title">{recipeTitle} מוכן!</p>
    </div>
  );
}
