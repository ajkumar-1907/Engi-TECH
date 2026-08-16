import React from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const TitleCell = ({ label, value, className = '' }) => (
  <div className={`border border-border px-3 py-2 sm:px-4 sm:py-3 ${className}`}>
    <p className="text-[9px] font-mono uppercase tracking-[0.2em] text-secondary mb-1">{label}</p>
    <p className="text-xs sm:text-sm font-medium text-foreground truncate">{value}</p>
  </div>
);

const Footer = () => {
  const { user } = useAuth();
  const year = new Date().getFullYear();
  return (
    <footer className="border-t-2 border-border bg-surface mt-auto blueprint-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-10 mb-8 sm:mb-10">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <svg width="24" height="24" viewBox="0 0 30 30">
                <circle cx="15" cy="15" r="13" fill="none" stroke="hsl(var(--primary))" strokeWidth="1.5" />
                <circle cx="15" cy="15" r="4.5" fill="hsl(var(--accent))" stroke="hsl(var(--foreground))" strokeWidth="1" />
              </svg>
              <h3 className="text-xl sm:text-2xl tracking-tight font-medium text-foreground font-display">
                Engi<span className="text-primary">Tech</span>
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed mb-3 max-w-sm">
              A complete B.Tech equipment reference — Mechanical, Electrical, Civil, and Electronics —
              organized by year, semester, and exam relevance.
            </p>
            <p className="text-[10px] font-mono uppercase tracking-wider text-primary">
              Designed &amp; developed by Anuj Kumar
            </p>
          </div>

          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary mb-3 dim-line">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-xs sm:text-sm text-secondary hover:text-primary transition-colors">Home</a></li>
              {user ? (
                <li><a href="/dashboard" className="text-xs sm:text-sm text-secondary hover:text-primary transition-colors">Dashboard</a></li>
              ) : (
                <li><a href="/login" className="text-xs sm:text-sm text-secondary hover:text-primary transition-colors">Login</a></li>
              )}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] text-primary mb-3 dim-line">Coverage</h4>
            <p className="text-xs sm:text-sm text-secondary leading-relaxed">
              83+ Equipment &middot; 4 Branches<br />
              Years 1&ndash;4 &middot; Semesters 1&ndash;8<br />
              Working principles &amp; exam notes
            </p>
          </div>
        </div>

        {/* Title block — like a real engineering drawing sheet */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="border-2 border-border bg-card"
        >
          <div className="grid grid-cols-2 sm:grid-cols-4">
            <TitleCell label="Project" value="EngiTech Reference" className="border-b sm:border-b-0" />
            <TitleCell label="Drawn By" value="Anuj Kumar" className="border-b sm:border-b-0" />
            <TitleCell label="Scale" value="1 : 1 (Full Detail)" />
            <TitleCell label="Sheet No." value={`4 / 4 \u2014 REV ${year}`} />
          </div>
        </motion.div>

        <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4">
          <p className="text-[11px] sm:text-xs font-mono text-secondary text-center sm:text-left">
            &copy; {year} EngiTech &mdash; Built by <span className="font-medium text-foreground">Anuj Kumar</span>
          </p>
          <p className="text-[11px] sm:text-xs font-mono text-secondary uppercase tracking-wider">
            All dimensions in exam-relevant units
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
