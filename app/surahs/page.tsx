"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Heart,
  ArrowLeft,
  BookOpen,
  LayoutGrid,
  List,
} from "lucide-react";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export default function SurahsPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filterType, setFilterType] = useState<"all" | "Meccan" | "Medinan">(
    "all",
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("quran-favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFavorite = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newFavs = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(newFavs);
    localStorage.setItem("quran-favorites", JSON.stringify(newFavs));
  };

  useEffect(() => {
    fetch("http://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setSurahs(data.data);
          setFilteredSurahs(data.data);
        }
      });
  }, []);

  useEffect(() => {
    let result = surahs;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter(
        (s) =>
          s.number.toString().includes(term) ||
          s.name.toLowerCase().includes(term) ||
          s.englishName.toLowerCase().includes(term) ||
          s.englishNameTranslation.toLowerCase().includes(term),
      );
    }
    if (filterType !== "all") {
      result = result.filter((s) => s.revelationType === filterType);
    }
    setFilteredSurahs(result);
  }, [searchTerm, surahs, filterType]);

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
          --gold-muted: rgba(181,141,71,0.12);
          --text-muted: #6b7c74;
          --white: #ffffff;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--cream);
          color: var(--forest);
          font-family: &apos;DM Sans&apos;, sans-serif;
        }

        .page-root {
          min-height: 100vh;
          background: var(--cream);
          position: relative;
        }

        .page-root::before {
          content: &apos;;
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(ellipse 70% 40% at 100% 0%, rgba(181,141,71,0.07) 0%, transparent 65%),
            radial-gradient(ellipse 50% 60% at 0% 100%, rgba(19,38,32,0.04) 0%, transparent 60%);
          pointer-events: none;
          z-index: 0;
        }

        /* HEADER */
        .site-header {
          position: sticky;
          top: 0;
          z-index: 100;
          background: rgba(244, 235, 210, 0.9);
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(181,141,71,0.18);
        }

        .header-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 70px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--forest);
          text-decoration: none;
          font-size: 0.875rem;
          font-weight: 400;
          opacity: 0.65;
          transition: opacity 0.2s, color 0.2s;
        }

        .back-link:hover { opacity: 1; color: var(--gold); }

        .header-title {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.6rem;
          font-weight: 400;
          letter-spacing: -0.01em;
          color: var(--forest);
        }

        .header-count {
          font-size: 0.8rem;
          color: var(--text-muted);
          background: var(--gold-muted);
          border: 1px solid rgba(181,141,71,0.2);
          border-radius: 100px;
          padding: 4px 12px;
          white-space: nowrap;
        }

        /* MAIN */
        .main-content {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 3rem 2rem 6rem;
        }

        /* TOOLBAR */
        .toolbar {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .search-wrap {
          flex: 1;
          min-width: 260px;
          position: relative;
        }

        .search-icon {
          position: absolute;
          left: 18px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--gold);
          pointer-events: none;
        }

        .search-input {
          width: 100%;
          background: var(--white);
          border: 1.5px solid rgba(181,141,71,0.22);
          border-radius: 14px;
          padding: 14px 18px 14px 48px;
          font-size: 0.95rem;
          color: var(--forest);
          font-family: &apos;DM Sans&apos;, sans-serif;
          outline: none;
          transition: border-color 0.25s, box-shadow 0.25s;
          box-shadow: 0 2px 12px rgba(181,141,71,0.07);
        }

        .search-input::placeholder { color: #a8b5ae; }
        .search-input:focus {
          border-color: var(--gold);
          box-shadow: 0 0 0 3px rgba(181,141,71,0.1);
        }

        /* Filter pills */
        .filter-group {
          display: flex;
          gap: 6px;
        }

        .filter-pill {
          padding: 8px 18px;
          border-radius: 100px;
          font-size: 0.78rem;
          font-weight: 500;
          letter-spacing: 0.04em;
          border: 1.5px solid rgba(181,141,71,0.25);
          background: transparent;
          color: var(--text-muted);
          cursor: pointer;
          transition: all 0.2s;
          font-family: &apos;DM Sans&apos;, sans-serif;
        }

        .filter-pill:hover {
          border-color: var(--gold);
          color: var(--gold);
        }

        .filter-pill.active {
          background: var(--forest);
          border-color: var(--forest);
          color: var(--cream);
        }

        /* View toggle */
        .view-toggle {
          display: flex;
          background: var(--white);
          border: 1.5px solid rgba(181,141,71,0.2);
          border-radius: 10px;
          overflow: hidden;
        }

        .view-btn {
          padding: 8px 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          transition: background 0.2s, color 0.2s;
        }

        .view-btn.active {
          background: var(--forest);
          color: var(--cream);
        }

        /* RESULTS INFO */
        .results-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid rgba(181,141,71,0.15);
        }

        .results-label {
          font-size: 0.8rem;
          color: var(--text-muted);
          letter-spacing: 0.04em;
        }

        .results-label strong {
          color: var(--forest);
          font-weight: 500;
        }

        /* GRID MODE */
        .surahs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 1024px) { .surahs-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .surahs-grid { grid-template-columns: 1fr; } }

        .surah-card {
          background: var(--white);
          border: 1.5px solid rgba(181,141,71,0.15);
          border-radius: 20px;
          padding: 1.75rem;
          text-decoration: none;
          color: inherit;
          display: block;
          position: relative;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          overflow: hidden;
          opacity: 0;
          animation: fadeUp 0.4s ease forwards;
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .surah-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 44px rgba(181,141,71,0.14), 0 4px 14px rgba(19,38,32,0.07);
          border-color: rgba(181,141,71,0.38);
        }

        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
        }

        .card-left-meta {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .surah-num {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          background: rgba(19,38,32,0.05);
          border: 1px solid rgba(19,38,32,0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.35rem;
          font-weight: 500;
          color: var(--forest);
          transition: background 0.3s, color 0.3s;
          flex-shrink: 0;
        }

        .surah-card:hover .surah-num {
          background: var(--forest);
          color: var(--cream);
        }

        .rev-badge {
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.07em;
          text-transform: uppercase;
        }

        .rev-badge.meccan {
          background: rgba(181,141,71,0.1);
          color: #8a6a2a;
          border: 1px solid rgba(181,141,71,0.22);
        }

        .rev-badge.medinan {
          background: rgba(19,38,32,0.06);
          color: var(--forest-light);
          border: 1px solid rgba(19,38,32,0.1);
        }

        .fav-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 6px;
          border-radius: 8px;
          color: #c0bfbc;
          transition: color 0.2s, background 0.2s;
          display: flex;
          align-items: center;
        }

        .fav-btn:hover { background: rgba(181,141,71,0.08); color: var(--gold); }
        .fav-btn.active { color: #e05a5a; }

        .arabic-name {
          font-family: &apos;Amiri&apos;, serif;
          font-size: 2.2rem;
          font-weight: 400;
          color: var(--forest);
          text-align: right;
          direction: rtl;
          line-height: 1.25;
          margin-bottom: 0.6rem;
          transition: color 0.3s;
        }

        .surah-card:hover .arabic-name { color: var(--gold); }

        .english-name {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--forest);
          margin-bottom: 3px;
          letter-spacing: -0.01em;
        }

        .english-meaning {
          font-size: 0.8rem;
          color: var(--text-muted);
          line-height: 1.5;
        }

        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 1.4rem;
          padding-top: 1.1rem;
          border-top: 1px solid rgba(181,141,71,0.1);
        }

        .ayah-info .label {
          font-size: 0.7rem;
          color: var(--text-muted);
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .ayah-info .value {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.25rem;
          font-weight: 500;
          color: var(--gold);
          line-height: 1;
          margin-top: 1px;
        }

        .read-cta {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          color: rgba(19,38,32,0.3);
          transition: color 0.2s;
        }

        .surah-card:hover .read-cta { color: var(--gold); }

        /* LIST MODE */
        .surahs-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          background: rgba(181,141,71,0.1);
          border-radius: 20px;
          overflow: hidden;
          border: 1.5px solid rgba(181,141,71,0.15);
        }

        .list-item {
          background: var(--white);
          padding: 1.1rem 1.5rem;
          display: grid;
          grid-template-columns: 56px 1fr auto auto;
          align-items: center;
          gap: 1.25rem;
          text-decoration: none;
          color: inherit;
          transition: background 0.2s;
          position: relative;
          opacity: 0;
          animation: fadeUp 0.3s ease forwards;
        }

        .list-item:hover { background: rgba(181,141,71,0.04); }

        .list-num {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          background: rgba(19,38,32,0.05);
          border: 1px solid rgba(19,38,32,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--forest);
          flex-shrink: 0;
          transition: background 0.2s, color 0.2s;
        }

        .list-item:hover .list-num {
          background: var(--forest);
          color: var(--cream);
        }

        .list-names {}

        .list-english {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.15rem;
          font-weight: 500;
          color: var(--forest);
          line-height: 1.2;
        }

        .list-meaning {
          font-size: 0.78rem;
          color: var(--text-muted);
          margin-top: 2px;
        }

        .list-arabic {
          font-family: &apos;Amiri&apos;, serif;
          font-size: 1.6rem;
          color: var(--forest);
          direction: rtl;
          text-align: right;
          transition: color 0.2s;
        }

        .list-item:hover .list-arabic { color: var(--gold); }

        .list-meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 6px;
        }

        .list-ayahs {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.1rem;
          font-weight: 500;
          color: var(--gold);
        }

        @media (max-width: 640px) {
          .list-item {
            grid-template-columns: 44px 1fr auto;
          }
          .list-arabic { display: none; }
        }

        /* EMPTY */
        .empty-state {
          text-align: center;
          padding: 6rem 2rem;
          color: var(--text-muted);
        }

        .empty-icon {
          width: 64px;
          height: 64px;
          background: var(--gold-muted);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 1.5rem;
          color: var(--gold);
        }

        .empty-title {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.6rem;
          font-weight: 400;
          color: var(--forest);
          margin-bottom: 0.5rem;
        }

        .empty-desc {
          font-size: 0.875rem;
          color: var(--text-muted);
        }
      `}</style>

      <div className="page-root">
        {/* HEADER */}
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="back-link">
              <ArrowLeft size={16} />
              Bosh sahifa
            </Link>

            <h1 className="header-title">Barcha Surahlar</h1>

            <div className="header-count">{filteredSurahs.length} ta surah</div>
          </div>
        </header>

        <main className="main-content">
          {/* TOOLBAR */}
          <div className="toolbar">
            <div className="search-wrap">
              <Search className="search-icon" size={18} />
              <input
                type="text"
                className="search-input"
                placeholder="Surah nomi yoki raqamini kiriting..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="filter-group">
              {(["all", "Meccan", "Medinan"] as const).map((f) => (
                <button
                  key={f}
                  className={`filter-pill ${filterType === f ? "active" : ""}`}
                  onClick={() => setFilterType(f)}
                >
                  {f === "all"
                    ? "Barchasi"
                    : f === "Meccan"
                      ? "Makka"
                      : "Madina"}
                </button>
              ))}
            </div>

            <div className="view-toggle">
              <button
                className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                onClick={() => setViewMode("grid")}
                title="Grid ko&apos;rinish"
              >
                <LayoutGrid size={16} />
              </button>
              <button
                className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                onClick={() => setViewMode("list")}
                title="Ro&apos;yxat ko&apos;rinish"
              >
                <List size={16} />
              </button>
            </div>
          </div>

          {/* RESULTS BAR */}
          <div className="results-bar">
            <p className="results-label">
              <strong>{filteredSurahs.length}</strong> ta surah topildi
              {filterType !== "all" &&
                ` · ${filterType === "Meccan" ? "Makka" : "Madina"} suralar`}
              {searchTerm && ` · "${searchTerm}" bo&apos;yicha`}
            </p>
          </div>

          {/* GRID VIEW */}
          {viewMode === "grid" && (
            <div className="surahs-grid">
              {filteredSurahs.map((surah, i) => (
                <Link
                  key={surah.number}
                  href={`/surah/${surah.number}`}
                  className="surah-card"
                  style={{ animationDelay: `${Math.min(i, 12) * 40}ms` }}
                >
                  <div className="card-top-row">
                    <div className="card-left-meta">
                      <div className="surah-num">{surah.number}</div>
                      <span
                        className={`rev-badge ${surah.revelationType === "Meccan" ? "meccan" : "medinan"}`}
                      >
                        {surah.revelationType === "Meccan" ? "Makka" : "Madina"}
                      </span>
                    </div>
                    {mounted && (
                      <button
                        className={`fav-btn ${favorites.includes(surah.number) ? "active" : ""}`}
                        onClick={(e) => toggleFavorite(surah.number, e)}
                        title={
                          favorites.includes(surah.number)
                            ? "Sevimlilardan olib tashlash"
                            : "Sevimliga qo&apos;shish"
                        }
                      >
                        <Heart
                          size={17}
                          fill={
                            favorites.includes(surah.number)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    )}
                  </div>

                  <div className="arabic-name">{surah.name}</div>

                  <div className="english-name">{surah.englishName}</div>
                  <div className="english-meaning">
                    {surah.englishNameTranslation}
                  </div>

                  <div className="card-footer">
                    <div className="ayah-info">
                      <div className="label">Oyatlar</div>
                      <div className="value">{surah.numberOfAyahs}</div>
                    </div>
                    <div className="read-cta">
                      <BookOpen size={13} />
                      O&apos;qish
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {viewMode === "list" && (
            <div className="surahs-list">
              {filteredSurahs.map((surah, i) => (
                <Link
                  key={surah.number}
                  href={`/surah/${surah.number}`}
                  className="list-item"
                  style={{ animationDelay: `${Math.min(i, 20) * 20}ms` }}
                >
                  <div className="list-num">{surah.number}</div>

                  <div className="list-names">
                    <div className="list-english">{surah.englishName}</div>
                    <div className="list-meaning">
                      {surah.englishNameTranslation}
                    </div>
                  </div>

                  <div className="list-arabic">{surah.name}</div>

                  <div className="list-meta">
                    <span
                      className={`rev-badge ${surah.revelationType === "Meccan" ? "meccan" : "medinan"}`}
                    >
                      {surah.revelationType === "Meccan" ? "Makka" : "Madina"}
                    </span>
                    <span className="list-ayahs">{surah.numberOfAyahs}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* EMPTY STATE */}
          {filteredSurahs.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">
                <Search size={28} />
              </div>
              <h3 className="empty-title">Hech qanday surah topilmadi</h3>
              <p className="empty-desc">Boshqa so&apos;z bilan qidirib ko&apos;ring</p>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
