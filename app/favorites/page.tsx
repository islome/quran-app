"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Trash2, BookOpen, ArrowRight } from "lucide-react";

interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) setSurahs(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem("quran-favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const removeFavorite = (surahNumber: number) => {
    setRemoving(surahNumber);
    setTimeout(() => {
      const updated = favorites.filter((id) => id !== surahNumber);
      setFavorites(updated);
      localStorage.setItem("quran-favorites", JSON.stringify(updated));
      setRemoving(null);
    }, 320);
  };

  const clearAll = () => {
    setFavorites([]);
    localStorage.setItem("quran-favorites", JSON.stringify([]));
  };

  const favoriteSurahs = surahs.filter((s) => favorites.includes(s.number));

  if (loading) {
    return (
      <>
        <style>{`
          @import url(&apos;https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500&family=Amiri:wght@400;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400&display=swap&apos;);
          body { background: #f4ebd2; margin: 0; font-family: &apos;DM Sans&apos;, sans-serif; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
        <div
          style={{
            minHeight: "100vh",
            background: "#f4ebd2",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "1.5rem",
          }}
        >
          <div
            style={{
              fontFamily: "Amiri, serif",
              fontSize: "3rem",
              color: "#132620",
              opacity: 0.12,
            }}
          >
            القرآن الكريم
          </div>
          <div
            style={{
              width: 44,
              height: 44,
              border: "2px solid #b58d47",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <p
            style={{
              color: "#6b7c74",
              fontSize: "0.875rem",
              letterSpacing: "0.06em",
            }}
          >
            Yuklanmoqda...
          </p>
        </div>
      </>
    );
  }

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
          --gold-muted: rgba(181,141,71,0.11);
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
            radial-gradient(ellipse 65% 45% at 90% 5%, rgba(181,141,71,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 45% 55% at 5% 95%, rgba(19,38,32,0.04) 0%, transparent 55%);
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
          gap: 1rem;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--forest);
          text-decoration: none;
          font-size: 0.875rem;
          opacity: 0.6;
          transition: opacity 0.2s, color 0.2s;
          white-space: nowrap;
        }

        .back-link:hover { opacity: 1; color: var(--gold); }

        .header-title {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.55rem;
          font-weight: 400;
          letter-spacing: -0.01em;
          color: var(--forest);
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-title-heart {
          color: #e05a5a;
        }

        .header-count {
          font-size: 0.8rem;
          color: var(--text-muted);
          background: var(--gold-muted);
          border: 1px solid rgba(181,141,71,0.2);
          border-radius: 100px;
          padding: 4px 14px;
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

        /* TOP BAR */
        .top-bar {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          margin-bottom: 2.5rem;
          gap: 1rem;
          flex-wrap: wrap;
        }

        .top-bar-left .eyebrow {
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--gold);
          margin-bottom: 0.3rem;
        }

        .top-bar-left .section-title {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 2.2rem;
          font-weight: 400;
          color: var(--forest);
          letter-spacing: -0.01em;
          line-height: 1.1;
        }

        .clear-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: transparent;
          border: 1.5px solid rgba(224,90,90,0.25);
          border-radius: 10px;
          padding: 8px 16px;
          font-size: 0.78rem;
          font-weight: 500;
          font-family: &apos;DM Sans&apos;, sans-serif;
          color: #c05050;
          cursor: pointer;
          transition: all 0.2s;
        }

        .clear-all-btn:hover {
          background: rgba(224,90,90,0.06);
          border-color: rgba(224,90,90,0.45);
        }

        /* GRID */
        .favorites-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        @media (max-width: 1024px) { .favorites-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .favorites-grid { grid-template-columns: 1fr; } }

        /* CARD */
        .fav-card-wrapper {
          opacity: 1;
          transform: scale(1) translateY(0);
          transition: opacity 0.3s ease, transform 0.3s ease;
        }

        .fav-card-wrapper.removing {
          opacity: 0;
          transform: scale(0.94) translateY(6px);
        }

        .fav-card {
          background: var(--white);
          border: 1.5px solid rgba(181,141,71,0.15);
          border-radius: 20px;
          padding: 1.75rem;
          position: relative;
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
        }

        .fav-card::before {
          content: &apos;;
          position: absolute;
          top: 0; right: 0;
          width: 80px; height: 80px;
          background: radial-gradient(circle at top right, rgba(224,90,90,0.05), transparent 70%);
          pointer-events: none;
        }

        .fav-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(181,141,71,0.12), 0 3px 10px rgba(19,38,32,0.06);
          border-color: rgba(181,141,71,0.32);
        }

        /* Remove btn */
        .remove-btn {
          position: absolute;
          top: 1.25rem;
          right: 1.25rem;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: transparent;
          border: 1px solid rgba(224,90,90,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: rgba(224,90,90,0.45);
          transition: all 0.2s;
          z-index: 2;
        }

        .remove-btn:hover {
          background: rgba(224,90,90,0.08);
          border-color: rgba(224,90,90,0.5);
          color: #e05a5a;
        }

        /* Card content */
        .card-top-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1.5rem;
          padding-right: 40px;
        }

        .card-left {
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

        .fav-card:hover .surah-num {
          background: var(--forest);
          color: var(--cream);
        }

        .rev-badge {
          padding: 3px 10px;
          border-radius: 100px;
          font-size: 0.65rem;
          font-weight: 500;
          letter-spacing: 0.06em;
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

        /* Heart indicator */
        .heart-indicator {
          position: absolute;
          bottom: 1.2rem;
          right: 1.4rem;
          color: rgba(224,90,90,0.25);
          transition: color 0.3s;
        }

        .fav-card:hover .heart-indicator { color: rgba(224,90,90,0.45); }

        .card-link {
          text-decoration: none;
          color: inherit;
          display: block;
          flex: 1;
        }

        .arabic-name {
          font-family: &apos;Amiri&apos;, serif;
          font-size: 2.1rem;
          font-weight: 400;
          color: var(--forest);
          text-align: right;
          direction: rtl;
          line-height: 1.25;
          margin-bottom: 0.6rem;
          transition: color 0.3s;
        }

        .fav-card:hover .arabic-name { color: var(--gold); }

        .english-name {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 1.22rem;
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
          font-size: 0.68rem;
          color: var(--text-muted);
          letter-spacing: 0.08em;
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
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          color: rgba(19,38,32,0.3);
          text-decoration: none;
          transition: color 0.2s;
        }

        .fav-card:hover .read-cta { color: var(--gold); }

        /* EMPTY STATE */
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-height: 60vh;
          text-align: center;
          padding: 2rem;
        }

        .empty-emblem {
          width: 120px;
          height: 120px;
          background: var(--white);
          border: 1.5px solid rgba(181,141,71,0.18);
          border-radius: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 2rem;
          box-shadow: 0 8px 32px rgba(181,141,71,0.08);
          position: relative;
        }

        .empty-emblem-arabic {
          font-family: &apos;Amiri&apos;, serif;
          font-size: 3rem;
          color: var(--forest);
          opacity: 0.12;
          position: absolute;
        }

        .empty-emblem-icon {
          color: rgba(224,90,90,0.3);
          position: relative;
          z-index: 1;
        }

        .empty-title {
          font-family: &apos;Cormorant Garamond&apos;, serif;
          font-size: 2rem;
          font-weight: 400;
          color: var(--forest);
          margin-bottom: 0.75rem;
          letter-spacing: -0.01em;
        }

        .empty-desc {
          font-size: 0.9rem;
          color: var(--text-muted);
          max-width: 380px;
          line-height: 1.7;
          margin-bottom: 2.5rem;
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
          box-shadow: 0 4px 20px rgba(19,38,32,0.18);
        }

        .btn-primary:hover {
          background: var(--forest-light);
          transform: translateY(-1px);
          box-shadow: 0 8px 28px rgba(19,38,32,0.24);
        }

        /* card entrance animation */
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(14px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .fav-card-wrapper {
          opacity: 0;
          animation: fadeUp 0.38s ease forwards;
        }

        .fav-card-wrapper.removing {
          opacity: 0 !important;
          transform: scale(0.94) translateY(6px) !important;
          transition: opacity 0.3s ease, transform 0.3s ease !important;
        }
      `}</style>

      <div className="page-root">
        {/* HEADER */}
        <header className="site-header">
          <div className="header-inner">
            <Link href="/" className="back-link">
              <ArrowLeft size={15} />
              Bosh sahifa
            </Link>

            <h1 className="header-title">
              <Heart
                size={18}
                className="header-title-heart"
                fill="currentColor"
              />
              Sevimli Surahlar
            </h1>

            <div className="header-count">
              {favoriteSurahs.length} ta sevimli
            </div>
          </div>
        </header>

        <main className="main-content">
          {favoriteSurahs.length > 0 ? (
            <>
              {/* TOP BAR */}
              <div className="top-bar">
                <div className="top-bar-left">
                  <p className="eyebrow">Saqlangan surahlar</p>
                  <h2 className="section-title">Sevimlilarim</h2>
                </div>

                <button className="clear-all-btn" onClick={clearAll}>
                  <Trash2 size={13} />
                  Barchasini o&apos;chirish
                </button>
              </div>

              {/* GRID */}
              <div className="favorites-grid">
                {favoriteSurahs.map((surah, i) => (
                  <div
                    key={surah.number}
                    className={`fav-card-wrapper ${removing === surah.number ? "removing" : ""}`}
                    style={{ animationDelay: `${Math.min(i, 12) * 45}ms` }}
                  >
                    <div className="fav-card">
                      {/* Remove button */}
                      <button
                        className="remove-btn"
                        onClick={() => removeFavorite(surah.number)}
                        title="Sevimlilardan olib tashlash"
                      >
                        <Trash2 size={14} />
                      </button>

                      {/* Card top */}
                      <div className="card-top-row">
                        <div className="card-left">
                          <div className="surah-num">{surah.number}</div>
                          <span
                            className={`rev-badge ${surah.revelationType === "Meccan" ? "meccan" : "medinan"}`}
                          >
                            {surah.revelationType === "Meccan"
                              ? "Makka"
                              : "Madina"}
                          </span>
                        </div>
                      </div>

                      {/* Content */}
                      <Link
                        href={`/surah/${surah.number}`}
                        className="card-link"
                      >
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
                          <span className="read-cta">
                            <BookOpen size={13} />
                            O&apos;qish
                          </span>
                        </div>
                      </Link>

                      {/* Decorative heart */}
                      <Heart
                        size={18}
                        className="heart-indicator"
                        fill="currentColor"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            /* EMPTY STATE */
            <div className="empty-state">
              <div className="empty-emblem">
                <span className="empty-emblem-arabic">♡</span>
                <Heart size={40} className="empty-emblem-icon" />
              </div>

              <h2 className="empty-title">Hali sevimli surah yo&apos;q</h2>
              <p className="empty-desc">
                Surahlar sahifasidan yoki o&apos;qish sahifasidan ❤ tugmasini bosib,
                sevimli surahlaringizni shu yerga saqlang.
              </p>

              <Link href="/surahs" className="btn-primary">
                <BookOpen size={16} />
                Surahlarni ko&apos;rish
                <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
