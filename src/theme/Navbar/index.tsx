import React, { useState, useRef, useEffect } from 'react';
import Link from '@docusaurus/Link';
import { useLocation } from '@docusaurus/router';
import styles from './styles.module.css';

// SVG Chevron component - rotates when dropdown is open
const Chevron = ({ isOpen }: { isOpen: boolean }) => (
  <svg
    className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
    width="10"
    height="10"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

// Dropdown item type
interface DropdownItem {
  to: string;
  label: string;
}

// Dropdown component with hover behavior
const Dropdown = ({ label, items }: { label: string; items: DropdownItem[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      closeTimeoutRef.current = null;
    }, 200);
  };

  // Cleanup timeout on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (closeTimeoutRef.current) {
        clearTimeout(closeTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className={styles.dropdown}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={styles.dropdownToggle}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {label}
        <Chevron isOpen={isOpen} />
      </button>
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {items.map((item, idx) => (
            <Link key={idx} to={item.to} className={styles.dropdownItem}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

// NavLink component that detects active state
const NavLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
    >
      {children}
    </Link>
  );
};

// Inline Theta letter for use in "Θpen Telco" text
const ThetaLetter = () => (
  <svg
    className={styles.thetaInline}
    viewBox="0 0 20 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <ellipse cx="10" cy="12" rx="8" ry="10" stroke="currentColor" strokeWidth="2.5" fill="none"/>
    <line x1="2" y1="12" x2="18" y2="12" stroke="currentColor" strokeWidth="2"/>
  </svg>
);

export default function Navbar(): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Listen for scroll on any element using capture phase
  useEffect(() => {
    const handleScroll = (e: Event) => {
      // Get scroll position from the event target (the actual scrolling element)
      const target = e.target as Element | Document;
      let scrollY = 0;

      if (target === document || target === document.documentElement) {
        scrollY = window.scrollY || document.documentElement.scrollTop;
      } else if (target instanceof Element) {
        scrollY = target.scrollTop;
      }

      setIsCollapsed(scrollY > 50);
    };

    // Use capture phase to catch scroll events from any element
    document.addEventListener('scroll', handleScroll, { capture: true, passive: true });

    // Initial check - find any scrolled container
    const checkInitialScroll = () => {
      const scrollY = window.scrollY ||
        document.documentElement.scrollTop ||
        (document.querySelector('[class*="main"]')?.scrollTop ?? 0);
      setIsCollapsed(scrollY > 50);
    };
    checkInitialScroll();

    return () => {
      document.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, []);

  return (
    <nav className={`navbar ${styles.navbar}`}>
        <div className={styles.navbarInner}>
        {/* Logo & Brand with collapse animation */}
        <Link to="/" className={`${styles.brand} ${isCollapsed ? styles.brandCollapsed : ''}`}>
          {/* Animated logo text - individual spans for smooth morphing */}
          <div className={styles.logoText}>
            {/* Θ - stays fixed */}
            <span className={styles.letterTheta}>
              <ThetaLetter />
            </span>

            {/* "pen" - fades out and collapses */}
            <span className={`${styles.letterPen} ${isCollapsed ? styles.letterPenCollapsed : ''}`}>
              pen
            </span>

            {/* Space - collapses */}
            <span className={`${styles.letterSpace} ${isCollapsed ? styles.letterSpaceCollapsed : ''}`}>
              {' '}
            </span>

            {/* T - slides left */}
            <span className={`${styles.letterT} ${isCollapsed ? styles.letterTSlide : ''}`}>
              T
            </span>

            {/* "elco" - fades out */}
            <span className={`${styles.letterFade} ${isCollapsed ? styles.letterFadeOut : ''}`}>
              elco
            </span>
          </div>

          {/* Subtitle - fades out */}
          <span className={`${styles.subtitle} ${isCollapsed ? styles.subtitleHidden : ''}`}>
            by <span className={styles.gsmaHighlight}>GSMA</span>
          </span>
        </Link>

        {/* Nav Items */}
        <div className={styles.navItems}>
          <Dropdown
            label="Research"
            items={[
              { to: '/dashboards', label: 'Dashboard' },
              { to: '/benchmarks', label: 'Benchmarks' },
              { to: '/models', label: 'Models' },
            ]}
          />
          <NavLink to="/leaderboard">Leaderboard</NavLink>
          <NavLink to="/docs">Documentation</NavLink>
        </div>

        {/* Right Items */}
        <div className={styles.navItemsRight}>
          <a
            href="https://github.com/otelcos/open_telco"
            className={styles.navLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>
        </div>
      </div>
    </nav>
  );
}
