"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  Menu,
  X,
  BookOpen,
  Star,
  ArrowRight,
} from "lucide-react";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export default function Home() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState("uz");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  useEffect(() => {
    fetch("http://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setSurahs(data.data);
          setFilteredSurahs(data.data.slice(0, 6));
        }
      });
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredSurahs(surahs.slice(0, 6));
    } else {
      const term = searchTerm.toLowerCase().trim();
      const filtered = surahs.filter(
        (s) =>
          s.number.toString().includes(term) ||
          s.name.toLowerCase().includes(term) ||
          s.englishName.toLowerCase().includes(term) ||
          s.englishNameTranslation.toLowerCase().includes(term),
      );
      setFilteredSurahs(filtered.slice(0, 6));
    }
  }, [searchTerm, surahs]);

  return (
    <>
      <style>{`
        @import url(&apos;https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Amiri:ital,wght@0,400;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap&apos;);

        :root {
          --forest: #132620;
          --cream: #f4ebd2;
          --gold: #b58d47;
          --forest-light: #1e3a30;
          --cream-dark: #e8d9b8;
          --gold-light: #c9a660;
          --gold-muted: #b58d4740;
          --text-muted: #6b7c74;
        }

        * { box-sizing: border-box; }

        body {
          background: var(--cream);
          color: var(--forest);
          font-family: &apos;DM Sans&apos;, sans-serif;
          margin: 0;
        }

        .page-wrapper {
          min-height: 100vh;
          background: var(--cream);
          position: relative;
          overflow-x: hidden;
        }

        /* Decorative background texture */
        .page-wrapper::before {
          content: &apos;;
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(181,141,71,0.08) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 100% 100%, rgba(19,38,32,0.04) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        /* Geometric pattern overlay */
        .geo-pattern {
          position: fixed;
          top: 0; right: 0;
          width: 480px; height: 480px;
          opacity: 0.035;
          pointer-events: none;
          z-index: 0;
        }

        /* ---- HEADER ---- */
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(244, 235, 210, 0.88);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(181,141,71,0.2);
        }

        .header-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 72px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 2rem;
        }

        .logo-group {
          display: flex;
          align-items: center;
          gap: 14px;
          text-decoration: none;
        }

        .logo-emblem {
          width: 44px;
          height: 44px;
          background: var(--forest);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
          color: var(--gold);
          flex-shrink: 0;
          box-shadow: 0 2px 12px rgba(19,38,32,0.15);
        }

        .logo-text h1 {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.6rem;
          font-weight: 500;
          color: var(--forest);
          margin: 0;
          line-height: 1;
          letter-spacing: -0.01em;
        }

        .logo-text p {
          font-family: &apos;Amiri&apos;, serif;
          font-size: 0.7rem;
          color: var(--gold);
          margin: 2px 0 0;
          letter-spacing: 0.05em;
        }

        .main-nav {
          display: flex;
          align-items: center;
          gap: 2.5rem;
          list-style: none;
          margin: 0; padding: 0;
        }

        .main-nav a {
          font-size: 0.875rem;
          font-weight: 400;
          color: var(--forest);
          text-decoration: none;
          letter-spacing: 0.01em;
          opacity: 0.75;
          transition: opacity 0.2s, color 0.2s;
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .main-nav a:hover { opacity: 1; color: var(--gold); }

        .lang-select {
          background: transparent;
          border: 1px solid rgba(181,141,71,0.35);
          color: var(--forest);
          font-size: 0.8rem;
          padding: 6px 10px;
          border-radius: 8px;
          cursor: pointer;
          font-family: &apos;DM Sans&apos;, sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }

        .lang-select:focus { border-color: var(--gold); }

        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--forest);
          padding: 4px;
        }

        @media (max-width: 768px) {
          .main-nav { display: none; }
          .mobile-toggle { display: flex; }
        }

        /* ---- HERO ---- */
        .hero-section {
          position: relative;
          z-index: 1;
          padding: 5rem 2rem 4rem;
          max-width: 1280px;
          margin: 0 auto;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        @media (max-width: 900px) {
          .hero-section {
            grid-template-columns: 1fr;
            padding: 3rem 1.5rem 2rem;
            gap: 2rem;
          }
          .hero-right { display: none; }
        }

        .hero-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: rgba(181,141,71,0.12);
          border: 1px solid rgba(181,141,71,0.3);
          border-radius: 100px;
          padding: 6px 14px;
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 1.5rem;
        }

        .hero-eyebrow span.dot {
          width: 5px; height: 5px;
          background: var(--gold);
          border-radius: 50%;
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.7); }
        }

        .hero-title {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: clamp(3rem, 5vw, 4.8rem);
          font-weight: 300;
          line-height: 1.05;
          color: var(--forest);
          margin: 0 0 1.5rem;
          letter-spacing: -0.02em;
        }

        .hero-title em {
          font-style: italic;
          color: var(--gold);
        }

        .hero-desc {
          font-size: 1rem;
          color: var(--text-muted);
          line-height: 1.7;
          max-width: 420px;
          margin: 0 0 2.5rem;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--forest);
          color: var(--cream);
          border: none;
          border-radius: 12px;
          padding: 14px 28px;
          font-size: 0.9rem;
          font-weight: 500;
          font-family: &apos;DM Sans&apos;, sans-serif;
          cursor: pointer;
          text-decoration: none;
          transition: background 0.25s, transform 0.2s, box-shadow 0.25s;
          box-shadow: 0 4px 20px rgba(19,38,32,0.2);
        }

        .btn-primary:hover {
          background: var(--forest-light);
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(19,38,32,0.28);
        }

        .btn-secondary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          color: var(--forest);
          border: 1.5px solid rgba(19,38,32,0.25);
          border-radius: 12px;
          padding: 13px 24px;
          font-size: 0.9rem;
          font-weight: 400;
          font-family: &apos;DM Sans&apos;, sans-serif;
          cursor: pointer;
          text-decoration: none;
          transition: border-color 0.2s, color 0.2s, background 0.2s;
        }

        .btn-secondary:hover {
          border-color: var(--gold);
          color: var(--gold);
          background: rgba(181,141,71,0.05);
        }

        /* Hero right: decorative Arabic panel */
        .hero-right {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .arabic-panel {
          background: var(--forest);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          text-align: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 20px 60px rgba(19,38,32,0.2);
        }

        .arabic-panel::before {
          content: &apos;;
          position: absolute;
          inset: 0;
          background: radial-gradient(ellipse at 50% 0%, rgba(181,141,71,0.15), transparent 70%);
        }

        .arabic-panel-verse {
          font-family: &apos;Amiri&apos;, serif;
          font-size: 2.2rem;
          color: var(--cream);
          line-height: 1.7;
          direction: rtl;
          margin-bottom: 1.5rem;
          position: relative;
        }

        .arabic-panel-translation {
          font-size: 0.85rem;
          color: rgba(244,235,210,0.55);
          font-style: italic;
          position: relative;
        }

        .arabic-panel-divider {
          width: 40px;
          height: 1px;
          background: rgba(181,141,71,0.5);
          margin: 1rem auto;
          position: relative;
        }

        .arabic-panel-ref {
          font-size: 0.75rem;
          color: var(--gold);
          letter-spacing: 0.08em;
          text-transform: uppercase;
          position: relative;
        }

        /* ---- STATS ---- */
        .stats-section {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem 4rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5px;
          background: rgba(181,141,71,0.15);
          border-radius: 20px;
          overflow: hidden;
          border: 1.5px solid rgba(181,141,71,0.15);
        }

        @media (max-width: 640px) {
          .stats-grid { grid-template-columns: repeat(2, 1fr); }
        }

        .stat-item {
          background: var(--cream);
          padding: 2rem 1.5rem;
          text-align: center;
          transition: background 0.2s;
        }

        .stat-item:hover { background: rgba(181,141,71,0.06); }

        .stat-value {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 2.8rem;
          font-weight: 400;
          color: var(--forest);
          line-height: 1;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          font-size: 0.72rem;
          font-weight: 500;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--text-muted);
        }

        /* ---- SEARCH ---- */
        .search-section {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem 4rem;
        }

        .search-wrapper {
          max-width: 680px;
          margin: 0 auto;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 22px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gold);
          pointer-events: none;
          transition: color 0.2s;
        }

        .search-input {
          width: 100%;
          background: white;
          border: 1.5px solid rgba(181,141,71,0.25);
          border-radius: 16px;
          padding: 18px 20px 18px 56px;
          font-size: 1rem;
          color: var(--forest);
          font-family: &apos;DM Sans&apos;, sans-serif;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
          box-shadow: 0 2px 16px rgba(181,141,71,0.08);
        }

        .search-input::placeholder { color: #a8b5ae; }
        .search-input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 4px rgba(181,141,71,0.1), 0 2px 16px rgba(181,141,71,0.1);
        }

        /* ---- SURAH GRID ---- */
        .surahs-section {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem 6rem;
        }

        .section-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .section-eyebrow {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.4rem;
        }

        .section-title {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 2.4rem;
          font-weight: 400;
          color: var(--forest);
          margin: 0;
          letter-spacing: -0.01em;
          line-height: 1.1;
        }

        .see-all-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.85rem;
          color: var(--gold);
          text-decoration: none;
          font-weight: 500;
          transition: gap 0.2s;
        }

        .see-all-link:hover { gap: 10px; }

        .surahs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 1024px) {
          .surahs-grid { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 640px) {
          .surahs-grid { grid-template-columns: 1fr; }
        }

        .surah-card {
          background: white;
          border: 1.5px solid rgba(181,141,71,0.15);
          border-radius: 20px;
          padding: 2rem;
          text-decoration: none;
          color: inherit;
          display: block;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .surah-card::before {
          content: &apos;;
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(181,141,71,0.04) 0%, transparent 50%);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .surah-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 48px rgba(181,141,71,0.15), 0 4px 12px rgba(19,38,32,0.08);
          border-color: rgba(181,141,71,0.4);
        }

        .surah-card:hover::before { opacity: 1; }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.75rem;
        }

        .surah-number {
          width: 52px;
          height: 52px;
          background: rgba(19,38,32,0.06);
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.5rem;
          font-weight: 500;
          color: var(--forest);
          transition: background 0.3s;
          border: 1px solid rgba(19,38,32,0.08);
        }

        .surah-card:hover .surah-number {
          background: var(--forest);
          color: var(--cream);
        }

        .revelation-badge {
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 0.68rem;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .revelation-badge.meccan {
          background: rgba(181,141,71,0.1);
          color: #8a6a2a;
          border: 1px solid rgba(181,141,71,0.25);
        }

        .revelation-badge.medinan {
          background: rgba(19,38,32,0.07);
          color: #1e3a30;
          border: 1px solid rgba(19,38,32,0.12);
        }

        .arabic-name {
          font-family: &apos;Amiri&apos;, serif;
          font-size: 2.4rem;
          font-weight: 400;
          color: var(--forest);
          text-align: right;
          direction: rtl;
          line-height: 1.2;
          margin-bottom: 0.75rem;
          transition: color 0.3s;
        }

        .surah-card:hover .arabic-name { color: var(--gold); }

        .english-name {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.3rem;
          font-weight: 500;
          color: var(--forest);
          margin: 0 0 4px;
          letter-spacing: -0.01em;
        }

        .english-meaning {
          font-size: 0.82rem;
          color: var(--text-muted);
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.5rem;
          padding-top: 1.25rem;
          border-top: 1px solid rgba(181,141,71,0.12);
        }

        .ayah-label {
          font-size: 0.75rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .ayah-count {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.3rem;
          font-weight: 500;
          color: var(--gold);
        }

        .read-indicator {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.75rem;
          color: rgba(19,38,32,0.35);
          transition: color 0.2s;
        }

        .surah-card:hover .read-indicator {
          color: var(--gold);
        }

        /* Empty state */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 5rem 2rem;
          color: var(--text-muted);
          font-size: 1rem;
        }

        /* Mobile nav */
        .mobile-nav {
          display: none;
          position: fixed;
          inset: 0;
          z-index: 200;
          background: rgba(19,38,32,0.97);
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 2rem;
        }

        .mobile-nav.open { display: flex; }

        .mobile-nav a {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 2.5rem;
          font-weight: 300;
          color: var(--cream);
          text-decoration: none;
          transition: color 0.2s;
        }

        .mobile-nav a:hover { color: var(--gold); }

        .mobile-close {
          position: absolute;
          top: 1.5rem; right: 1.5rem;
          background: none;
          border: none;
          color: var(--cream);
          cursor: pointer;
          opacity: 0.7;
        }
      `}</style>

      <div className="page-wrapper">
        {/* Decorative SVG pattern */}
        <svg className="geo-pattern" viewBox="0 0 480 480" fill="none">
          <circle cx="240" cy="240" r="200" stroke="#b58d47" strokeWidth="1" />
          <circle
            cx="240"
            cy="240"
            r="160"
            stroke="#b58d47"
            strokeWidth="0.5"
          />
          <circle cx="240" cy="240" r="120" stroke="#b58d47" strokeWidth="1" />
          <polygon
            points="240,40 440,360 40,360"
            stroke="#132620"
            strokeWidth="1"
            fill="none"
          />
          <polygon
            points="240,440 40,120 440,120"
            stroke="#132620"
            strokeWidth="0.5"
            fill="none"
          />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="240"
              y1="240"
              x2={240 + 200 * Math.cos((deg * Math.PI) / 180)}
              y2={240 + 200 * Math.sin((deg * Math.PI) / 180)}
              stroke="#b58d47"
              strokeWidth="0.4"
            />
          ))}
        </svg>

        {/* HEADER */}
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="logo-group">
              <div className="logo-emblem">☽</div>
              <div className="logo-text">
                <h1>Al-Quran</h1>
                <p>القرآن الكريم</p>
              </div>
            </Link>

            <nav>
              <ul className="main-nav">
                <li>
                  <Link href="/">Bosh sahifa</Link>
                </li>
                <li>
                  <Link href="/surahs">Surahlar</Link>
                </li>
                <li>
                  <Link href="/favorites">
                    <Heart size={14} />
                    Sevimlilar
                  </Link>
                </li>
              </ul>
            </nav>

            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <select
                className="lang-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="uz">🇺🇿 O&apos;zbek</option>
                <option value="en">🇬🇧 English</option>
                <option value="ru">🇷🇺 Русский</option>
                <option value="ar">🇸🇦 العربية</option>
              </select>

              <button
                className="mobile-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Nav Overlay */}
        <div className={`mobile-nav ${isMenuOpen ? "open" : ""}`}>
          <button className="mobile-close" onClick={() => setIsMenuOpen(false)}>
            <X size={28} />
          </button>
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            Bosh sahifa
          </Link>
          <Link href="/surahs" onClick={() => setIsMenuOpen(false)}>
            Surahlar
          </Link>
          <Link href="/favorites" onClick={() => setIsMenuOpen(false)}>
            Sevimlilar
          </Link>
        </div>

        {/* HERO */}
        <section className="hero-section">
          <div className="hero-left">
            <div className="hero-eyebrow">
              <span className="dot" />
              Muqaddas Kitob
            </div>
            <h2 className="hero-title">
              Ilohiy <em>So&apos;zlar</em>
              <br />
              bilan tanishing
            </h2>
            <p className="hero-desc">
              Qur&apos;oni Karimni o&apos;z ona tilingizda o&apos;qing, tinglang va chuqur
              o&apos;rganing. 114 surah, 6236 oyat — har bir so&apos;z hikmat.
            </p>
            <div className="hero-actions">
              <Link href="/surahs" className="btn-primary">
                <BookOpen size={16} />
                O&apos;qishni boshlash
              </Link>
              <Link href="/favorites" className="btn-secondary">
                <Heart size={16} />
                Sevimlilar
              </Link>
            </div>
          </div>

          <div className="hero-right">
            <div className="arabic-panel" style={{ maxWidth: 360 }}>
              <div className="arabic-panel-verse">
                بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
              </div>
              <div className="arabic-panel-divider" />
              <div className="arabic-panel-translation">
                Mehribon va rahmli Alloh nomi bilan
              </div>
              <div style={{ marginTop: "0.75rem" }}>
                <div className="arabic-panel-ref">Al-Fotiha · 1:1</div>
              </div>
            </div>
          </div>
        </section>

        {/* STATS */}
        <section className="stats-section">
          <div className="stats-grid">
            {[
              { value: "114", label: "Surahlar" },
              { value: "6,236", label: "Oyatlar" },
              { value: "30", label: "Juz&apos;lar" },
              { value: "4+", label: "Tillar" },
            ].map((s, i) => (
              <div key={i} className="stat-item">
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* SEARCH */}
        <section className="search-section">
          <div className="search-wrapper">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              className="search-input"
              placeholder="Surah nomi, raqami yoki tarjima bo&apos;yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>
        </section>

        {/* SURAHS */}
        <section className="surahs-section">
          <div className="section-header">
            <div>
              <p className="section-eyebrow">Eng ko&apos;p o&apos;qiladiganlar</p>
              <h3 className="section-title">Mashhur Surahlar</h3>
            </div>
            <Link href="/surahs" className="see-all-link">
              Barchasini ko&apos;rish
              <ArrowRight size={16} />
            </Link>
          </div>

          <div className="surahs-grid">
            {filteredSurahs.map((surah) => (
              <Link
                key={surah.number}
                href={`/surah/${surah.number}`}
                className="surah-card"
              >
                <div className="card-top">
                  <div className="surah-number">{surah.number}</div>
                  <span
                    className={`revelation-badge ${surah.revelationType === "Meccan" ? "meccan" : "medinan"}`}
                  >
                    {surah.revelationType === "Meccan" ? "Makka" : "Madina"}
                  </span>
                </div>

                <div className="arabic-name">{surah.name}</div>

                <div>
                  <p className="english-name">{surah.englishName}</p>
                  <p className="english-meaning">
                    {surah.englishNameTranslation}
                  </p>
                </div>

                <div className="card-footer">
                  <div>
                    <div className="ayah-label">Oyatlar soni</div>
                    <div className="ayah-count">{surah.numberOfAyahs}</div>
                  </div>
                  <div className="read-indicator">
                    <BookOpen size={13} />
                    O&apos;qish
                  </div>
                </div>
              </Link>
            ))}

            {filteredSurahs.length === 0 && (
              <div className="empty-state">Hech qanday surah topilmadi</div>
            )}
          </div>
        </section>
      </div>
    </>
  );
}
