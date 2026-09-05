export default function PageHead({ eyebrow, title, subtitle, action }) {
  return (
    <div className="page-head">
      <div>
        <p>{eyebrow}</p>
        <h1>{title}</h1>
        <span>{subtitle}</span>
      </div>
      {action}
    </div>
  );
}
