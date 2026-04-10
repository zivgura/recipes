import './Section.css'

export function Section({ showHeading, headingText, children }) {
  return (
    <div className='recipe-section'>
      {showHeading && (
        <div className='recipe-section__heading'>{headingText}</div>
      )}
      {children}
    </div>
  )
}
