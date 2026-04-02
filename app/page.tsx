// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Heart, Menu, X, BookOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

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
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [language, setLanguage] = useState('uz');

  useEffect(() => {
    fetch('http://api.alquran.cloud/v1/surah')
      .then(res => res.json())
      .then(data => {
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
      const filtered = surahs.filter(s =>
        s.number.toString().includes(term) ||
        s.name.toLowerCase().includes(term) ||
        s.englishName.toLowerCase().includes(term) ||
        s.englishNameTranslation.toLowerCase().includes(term)
      );
      setFilteredSurahs(filtered.slice(0, 6));
    }
  }, [searchTerm, surahs]);

  return (
    <div className="min-h-screen bg-[#050505] text-[#f1f1f1] overflow-hidden relative">
      <div className="fixed inset-0 opacity-5 pointer-events-none"
           style={{
             backgroundImage: `radial-gradient(circle at 25% 25%, #d4af37 0.5px, transparent 1px)`,
             backgroundSize: '60px 60px'
           }}
      />
      
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#050505]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 border border-[#d4af37]/30 rounded-full flex items-center justify-center text-[#d4af37] text-2xl">
              ﷺ
            </div>
            <div>
              <h1 className="text-3xl font-light tracking-tighter">Al-Quran</h1>
              <p className="text-[10px] text-[#d4af37]/70 -mt-1 tracking-[2px]">القرآن الكريم</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10 text-sm font-medium">
            <Link href="/" className="hover:text-[#d4af37] transition-colors">Bosh sahifa</Link>
            <Link href="/surahs" className="hover:text-[#d4af37] transition-colors">Surahlar</Link>
            <Link href="/favorites" className="flex items-center gap-1.5 hover:text-[#d4af37] transition-colors">
              <Heart className="w-4 h-4" /> Sevimlilar
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="bg-transparent border-white/10 text-sm w-32 focus:ring-1 focus:ring-[#d4af37]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className='bg-amber-50'>
                <SelectItem value="uz">🇺🇿 O'zbek</SelectItem>
                <SelectItem value="en">🇬🇧 English</SelectItem>
                <SelectItem value="ru">🇷🇺 Русский</SelectItem>
                <SelectItem value="ar">🇸🇦 العربية</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 pt-16 pb-24">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {[
            { label: "Surahlar", value: "114", icon: BookOpen },
            { label: "Oyatlar", value: "6,236", icon: null },
            { label: "Juz'lar", value: "30", icon: null },
            { label: "Tillarda", value: "4+", icon: null },
          ].map((stat, i) => (
            <Card key={i} className="bg-[#111] border-white/5 hover:border-[#d4af37]/30 transition-all group">
              <CardContent className="p-8 text-center">
                <div className="text-[#d4af37] mb-3 text-5xl font-light tabular-nums group-hover:scale-110 transition-transform">
                  {stat.value}
                </div>
                <p className="text-sm uppercase tracking-widest text-[#888]">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[#666] w-5 h-5" />
            <Input
              type="text"
              placeholder="Surah nomi, raqami yoki tarjima bo'yicha qidirish..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-14 py-8 text-lg bg-[#111] border-white/10 focus:border-[#d4af37] rounded-3xl placeholder:text-[#555] text-left text-xl"
            />
          </div>
        </div>

        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="uppercase tracking-[3px] text-[#d4af37] text-xs">Eng ko'p o'qiladiganlar</p>
            <h2 className="text-4xl font-light">Mashhur Surahlar</h2>
          </div>
          <Link href="/surahs" className="text-[#d4af37] hover:underline text-sm flex items-center gap-2">
            Barchasini ko'rish <span>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSurahs.map((surah, index) => (
            <Link key={surah.number} href={`/surah/${surah.number}`} className="group">
              <Card className="bg-[#111] border border-white/5 overflow-hidden transform-gpu transition-all duration-300 ease-out hover:border-[#d4af37]/40 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[0_16px_40px_rgba(212,175,55,0.25)]">
                <CardContent className="p-8">
                  <div className="flex justify-between items-start mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4af37]/10 to-transparent flex items-center justify-center text-4xl font-light border border-[#d4af37]/20">
                      {surah.number}
                    </div>
                    <div className={`px-4 py-1 text-xs rounded-full border ${surah.revelationType === 'Meccan' ? 'border-amber-400/30 text-amber-400' : 'border-emerald-400/30 text-emerald-400'}`}>
                      {surah.revelationType === 'Meccan' ? 'Makka' : 'Madina'}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-right text-4xl leading-[1.15] font-light text-[#f8f1e3] font-serif" style={{ fontFamily: 'Amiri, serif' }}>
                      {surah.name}
                    </h3>
                    <div>
                      <p className="text-xl text-[#d4af37]">{surah.englishName}</p>
                      <p className="text-sm text-[#777] mt-1">{surah.englishNameTranslation}</p>
                    </div>
                  </div>

                  <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center text-sm">
                    <span className="text-[#666]">Oyatlar soni</span>
                    <span className="font-medium text-[#d4af37]">{surah.numberOfAyahs}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
          {filteredSurahs.length === 0 && (
          <div className="text-center py-20 text-[#777]">
            Hech qanday surah topilmadi
          </div>
        )}
        </div>
      </main>
    </div>
  );
}