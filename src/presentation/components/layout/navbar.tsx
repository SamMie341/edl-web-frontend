"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PhoneCall,
  Clock,
  Globe,
  Search,
  Menu,
  X,
  Zap,
  ChevronDown,
  Building2,
  FileText,
  ShieldAlert,
} from "lucide-react";

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-[#2329c1] text-white text-[11px] lg:text-xs py-2 px-4 border-b border-white/15 shadow-sm hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <div className="flex items-center gap-4 lg:gap-6 min-w-0">
            <div className="flex items-center gap-2 text-amber-300 font-medium whitespace-nowrap">
              <span className="flex h-2 w-2 relative shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-400"></span>
              </span>
              <span>ສາຍດ່ວນ ຟຟລ: 1199 (ບໍລິການ 24/7)</span>
            </div>
            <div className="hidden lg:flex items-center gap-2 text-blue-100 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              <span>ໂມງລັດຖະການ: 08:00 - 16:00 ໂມງ</span>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-5 shrink-0">
            <Link
              href="/services/tariffs#outages"
              className="text-blue-100 hover:text-amber-300 transition-colors flex items-center gap-1.5 whitespace-nowrap"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>ແຈ້ງການຕັດກະແສໄຟຟ້າຊົ່ວຄາວ</span>
            </Link>
            <span className="text-white/30">|</span>
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Globe className="w-3.5 h-3.5 text-blue-200 shrink-0" />
              <button className="font-semibold text-white hover:text-amber-300 transition-colors">
                ລາວ
              </button>
              <span className="text-white/40">/</span>
              <button className="text-blue-200 hover:text-white transition-colors">
                EN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? "bg-white/95 backdrop-blur-md shadow-md py-2.5 sm:py-3 border-b border-slate-200/80"
            : "bg-white/95 backdrop-blur-sm py-3 sm:py-4 border-b border-slate-100"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex items-center justify-between gap-2 sm:gap-4">
          {/* Brand Logo & Name */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3.5 group min-w-0">
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src="/edl-logo-v2.png"
                alt="Electricite Du Laos (EDL) Logo"
                fill
                className="object-contain"
                priority
                unoptimized
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-sm sm:text-base md:text-lg font-bold text-[#2329c1] tracking-tight group-hover:text-[#1b209e] transition-colors leading-tight truncate">
                ລັດວິສາຫະກິດໄຟຟ້າລາວ
              </span>
              <span className="text-[9px] sm:text-[10px] md:text-xs font-semibold text-slate-500 tracking-wider truncate">
                ELECTRICITE DU LAOS (EDL)
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden xl:flex items-center gap-1 2xl:gap-2 shrink-0">
            <Link
              href="/"
              className="px-3 py-2 text-sm font-semibold text-[#2329c1] bg-blue-50/80 rounded-full transition-colors whitespace-nowrap"
            >
              ໜ້າຫຼັກ
            </Link>

            {/* About Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("about")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(activeDropdown === "about" ? null : "about")
                }
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#2329c1] hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
              >
                <span>ກ່ຽວກັບ ຟຟລ</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {activeDropdown === "about" && (
                <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/#stats"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50/60 text-slate-700 hover:text-[#2329c1] transition-colors text-sm"
                  >
                    <Building2 className="w-4 h-4 text-[#2329c1]" />
                    <div>
                      <div className="font-medium">ວິໄສທັດ ແລະ ພາລະກິດ</div>
                      <div className="text-xs text-slate-600">Vision & Mission</div>
                    </div>
                  </Link>
                  <Link
                    href="/about/organization"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50/60 text-slate-700 hover:text-[#2329c1] transition-colors text-sm"
                  >
                    <Zap className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-medium">ໂຄງຮ່າງການຈັດຕັ້ງ</div>
                      <div className="text-xs text-slate-600">Organization Structure</div>
                    </div>
                  </Link>
                  <Link
                    href="/#stats"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50/60 text-slate-700 hover:text-[#2329c1] transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-medium">ປະຫວັດຄວາມເປັນມາ</div>
                      <div className="text-xs text-slate-600">History of EDL</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Services Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setActiveDropdown("services")}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveDropdown(
                    activeDropdown === "services" ? null : "services"
                  )
                }
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#2329c1] hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
              >
                <span>ການບໍລິການ & ອັດຕາໄຟ</span>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {activeDropdown === "services" && (
                <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Link
                    href="/services/tariffs"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50/60 text-slate-700 hover:text-[#2329c1] transition-colors text-sm"
                  >
                    <Zap className="w-4 h-4 text-[#2329c1]" />
                    <div>
                      <div className="font-medium">ອັດຕາຄ່າກະແສໄຟຟ້າ</div>
                      <div className="text-xs text-slate-600">ຕາຕະລາງລາຄາທາງການ & ດາວໂຫຼດ PDF</div>
                    </div>
                  </Link>
                  <Link
                    href="/services/branches"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50/60 text-slate-700 hover:text-[#2329c1] transition-colors text-sm"
                  >
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="font-medium">ສາຂາ & ສູນບໍລິການ 18 ແຂວງ</div>
                      <div className="text-xs text-slate-600">ຄົ້ນຫາທີ່ຕັ້ງ, ເບີໂທຕິດຕໍ່ ແລະ ແຜນທີ່</div>
                    </div>
                  </Link>
                  <Link
                    href="/services/tariff-calculator"
                    onClick={() => setActiveDropdown(null)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50/60 text-slate-700 hover:text-[#2329c1] transition-colors text-sm"
                  >
                    <FileText className="w-4 h-4 text-amber-500" />
                    <div>
                      <div className="font-medium">ຄຳນວນຄ່າໄຟຟ້າອັດສະລິຍະ</div>
                      <div className="text-xs text-slate-600">ໂປຣແກຣມຈຳລອງຄິດໄລ່ຄ່າໄຟ 8 ຂັ້ນ</div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            <Link
              href="/news"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#2329c1] hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              ຂ່າວສານ & ກິດຈະກຳ
            </Link>

            <Link
              href="/magazines"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#2329c1] hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              ວາລະສານ ຟຟລ
            </Link>

            <Link
              href="/#procurements"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#2329c1] hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              ຈັດຊື້-ຈັດຈ້າງ
            </Link>

            <Link
              href="#contact"
              className="px-3 py-2 text-sm font-medium text-slate-700 hover:text-[#2329c1] hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
            >
              ຕິດຕໍ່ພວກເຮົາ
            </Link>
          </div>

          {/* Right Action Buttons & Mobile/Tablet Menu Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setSearchOpen(!searchOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-[#2329c1] hover:bg-blue-50/70 transition-all"
              title="ຄົ້ນຫາ"
              aria-label="ຄົ້ນຫາ"
            >
              <Search className="w-5 h-5" />
            </button>

            <Link
              href="/services/tariff-calculator"
              className="hidden sm:inline-flex relative items-center gap-2 px-4 xl:px-5 py-2 xl:py-2.5 rounded-full bg-[#2329c1] text-white text-xs xl:text-sm font-semibold shadow-md shadow-blue-700/20 hover:bg-[#1b209e] hover:shadow-lg hover:shadow-blue-700/30 transition-all duration-200 group active:scale-95 whitespace-nowrap"
            >
              <Zap className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
              <span>ກວດສອບຄ່າໄຟຟ້າ</span>
            </Link>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 text-[#2329c1]" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Search Bar Overlay */}
        {searchOpen && (
          <div className="border-t border-slate-100 bg-slate-50/95 py-3 px-4 animate-in slide-in-from-top duration-200">
            <div className="max-w-2xl mx-auto flex items-center gap-2 sm:gap-3 bg-white border border-slate-200 rounded-full px-3.5 sm:px-4 py-2 shadow-inner">
              <Search className="w-4 h-4 sm:w-5 sm:h-5 text-slate-400 shrink-0" />
              <input
                id="navbar-search-input"
                type="text"
                placeholder="ຄົ້ນຫາຂ່າວສານ, ປະກາດປະມູນ, ອັດຕາຄ່າໄຟຟ້າ..."
                aria-label="ຄົ້ນຫາຂ່າວສານ, ປະກາດປະມູນ, ອັດຕາຄ່າໄຟຟ້າ"
                className="min-w-0 w-full bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-500 focus:outline-none"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="text-xs text-slate-600 hover:text-slate-900 px-2.5 py-1.5 min-h-[32px] shrink-0"
              >
                ປິດ
              </button>
            </div>
          </div>
        )}

        {/* Mobile & Tablet Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 shadow-xl space-y-1.5 max-h-[calc(100dvh-4.5rem)] overflow-y-auto overscroll-contain animate-in slide-in-from-top-4 duration-300">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm text-[#2329c1] bg-blue-50/80"
            >
              ໜ້າຫຼັກ (Home)
            </Link>
            <Link
              href="/about/organization"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm text-slate-700 hover:bg-slate-50"
            >
              🏛️ ໂຄງຮ່າງການຈັດຕັ້ງ (Organization)
            </Link>
            <Link
              href="/services/tariffs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm text-slate-700 hover:bg-slate-50"
            >
              ⚡ ອັດຕາຄ່າກະແສໄຟຟ້າ (Official Tariffs)
            </Link>
            <Link
              href="/services/branches"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm text-slate-700 hover:bg-slate-50"
            >
              🏢 ສາຂາ & ສູນບໍລິການ 18 ແຂວງ (Branches)
            </Link>
            <Link
              href="/services/tariff-calculator"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm text-slate-700 hover:bg-slate-50"
            >
              🧮 ຄຳນວນຄ່າໄຟຟ້າອັດສະລິຍະ (Calculator)
            </Link>
            <Link
              href="/news"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm text-slate-700 hover:bg-slate-50"
            >
              📰 ຂ່າວສານ & ກິດຈະກຳ (News)
            </Link>
            <Link
              href="/magazines"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm text-slate-700 hover:bg-slate-50"
            >
              📖 ວາລະສານ ຟຟລ (Magazines)
            </Link>
            <Link
              href="/#procurements"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm text-slate-700 hover:bg-slate-50"
            >
              📄 ຈັດຊື້-ຈັດຈ້າງ (Procurements)
            </Link>
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 sm:py-3 rounded-xl font-medium text-sm text-slate-700 hover:bg-slate-50"
            >
              📞 ຕິດຕໍ່ພວກເຮົາ (Contact)
            </Link>

            <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2">
              <a
                href="tel:1199"
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-amber-500 text-white font-semibold text-sm shadow-sm"
              >
                <PhoneCall className="w-4 h-4" />
                <span>ສາຍດ່ວນສຸກເສີນ: 1199</span>
              </a>
              <Link
                href="/services/tariff-calculator"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#2329c1] text-white font-semibold text-sm shadow-sm"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>ກວດສອບຄ່າໄຟຟ້າ</span>
              </Link>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
