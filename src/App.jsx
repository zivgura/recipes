import { useState, useEffect } from 'react'
import { MainPage } from './pages/MainPage/MainPage.jsx'
import { LoginPage } from './pages/LoginPage/LoginPage.jsx'
import { RecipePage } from './pages/RecipePage/RecipePage.jsx'
import { useRecipes } from './hooks/useRecipes.js'

import './styles/App.css'

export default function App() {
  const [dark] = useState(() => {
    try {
      return localStorage.getItem('rcp_dark') !== 'false'
    } catch {
      return false
    }
  })
  const [page, setPage] = useState('main')
  const [selected, setSelected] = useState(null)

  const {
    status,
    recipes,
    tagEmoji,
    recipesSource,
    error,
    allCats,
    allTags,
    requestLogin,
    retry,
    logout
  } = useRecipes()

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
  }, [dark])

  useEffect(() => {
    try {
      localStorage.setItem('rcp_dark', dark)
    } catch {}
  }, [dark])
  const openRecipe = r => {
    setSelected(r)
    setPage('recipe')
    window.scrollTo(0, 0)
  }
  const goBack = () => {
    setPage('main')
    window.scrollTo(0, 0)
  }

  const mainContent =
    status === 'ready' ? (
      page === 'main' ? (
        <MainPage
          onSelect={openRecipe}
          recipes={recipes}
          allCats={allCats}
          allTags={allTags}
          tagEmoji={tagEmoji}
          onRefreshFromDrive={recipesSource === 'cache' ? retry : undefined}
          logout={logout}
        />
      ) : (
        selected && <RecipePage recipe={selected} onBack={goBack} />
      )
    ) : null

  return (
    <>
      {/* <button
        type="button"
        onClick={() => setDark((d) => !d)}
        className="app-theme-toggle"
        aria-label="החלפת ערכת נושא"
      >
        {dark ? "☀️" : "🌙"}
      </button> */}

      {status === 'loading' && (
        <div className='app-loading' dir='rtl'>
          טוען מתכונים…
        </div>
      )}

      {status === 'needs_auth' && <LoginPage requestLogin={requestLogin} />}

      {status === 'no_access' && (
        <div className='app-fullscreen app-fullscreen--gap-md' dir='rtl'>
          <p className='app-no-access-title'>אין גישה למתכונים</p>
          <p className='app-auth-body app-auth-body--wide'>
            החשבון הזה לא ברשימת המוזמנים ב-Drive: אין הרשאת צפייה בקובץ או
            בתיקיית המתכונים. בעל הקבצים צריך לשתף איתך ב-Google Drive (Viewer)
            את אותו כתובת Gmail שאיתה התחברת — או להחליף חשבון למוזמן אחר.
          </p>
          {error && <p className='app-error-detail'>{error}</p>}
          <div className='app-actions-row'>
            <button
              type='button'
              onClick={() => {
                logout()
                requestLogin()
              }}
              className='app-btn-outline'
            >
              החלף חשבון Google
            </button>
            <button
              type='button'
              onClick={() => retry()}
              className='app-btn-secondary'
            >
              נסה שוב אחרי שקיבלתי גישה
            </button>
          </div>
        </div>
      )}

      {status === 'error' && (
        <div className='app-fullscreen app-fullscreen--gap-md' dir='rtl'>
          <p className='app-error-title'>שגיאה בטעינת מתכונים</p>
          <p className='app-error-msg'>{error}</p>
          <button
            type='button'
            onClick={() => retry()}
            className='app-btn-primary app-btn-primary--sm'
          >
            נסה שוב
          </button>
        </div>
      )}

      {status === 'ready' && <>{mainContent}</>}
    </>
  )
}
