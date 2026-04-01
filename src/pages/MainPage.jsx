import { useState } from "react";
import { Search } from "lucide-react";
import { tagLabel } from "../lib/recipeCatalog.js";
import { RecipeRow } from "../components/RecipeRow.jsx";

export function MainPage({
  onSelect,
  favs,
  toggleFav,
  C,
  dark,
  recipes,
  allCats,
  allTags,
  tagEmoji,
}) {
  const [search, setSearch] = useState("");
  const [activeTag, setActiveTag] = useState(null);
  const [activeCat, setActiveCat] = useState("הכל");
  const [showFavs, setShowFavs] = useState(false);

  const bg = dark ? "#160f0c" : "#fff9f7";
  const card = dark ? "#1f1410" : "#ffffff";
  const textMain = dark ? "#f5ede8" : "#23100a";
  const textSub = dark ? "#8a6050" : "#b07060";
  const borderColor = dark ? "#ffffff0a" : "#0000000a";

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
    <div style={{ minHeight: "100vh", background: bg, fontFamily: "'Nunito',sans-serif" }} dir="rtl">
      <div style={{ padding: "36px 20px 0", background: bg }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.mint, letterSpacing: "0.06em", marginBottom: 6 }}>
            Recipes · 🍴 ספר המתכונים
          </div>
          <h1
            style={{
              fontSize: 34,
              fontWeight: 900,
              color: textMain,
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
            }}
          >
            המתכונים
            <br />
            של זיו
          </h1>
          <p style={{ fontSize: 13, color: textSub, marginTop: 6, fontWeight: 600 }}>
            {recipes.length} מתכונים · {favs.length} מועדפים
          </p>
        </div>

        <div style={{ position: "relative", marginBottom: 14 }}>
          <span
            style={{
              position: "absolute",
              right: 15,
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              pointerEvents: "none",
            }}
          >
            <Search size={16} color={textSub} />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי שם או מצרך..."
            style={{
              width: "100%",
              background: card,
              border: `2px solid ${search ? C.mint : borderColor}`,
              borderRadius: 20,
              padding: "13px 44px 13px 16px",
              fontSize: 15,
              fontWeight: 600,
              color: textMain,
              outline: "none",
              fontFamily: "inherit",
              transition: "border-color 0.2s",
              WebkitAppearance: "none",
            }}
            onFocus={(e) => (e.target.style.borderColor = C.mint)}
            onBlur={(e) => (e.target.style.borderColor = search ? C.mint : borderColor)}
          />
        </div>

        <div
          style={{
            display: "flex",
            gap: 8,
            overflowX: "auto",
            paddingBottom: 16,
            scrollbarWidth: "none",
            WebkitOverflowScrolling: "touch",
            marginLeft: -20,
            marginRight: -20,
            paddingLeft: 20,
            paddingRight: 20,
          }}
        >
          {allCats.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              style={{
                padding: "9px 18px",
                borderRadius: 22,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                border: activeCat === cat ? `2px solid ${C.mint}` : "2px solid transparent",
                background: activeCat === cat ? C.mint : card,
                color: activeCat === cat ? "#fff" : textSub,
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              {cat}
            </button>
          ))}
          <div style={{ width: 1, background: "transparent", flexShrink: 0, margin: "0 2px" }} />
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActiveTag((t) => (t === tag ? null : tag))}
              style={{
                padding: "9px 16px",
                borderRadius: 22,
                fontSize: 13,
                fontWeight: 700,
                cursor: "pointer",
                whiteSpace: "nowrap",
                flexShrink: 0,
                border: activeTag === tag ? `2px solid ${C.mint}` : "2px solid transparent",
                background: activeTag === tag ? C.mintFaint : card,
                color: activeTag === tag ? C.mint : textSub,
                fontFamily: "inherit",
                transition: "all 0.15s",
              }}
            >
              {tagLabel(tag, tagEmoji)}
            </button>
          ))}
          <button
            onClick={() => setShowFavs((f) => !f)}
            style={{
              padding: "9px 16px",
              borderRadius: 22,
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              flexShrink: 0,
              border: showFavs ? "2px solid #ff6b6b" : "2px solid transparent",
              background: showFavs ? "#ff6b6b22" : card,
              color: showFavs ? "#ff6b6b" : textSub,
              fontFamily: "inherit",
              transition: "all 0.15s",
            }}
          >
            ❤️ מועדפים
          </button>
        </div>
      </div>

      <div style={{ paddingBottom: 100 }}>
        {filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "70px 20px", color: textSub }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
            <p style={{ fontSize: 16, fontWeight: 700 }}>לא נמצאו מתכונים</p>
          </div>
        ) : isFiltering ? (
          <div>
            <div style={{ padding: "10px 20px 6px", fontSize: 12, fontWeight: 700, color: textSub }}>
              {filtered.length} תוצאות
            </div>
            <div
              style={{
                background: card,
                borderRadius: 24,
                margin: "0 16px",
                overflow: "hidden",
                boxShadow: dark ? "none" : "0 2px 20px #00000008",
              }}
            >
              {filtered.map((r) => (
                <RecipeRow
                  key={r.id}
                  recipe={r}
                  onClick={() => onSelect(r)}
                  isFav={favs.includes(r.id)}
                  onFav={toggleFav}
                  C={C}
                  dark={dark}
                />
              ))}
            </div>
          </div>
        ) : (
          grouped.map(({ cat, items }) => (
            <div key={cat} style={{ marginBottom: 10 }}>
              <div
                style={{
                  padding: "16px 20px 8px",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  color: C.mint,
                  textTransform: "uppercase",
                }}
              >
                {cat}
              </div>
              <div
                style={{
                  background: card,
                  borderRadius: 24,
                  margin: "0 16px",
                  overflow: "hidden",
                  boxShadow: dark ? "none" : "0 2px 20px #00000008",
                }}
              >
                {items.map((r) => (
                  <RecipeRow
                    key={r.id}
                    recipe={r}
                    onClick={() => onSelect(r)}
                    isFav={favs.includes(r.id)}
                    onFav={toggleFav}
                    C={C}
                    dark={dark}
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
