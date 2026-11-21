"use client";

import React from "react";
import { Zap, ShieldCheck, Globe, Radio } from "lucide-react";
import type { VisionMission } from "@/domain";

const STATS = [
  {
    icon: Globe,
    value: "95%+",
    label: "ອັດຕາການເຂົ້າເຖິງໄຟຟ້າ",
    sublabel: "ຄອບຄົວທົ່ວປະເທດມີໄຟຟ້າໃຊ້",
    badge: "ມາດຕະຖານສາກົນ",
  },
  {
    icon: Zap,
    value: "10,000+ MW",
    label: "ກຳລັງການຜະລິດຕິດຕັ້ງ",
    sublabel: "ພະລັງງານນ້ຳ, ແສງຕາເວັນ ແລະ ລົມ",
    badge: "Clean Energy",
  },
  {
    icon: ShieldCheck,
    value: "18 ແຂວງ",
    label: "ເຊື່ອມໂຍງສາຍສົ່ງທົ່ວປະເທດ",
    sublabel: "ລະບົບສາຍສົ່ງ 500kV, 230kV, 115kV",
    badge: "100% Nationwide",
  },
  {
    icon: Radio,
    value: "24/7",
    label: "ສາຍດ່ວນບໍລິການ 1199",
    sublabel: "ພ້ອມແກ້ໄຂເຫດສຸກເສີນຕະຫຼອດເວລາ",
    badge: "Free Call",
  },
];

interface NationalGridStatsProps {
  visionMissions?: VisionMission[];
}

export function NationalGridStats({ visionMissions }: NationalGridStatsProps) {
  const visionItem = visionMissions?.find((v) => v.entryType === "VISION");
  const missionItem = visionMissions?.find((v) => v.entryType === "MISSION");

  return (
    <section id="stats" className="py-12 sm:py-16 md:py-24 bg-[#121568] text-white relative overflow-hidden">
      {/* Background Tech Elements */}
      <div className="absolute inset-0 bg-dot-pattern opacity-10 pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#2329c1]/40 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-blue-300 text-xs font-semibold backdrop-blur-sm mb-3">
            <Zap className="w-3.5 h-3.5 text-amber-300" />
            <span>ພາລະກິດ & ຄວາມໝັ້ນຄົງດ້ານພະລັງງານ</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            ພະລັງງານຂັບເຄື່ອນ ການພັດທະນາປະເທດຊາດ
          </h2>
          <p className="mt-3 text-sm sm:text-base text-blue-100/80 leading-relaxed">
            ລັດວິສາຫະກິດໄຟຟ້າລາວ ພັດທະນາພື້ນຖານໂຄງລ່າງສາຍສົ່ງ ແລະ ສະຖານີໄຟຟ້າຢ່າງບໍ່ຢຸດຢັ້ງ
            ເພື່ອສ້າງຄວາມໝັ້ນຄົງທາງດ້ານພະລັງງານໃຫ້ແກ່ປວງຊົນລາວ
          </p>
        </div>

        {/* 4 Key Stat Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10 sm:mb-12">
          {STATS.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="relative bg-white/5 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-white/10 hover:border-blue-400/50 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#2329c1] to-blue-500 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform">
                    <Icon className="w-6 h-6 text-amber-300" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-blue-200 border border-white/10">
                    {stat.badge}
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-1 group-hover:text-amber-300 transition-colors">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-slate-100">{stat.label}</div>
                <div className="text-xs text-blue-200/70 mt-1">{stat.sublabel}</div>
              </div>
            );
          })}
        </div>

        {/* Vision & Mission Highlight from Backend UAT if available */}
        {(visionItem || missionItem) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-white/10">
            {visionItem && (
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                  ວິໄສທັດ (Vision)
                </div>
                <div className="text-sm text-slate-200 leading-relaxed">
                  {visionItem.content || visionItem.description || visionItem.slogan}
                </div>
              </div>
            )}
            {missionItem && (
              <div className="p-6 rounded-2xl bg-white/[0.04] border border-white/10">
                <div className="text-xs font-bold text-blue-300 uppercase tracking-wider mb-2">
                  ພາລະກິດ (Mission)
                </div>
                <div className="text-sm text-slate-200 leading-relaxed">
                  {missionItem.content || missionItem.description || missionItem.slogan}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
