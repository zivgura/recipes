import { useState } from 'react'
import { Search } from 'lucide-react'
import { tagLabel, recipeCategoryList } from '../../lib/recipeCatalog.js'
import { RecipeRow } from '../../components/RecipeRow/RecipeRow.jsx'
import CategoryIcon from '../../components/CategoryIcon/CategoryIcon.jsx'
import logo from '../../assets/logo.png'
import icon from '../../assets/logo-image.png'
import './MainPage.css'

export function MainPage({
  onSelect,
  recipes,
  allCats,
  allTags,
  tagEmoji,
  onRefreshFromDrive,
  logout
}) {
  const [search, setSearch] = useState('')
  const [activeTag, setActiveTag] = useState(null)
  const [activeCat, setActiveCat] = useState('הכל')

  const filtered = recipes.filter(r => {
    if (activeCat !== 'הכל' && !recipeCategoryList(r).includes(activeCat))
      return false
    if (activeTag && !r.tags.includes(activeTag)) return false
    const q = search.trim().toLowerCase()
    return (
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.ingredients.some(i => i.name.toLowerCase().includes(q))
    )
  })

  const isFiltering = search || activeTag || activeCat !== 'הכל'

  return (
    <div className='main-page' dir='rtl'>
      <div className='main-page__header-wrap'>
        <div className='main-page__header-logout'>
          <button
            type='button'
            className='main-page__header-logout-btn'
            onClick={() => logout()}
          >
            התנתק
          </button>
        </div>
        <div className='main-page__intro'>
          <img src={logo} alt='Logo' className='main-page__logo' />
          <img src={icon} alt='Icon' className='main-page__icon' />
        </div>
      </div>
      <div className='main-page__subtitle-wrap'>
        <div className='main-page__subtitle'>
          <span className='main-page__subtitle-greeting'>היי שלום</span>
          <span className='main-page__subtitle-text'>מה נבשל היום?</span>
        </div>
        <div className='main-page__search-wrap'>
          <span className='main-page__search-icon'>
            <Search size={16} />
          </span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder='חיפוש לפי שם / מצרכים'
            className={`main-page__search${search ? ' main-page__search--active' : ''}`}
          />
        </div>

        <div className='main-page__filters-wrap'>
          <div className='main-page__filters'>
            {allCats.map(cat => (
              <CategoryIcon
                key={cat}
                category={cat}
                selected={activeCat === cat}
                onClick={() => setActiveCat(cat)}
              />
            ))}
            <div className='main-page__filter-spacer' />
            {allTags.map(tag => (
              <button
                key={tag}
                type='button'
                onClick={() => setActiveTag(t => (t === tag ? null : tag))}
                className={`main-page__filter${activeTag === tag ? ' main-page__filter--tag-on' : ''}`}
              >
                {tagLabel(tag, tagEmoji)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className='main-page__list-pad'>
        {onRefreshFromDrive && (
          <button
            type='button'
            className='main-page__sync'
            onClick={onRefreshFromDrive}
          >
            עדכן מ-Google Drive
          </button>
        )}
        {filtered.length === 0 ? (
          <div className='main-page__empty'>
            <div className='main-page__empty-emoji'>🍽️</div>
            <p className='main-page__empty-text'>לא נמצאו מתכונים</p>
          </div>
        ) : isFiltering ? (
          <div>
            <div className='main-page__results-label'>
              {filtered.length} תוצאות
            </div>
            <div className='main-page__card-list'>
              {filtered.map(r => (
                <RecipeRow key={r.id} recipe={r} onClick={() => onSelect(r)} />
              ))}
            </div>
          </div>
        ) : (
          <div className='main-page__group'>
            <div className='main-page__group-label'>
              <span>המתכונים של זיו</span>
              <span className='main-page__group-label-count'>
                {filtered.length} מתכונים
              </span>
            </div>
            <div className='main-page__card-list'>
              {filtered.map(r => (
                <RecipeRow key={r.id} recipe={r} onClick={() => onSelect(r)} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
