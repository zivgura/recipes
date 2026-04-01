import { useState } from "react";
import { Search } from "lucide-react";
import { tagLabel } from "../../lib/recipeCatalog.js";
import { RecipeRow } from "../../components/RecipeRow/RecipeRow.jsx";
import "./MainPage.css";

export function MainPage({
  onSelect,
  favs,
  toggleFav,
  recipes,
  allCats,
  allTags,
  tagEmoji,
}) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [activeCat, setActiveCat] = useState("הכל");
  const [showFavs, setShowFavs] = useState(false);

  const filtered = recipes.filter((r) => {
    if (activeCat !== "הכל" && r.category !== activeCat) return false;
    if (activeTag && !r.tags.includes(activeTag)) return false;
    if (showFavs && !favs.includes(r.id)) return false;
    const q = search.trim().toLowerCase();
    return !q || r.title.toLowerCase().includes(q) || r.ingredients.some((i) => i.name.toLowerCase().includes(q));
  });

  const grouped = allCats.filter((c) => c !== "הכל").reduce((acc, cat) => {
    const items = filtered.filter((r) => r.category === cat);
    if (items.length) acc.push({ cat, items });
    return acc;
  }, []);

  const isFiltering = search || activeTag || showFavs || activeCat !== "הכל";

  return (
    <div className="main-page" dir="rtl">
      <div className="main-page__header-wrap">
        <div className="main-page__intro">
          <div className="main-page__kicker">Recipes · 🍴 ספר המתכונים</div>
          <h1 className="main-page__title">
            המתכונים
            <br />
            של זיו
          </h1>
          <p className="main-page__subtitle">
            {recipes.length} מתכונים · {favs.length} מועדפים
          </p>
        </div>

        <div className="main-page__search-wrap">
          <span className="main-page__search-icon">
            <Search size={16} />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם או מצרך..."
            className={`main-page__search${search ? " main-page__search--active" : ""}`}
          />
        </div>

        <div className="main-page__filters">
          {allCats.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveCat(cat)}
              className={`main-page__filter${activeCat === cat ? " main-page__filter--cat-on" : ""}`}
            >
              {cat}
            </button>
          ))}
          <div className="main-page__filter-spacer" />
          {allTags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveTag((t) => (t === tag ? null : tag))}
              className={`main-page__filter${activeTag === tag ? " main-page__filter--tag-on" : ""}`}
            >
              {tagLabel(tag, tagEmoji)}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowFavs((f) => !f)}
            className={`main-page__filter${showFavs ? " main-page__filter--fav-on" : ""}`}
          >
            ❤️ מועדפים
          </button>
        </div>
      </div>

      <div className="main-page__list-pad">
        {filtered.length === 0 ? (
          <div className="main-page__empty">
            <div className="main-page__empty-emoji">🍽️</div>
            <p className="main-page__empty-text">לא נמצאו מתכונים</p>
          </div>
        ) : isFiltering ? (
          <div>
            <div className="main-page__results-label">{filtered.length} תוצאות</div>
            <div className="main-page__card-list">
              {filtered.map((r) => (
                <RecipeRow
                  key={r.id}
                  recipe={r}
                  onClick={() => onSelect(r)}
                  isFav={favs.includes(r.id)}
                  onFav={toggleFav}
                />
              ))}
            </div>
          </div>
        ) : (
          grouped.map(({ cat, items }) => (
            <div key={cat} className="main-page__group">
              <div className="main-page__group-label">{cat}</div>
              <div className="main-page__card-list">
                {items.map((r) => (
                  <RecipeRow
                    key={r.id}
                    recipe={r}
                    onClick={() => onSelect(r)}
                    isFav={favs.includes(r.id)}
                    onFav={toggleFav}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
