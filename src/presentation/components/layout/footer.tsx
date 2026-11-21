"use client";

import React from "react";
import Link from "next/link";
import {
  PhoneCall,
  Mail,
  MapPin,
  Clock,
  Globe,
  Zap,
  ArrowUp,
  ShieldCheck,
} from "lucide-react";

export function Footer() {
  const [year, setYear] = React.useState<number>(2026);

  React.useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer id="contact" className="bg-[#0b0d3e] text-slate-300 pt-16 pb-8 border-t border-white/10 relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#2329c1]/20 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Top Hotline Bar */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2329c1] to-[#171a84] p-5 sm:p-8 mb-12 sm:mb-14 border border-white/10 flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 text-center sm:text-left">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center flex-shrink-0 shadow-lg">
              <PhoneCall className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="text-xs uppercase font-bold text-amber-300 tracking-wider">
                ສູນບໍລິການລູກຄ້າ ແລະ ແຈ້ງເຫດສຸກເສີນ
              </div>
              <div className="text-lg sm:text-2xl font-extrabold text-white mt-0.5">
                ສາຍດ່ວນ ຟຟລ: 1199 (ຕະຫຼອດ 24 ຊົ່ວໂມງ)
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row w-full lg:w-auto items-stretch sm:items-center justify-center gap-3">
            <a
              href="tel:1199"
              className="px-6 py-3 rounded-2xl bg-white text-[#2329c1] hover:bg-amber-300 hover:text-slate-900 font-extrabold text-sm transition-all shadow-md active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <PhoneCall className="w-4 h-4" />
              <span>ໂທ 1199 ດຽວນີ້</span>
            </a>
            <Link
              href="/services/branches"
              className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all border border-white/20 active:scale-95 flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <span>ສາຂາທົ່ວປະເທດ</span>
            </Link>
          </div>
        </div>

        {/* 4 Columns Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10 pb-10 sm:pb-12 border-b border-white/10">
          {/* Col 1: About Brand */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white p-1 flex items-center justify-center">
                <img
                  src="/edl-logo-v2.png"
                  alt="EDL Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div>
                <div className="font-extrabold text-white text-base tracking-tight">
                  ລັດວິສາຫະກິດໄຟຟ້າລາວ
                </div>
                <div className="text-[11px] text-slate-400 font-semibold tracking-wider">
                  ELECTRICITE DU LAOS (EDL)
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-sm">
              ລັດວິສາຫະກິດໄຟຟ້າລາວ ເປັນເສົາຄ້ຳດ້ານພະລັງງານແຫ່ງຊາດ
              ມຸ່ງໝັ້ນສະໜອງກະແສໄຟຟ້າຢ່າງໝັ້ນຄົງ, ປອດໄພ ແລະ ທົ່ວເຖິງ
              ເພື່ອຂັບເຄື່ອນການພັດທະນາເສດຖະກິດ-ສັງຄົມ ແຫ່ງ ສປປ ລາວ.
            </p>

            <div className="pt-2 flex items-center gap-3">
              <a
                href="https://facebook.com/edllaos"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#2329c1] hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                title="Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com/@edllaos"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-red-600 hover:text-white flex items-center justify-center text-slate-300 transition-colors"
                title="YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Services */}
          <div className="space-y-3">
            <div className="font-bold text-white text-sm tracking-wider uppercase">
              ການບໍລິການ
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/services/tariffs" className="hover:text-white transition-colors">
                  ອັດຕາຄ່າກະແສໄຟຟ້າ
                </Link>
              </li>
              <li>
                <Link href="/#calculator" className="hover:text-white transition-colors">
                  ຄຳນວນຄ່າໄຟຟ້າ
                </Link>
              </li>
              <li>
                <Link href="/services/branches" className="hover:text-white transition-colors">
                  ສາຂາ ແລະ ສູນບໍລິການ 18 ແຂວງ
                </Link>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  ຂໍຕິດຕັ້ງໝໍ້ແປງໄຟຟ້າໃໝ່
                </a>
              </li>
              <li>
                <a href="#services" className="hover:text-white transition-colors">
                  ແຈ້ງເຫດໄຟຟ້າຂັດຂ້ອງ 1199
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Information & Media */}
          <div className="space-y-3">
            <div className="font-bold text-white text-sm tracking-wider uppercase">
              ຂໍ້ມູນຂ່າວສານ
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/news" className="hover:text-white transition-colors">
                  ຂ່າວສານ & ກິດຈະກຳ
                </Link>
              </li>
              <li>
                <Link href="/magazines" className="hover:text-white transition-colors">
                  ວາລະສານ ໄຟຟ້າລາວ
                </Link>
              </li>
              <li>
                <a href="#procurements" className="hover:text-white transition-colors">
                  ປະກາດປະມູນ & ຈັດຊື້-ຈັດຈ້າງ
                </a>
              </li>
              <li>
                <Link href="/about/organization" className="hover:text-white transition-colors">
                  ໂຄງຮ່າງການຈັດຕັ້ງ
                </Link>
              </li>
              <li>
                <a href="#safety" className="hover:text-white transition-colors">
                  ຄູ່ມືຄວາມປອດໄພເລື່ອງໄຟຟ້າ
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Headquarters */}
          <div className="space-y-3">
            <div className="font-bold text-white text-sm tracking-wider uppercase">
              ສຳນັກງານໃຫຍ່
            </div>
            <div className="space-y-2.5 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#2329c1] bg-white rounded-full p-0.5 shrink-0 mt-0.5" />
                <span>ຖະໜົນມິດຕະພາບ ລາວ-ໄທ, ບ້ານທົ່ງກາງ, ເມືອງສີສັດຕະນາກ, ນະຄອນຫຼວງວຽງຈັນ</span>
              </div>
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
                <span>(+856-21) 316120, 316121</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-300 shrink-0" />
                <span>edlhq@edl.com.la</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>08:00 - 16:00 (ຈັນ - ສຸກ)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright & Back to Top */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
          <div>
            © {year} ລັດວິສາຫະກິດໄຟຟ້າລາວ (Electricité du Laos). All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>ເວັບໄຊທາງການ ຟຟລ</span>
            </span>

            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-slate-400 hover:text-white transition-colors"
            >
              <span>ກັບຂຶ້ນເທິງສຸດ</span>
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
