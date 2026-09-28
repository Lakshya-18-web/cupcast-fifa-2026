import { NavLink, Outlet } from "react-router-dom";


function Layout() {
  const navItems = [
    { name: "Home", path: "/" },
    { name: "Predictor", path: "/predictor" },
    { name: "Tournament", path: "/tournament" },
    { name: "Teams", path: "/teams" },
    { name: "Analytics", path: "/analytics" },
    { name: "Methodology", path: "/methodology" },
  ];

  return (
    <div className="app">

      <header className="navbar">

        <div className="navbar-inner">

          <NavLink to="/" className="brand">
            <span className="brand-mark">⚽</span>

            <div>
              <div className="brand-title">
                FIFA 2026
              </div>

              <div className="brand-subtitle">
                Prediction Engine
              </div>
            </div>
          </NavLink>


          <nav className="nav-links">

            {navItems.map((item) => (

              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "nav-link active"
                    : "nav-link"
                }
              >
                {item.name}
              </NavLink>

            ))}

          </nav>

        </div>

      </header>


      <main className="main-content">
        <Outlet />
      </main>


      <footer className="footer">

        <div>
          FIFA World Cup 2026 Prediction Engine
        </div>

        <div>
          Powered by XGBoost + Monte Carlo Simulation
        </div>

      </footer>

    </div>
  );
}


export default Layout;