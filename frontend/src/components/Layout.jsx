import { NavLink, Outlet } from "react-router-dom";
import {
  Bell,
  CloudSun,
  History,
  LayoutDashboard,
  Leaf,
  LogOut,
  Search,
  Settings,
  Sprout,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "../auth/AuthContext";

const links = [
  ["/", LayoutDashboard, "Dashboard"],
  ["/recommend", Leaf, "New recommendation"],
  ["/history", History, "History"],
  ["/insights", TrendingUp, "Insights"],
  ["/settings", Settings, "Settings"],
];
export default function Layout() {
  const { user, logout } = useAuth();
  return (
    <main className="shell">
      <header>
        <div className="brand-icon">
          <Sprout />
        </div>
        <div>
          <b>KrishiMitra AI</b>
          <span>Smart crop intelligence</span>
        </div>
        <div className="search">
          <Search /> Search
        </div>
        <Bell className="bell" />
        <div className="avatar">
          {user?.name
            ?.split(" ")
            .map((x) => x[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()}
        </div>
        <button className="header-logout" onClick={logout} title="Logout">
          <LogOut />
        </button>
      </header>
      <div className="app-grid">
        <aside className="sidebar">
          <nav>
            {links.map(([to, Icon, label]) => (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                <Icon />
                {label}
              </NavLink>
            ))}
            <button className="logout" onClick={logout}>
              <LogOut />
              Logout
            </button>
          </nav>
          <div className="weather">
            <CloudSun />
            <b>Weather connected</b>
            <p>Live climate data improves recommendation accuracy.</p>
          </div>
        </aside>
        <section className="content">
          <Outlet />
        </section>
      </div>
      <nav className="mobile-nav fixed h-auto border-2">
        {links.map(([to, Icon, label]) => (
          <NavLink key={to} to={to} end={to === "/"}>
            <Icon />
            <small>{label.split(" ")[0]}</small>
          </NavLink>
        ))}
      </nav>
    </main>
  );
}
