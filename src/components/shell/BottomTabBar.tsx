import { NavLink } from 'react-router-dom';
import { tabRoutes } from '../../lib/constants/routes';

export function BottomTabBar() {
  return (
    <nav className="tab-bar" aria-label="Primary">
      {tabRoutes.map((tab) => (
        <NavLink
          key={tab.path}
          to={tab.path}
          className={({ isActive }) => `tab-bar__item ${isActive ? 'is-active' : ''}`}
        >
          <span className="tab-bar__icon" aria-hidden="true">
            {tab.icon}
          </span>
          <span className="tab-bar__label">{tab.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
