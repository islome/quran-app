"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import * as React from "react";

interface Ayah {
  number: number;
  text: string;
  translation?: string;
  numberInSurah: number;
  juz: number;
  page: number;
}

interface SurahDetail {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

const languages = [
  { code: "uz", label: "🇺🇿 O'zbek", edition: "uz.sodik" },
  { code: "en", label: "🇬🇧 English", edition: "en.asad" },
  { code: "ru", label: "🇷🇺 Русский", edition: "ru.kuliev" },
  { code: "ar", label: "🇸🇦 العربية", edition: "quran-uthmani" },
];

export default function SurahDetailPage({
  params,
}: {
  params: Promise<{ number: string }>;
}) {
  const resolvedParams = React.use(params);
  const surahNumber = parseInt(resolvedParams.number);

  const [surah, setSurah] = useState<SurahDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [selectedLang, setSelectedLang] = useState("uz");

  // Audio state
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const activeAyahRef = useRef<HTMLDivElement>(null);

  // Favorites
  useEffect(() => {
    const saved = localStorage.getItem("quran-favorites");
    if (saved) {
      const favs: number[] = JSON.parse(saved);
      setIsFavorite(favs.includes(surahNumber));
    }
  }, [surahNumber]);

  const toggleFavorite = () => {
    const saved = localStorage.getItem("quran-favorites");
    let favs: number[] = saved ? JSON.parse(saved) : [];
    favs = isFavorite
      ? favs.filter((id) => id !== surahNumber)
      : [...favs, surahNumber];
    localStorage.setItem("quran-favorites", JSON.stringify(favs));
    setIsFavorite(!isFavorite);
  };

  // Fetch surah
  useEffect(() => {
    if (!surahNumber) return;
    setLoading(true);
    const lang = languages.find((l) => l.code === selectedLang);
    const edition = lang?.edition || "uz.sodik";

    fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/${edition},quran-uthmani`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.data?.length > 0) {
          const uthmani = data.data.find(
            (item: any) =>
              item.edition.type === "quran" ||
              item.edition.identifier === "quran-uthmani",
          );
          const translationData = data.data.find(
            (item: any) => item.edition.identifier === edition,
          );
          const ayahs: Ayah[] = uthmani.ayahs.map(
            (ayah: any, index: number) => ({
              number: ayah.number,
              text: ayah.text,
              translation: translationData?.ayahs[index]?.text || "",
              numberInSurah: ayah.numberInSurah,
              juz: ayah.juz,
              page: ayah.page,
            }),
          );
          setSurah({
            number: uthmani.number,
            name: uthmani.name,
            englishName: uthmani.englishName,
            englishNameTranslation: uthmani.englishNameTranslation,
            numberOfAyahs: uthmani.numberOfAyahs,
            revelationType: uthmani.revelationType,
            ayahs,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [surahNumber, selectedLang]);

  // Play ayah
  const playAyah = (ayahNumberInSurah: number) => {
    if (currentAyah === ayahNumberInSurah && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }
    if (currentAyah === ayahNumberInSurah && !isPlaying) {
      audioRef.current?.play();
      setIsPlaying(true);
      return;
    }
    const audioUrl = `https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/${surahNumber}${ayahNumberInSurah.toString().padStart(3, "0")}`;
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.volume = isMuted ? 0 : volume;
      audioRef.current
        .play()
        .then(() => {
          setCurrentAyah(ayahNumberInSurah);
          setIsPlaying(true);
          setIsPlayerVisible(true);
        })
        .catch(console.error);
    }
  };

  const playNext = () => {
    if (!surah || currentAyah === null) return;
    const next = currentAyah < surah.numberOfAyahs ? currentAyah + 1 : null;
    if (next) playAyah(next);
  };

  const playPrev = () => {
    if (currentAyah === null || currentAyah <= 1) return;
    playAyah(currentAyah - 1);
  };

  // Audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress(
        audio.duration ? (audio.currentTime / audio.duration) * 100 : 0,
      );
    };
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      // auto-play next
      if (surah && currentAyah !== null && currentAyah < surah.numberOfAyahs) {
        setTimeout(() => playAyah(currentAyah + 1), 600);
      } else {
        setCurrentAyah(null);
        setIsPlayerVisible(false);
      }
    };
    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [surah, currentAyah]);

  // Scroll active ayah into view
  useEffect(() => {
    if (activeAyahRef.current) {
      activeAyahRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentAyah]);

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    if (audioRef.current && duration) {
      audioRef.current.currentTime = ratio * duration;
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? volume : 0;
    }
    setIsMuted(!isMuted);
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    if (v > 0) setIsMuted(false);
  };

  const formatTime = (s: number) => {
    if (isNaN(s)) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const currentAyahData = surah?.ayahs.find(
    (a) => a.numberInSurah === currentAyah,
  );

  if (loading) {
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300&family=Amiri:wght@400;700&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');
          body { background: #f4ebd2; margin: 0; font-family: 'DM Sans', sans-serif; }
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
              opacity: 0.15,
            }}
          >
            القرآن الكريم
          </div>
          <div
            style={{
              width: 48,
              height: 48,
              border: "2px solid #b58d47",
              borderTopColor: "transparent",
              borderRadius: "50%",
              animation: "spin 0.8s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p
            style={{
              color: "#6b7c74",
              fontSize: "0.9rem",
              letterSpacing: "0.06em",
            }}
          >
            Yuklanmoqda...
          </p>
        </div>
      </>
    );
  }

  if (!surah)
    return (
      <div
        style={{
          background: "#f4ebd2",
          minHeight: "100vh",
          padding: "4rem",
          color: "#132620",
        }}
      >
        Surah topilmadi
      </div>
    );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Amiri:ital,wght@0,400;0,700;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&display=swap');

        :root {
          --forest: #132620;
          --cream: #f4ebd2;
          --gold: #b58d47;
          --forest-light: #1e3a30;
          --cream-dark: #e8d9b8;
          --gold-muted: rgba(181,141,71,0.12);
          --text-muted: #6b7c74;
          --white: #ffffff;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          background: var(--cream);
          color: var(--forest);
          font-family: 'DM Sans', sans-serif;
        }

        .page-root {
          min-height: 100vh;
          background: var(--cream);
          position: relative;
          padding-bottom: ${isPlayerVisible ? "110px" : "0"};
        }

        .page-root::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            radial-gradient(ellipse 60% 40% at 80% 0%, rgba(181,141,71,0.07) 0%, transparent 60%),
            radial-gradient(ellipse 40% 50% at 0% 100%, rgba(19,38,32,0.04) 0%, transparent 55%);
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
          max-width: 860px;
          margin: 0 auto;
          padding: 0 2rem;
          height: 68px;
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

        .header-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .lang-select {
          background: var(--white);
          border: 1.5px solid rgba(181,141,71,0.22);
          color: var(--forest);
          font-size: 0.8rem;
          padding: 7px 12px;
          border-radius: 10px;
          cursor: pointer;
          font-family: 'DM Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }

        .lang-select:focus { border-color: var(--gold); }

        .fav-btn {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          border: 1.5px solid rgba(19,38,32,0.15);
          border-radius: 10px;
          padding: 7px 14px;
          font-size: 0.8rem;
          font-family: 'DM Sans', sans-serif;
          cursor: pointer;
          color: var(--text-muted);
          transition: all 0.2s;
          white-space: nowrap;
        }

        .fav-btn:hover { border-color: var(--gold); color: var(--gold); }
        .fav-btn.active { border-color: #e05a5a; color: #e05a5a; background: rgba(224,90,90,0.06); }

        /* HERO */
        .surah-hero {
          position: relative;
          z-index: 1;
          max-width: 860px;
          margin: 0 auto;
          padding: 4rem 2rem 3rem;
          text-align: center;
        }

        .hero-top {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1.25rem;
          margin-bottom: 2rem;
        }

        .surah-num-badge {
          width: 64px;
          height: 64px;
          background: var(--forest);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.8rem;
          font-weight: 500;
          color: var(--cream);
          box-shadow: 0 4px 20px rgba(19,38,32,0.2);
        }

        .rev-badge {
          padding: 6px 16px;
          border-radius: 100px;
          font-size: 0.7rem;
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .rev-badge.meccan {
          background: rgba(181,141,71,0.1);
          color: #8a6a2a;
          border: 1px solid rgba(181,141,71,0.3);
        }

        .rev-badge.medinan {
          background: rgba(19,38,32,0.06);
          color: var(--forest-light);
          border: 1px solid rgba(19,38,32,0.12);
        }

        .hero-arabic {
          font-family: 'Amiri', serif;
          font-size: clamp(3.5rem, 8vw, 6rem);
          font-weight: 400;
          color: var(--forest);
          line-height: 1.1;
          margin-bottom: 1rem;
          direction: rtl;
        }

        .hero-english {
          font-family: 'Cormorant Garamond', serif;
          font-size: 2rem;
          font-weight: 400;
          color: var(--gold);
          margin-bottom: 0.4rem;
          letter-spacing: -0.01em;
        }

        .hero-meaning {
          font-size: 0.9rem;
          color: var(--text-muted);
          margin-bottom: 2.5rem;
        }

        .hero-meta-strip {
          display: inline-flex;
          align-items: center;
          gap: 0;
          background: var(--white);
          border: 1.5px solid rgba(181,141,71,0.18);
          border-radius: 14px;
          overflow: hidden;
        }

        .meta-item {
          padding: 12px 24px;
          text-align: center;
          border-right: 1px solid rgba(181,141,71,0.15);
        }

        .meta-item:last-child { border-right: none; }

        .meta-val {
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.4rem;
          font-weight: 500;
          color: var(--forest);
          line-height: 1;
        }

        .meta-lbl {
          font-size: 0.65rem;
          color: var(--text-muted);
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-top: 3px;
        }

        /* Bismillah */
        .bismillah {
          text-align: center;
          font-family: 'Amiri', serif;
          font-size: 2rem;
          color: var(--forest);
          direction: rtl;
          margin: 0 auto 3rem;
          padding: 2rem;
          max-width: 860px;
          position: relative;
          z-index: 1;
          opacity: 0.65;
          letter-spacing: 0.02em;
        }

        /* AYAHS */
        .ayahs-container {
          position: relative;
          z-index: 1;
          max-width: 860px;
          margin: 0 auto;
          padding: 0 2rem 4rem;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .ayah-card {
          background: var(--white);
          border: 1.5px solid rgba(181,141,71,0.14);
          border-radius: 20px;
          overflow: hidden;
          transition: border-color 0.3s, box-shadow 0.3s;
        }

        .ayah-card.active {
          border-color: rgba(181,141,71,0.55);
          box-shadow: 0 8px 32px rgba(181,141,71,0.14), 0 2px 8px rgba(19,38,32,0.06);
        }

        .ayah-card:hover {
          border-color: rgba(181,141,71,0.3);
          box-shadow: 0 4px 20px rgba(181,141,71,0.08);
        }

        .ayah-inner {
          padding: 2rem 2.25rem;
        }

        .ayah-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.75rem;
        }

        .ayah-num-wrap {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .ayah-num {
          width: 42px;
          height: 42px;
          border-radius: 10px;
          background: rgba(19,38,32,0.05);
          border: 1px solid rgba(19,38,32,0.07);
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.2rem;
          font-weight: 500;
          color: var(--forest);
          flex-shrink: 0;
          transition: background 0.3s, color 0.3s;
        }

        .ayah-card.active .ayah-num {
          background: var(--forest);
          color: var(--cream);
        }

        .juz-tag {
          font-size: 0.7rem;
          color: var(--text-muted);
          background: var(--gold-muted);
          border: 1px solid rgba(181,141,71,0.18);
          border-radius: 100px;
          padding: 2px 10px;
          letter-spacing: 0.05em;
        }

        .play-btn {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: transparent;
          border: 1.5px solid rgba(181,141,71,0.25);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--gold);
          transition: all 0.2s;
        }

        .play-btn:hover {
          background: var(--forest);
          border-color: var(--forest);
          color: var(--cream);
        }

        .play-btn.playing {
          background: var(--forest);
          border-color: var(--forest);
          color: var(--cream);
        }

        .arabic-text {
          font-family: 'Amiri', serif;
          font-size: 2rem;
          font-weight: 400;
          color: var(--forest);
          text-align: right;
          direction: rtl;
          line-height: 2;
          margin-bottom: 1.5rem;
        }

        .translation-text {
          font-size: 0.95rem;
          line-height: 1.8;
          color: var(--text-muted);
          padding-top: 1.25rem;
          border-top: 1px solid rgba(181,141,71,0.1);
        }

        /* Active highlight bar */
        .active-bar {
          height: 3px;
          background: linear-gradient(90deg, var(--gold), rgba(181,141,71,0.2));
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.4s ease;
        }

        .ayah-card.active .active-bar {
          transform: scaleX(1);
        }

        /* ======== AUDIO PLAYER ======== */
        .audio-player {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 200;
          background: var(--forest);
          border-top: 1px solid rgba(181,141,71,0.2);
          box-shadow: 0 -8px 40px rgba(19,38,32,0.3);
          transform: translateY(${isPlayerVisible ? "0" : "100%"});
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .player-progress-track {
          height: 3px;
          background: rgba(255,255,255,0.1);
          cursor: pointer;
          position: relative;
        }

        .player-progress-fill {
          height: 100%;
          background: var(--gold);
          pointer-events: none;
          transition: width 0.1s linear;
        }

        .player-body {
          max-width: 860px;
          margin: 0 auto;
          padding: 14px 2rem 18px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 1.5rem;
        }

        .player-info {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .player-surah {
          font-family: 'Amiri', serif;
          font-size: 1.1rem;
          color: var(--cream);
          direction: rtl;
          text-align: left;
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .player-ayah-ref {
          font-size: 0.72rem;
          color: rgba(244,235,210,0.45);
          margin-top: 2px;
          letter-spacing: 0.05em;
        }

        .player-controls {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .ctrl-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255,255,255,0.06);
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(244,235,210,0.7);
          transition: all 0.2s;
          flex-shrink: 0;
        }

        .ctrl-btn:hover { background: rgba(255,255,255,0.12); color: var(--cream); }

        .ctrl-btn.play-main {
          width: 48px;
          height: 48px;
          background: var(--gold);
          color: var(--forest);
        }

        .ctrl-btn.play-main:hover { background: #c9a660; }

        .player-right {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 10px;
        }

        .player-time {
          font-size: 0.72rem;
          color: rgba(244,235,210,0.45);
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        .volume-wrap {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .vol-btn {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(244,235,210,0.5);
          display: flex;
          align-items: center;
          transition: color 0.2s;
          padding: 4px;
        }

        .vol-btn:hover { color: var(--cream); }

        .volume-slider {
          -webkit-appearance: none;
          width: 70px;
          height: 3px;
          border-radius: 2px;
          background: rgba(255,255,255,0.15);
          outline: none;
          cursor: pointer;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--gold);
          cursor: pointer;
        }

        .close-player {
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(244,235,210,0.35);
          font-size: 1.1rem;
          padding: 4px 6px;
          transition: color 0.2s;
          line-height: 1;
        }

        .close-player:hover { color: var(--cream); }

        @media (max-width: 640px) {
          .player-body { grid-template-columns: 1fr auto; padding: 12px 1.25rem 16px; }
          .player-right { display: none; }
          .player-surah { font-size: 0.95rem; }
        }
      `}</style>

      <div className="page-root">
        {/* HEADER */}
        <header className="site-header">
          <div className="header-inner">
            <Link href="/surahs" className="back-link">
              <ArrowLeft size={15} />
              Surahlar
            </Link>

            <div className="header-actions">
              <select
                className="lang-select"
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value)}
              >
                {languages.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>

              <button
                className={`fav-btn ${isFavorite ? "active" : ""}`}
                onClick={toggleFavorite}
              >
                <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
                {isFavorite ? "Sevimlida" : "Sevimliga"}
              </button>
            </div>
          </div>
        </header>

        {/* HERO */}
        <section className="surah-hero">
          <div className="hero-top">
            <div className="surah-num-badge">{surah.number}</div>
            <span
              className={`rev-badge ${surah.revelationType === "Meccan" ? "meccan" : "medinan"}`}
            >
              {surah.revelationType === "Meccan" ? "Makka" : "Madina"}
            </span>
          </div>

          <div className="hero-arabic">{surah.name}</div>
          <div className="hero-english">{surah.englishName}</div>
          <div className="hero-meaning">{surah.englishNameTranslation}</div>

          <div className="hero-meta-strip">
            <div className="meta-item">
              <div className="meta-val">{surah.numberOfAyahs}</div>
              <div className="meta-lbl">Oyatlar</div>
            </div>
            <div className="meta-item">
              <div className="meta-val">{surah.ayahs[0]?.juz}</div>
              <div className="meta-lbl">Juz</div>
            </div>
            <div className="meta-item">
              <div className="meta-val">{surah.ayahs[0]?.page}</div>
              <div className="meta-lbl">Sahifa</div>
            </div>
            <div className="meta-item">
              <div className="meta-val">{surah.number}</div>
              <div className="meta-lbl">Tartib</div>
            </div>
          </div>
        </section>

        {/* Bismillah (except Al-Fatiha & At-Tawbah) */}
        {surah.number !== 1 && surah.number !== 9 && (
          <div className="bismillah">
            بِسۡمِ ٱللَّهِ ٱلرَّحۡمَٰنِ ٱلرَّحِيمِ
          </div>
        )}

        {/* AYAHS */}
        <div className="ayahs-container">
          {surah.ayahs.map((ayah) => {
            const active = currentAyah === ayah.numberInSurah;
            return (
              <div
                key={ayah.number}
                className={`ayah-card ${active ? "active" : ""}`}
                ref={active ? activeAyahRef : null}
              >
                <div className="active-bar" />
                <div className="ayah-inner">
                  <div className="ayah-header">
                    <div className="ayah-num-wrap">
                      <div className="ayah-num">{ayah.numberInSurah}</div>
                      <span className="juz-tag">Juz {ayah.juz}</span>
                    </div>
                    <button
                      className={`play-btn ${active && isPlaying ? "playing" : ""}`}
                      onClick={() => playAyah(ayah.numberInSurah)}
                      title={active && isPlaying ? "Pauza" : "Tinglash"}
                    >
                      {active && isPlaying ? (
                        <Pause size={16} />
                      ) : (
                        <Play size={16} />
                      )}
                    </button>
                  </div>

                  <div className="arabic-text">{ayah.text}</div>

                  {ayah.translation && (
                    <div className="translation-text">{ayah.translation}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* AUDIO PLAYER */}
        <div className="audio-player">
          <div className="player-progress-track" onClick={handleProgressClick}>
            <div
              className="player-progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="player-body">
            {/* Info */}
            <div className="player-info">
              <div className="player-surah">{surah.name}</div>
              <div className="player-ayah-ref">
                {surah.englishName} ·{" "}
                {currentAyah ? `Oyat ${currentAyah}` : "—"}
              </div>
            </div>

            {/* Controls */}
            <div className="player-controls">
              <button className="ctrl-btn" onClick={playPrev} title="Oldingi">
                <SkipBack size={16} />
              </button>

              <button
                className="ctrl-btn play-main"
                onClick={() => currentAyah !== null && playAyah(currentAyah)}
              >
                {isPlaying ? <Pause size={20} /> : <Play size={20} />}
              </button>

              <button className="ctrl-btn" onClick={playNext} title="Keyingi">
                <SkipForward size={16} />
              </button>
            </div>

            {/* Right: time + volume + close */}
            <div className="player-right">
              <div className="player-time">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>

              <div className="volume-wrap">
                <button className="vol-btn" onClick={toggleMute}>
                  {isMuted || volume === 0 ? (
                    <VolumeX size={15} />
                  ) : (
                    <Volume2 size={15} />
                  )}
                </button>
                <input
                  type="range"
                  className="volume-slider"
                  min={0}
                  max={1}
                  step={0.01}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolume}
                />
              </div>

              <button
                className="close-player"
                onClick={() => {
                  audioRef.current?.pause();
                  setIsPlaying(false);
                  setIsPlayerVisible(false);
                  setCurrentAyah(null);
                }}
                title="Yopish"
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        <audio ref={audioRef} preload="none" />
      </div>
    </>
  );
}
