"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { formatNumber } from "@/shared";
import {
  Zap,
  PhoneCall,
  Calculator,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Activity,
  CheckCircle2,
} from "lucide-react";

interface HeroSlide {
  tag: string;
  tagEn: string;
  title: string;
  desc: string;
  badge: string;
  accent: string;
}

const HERO_SLIDES: HeroSlide[] = [
  {
    tag: "ພະລັງງານສະອາດ ເພື່ອອະນາຄົດ ສປປ ລາວ",
    tagEn: "Clean Energy for Sustainable Laos",
    title: "ພະລັງງານໄຟຟ້າ ເພື່ອການພັດທະນາ ເສດຖະກິດ-ສັງຄົມ ແຫ່ງຊາດ",
    desc: "ລັດວິສາຫະກິດໄຟຟ້າລາວ ມຸ່ງໝັ້ນສະໜອງພະລັງງານໄຟຟ້າທີ່ມີສະຖຽນລະພາບ, ຄອບຄຸມທົ່ວປະເທດ ແລະ ເປັນມິດກັບສິ່ງແວດລ້ອມ ເພື່ອຄຸນນະພາບຊີວິດທີ່ດີຂຶ້ນຂອງປະຊາຊົນ.",
    badge: "10,000+ MW ກຳລັງການຜະລິດຕິດຕັ້ງທັງໝົດ",
    accent: "from-blue-600 via-[#2329c1] to-[#121568]",
  },
  {
    tag: "ນະວັດຕະກຳ ແລະ ດິຈິທັອກ ຟຟລ",
    tagEn: "EDL Digital Services & Innovation",
    title: "ກວດບິນ ແລະ ຊຳລະຄ່າໄຟຟ້າງ່າຍດາຍ ທຸກທີ່ທຸກເວລາ",
    desc: "ຍົກລະດັບການບໍລິການດ້ວຍລະບົບດິຈິທັອກ Smart Metering ແລະ EDL Easy Pay ໃຫ້ທ່ານສາມາດກວດສອບການຊົມໃຊ້ໄຟຟ້າ ແລະ ຊຳລະຜ່ານທະນາຄານໄດ້ສະດວກສະບາຍ.",
    badge: "100% ລະບົບຊຳລະເງິນອອນລາຍສະດວກວ່ອງໄວ",
    accent: "from-[#2329c1] via-[#1a1f9e] to-[#0c0e4a]",
  },
  {
    tag: "ຄວາມໝັ້ນຄົງດ້ານພະລັງງານແຫ່ງຊາດ",
    tagEn: "National Power Grid Reliability",
    title: "ເຊື່ອມຕໍ່ສາຍສົ່ງໄຟຟ້າ ຄອບຄຸມ 18 ແຂວງທົ່ວປະເທດ",
    desc: "ພັດທະນາໂຄງລ່າງພື້ນຖານສາຍສົ່ງ ແລະ ສະຖານີໄຟຟ້າແຮງສູງມາດຕະຖານສາກົນ ເພື່ອຮອງຮັບການຂະຫຍາຍຕົວຂອງຕົວເມືອງ, ອຸດສາຫະກຳ ແລະ ກະສິກຳ.",
    badge: "95%+ ປະຊາຊົນເຂົ້າເຖິງໄຟຟ້າແລ້ວ",
    accent: "from-indigo-600 via-[#2329c1] to-[#151978]",
  },
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [quickInput, setQuickInput] = useState("");
  const [simulatedKwh, setSimulatedKwh] = useState(185);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const slide = HERO_SLIDES[currentSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-blue-50/40 to-slate-50 pt-6 pb-14 sm:pt-10 sm:pb-16 lg:pt-14 lg:pb-24 border-b border-slate-100">
      {/* Background Tech Grid & Ambient Glows */}
      <div className="absolute inset-0 bg-grid-pattern opacity-60 pointer-events-none" />
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#2329c1]/10 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            {/* Live Status Badge */}
            <div className="inline-flex flex-wrap items-center gap-x-2 gap-y-1 px-3.5 py-2 sm:py-1.5 rounded-2xl sm:rounded-full bg-white border border-blue-200/80 shadow-sm shadow-blue-500/5 max-w-full">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-700">
                ສະຖານະຕາໜ່າງໄຟຟ້າແຫ່ງຊາດ:
              </span>
              <span className="text-[11px] sm:text-xs font-bold text-emerald-700">ປົກກະຕິ (100%)</span>
              <span className="hidden sm:inline text-slate-300">|</span>
              <span className="text-[11px] sm:text-xs font-medium text-[#2329c1] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                <span>{slide.tag}</span>
              </span>
            </div>

            {/* Dynamic Headline with Smooth Transitions */}
            <div className="min-h-[100px] sm:min-h-[130px] md:min-h-[150px] flex flex-col justify-center">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.25] transition-all duration-500">
                {slide.title}
              </h1>
            </div>

            {/* Description */}
            <p className="text-sm sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              {slide.desc}
            </p>

            {/* Slide Indicators */}
            <div className="flex items-center gap-1.5 pt-1">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentSlide(idx)}
                  className="min-w-[32px] h-8 px-1.5 flex items-center justify-center rounded-full cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2329c1]"
                  aria-label={`Go to slide ${idx + 1}`}
                  aria-pressed={idx === currentSlide}
                >
                  <span
                    className={`h-2 rounded-full transition-all duration-300 block ${
                      idx === currentSlide
                        ? "w-8 bg-[#2329c1]"
                        : "w-2.5 bg-slate-400 hover:bg-slate-500"
                    }`}
                  />
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 pt-2 sm:pt-3">
              <a
                href="#calculator"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#2329c1] text-white text-sm sm:text-base font-semibold shadow-lg shadow-blue-700/25 hover:bg-[#1a1f9e] hover:shadow-xl hover:shadow-blue-700/35 transition-all duration-200 active:scale-95 group"
              >
                <Calculator className="w-5 h-5 text-amber-300 group-hover:scale-110 transition-transform" />
                <span>ຄຳນວນຄ່າໄຟຟ້າ</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href="tel:1199"
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:text-[#2329c1] hover:border-blue-300 hover:bg-blue-50/50 text-sm sm:text-base font-semibold transition-all duration-200 shadow-sm"
              >
                <PhoneCall className="w-5 h-5 text-amber-500" />
                <span>ແຈ້ງໄຟຟ້າຂັດຂ້ອງ 1199</span>
              </a>

              <Link
                href="/services/branches"
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 sm:py-3.5 text-slate-600 hover:text-[#2329c1] text-sm font-semibold transition-colors"
              >
                <span>ຄົ້ນຫາສາຂາ & ສູນບໍລິການ</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Feature Pills */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 border-t border-slate-200/80 max-w-xl">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2329c1] flex-shrink-0" />
                <span className="text-xs font-medium text-slate-600">
                  ບໍລິການ 24 ຊົ່ວໂມງ
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2329c1] flex-shrink-0" />
                <span className="text-xs font-medium text-slate-600">
                  18 ແຂວງ ທົ່ວປະເທດ
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2329c1] flex-shrink-0" />
                <span className="text-xs font-medium text-slate-600">
                  ຊຳລະອອນລາຍທັນໃຈ
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Interactive Energy Hub Card */}
          <div className="lg:col-span-5">
            <div className="relative sm:px-2 lg:px-0">
              {/* Outer Decorative Gradient Border with Electric Glow Animation */}
              <div className="relative rounded-3xl bg-gradient-to-br from-[#2329c1] via-[#1d22a8] to-[#101357] p-1 shadow-2xl animate-electric-glow">
                <div className="relative rounded-[22px] bg-slate-900/95 backdrop-blur-xl p-5 sm:p-7 text-white overflow-hidden">
                  {/* Subtle Electric Circuit Glow */}
                  <div className="absolute top-0 right-0 w-48 h-48 bg-[#2329c1]/40 rounded-full blur-2xl pointer-events-none animate-pulse-subtle" />
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none animate-pulse-subtle" />

                  {/* Header of Interactive Card */}
                  <div className="flex items-center justify-between gap-2 pb-4 sm:pb-5 border-b border-white/10">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-[#2329c1] to-blue-500 flex items-center justify-center shadow-md shrink-0">
                        <Zap className="w-5 h-5 text-amber-300" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                          EDL SMART SERVICE
                        </div>
                        <div className="text-[11px] sm:text-xs text-blue-200 truncate">
                          ລະບົບກວດສອບ & ບໍລິການອັດສະລິຍະ
                        </div>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold flex items-center gap-1.5 border border-emerald-500/30 shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                      Online
                    </span>
                  </div>

                  {/* Live Simulation Card: Power Consumption Preview */}
                  <div className="my-4 sm:my-5 p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
                    <div className="flex justify-between items-center gap-2 text-xs">
                      <label htmlFor="hero-kwh-slider" className="text-slate-200">
                        ຈຳລອງການຄິດໄລ່ຄ່າໄຟປະຈຳເດືອນ:
                      </label>
                      <span className="font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20 shrink-0">
                        {simulatedKwh} kWh
                      </span>
                    </div>

                    <input
                      id="hero-kwh-slider"
                      type="range"
                      min="50"
                      max="500"
                      step="5"
                      value={simulatedKwh}
                      onChange={(e) => setSimulatedKwh(Number(e.target.value))}
                      aria-label="ຈຳລອງການຄິດໄລ່ຄ່າໄຟປະຈຳເດືອນ (kWh)"
                      className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400"
                    />

                    <div className="flex flex-wrap justify-between items-end gap-2 pt-1">
                      <div>
                        <div className="text-[11px] text-slate-300">ປະມານການຄ່າໄຟ (ທີ່ຢູ່ອາໄສ):</div>
                        <div className="text-lg sm:text-xl font-extrabold text-white">
                          {formatNumber(simulatedKwh * 1350)}{" "}
                          <span className="text-xs font-normal text-slate-200">ກີບ</span>
                        </div>
                      </div>
                      <a
                        href="#calculator"
                        className="text-xs font-medium text-blue-200 hover:text-white flex items-center gap-1 group py-1"
                      >
                        <span>ຄຳນວນລະອຽດ</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </a>
                    </div>
                  </div>

                  {/* Quick Bill Search by Account No. */}
                  <div className="space-y-2">
                    <label htmlFor="hero-account-input" className="text-xs font-medium text-slate-200 block">
                      ກວດສອບໃບບິນດ້ວຍເລກບັນຊີລູກຄ້າ:
                    </label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        id="hero-account-input"
                        type="text"
                        placeholder="ປ້ອນເລກບັນຊີຜູ້ຊົມໃຊ້ (ເຊັ່ນ: 0100xxxx)"
                        value={quickInput}
                        onChange={(e) => setQuickInput(e.target.value)}
                        className="min-w-0 flex-1 bg-white/10 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-300 focus:outline-none focus:border-blue-400 transition-colors"
                      />
                      <button
                        onClick={() => {
                          if (quickInput.trim()) {
                            alert(
                              `ກຳລັງກວດສອບຂໍ້ມູນເລກບັນຊີ: ${quickInput}\n(ກະລຸນາກວດສອບທີ່ໜ້າຕາຕະລາງລາຍລະອຽດ ຫຼື ແອັບ EDL Mobile)`
                            );
                          }
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#2329c1] hover:bg-blue-600 text-white text-xs font-semibold shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
                      >
                        <span>ກວດບິນ</span>
                      </button>
                    </div>
                  </div>

                  {/* Grid Stat Footer */}
                  <div className="mt-5 sm:mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-2.5 sm:gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-white/[0.04]">
                      <div className="text-[11px] sm:text-xs text-slate-300">ກຳລັງການຜະລິດທົ່ວປະເທດ</div>
                      <div className="text-sm sm:text-base font-bold text-amber-300 flex items-center justify-center gap-1">
                        <TrendingUp className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span>8,840 MW</span>
                      </div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.04]">
                      <div className="text-[11px] sm:text-xs text-slate-300">ສູນບໍລິການ & ສາຂາ</div>
                      <div className="text-sm sm:text-base font-bold text-white flex items-center justify-center gap-1">
                        <Activity className="w-4 h-4 text-blue-400 shrink-0" />
                        <span>140+ ຈຸດ</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile-friendly inline Pills (prevents edge overflow on small screens) */}
              <div className="grid grid-cols-2 gap-2.5 mt-3 sm:hidden">
                <div className="bg-white rounded-2xl p-3 shadow-md border border-blue-100 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs shrink-0">
                    ⚡
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] text-slate-500 font-semibold truncate">ກຳລັງການຜະລິດ</div>
                    <div className="text-xs font-extrabold text-[#2329c1]">10,000+ MW</div>
                  </div>
                </div>
                <a
                  href="tel:1199"
                  className="bg-white rounded-2xl p-3 shadow-md border border-slate-100 flex items-center gap-2.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-sm shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[10px] font-bold text-slate-500 uppercase truncate">
                      ສາຍດ່ວນ 24 ຊມ
                    </div>
                    <div className="text-xs font-extrabold text-[#2329c1]">
                      1199 ໂທຟຣີ
                    </div>
                  </div>
                </a>
              </div>

              {/* Floating Pill: Clean Energy Top-Right (sm+) */}
              <div className="hidden sm:flex absolute -top-4 right-0 lg:-right-4 bg-white/95 backdrop-blur-md rounded-2xl py-2 px-3.5 shadow-xl border border-blue-100 items-center gap-2.5 animate-float-reverse z-20">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
                  ⚡
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 font-semibold">ກຳລັງການຜະລິດ</div>
                  <div className="text-xs font-extrabold text-[#2329c1]">10,000+ MW</div>
                </div>
              </div>

              {/* Floating Pill: Emergency Hotline Call (sm+) */}
              <div className="hidden sm:flex absolute -bottom-5 left-0 lg:-left-5 bg-white rounded-2xl p-3 shadow-xl border border-slate-100 items-center gap-3 animate-float-slow z-20">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-md">
                  <PhoneCall className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    ສາຍດ່ວນ 24 ຊົ່ວໂມງ
                  </div>
                  <a
                    href="tel:1199"
                    className="text-base font-extrabold text-[#2329c1] hover:underline"
                  >
                    1199 ໂທຟຣີ
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
