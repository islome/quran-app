// app/favorites/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Heart, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  // Barcha surahlarni yuklash
  useEffect(() => {
    fetch("http://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setSurahs(data.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Favorites ni localStorage dan olish
  useEffect(() => {
    const saved = localStorage.getItem("quran-favorites");
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  // Favorite ni o'chirish
  const removeFavorite = (surahNumber: number) => {
    const updated = favorites.filter((id) => id !== surahNumber);
    setFavorites(updated);
    localStorage.setItem("quran-favorites", JSON.stringify(updated));
  };

  // Faqat sevimli surahlar
  const favoriteSurahs = surahs.filter((surah) =>
    favorites.includes(surah.number),
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="text-[#d4af37] text-2xl font-light">Yuklanmoqda...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#f1f1f1] relative">
      {/* Subtle background pattern */}
      <div
        className="fixed inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #d4af37 0.8px, transparent 1px)`,
          backgroundSize: "70px 70px",
        }}
      />

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/95 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-3 text-[#d4af37] hover:text-[#f5c462] transition"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-light">Bosh sahifa</span>
          </Link>

          <h1 className="text-3xl font-light tracking-tighter">
            Sevimli Surahlar
          </h1>

          <div className="text-sm text-[#777]">{favoriteSurahs.length} ta</div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 pt-12 pb-24">
        {favoriteSurahs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteSurahs.map((surah) => (
              <Card
                key={surah.number}
                className="bg-[#111] border border-white/5 hover:border-[#d4af37]/40 transition-all group overflow-hidden"
              >
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-transparent flex items-center justify-center text-4xl font-light border border-[#d4af37]/20">
                      {surah.number}
                    </div>

                    <Badge
                      variant="outline"
                      className={`px-4 py-1 text-xs border ${
                        surah.revelationType === "Meccan"
                          ? "border-amber-400/40 text-amber-400"
                          : "border-emerald-400/40 text-emerald-400"
                      }`}
                    >
                      {surah.revelationType === "Meccan" ? "Makka" : "Madina"}
                    </Badge>
                  </div>

                  <Link
                    href={`/surah/${surah.number}`}
                    className="block group-hover:text-[#d4af37] transition-colors"
                  >
                    <h3
                      className="text-right text-4xl leading-[1.15] font-light text-[#f8f1e3] mb-3 font-serif"
                      style={{ fontFamily: "Amiri, serif" }}
                    >
                      {surah.name}
                    </h3>
                    <p className="text-xl text-[#d4af37]">
                      {surah.englishName}
                    </p>
                    <p className="text-sm text-[#777] mt-1 line-clamp-2">
                      {surah.englishNameTranslation}
                    </p>
                  </Link>

                  <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center">
                    <span className="text-[#666] text-sm">Oyatlar soni</span>
                    <span className="font-medium text-[#d4af37]">
                      {surah.numberOfAyahs}
                    </span>
                  </div>

                  {/* Remove button */}
                  <Button
                    onClick={() => removeFavorite(surah.number)}
                    variant="ghost"
                    className="absolute top-6 right-6 text-red-500 hover:text-red-600 hover:bg-red-500/10 transition-colors"
                    size="icon"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-24 h-24 rounded-full bg-[#111] flex items-center justify-center mb-8 border border-white/10">
              <Heart className="w-12 h-12 text-[#555]" />
            </div>

            <h2 className="text-3xl font-light text-[#777] mb-3">
              Sevimli surahlar yo'q
            </h2>
            <p className="text-[#666] max-w-md mb-10">
              Siz hali hech qanday surahni sevimlilarga qo'shmadingiz. Surahlar
              sahifasidan yoki detail sahifasidan ❤️ tugmasini bosing.
            </p>

            <Link href="/surahs">
              <Button className="bg-[#d4af37] hover:bg-[#f5c462] text-black font-medium px-8 py-6 text-lg rounded-2xl">
                Surahlar ro'yxatini ko'rish
              </Button>
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
