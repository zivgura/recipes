import { useState } from "react";
import { Heart, ChevronLeft } from "lucide-react";
import "./RecipeRow.css";

export function RecipeRow({ recipe, onClick, isFav, onFav }) {
  const [pressed, setPressed] = useState(false);
  return (
    <div
      onClick={onClick}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerLeave={() => setPressed(false)}
      className={`recipe-row${pressed ? " recipe-row--pressed" : ""}`}
    >
      <div className="recipe-row__thumb">{recipe.emoji}</div>

      <div className="recipe-row__main">
        <div className="recipe-row__title">{recipe.title}</div>
        <div className="recipe-row__meta-row">
          <span className="recipe-row__cat">{recipe.category}</span>
          <span className="recipe-row__meta">
            {recipe.cookTime} · {recipe.ingredients.length} מצרכים
          </span>
        </div>
      </div>

      <div className="recipe-row__actions">
        <button
          type="button"
          className="recipe-row__fav-btn"
          onClick={(e) => {
            e.stopPropagation();
            onFav(recipe.id);
          }}
        >
          <Heart
            className={`recipe-row__fav-icon${isFav ? " recipe-row__fav-icon--active" : ""}`}
            size={19}
            fill={isFav ? "currentColor" : "none"}
            strokeWidth={2}
          />
        </button>
        <ChevronLeft className="recipe-row__chevron" size={18} strokeWidth={2.5} />
      </div>
    </div>
  );
}
