import { NavLink } from 'react-router-dom';

export function Header() {
  return (
    <header className="site-header">
      <div className="site-header-inner">
        <NavLink to="/" className="brand">
          Dependency Evaluator
        </NavLink>
        <nav className="site-nav">
          <NavLink to="/" end>
            Analyze
          </NavLink>
          <NavLink to="/compare">Compare</NavLink>
        </nav>
      </div>
    </header>
  );
}
