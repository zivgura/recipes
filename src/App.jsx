import { useState, useEffect } from "react";
import { MainPage } from "./pages/MainPage.jsx";
import { RecipePage } from "./pages/RecipePage.jsx";
import { useRecipes } from "./hooks/useRecipes.js";

export default function App() {
  const [dark, setDark] = useState(() => {
    try {
      return localStorage.getItem("rcp_dark") !== "false";
    } catch {
      return false;
    }
  });
  const [favs, setFavs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("rcp_favs") || "[]");
    } catch {
      return [];
    }
  });
  const [page, setPage] = useState("main");
  const [selected, setSelected] = useState(null);

  const {
    status,
    recipes,
    tagEmoji,
    error,
    allCats,
    allTags,
    requestLogin,
    retry,
    logout,
  } = useRecipes();

  useEffect(() => {
    try {
      localStorage.setItem("rcp_dark", dark);
    } catch {}
  }, [dark]);
  useEffect(() => {
    try {
      localStorage.setItem("rcp_favs", JSON.stringify(favs));
    } catch {}
  }, [favs]);

  const toggleFav = (id) => setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const openRecipe = (r) => {
    setSelected(r);
    setPage("recipe");
    window.scrollTo(0, 0);
  };
  const goBack = () => {
    setPage("main");
    window.scrollTo(0, 0);
  };

  const C = {
    mint: "#ff7043",
    mintFaint: dark ? "#ff704320" : "#fff0ec",
    mintLight: dark ? "#ff704355" : "#ffb39e",
    green: "#e85d2f",
    greenFaint: dark ? "#e85d2f20" : "#fff0ec",
  };

  const bg = dark ? "#160f0c" : "#fff9f7";
  const textMain = dark ? "#f5ede8" : "#23100a";
  const textSub = dark ? "#8a6050" : "#b07060";

  const mainContent =
    status === "ready" ? (
      page === "main" ? (
        <MainPage
          onSelect={openRecipe}
          favs={favs}
          toggleFav={toggleFav}
          C={C}
          dark={dark}
          recipes={recipes}
          allCats={allCats}
          allTags={allTags}
          tagEmoji={tagEmoji}
        />
      ) : (
        selected && <RecipePage recipe={selected} onBack={goBack} favs={favs} toggleFav={toggleFav} C={C} dark={dark} />
      )
    ) : null;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@600;700;800;900&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        ::-webkit-scrollbar{display:none;}
        button,input{-webkit-tap-highlight-color:transparent; transition:all 0.14s;}
      `}</style>

      <button
        onClick={() => setDark((d) => !d)}
        style={{
          position: "fixed",
          bottom: 24,
          left: 20,
          zIndex: 300,
          background: dark ? "#1f1410" : "#fff",
          border: `1.5px solid ${dark ? "#ff704333" : "#ff704322"}`,
          borderRadius: 16,
          width: 46,
          height: 46,
          fontSize: 19,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 4px 24px ${dark ? "#00000060" : "#00000018"}`,
        }}
      >
        {dark ? "☀️" : "🌙"}
      </button>

      {status === "loading" && (
        <div
          style={{
            minHeight: "100vh",
            background: bg,
            fontFamily: "'Nunito',sans-serif",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: textSub,
            fontSize: 16,
            fontWeight: 700,
          }}
          dir="rtl"
        >
          טוען מתכונים…
        </div>
      )}

      {status === "needs_auth" && (
        <div
          style={{
            minHeight: "100vh",
            background: bg,
            fontFamily: "'Nunito',sans-serif",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 20,
            padding: 24,
            color: textMain,
          }}
          dir="rtl"
        >
          <p style={{ fontSize: 22, fontWeight: 900, textAlign: "center" }}>התחברות</p>
          <p style={{ fontSize: 14, color: textSub, textAlign: "center", maxWidth: 360, lineHeight: 1.5 }}>
            המתכונים נשמרים ב-Google Drive. רק מוזמנים שקיבלו שיתוף (Viewer ומעלה) יכולים לצפות — יש להתחבר עם אותו חשבון Google.
          </p>
          <button
            type="button"
            onClick={() => requestLogin()}
            style={{
              background: C.mint,
              color: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "12px 24px",
              fontSize: 15,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            התחבר עם Google
          </button>
          <a
            href={`${import.meta.env.BASE_URL}privacy.html`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 12, color: textSub, fontWeight: 600 }}
          >
            Privacy policy (English)
          </a>
        </div>
      )}

      {status === "no_access" && (
        <div
          style={{
            minHeight: "100vh",
            background: bg,
            fontFamily: "'Nunito',sans-serif",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 24,
            color: textMain,
          }}
          dir="rtl"
        >
          <p style={{ fontSize: 22, fontWeight: 900, textAlign: "center" }}>אין גישה למתכונים</p>
          <p style={{ fontSize: 14, color: textSub, textAlign: "center", maxWidth: 400, lineHeight: 1.55 }}>
            החשבון הזה לא ברשימת המוזמנים ב-Drive: אין הרשאת צפייה בקובץ או בתיקיית המתכונים. בעל הקבצים צריך לשתף איתך ב-Google Drive (Viewer) את אותו כתובת Gmail שאיתה התחברת — או להחליף חשבון למוזמן אחר.
          </p>
          {error && (
            <p
              style={{
                fontSize: 12,
                color: textSub,
                textAlign: "center",
                maxWidth: 420,
                opacity: 0.85,
              }}
            >
              {error}
            </p>
          )}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => {
                logout();
                requestLogin();
              }}
              style={{
                background: "transparent",
                color: C.mint,
                border: `2px solid ${C.mint}`,
                borderRadius: 20,
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              החלף חשבון Google
            </button>
            <button
              type="button"
              onClick={() => retry()}
              style={{
                background: dark ? "#2a1a14" : "#fff0ec",
                color: textMain,
                border: "none",
                borderRadius: 20,
                padding: "10px 18px",
                fontSize: 13,
                fontWeight: 800,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              נסה שוב אחרי שקיבלתי גישה
            </button>
          </div>
        </div>
      )}

      {status === "error" && (
        <div
          style={{
            minHeight: "100vh",
            background: bg,
            fontFamily: "'Nunito',sans-serif",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 16,
            padding: 24,
            color: textMain,
          }}
          dir="rtl"
        >
          <p style={{ fontSize: 18, fontWeight: 800 }}>שגיאה בטעינת מתכונים</p>
          <p
            style={{
              fontSize: 13,
              color: textSub,
              textAlign: "center",
              maxWidth: 420,
              wordBreak: "break-word",
            }}
          >
            {error}
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              background: C.mint,
              color: "#fff",
              border: "none",
              borderRadius: 20,
              padding: "10px 20px",
              fontSize: 14,
              fontWeight: 800,
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            נסה שוב
          </button>
        </div>
      )}

      {mainContent}
    </>
  );
}
