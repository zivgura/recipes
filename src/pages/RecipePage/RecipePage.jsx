import { useState, useEffect, useRef } from 'react'
import { useSwipeable } from 'react-swipeable'
import { ArrowRight, RotateCcw } from 'lucide-react'
import { fmtAmt } from '../../utils/recipeUtils.js'
import { recipeCategoryList } from '../../lib/recipeCatalog.js'
import { Section } from '../../components/Section/Section.jsx'
import { Step } from '../../components/Step/Step.jsx'
import { RecipeDone } from '../../components/RecipeDone/RecipeDone.jsx'

import checkIcon from '../../assets/check-icon.svg'
import './RecipePage.css'

const EDGE_BACK_PX = 40
const MIN_BACK_SWIPE_PX = 56

export function RecipePage({ recipe, onBack }) {
  const [scale, setScale] = useState(1)
  const [done, setDone] = useState({})
  const [checkedIngs, setCheckedIngs] = useState({})
  const [recipeLayout, setRecipeLayout] = useState('combined')
  const [recipeTab, setRecipeTab] = useState('ingredients')
  const isSplit = recipeLayout === 'split'
  const showIngredients = !isSplit || recipeTab === 'ingredients'
  const showDirections = !isSplit || recipeTab === 'directions'
  const toggleStepDone = id => setDone(d => ({ ...d, [id]: !d[id] }))
  const toggleIngredientChecked = id =>
    setCheckedIngs(d => ({ ...d, [id]: !d[id] }))
  const totalSteps = recipe.sections.reduce((a, s) => a + s.steps.length, 0)
  const doneCount = Object.values(done).filter(Boolean).length
  const progress = doneCount / totalSteps
  const checkedIngCount = Object.values(checkedIngs).filter(Boolean).length
  const heroRef = useRef(null)

  const edgeBack = useSwipeable({
    onSwipedRight: e => {
      if (e.initial[0] > EDGE_BACK_PX) return
      if (e.absX < MIN_BACK_SWIPE_PX || e.absX < e.absY) return
      onBack()
    },
    onSwipedLeft: e => {
      const w = window.innerWidth
      if (e.initial[0] < w - EDGE_BACK_PX) return
      if (e.absX < MIN_BACK_SWIPE_PX || e.absX < e.absY) return
      onBack()
    },
    trackMouse: false,
    delta: 24
  })

  useEffect(() => {
    const hero = heroRef.current
    if (!hero) return

    const SCROLL_START = 10
    const SCROLL_RANGE = 200

    const onScroll = () => {
      const y = window.scrollY
      const t = Math.min(1, Math.max(0, (y - SCROLL_START) / SCROLL_RANGE))
      hero.style.setProperty('--recipe-hero-shrink', t.toFixed(4))
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className='recipe-page' {...edgeBack}>
      <div className='recipe-page__toolbar'>
        <div className='recipe-page__toolbar-start'>
          <button type='button' onClick={onBack} className='recipe-page__back'>
            <ArrowRight size={17} strokeWidth={2.5} /> כל המתכונים
          </button>
        </div>
        <div className='recipe-page__toolbar-center'>
          {doneCount > 0 && (
            <div className='recipe-page__progress-wrap'>
              <div className='recipe-page__progress-track'>
                <div
                  className='recipe-page__progress-fill'
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
              <span className='recipe-page__progress-label'>
                {doneCount}/{totalSteps}
              </span>
            </div>
          )}
        </div>
        <div className='recipe-page__toolbar-end' aria-hidden='true' />
      </div>

      <div className='recipe-page__content' dir='rtl'>
        <div
          ref={heroRef}
          className='recipe-page__card recipe-page__card--hero'
        >
          {/* <div className="recipe-page__emoji">{recipe.emoji}</div> */}
          <div className='recipe-page__title-wrap'>
            <h1 className='recipe-page__title'>{recipe.title}</h1>
            <div className='recipe-page__scale'>
              {/* <span className="recipe-page__scale-label">כמות המתכון:</span> */}
              <button
                type='button'
                className='recipe-page__scale-btn'
                onClick={() => setScale(s => Math.max(0.5, s - 0.5))}
              >
                −
              </button>
              <span className='recipe-page__scale-value'>
                <span>×</span>
                <span className='recipe-page__scale-value-amount'>
                  {fmtAmt(1, scale)}
                </span>
              </span>
              <button
                type='button'
                className='recipe-page__scale-btn'
                onClick={() => setScale(s => s + 0.5)}
              >
                +
              </button>
            </div>
          </div>

          {(recipe.note ?? '').trim() ? (
            <p className='recipe-page__note'>{recipe.note}</p>
          ) : null}

          <div className='recipe-page__tags'>
            {recipeCategoryList(recipe).map((c, i) => (
              <span
                key={`${c}-${i}`}
                className={`recipe-page__tag${i === 0 ? ' recipe-page__tag--primary' : ' recipe-page__tag--muted'}`}
              >
                {c}
              </span>
            ))}
            {/* <span className="recipe-page__tag recipe-page__tag--muted">⏱ {recipe.cookTime}</span> */}
            {recipe.tags.map(t => (
              <span
                key={t}
                className='recipe-page__tag recipe-page__tag--muted'
              >
                {t}
              </span>
            ))}
          </div>

          <div className='recipe-page__layout-wrap'>
            <span
              className='recipe-page__layout-label'
              id='recipe-layout-label'
            >
              תצוגה:
            </span>
            <div
              className='recipe-page__tab-bar recipe-page__tab-bar--layout'
              role='tablist'
              aria-labelledby='recipe-layout-label'
            >
              <button
                type='button'
                role='tab'
                id='recipe-layout-combined'
                aria-selected={recipeLayout === 'combined'}
                aria-controls='recipe-panels'
                className={`recipe-page__tab${recipeLayout === 'combined' ? ' recipe-page__tab--active' : ''}`}
                onClick={() => setRecipeLayout('combined')}
              >
                ביחד
              </button>
              <button
                type='button'
                role='tab'
                id='recipe-layout-split'
                aria-selected={recipeLayout === 'split'}
                aria-controls='recipe-panels'
                className={`recipe-page__tab${recipeLayout === 'split' ? ' recipe-page__tab--active' : ''}`}
                onClick={() => setRecipeLayout('split')}
              >
                טאבים
              </button>
            </div>
          </div>
        </div>

        {isSplit && (
          <div
            className='recipe-page__tab-bar recipe-page__tab-bar--content'
            role='tablist'
            aria-label='מצרכים והוראות'
          >
            <button
              type='button'
              role='tab'
              id='recipe-tab-ingredients'
              aria-selected={recipeTab === 'ingredients'}
              aria-controls='recipe-panel-ingredients'
              className={`recipe-page__tab${recipeTab === 'ingredients' ? ' recipe-page__tab--active' : ''}`}
              onClick={() => setRecipeTab('ingredients')}
            >
              מצרכים
            </button>
            <button
              type='button'
              role='tab'
              id='recipe-tab-directions'
              aria-selected={recipeTab === 'directions'}
              aria-controls='recipe-panel-directions'
              className={`recipe-page__tab${recipeTab === 'directions' ? ' recipe-page__tab--active' : ''}`}
              onClick={() => setRecipeTab('directions')}
            >
              הוראות
            </button>
          </div>
        )}

        <div id='recipe-panels'>
          <div
            className='recipe-page__card recipe-page__card--block'
            id='recipe-panel-ingredients'
            role={isSplit ? 'tabpanel' : 'region'}
            aria-labelledby={
              isSplit ? 'recipe-tab-ingredients' : 'recipe-heading-ingredients'
            }
            hidden={isSplit ? !showIngredients : undefined}
          >
            <div className='recipe-page__block-header'>
              <div className='recipe-heading-ingredients'>
                מצרכים
                {checkedIngCount > 0 && (
                  <span className='recipe-page__count'>
                    {checkedIngCount}/{recipe.ingredients.length}
                  </span>
                )}
              </div>
              {checkedIngCount > 0 && (
                <button
                  type='button'
                  className='recipe-page__reset'
                  onClick={() => setCheckedIngs({})}
                >
                  <RotateCcw size={12} /> איפוס
                </button>
              )}
            </div>
            <div className='recipe-page__ing-list'>
              {recipe.ingredients.map(ing => {
                const isChecked = checkedIngs[ing.id]
                return (
                  <div
                    key={ing.id}
                    onClick={() => toggleIngredientChecked(ing.id)}
                    className={`recipe-page__ing${isChecked ? ' recipe-page__ing--checked' : ''}`}
                  >
                    <div className='recipe-page__ing-label'>
                      <div
                        className={`recipe-page__ing-check${isChecked ? ' recipe-page__ing-check--on' : ''}`}
                      >
                        {isChecked && (
                          <img
                            src={checkIcon}
                            alt='checkmark'
                            className='recipe-page__ing-check-icon'
                          />
                        )}
                      </div>
                      <span
                        className={`recipe-page__ing-name${isChecked ? ' recipe-page__ing-name--checked' : ''}`}
                      >
                        {ing.name}
                      </span>
                    </div>
                    {ing.amount > 0 && (
                      <span
                        className={`recipe-page__ing-amt${isChecked ? ' recipe-page__ing-amt--checked' : ''}`}
                      >
                        <span className='recipe-page__ing-amt-amount'>
                          {fmtAmt(ing.amount, scale)}
                        </span>{' '}
                        {ing.unit}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div
            className='recipe-page__card recipe-page__card--steps'
            id='recipe-panel-directions'
            role={isSplit ? 'tabpanel' : 'region'}
            aria-labelledby={
              isSplit ? 'recipe-tab-directions' : 'recipe-heading-directions'
            }
            hidden={isSplit ? !showDirections : undefined}
          >
            <div className='recipe-page__block-header'>
              <h4 className='recipe-page__h2' id='recipe-heading-directions'>
                הוראות
              </h4>
              {doneCount > 0 && (
                <button
                  type='button'
                  className='recipe-page__reset'
                  onClick={() => setDone({})}
                >
                  <RotateCcw size={12} /> איפוס
                </button>
              )}
            </div>
            <div className='recipe-page__steps-list'>
              {recipe.sections.map((sec, secIdx) => {
                const showSectionHeading =
                  recipe.sections.length > 1 &&
                  !(secIdx === 0 && sec.title === 'הכנה')
                const headingText = sec.title && sec.title.trim()
                return (
                  <Section
                    key={`sec-${secIdx}`}
                    showHeading={showSectionHeading}
                    headingText={headingText}
                    secIndex={secIdx}
                  >
                    {sec.steps.map(step => (
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
                )
              })}
            </div>

            {progress === 1 && <RecipeDone recipeTitle={recipe.title} />}
          </div>
        </div>
      </div>
    </div>
  )
}
