"use client";

import React from "react";
import Link from "next/link";
import {
  Zap,
  CreditCard,
  MapPin,
  FileCheck2,
  BookOpen,
  ChevronRight,
  ShieldAlert,
} from "lucide-react";

const SERVICES = [
  {
    icon: CreditCard,
    title: "ອັດຕາຄ່າກະແສໄຟຟ້າທາງການ",
    titleEn: "Official Electricity Tariffs",
    description: "ຕາຕະລາງລາຄາໄຟຟ້າແຍກປະເພດທີ່ຢູ່ອາໄສ, ທຸລະກິດ, ອຸດສາຫະກຳ ພ້ອມດາວໂຫຼດດຳລັດທາງການ (PDF)",
    link: "/services/tariffs",
    badge: "ອັບເດດລ່າສຸດ",
    color: "from-blue-600 to-[#2329c1]",
  },
  {
    icon: Zap,
    title: "ຄຳນວນຄ່າໄຟຟ້າເບື້ອງຕົ້ນ",
    titleEn: "Tariff Calculator",
    description: "ໂປຣແກຣມຄຳນວນຄ່າກະແສໄຟຟ້າອັດສະລິຍະ ຕາມໂຄງສ້າງລາຄາທາງການລັດວິສາຫະກິດໄຟຟ້າລາວ",
    link: "/services/tariff-calculator",
    badge: "Interactive",
    color: "from-[#2329c1] to-indigo-700",
  },
  {
    icon: MapPin,
    title: "ສາຂາ ແລະ ສູນບໍລິການ 18 ແຂວງ",
    titleEn: "Branch & Service Locator",
    description: "ຄົ້ນຫາທີ່ຕັ້ງ, ເບີໂທຕິດຕໍ່, ແລະ ແຜນທີ່ສູນບໍລິການລູກຄ້າ ຟຟລ ຄອບຄຸມ 18 ແຂວງທົ່ວປະເທດ",
    link: "/services/branches",
    badge: "18 ແຂວງທົ່ວປະເທດ",
    color: "from-indigo-600 to-blue-800",
  },
  {
    icon: FileCheck2,
    title: "ການຈັດຊື້ - ຈັດຈ້າງ",
    titleEn: "Procurements & Bidding",
    description: "ປະກາດປະມູນ, ຈັດຊື້ວັດສະດຸອຸປະກອນ, ໂຄງການກໍ່ສ້າງສາຍສົ່ງ ແລະ ດາວໂຫຼດເອກະສານ TOR",
    link: "#procurements",
    badge: "ໂປ່ງໃສກວດສອບໄດ້",
    color: "from-slate-700 to-slate-900",
  },
  {
    icon: BookOpen,
    title: "ວາລະສານ ຟຟລ & ຄວາມຮູ້",
    titleEn: "EDL Magazines & Safety",
    description: "ອ່ານວາລະສານອອນລາຍ, ດາວໂຫຼດ PDF, ຄວາມຮູ້ເລື່ອງຄວາມປອດໄພ ແລະ ການປະຢັດພະລັງງານ",
    link: "/magazines",
    badge: "ດາວໂຫຼດຟຣີ",
    color: "from-[#2329c1] to-blue-900",
  },
  {
    icon: ShieldAlert,
    title: "ແຈ້ງໄຟຟ້າຂັດຂ້ອງ & ສຸກເສີນ",
    titleEn: "Emergency Report & Outages",
    description: "ສາຍດ່ວນ 1199 ຕະຫຼອດ 24 ຊົ່ວໂມງ ພ້ອມກວດສອບຕາຕະລາງແຈ້ງດັບກະແສໄຟຟ້າຊົ່ວຄາວ",
    link: "tel:1199",
    badge: "ສາຍດ່ວນ 1199",
    color: "from-amber-600 to-amber-700",
  },
];

export function QuickServicesHub() {
  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 bg-slate-50 relative border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-[#2329c1] text-xs font-semibold mb-2">
              <Zap className="w-3.5 h-3.5" />
              <span>ບໍລິການອອນລາຍ (E-Services)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ຈຸດບໍລິການດ່ວນສຳລັບປະຊາຊົນ
            </h2>
            <p className="mt-1 text-sm text-slate-500 max-w-xl">
              ເຂົ້າເຖິງການບໍລິການຫຼັກຂອງລັດວິສາຫະກິດໄຟຟ້າລາວໄດ້ຢ່າງວ່ອງໄວ, ສະດວກ ແລະ ປອດໄພ
            </p>
          </div>

          <Link
            href="/services/tariffs"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#2329c1] hover:text-[#1b209e] transition-colors"
          >
            <span>ເບິ່ງການບໍລິການທັງໝົດ</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {SERVICES.map((item, idx) => {
            const Icon = item.icon;
            const isExternal = item.link.startsWith("tel:") || item.link.startsWith("http");
            const isAnchor = item.link.startsWith("#");

            const content = (
              <div className="relative h-full bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-blue-300 transition-all duration-300 group flex flex-col justify-between overflow-hidden">
                {/* Subtle top accent border */}
                <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity`} />

                <div>
                  <div className="flex items-start justify-between gap-2 mb-4 sm:mb-5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-blue-50 text-[#2329c1] flex items-center justify-center group-hover:bg-[#2329c1] group-hover:text-white transition-colors duration-300 shadow-sm shrink-0">
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform group-hover:scale-110" />
                    </div>
                    {item.badge && (
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-600 group-hover:bg-blue-100 group-hover:text-[#2329c1] transition-colors shrink-0">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#2329c1] transition-colors mb-1">
                    {item.title}
                  </h3>
                  <div className="text-[11px] font-semibold tracking-wider text-slate-600 uppercase mb-3">
                    {item.titleEn}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#2329c1]">
                  <span>ເຂົ້າເຖິງບໍລິການ</span>
                  <div className="w-7 h-7 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-[#2329c1] group-hover:text-white group-hover:translate-x-1 transition-all">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );

            if (isExternal || isAnchor) {
              return (
                <a key={idx} href={item.link}>
                  {content}
                </a>
              );
            }

            return (
              <Link key={idx} href={item.link}>
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
