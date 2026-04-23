import { Link } from 'react-router-dom';

type Props = {
  title: string;
  subtitle?: string;
  backTo?: string;
};

export function PageHeader({ title, subtitle, backTo }: Props) {
  return (
    <header className="page-header">
      <div className="page-header__top">
        {backTo ? (
          <Link to={backTo} className="back-link">
            ← Back
          </Link>
        ) : null}
      </div>
      <h1>{title}</h1>
      {subtitle ? <p>{subtitle}</p> : null}
    </header>
  );
}
