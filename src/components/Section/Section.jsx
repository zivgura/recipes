import "./Section.css";

export function Section({ showHeading, headingText, secIndex, children }) {
  return (
    <div className={`recipe-section${secIndex > 0 ? " recipe-section--offset" : ""}`}>
      {showHeading && <h3 className="recipe-section__heading">{headingText}</h3>}
      {children}
    </div>
  );
}
