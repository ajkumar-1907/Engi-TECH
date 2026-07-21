import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { SignOut, BookmarkSimple, GearSix, House, Moon, Sun, List, X, CaretDown } from '@phosphor-icons/react';

const LogoMark = () => (
  <svg width="30" height="30" viewBox="0 0 30 30" className="shrink-0">
    <circle cx="15" cy="15" r="13" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
    <circle cx="15" cy="15" r="4.5" fill="hsl(var(--accent))" stroke="hsl(var(--foreground))" strokeWidth="1" />
    <line x1="15" y1="0" x2="15" y2="7" stroke="hsl(var(--primary))" strokeWidth="1.5" />
    <line x1="15" y1="23" x2="15" y2="30" stroke="hsl(var(--primary))" strokeWidth="1.5" />
    <line x1="0" y1="15" x2="7" y2="15" stroke="hsl(var(--primary))" strokeWidth="1.5" />
    <line x1="23" y1="15" x2="30" y2="15" stroke="hsl(var(--primary))" strokeWidth="1.5" />
  </svg>
);

const Header = () => {
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const handleLogout = async () => {
    setProfileOpen(false);
    setMobileOpen(false);
    await logout();
    navigate('/login');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [navigate]);

  return (
    <header className="bg-background/90 backdrop-blur-md border-b border-border sticky top-0 z-50" data-testid="main-header">
      <div className="h-[3px] w-full bg-gradient-to-r from-primary via-accent to-primary" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3 sm:gap-6">
          <Link to="/" className="flex items-center gap-2.5 group" data-testid="logo-link">
            <motion.div whileHover={{ rotate: 90 }} transition={{ type: 'spring', stiffness: 200 }}>
              <LogoMark />
            </motion.div>
            <div className="leading-none">
              <h2 className="text-lg sm:text-xl tracking-tight font-medium text-foreground font-display">
                Engi<span className="text-primary">Tech</span>
              </h2>
              <span className="hidden sm:block text-[9px] font-mono uppercase tracking-[0.25em] text-secondary">
                Ref. Platform
              </span>
            </div>
          </Link>
          <span className="hidden lg:block text-[10px] font-mono text-secondary border-l border-border pl-4 sm:pl-6 uppercase tracking-wider">
            Dwg. by <span className="font-medium text-foreground">Anuj Kumar</span>
          </span>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 border border-border hover:border-primary hover:bg-muted transition-colors"
            data-testid="dark-mode-toggle"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} weight="bold" className="text-accent" /> : <Moon size={18} weight="bold" className="text-foreground" />}
          </button>

          {user ? (
            <>
              <Link
                to="/"
                className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-medium text-foreground hover:text-primary transition-colors px-3 py-2"
                data-testid="nav-home"
              >
                <House size={16} weight="bold" />
                <span className="hidden lg:inline">Home</span>
              </Link>
              <Link
                to="/dashboard"
                className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-medium text-foreground hover:text-primary transition-colors px-3 py-2"
                data-testid="nav-dashboard"
              >
                <BookmarkSimple size={16} weight="bold" />
                <span className="hidden lg:inline">Bookmarks</span>
              </Link>
              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider font-medium text-foreground hover:text-primary transition-colors px-3 py-2"
                  data-testid="nav-admin"
                >
                  <GearSix size={16} weight="bold" />
                  <span className="hidden lg:inline">Admin</span>
                </Link>
              )}

              {/* Profile Dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2 border border-border hover:border-primary hover:bg-muted transition-colors"
                  data-testid="profile-button"
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">
                      {user.name ? user.name[0].toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span className="hidden lg:inline text-sm font-medium text-foreground max-w-[100px] truncate">{user.name}</span>
                  <CaretDown size={14} weight="bold" className={`text-secondary transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-64 bg-card border-2 border-border shadow-tech-sm z-50"
                      data-testid="profile-dropdown"
                    >
                      <div className="p-4 border-b border-border">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                            <span className="text-sm font-bold text-primary-foreground">
                              {user.name ? user.name[0].toUpperCase() : 'U'}
                            </span>
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-secondary truncate">{user.email}</p>
                            <span className="inline-block mt-1 text-[10px] font-mono uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-0.5">
                              {user.role}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-2">
                        <Link
                          to="/dashboard"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full"
                        >
                          <BookmarkSimple size={16} weight="bold" />
                          My Bookmarks
                        </Link>
                        {user.role === 'admin' && (
                          <Link
                            to="/admin"
                            onClick={() => setProfileOpen(false)}
                            className="flex items-center gap-3 px-3 py-2 text-sm text-foreground hover:bg-muted transition-colors w-full"
                          >
                            <GearSix size={16} weight="bold" />
                            Admin Panel
                          </Link>
                        )}
                      </div>
                      <div className="p-2 border-t border-border">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors w-full"
                          data-testid="profile-logout-button"
                        >
                          <SignOut size={16} weight="bold" />
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 font-mono text-xs uppercase tracking-wider font-medium transition-colors border-2 border-primary"
              data-testid="login-link"
            >
              Login
            </Link>
          )}
        </nav>

        {/* Mobile: Theme toggle + Hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 border border-border hover:bg-muted transition-colors"
            data-testid="dark-mode-toggle-mobile"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} weight="bold" className="text-accent" /> : <Moon size={18} weight="bold" className="text-foreground" />}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 border border-border hover:bg-muted transition-colors"
            data-testid="mobile-menu-button"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} weight="bold" className="text-foreground" /> : <List size={20} weight="bold" className="text-foreground" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-border bg-background overflow-hidden"
            data-testid="mobile-menu"
          >
            <div className="px-4 py-4 space-y-1">
              {user ? (
                <>
                  {/* Profile Info */}
                  <div className="flex items-center gap-3 p-3 mb-3 bg-muted border border-border">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0">
                      <span className="text-sm font-bold text-primary-foreground">
                        {user.name ? user.name[0].toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-secondary truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-mono uppercase tracking-wider font-bold text-primary">
                        {user.role}
                      </span>
                    </div>
                  </div>

                  <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    data-testid="mobile-nav-home"
                  >
                    <House size={20} weight="bold" />
                    Home
                  </Link>
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                    data-testid="mobile-nav-dashboard"
                  >
                    <BookmarkSimple size={20} weight="bold" />
                    Bookmarks
                  </Link>
                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                      data-testid="mobile-nav-admin"
                    >
                      <GearSix size={20} weight="bold" />
                      Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-border mt-2 pt-2">
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-3 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
                      data-testid="mobile-logout-button"
                    >
                      <SignOut size={20} weight="bold" />
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block bg-primary text-primary-foreground text-center px-6 py-3 font-mono text-xs uppercase tracking-wider font-medium"
                  data-testid="mobile-login-link"
                >
                  Login
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
