// app/surah/[number]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Play, Pause, Volume2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";

interface Ayah {
  number: number;
  text: string; // Arabic
  translation?: string; // Tanlangan til tarjimasi
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
  { code: "ar", label: "🇸🇦 Arabic", edition: "quran-uthmani" },
  { code: "en", label: "🇬🇧 English", edition: "en.asad" },
  { code: "ru", label: "🇷🇺 Russian", edition: "ru.kuliev" },
  { code: "uz", label: "🇺🇿 O‘zbek", edition: "uz.sodik" },
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

  // Audio
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

    if (isFavorite) {
      favs = favs.filter((id) => id !== surahNumber);
    } else {
      favs.push(surahNumber);
    }

    localStorage.setItem("quran-favorites", JSON.stringify(favs));
    setIsFavorite(!isFavorite);
  };

  useEffect(() => {
    if (!surahNumber) return;

    setLoading(true);
    const lang = languages.find((l) => l.code === selectedLang);
    const edition = lang?.edition || "quran-uthmani";

    fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/editions/${edition},quran-uthmani`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.data && data.data.length > 0) {
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
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, [surahNumber, selectedLang]);

  // Audio player
  const playAyah = (ayahNumberInSurah: number) => {
    if (currentAyah === ayahNumberInSurah && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
      return;
    }

    const audioUrl = `https://cdn.alquran.cloud/media/audio/ayah/ar.alafasy/${surahNumber}${ayahNumberInSurah.toString().padStart(3, "0")}`;

    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current
        .play()
        .then(() => {
          setCurrentAyah(ayahNumberInSurah);
          setIsPlaying(true);
        })
        .catch((err) => console.error("Audio error:", err));
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentAyah(null);
    };

    audio.addEventListener("ended", handleEnded);
    return () => audio.removeEventListener("ended", handleEnded);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[#d4af37] text-2xl font-light">Yuklanmoqda...</div>
      </div>
    );
  }

  if (!surah)
    return (
      <div className="min-h-screen bg-[#050505] text-white p-10">
        Surah topilmadi
      </div>
    );

  return (
    <div className="min-h-screen bg-[#050505] text-[#f1f1f1] relative">
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 30% 20%, #d4af37 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/95 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/surahs"
            className="flex items-center gap-3 text-[#d4af37] hover:text-[#f5c462]"
          >
            <ArrowLeft className="w-5 h-5" />
            Surahlar
          </Link>

          <div className="flex items-center gap-4">
            <Select value={selectedLang} onValueChange={setSelectedLang}>
              <SelectTrigger className="w-40 bg-[#111] border-white/10">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-amber-50">
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={toggleFavorite}
              variant="ghost"
              className={`flex items-center gap-2 ${isFavorite ? "text-red-500" : "text-[#777] hover:text-white"}`}
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
              />
              {isFavorite ? "Sevimlidan chiqarish" : "Sevimlilarga"}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-24">
        {/* Surah Info */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-4 mb-6">
            <div className="text-7xl mb-4 font-light text-[#d4af37]">
              {surah.number}
            </div>
            <Badge
              className={`px-6 py-2.5 text-sm border ${surah.revelationType === "Meccan" ? "border-amber-400/50 text-amber-400" : "border-emerald-400/50 text-emerald-400"}`}
            >
              {surah.revelationType === "Meccan" ? "MAKKA" : "MADINA"}
            </Badge>
          </div>

          <h1
            className="text-7xl md:text-8xl leading-none font-light text-[#f8f1e3] mb-4 font-serif"
            style={{ fontFamily: "Amiri, serif" }}
          >
            {surah.name}
          </h1>
          <p className="text-3xl text-[#d4af37]">{surah.englishName}</p>
          <p className="text-lg text-[#777] mt-2">
            {surah.englishNameTranslation}
          </p>
        </div>

        {/* Oyatlar */}
        <div className="space-y-16">
          {surah.ayahs.map((ayah) => (
            <Card
              key={ayah.number}
              className="bg-[#111] border-white/5 hover:border-[#d4af37]/40 transition-all"
            >
              <CardContent className="p-10">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] border border-[#d4af37]/20 flex items-center justify-center text-[#d4af37] text-2xl font-light">
                      {ayah.numberInSurah}
                    </div>
                    <div className="text-xs text-[#666]">Juz {ayah.juz}</div>
                  </div>

                  <Button
                    onClick={() => playAyah(ayah.numberInSurah)}
                    variant="ghost"
                    size="icon"
                    className="text-[#d4af37] hover:bg-[#d4af37]/10"
                  >
                    {currentAyah === ayah.numberInSurah && isPlaying ? (
                      <Pause className="w-6 h-6" />
                    ) : (
                      <Play className="w-6 h-6" />
                    )}
                  </Button>
                </div>

                {/* Arabic */}
                <div
                  className="text-right text-[2.15rem] leading-[2.4] font-light text-[#f8f1e3] mb-10 font-serif"
                  style={{ fontFamily: "Amiri, serif" }}
                >
                  {ayah.text}
                </div>

                {/* Translation */}
                {ayah.translation && (
                  <div className="text-lg leading-relaxed text-[#ddd] border-t border-white/10 pt-8">
                    {ayah.translation}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <audio
        ref={audioRef}
        preload="none"
        onError={(e) => console.error("Audio error:", e)}
        onEnded={() => {
          setIsPlaying(false);
          setCurrentAyah(null);
        }}
      />
    </div>
  );
}
