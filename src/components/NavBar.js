import React, { useEffect, useRef, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Compass,
  Home,
  Map,
  PlusCircle,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import "./NavBar.css";

const LOGGED_OUT_LINKS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/trips", label: "Explore trips", icon: Map },
  { to: "/login", label: "Log in", icon: LogIn },
  { to: "/signup", label: "Join", icon: UserPlus },
];

const LOGGED_IN_LINKS = [
  { to: "/", label: "Home", icon: Home, end: true },
  { to: "/trips", label: "Explore trips", icon: Map },
  { to: "/trips/new", label: "New trip", icon: PlusCircle },
  { to: "/profile", label: "My profile", icon: User },
];

function NavLinks({ links, onNavigate, className }) {
  const location = useLocation();
  const prefersReducedMotion = useReducedMotion();

  return (
    <>
      {links.map(({ to, label, icon: Icon, end }) => {
        const isActive = end ? location.pathname === to : location.pathname.startsWith(to);
        return (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive: active }) => `${className} ${active ? "active" : ""}`.trim()}
          >
            <Icon size={17} aria-hidden="true" />
            <span>{label}</span>
            {isActive && !prefersReducedMotion && (
              <motion.span className="nav-indicator" layoutId="nav-indicator" transition={{ type: "spring", stiffness: 400, damping: 32 }} />
            )}
          </NavLink>
        );
      })}
    </>
  );
}

function NavBar() {
  const { user, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerRef = useRef(null);
  const toggleRef = useRef(null);
  const location = useLocation();

  const links = user ? LOGGED_IN_LINKS : LOGGED_OUT_LINKS;

  useEffect(() => {
    setDrawerOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!drawerOpen) return undefined;

    const drawer = drawerRef.current;
    const focusable = drawer?.querySelectorAll('a, button');
    focusable?.[0]?.focus();

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        setDrawerOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (e.key !== "Tab" || !focusable?.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [drawerOpen]);

  return (
    <header>
      <nav className="navbar">
        <div className="navbar-brand">
          <NavLink to="/" className="brand-link">
            <Compass size={22} aria-hidden="true" />
            <span>Glimpse Travels</span>
          </NavLink>
        </div>

        <div className="navbar-links">
          <NavLinks links={links} className="nav-link" />
          {user && (
            <button onClick={logout} className="btn btn-ghost nav-logout">
              <LogOut size={17} aria-hidden="true" />
              <span>Log out</span>
            </button>
          )}
        </div>

        <button
          ref={toggleRef}
          type="button"
          className="navbar-toggle"
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
          aria-controls="mobile-drawer"
          onClick={() => setDrawerOpen((open) => !open)}
        >
          {drawerOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
        </button>
      </nav>

      {drawerOpen && (
        <div className="navbar-drawer-backdrop" onClick={() => setDrawerOpen(false)}>
          <div
            id="mobile-drawer"
            ref={drawerRef}
            className="navbar-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Site menu"
            onClick={(e) => e.stopPropagation()}
          >
            <NavLinks links={links} className="nav-link-mobile" onNavigate={() => setDrawerOpen(false)} />
            {user && (
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  logout();
                }}
                className="btn btn-ghost nav-link-mobile"
              >
                <LogOut size={17} aria-hidden="true" />
                <span>Log out</span>
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default NavBar;
