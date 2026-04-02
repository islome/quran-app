"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Search, Heart, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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

export default function SurahsPage() {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<Surah[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("quran-favorites");
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (id: number) => {
    let newFavorites: number[];
    if (favorites.includes(id)) {
      newFavorites = favorites.filter((fav) => fav !== id);
    } else {
      newFavorites = [...favorites, id];
    }
    setFavorites(newFavorites);
    localStorage.setItem("quran-favorites", JSON.stringify(newFavorites));
  };

  // Fetch all surahs
  useEffect(() => {
    fetch("http://api.alquran.cloud/v1/surah")
      .then((res) => res.json())
      .then((data) => {
        if (data.data) {
          setSurahs(data.data);
          setFilteredSurahs(data.data);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Search functionality
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSurahs(surahs);
    } else {
      const term = searchTerm.toLowerCase().trim();
      const result = surahs.filter(
        (surah) =>
          surah.number.toString().includes(term) ||
          surah.name.toLowerCase().includes(term) ||
          surah.englishName.toLowerCase().includes(term) ||
          surah.englishNameTranslation.toLowerCase().includes(term),
      );
      setFilteredSurahs(result);
    }
  }, [searchTerm, surahs]);

  useEffect(() => {
    if (!filteredSurahs.length) return;
    setIsRefreshing(true);
    const timer = window.setTimeout(() => setIsRefreshing(false), 260);
    return () => window.clearTimeout(timer);
  }, [filteredSurahs]);

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
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 text-[#d4af37] hover:text-[#f5c462] transition"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-light">Bosh sahifa</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-light tracking-tighter">
              Barcha Surahlar
            </h1>
          </div>

          <div className="text-sm text-[#777]">
            {filteredSurahs.length} ta surah
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-12 pb-24">
        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#666] w-5 h-5" />
            <Input
              type="text"
              placeholder="Surah nomi yoki raqamini kiriting..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 py-7 text-lg bg-[#111] border-white/10 focus:border-[#d4af37] rounded-3xl placeholder:text-[#555]"
            />
          </div>
        </div>

        {/* Surahs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSurahs.map((surah) => {
            const isFavorite = favorites.includes(surah.number);

            return (
              <Card
                key={surah.number}
                className={`group bg-[#111] border border-white/5 overflow-hidden transform-gpu transition-all duration-450 ease-out ${isRefreshing ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'} hover:border-[#d4af37]/40 hover:-translate-y-1 hover:scale-[1.01] hover:shadow-[0_14px_35px_rgba(212,175,55,0.25)]`}
              >
                <CardContent className="p-8 relative">
                  {/* Favorite Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(surah.number);
                    }}
                    className={`absolute top-6 right-6 z-10 transition-all ${isFavorite ? "text-red-500 scale-110" : "text-[#555] hover:text-white"}`}
                  >
                    <Heart
                      className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`}
                    />
                  </Button>

                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-transparent flex items-center justify-center text-4xl font-light border border-[#d4af37]/20 group-hover:border-[#d4af37]/40 transition">
                      {surah.number}
                    </div>

                    <Badge
                      variant="outline"
                      className={`px-4 py-1 text-xs rounded-full border ${
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
                    className="block group-hover:text-[#d4af37] transition"
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
                    <span className="text-[#666] text-sm">Oyatlar</span>
                    <span className="font-medium text-[#d4af37] text-lg">
                      {surah.numberOfAyahs}
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredSurahs.length === 0 && (
          <div className="text-center py-20 text-[#777]">
            Hech qanday surah topilmadi
          </div>
        )}
      </main>
    </div>
  );
}
