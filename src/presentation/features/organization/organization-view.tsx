"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Users,
  Building2,
  Download,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ShieldCheck,
  Info,
  Layers,
  ArrowRight,
  ExternalLink,
} from "lucide-react";
import type { OrgStructure } from "@/domain";
import { getStorageUrl } from "@/infrastructure";

interface OrganizationViewProps {
  structures: OrgStructure[];
}

export function OrganizationView({ structures }: OrganizationViewProps) {
  const [activeTab, setActiveTab] = useState<string>("BOARD_OF_DIRECTORS");
  const [zoomScale, setZoomScale] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const viewerRef = useRef<HTMLDivElement>(null);

  const boardStructure = structures.find(
    (s) => s.structureType === "BOARD_OF_DIRECTORS"
  );
  const execStructure = structures.find(
    (s) => s.structureType === "EXECUTIVE_BOARD"
  );
  const generalStructure = structures.find(
    (s) => s.structureType === "ORG_STRUCTURE"
  );

  const getActiveData = () => {
    switch (activeTab) {
      case "BOARD_OF_DIRECTORS":
        return {
          title: "ສະພາຜູ້ອຳນວຍການ (Board of Directors)",
          subtitle:
            "ອົງການຊີ້ນຳສູງສຸດໃນການກຳນົດທິດທາງຍຸດທະສາດ, ນະໂຍບາຍ ແລະ ແຜນການພັດທະນາລັດວິສາຫະກິດໄຟຟ້າລາວ",
          data: boardStructure,
          description:
            "ສະພາຜູ້ອຳນວຍການ ລັດວິສາຫະກິດໄຟຟ້າລາວ ເປັນຕົວແທນຂອງລັດຖະບານໃນການຄຸ້ມຄອງ ແລະ ຊີ້ນຳວຽກງານນະໂຍບາຍ, ການລົງທຶນໂຄງການພະລັງງານໃຫຍ່ ແລະ ການກຳກັບດູແລການປະຕິບັດງານຂອງຄະນະຜູ້ບໍລິຫານ.",
          roles: [
            "ກຳນົດວິໄສທັດ, ເປົ້າໝາຍ ແລະ ຍຸດທະສາດການດຳເນີນທຸລະກິດພະລັງງານໄຟຟ້າ",
            "ອະນຸມັດແຜນການລົງທຶນ, ງົບປະມານປະຈຳປີ ແລະ ໂຄງການກໍ່ສ້າງຕາໜ່າງສາຍສົ່ງ",
            "ຕິດຕາມ ແລະ ປະເມີນຜົນການດຳເນີນງານຂອງຄະນະຜູ້ອຳນວຍການໃຫຍ່",
            "ຮັບປະກັນຄວາມໝັ້ນຄົງທາງດ້ານພະລັງງານ ແລະ ຜົນປະໂຫຍດຂອງປະເທດຊາດ",
          ],
        };
      case "EXECUTIVE_BOARD":
        return {
          title: "ຄະນະຜູ້ບໍລິຫານ (Executive Board)",
          subtitle:
            "ຄະນະອຳນວຍການໃຫຍ່ ແລະ ຮອງຜູ້ອຳນວຍການໃຫຍ່ ຜູ້ຊີ້ນຳການບໍລິຫານງານປະຈຳວັນຂອງ ຟຟລ",
          data: execStructure,
          description:
            "ຄະນະຜູ້ບໍລິຫານ ມີໜ້າທີ່ຮັບຜິດຊອບໃນການຂັບເຄື່ອນ ແລະ ຈັດຕັ້ງປະຕິບັດແຜນງານປະຕິຮູບ ຟຟລ ໃຫ້ປະກົດຜົນເປັນຈິງ, ຄຸ້ມຄອງການຜະລິດ, ລະບົບສາຍສົ່ງ, ການຈຳໜ່າຍ ແລະ ການບໍລິການລູກຄ້າທົ່ວປະເທດ.",
          roles: [
            "ຄຸ້ມຄອງ ແລະ ບໍລິຫານວຽກງານທົ່ວໄປຂອງ ຟຟລ ຕາມມະຕິຂອງສະພາຜູ້ອຳນວຍການ",
            "ຊີ້ນຳສາຍງານເຕັກນິກ, ວິສະວະກຳ, ການເງິນ ແລະ ຊັບພະຍາກອນມະນຸດ",
            "ປັບປຸງຄຸນນະພາບການບໍລິການໄຟຟ້າ ແລະ ຫຼຸດຜ່ອນບັນຫາໄຟຕົກ-ໄຟດັບ",
            "ພັດທະນານະວັດຕະກຳດິຈິທັອກ (Digital Transformation) ເພື່ອຍົກສູງປະສິດທິພາບ",
          ],
        };
      case "ORG_STRUCTURE":
      default:
        return {
          title: "ໂຄງຮ່າງການຈັດຕັ້ງລວມ (General Organization Structure)",
          subtitle:
            "ແຜນຜັງໂຄງສ້າງການຈັດຕັ້ງ ແລະ ສາຍການບັງຄັບບັນຊາ ລະຫວ່າງ ຝ່າຍ, ພະແນກ ແລະ ສາຂາທົ່ວປະເທດ",
          data: generalStructure,
          description:
            "ໂຄງຮ່າງການຈັດຕັ້ງຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ ແບ່ງອອກເປັນສາຍງານຄຸ້ມຄອງລະບົບໄຟຟ້າພາກ (ພາກເໜືອ, ພາກກາງ, ພາກໃຕ້), ສາຂາປະຈຳ 18 ແຂວງ ແລະ ບັນດາຝ່າຍວິຊາການສູນກາງ.",
          roles: [
            "ສາຍງານຄຸ້ມຄອງລະບົບໄຟຟ້າພາກເໜືອ, ພາກກາງ ແລະ ພາກໃຕ້",
            "ສາຂາ ແລະ ສູນບໍລິການລູກຄ້າ 18 ແຂວງ ທົ່ວປະເທດ",
            "ຝ່າຍເຕັກນິກ, ຝ່າຍການເງິນ, ຝ່າຍຈັດຊື້ ແລະ ຝ່າຍລະບົບຄວບຄຸມ (Dispatching)",
            "ສູນບໍລິການໂທລະຄົມ ແລະ ເຕັກໂນໂລຊີຂໍ້ມູນຂ່າວສານ",
          ],
        };
    }
  };

  const activeInfo = getActiveData();
  const currentImage = activeInfo.data?.imageUrl
    ? getStorageUrl(activeInfo.data.imageUrl)
    : null;

  const handleZoomIn = () => setZoomScale((prev) => Math.min(prev + 0.25, 3));
  const handleZoomOut = () =>
    setZoomScale((prev) => Math.max(prev - 0.25, 0.5));
  const handleResetZoom = () => setZoomScale(1);

  const toggleFullscreen = async () => {
    if (!viewerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        if (viewerRef.current.requestFullscreen) {
          await viewerRef.current.requestFullscreen();
        } else if ((viewerRef.current as any).webkitRequestFullscreen) {
          await (viewerRef.current as any).webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
      }
    } catch {
      setIsFullscreen((prev) => !prev);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6 flex-wrap">
          <Link href="/" className="hover:text-[#2329c1] transition-colors">
            ໜ້າຫຼັກ
          </Link>
          <span>/</span>
          <span className="text-slate-600">ກ່ຽວກັບ ຟຟລ</span>
          <span>/</span>
          <span className="text-[#2329c1] font-semibold">
            ໂຄງຮ່າງການຈັດຕັ້ງ
          </span>
        </nav>

        {/* Hero Banner */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2329c1] via-[#1b209e] to-[#0c0e4a] p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-xl mb-8 sm:mb-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-4 border border-white/15 backdrop-blur-sm shadow-sm">
              <Users className="w-3.5 h-3.5" />
              <span>ການຄຸ້ມຄອງ ແລະ ບໍລິຫານງານ (Corporate Governance)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              ໂຄງຮ່າງການຈັດຕັ້ງ ລັດວິສາຫະກິດໄຟຟ້າລາວ
            </h1>
            <p className="mt-3 text-xs sm:text-sm text-blue-100 leading-relaxed max-w-2xl">
              ແຜນຜັງສາຍການບັງຄັບບັນຊາ, ໂຄງສ້າງສະພາຜູ້ອຳນວຍການ, ຄະນະຜູ້ບໍລິຫານ
              ແລະ ການແບ່ງຂັ້ນຄຸ້ມຄອງລະບົບໄຟຟ້າແຫ່ງຊາດ ເພື່ອຄວາມໂປ່ງໃສ ແລະ ມີປະສິດທິຜົນສູງສຸດ.
            </p>
          </div>
        </div>

        {/* Tabs Selector with Animated Glow */}
        <div className="bg-white rounded-2xl p-1.5 sm:p-2 border border-slate-200/80 shadow-sm max-w-2xl mx-auto mb-8 sm:mb-10 grid grid-cols-1 sm:grid-cols-3 gap-1.5 sm:gap-1">
          <button
            onClick={() => {
              setActiveTab("BOARD_OF_DIRECTORS");
              setZoomScale(1);
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-98 ${
              activeTab === "BOARD_OF_DIRECTORS"
                ? "bg-[#2329c1] text-white shadow-md shadow-blue-700/25"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            ສະພາຜູ້ອຳນວຍການ
          </button>

          <button
            onClick={() => {
              setActiveTab("EXECUTIVE_BOARD");
              setZoomScale(1);
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-98 ${
              activeTab === "EXECUTIVE_BOARD"
                ? "bg-[#2329c1] text-white shadow-md shadow-blue-700/25"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            ຄະນະຜູ້ບໍລິຫານ
          </button>

          <button
            onClick={() => {
              setActiveTab("ORG_STRUCTURE");
              setZoomScale(1);
            }}
            className={`flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 active:scale-98 ${
              activeTab === "ORG_STRUCTURE"
                ? "bg-[#2329c1] text-white shadow-md shadow-blue-700/25"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            ໂຄງຮ່າງການຈັດຕັ້ງລວມ
          </button>
        </div>

        {/* Diagram Canvas Showcase Card */}
        <div className="bg-white rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200/80 shadow-sm mb-10 sm:mb-12">
          {/* Header of Active Tab */}
          <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-100 gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-[#2329c1] text-xs font-bold mb-2">
                <Layers className="w-3.5 h-3.5" />
                <span>
                  {activeInfo.data?.structureName || activeInfo.title}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900">
                {activeInfo.title}
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 max-w-2xl">
                {activeInfo.subtitle}
              </p>
            </div>

            {/* Interactive Image Tools */}
            <div className="flex items-center gap-2 self-start md:self-auto flex-wrap">
              <div className="inline-flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200 text-xs text-slate-600">
                <button
                  onClick={handleZoomOut}
                  title="ຫຍໍ້ຮູບ"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-[#2329c1] transition-colors"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="px-2 font-bold font-mono text-[11px]">
                  {Math.round(zoomScale * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  title="ຂະຫຍາຍຮູບ"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-[#2329c1] transition-colors"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  onClick={handleResetZoom}
                  title="ຣີເຊັດຂະໜາດ"
                  className="p-1.5 rounded-lg hover:bg-white hover:text-[#2329c1] transition-colors ml-1 border-l border-slate-200"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>

              {currentImage && (
                <>
                  <button
                    onClick={toggleFullscreen}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-[#2329c1] hover:text-white text-slate-700 text-xs font-bold transition-colors active:scale-95"
                    title="ເບິ່ງເຕັມຈໍ (Fullscreen)"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>ເຕັມຈໍ</span>
                  </button>

                  <a
                    href={currentImage}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-blue-50 text-slate-700 hover:text-[#2329c1] text-xs font-bold transition-colors border border-slate-200 active:scale-95"
                    title="ເປີດຮູບຕົ້ນສະບັບໃນແທັບໃໝ່"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#2329c1]" />
                    <span className="hidden sm:inline">ແທັບໃໝ່</span>
                  </a>

                  <a
                    href={currentImage}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#2329c1] hover:bg-[#1a1f9e] text-white text-xs font-bold transition-colors active:scale-95 shadow-sm shadow-blue-700/20"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>ດາວໂຫຼດ</span>
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Diagram Display Container */}
          <div
            ref={viewerRef}
            className={`relative w-full overflow-auto transition-colors duration-200 flex flex-col justify-center items-center ${
              isFullscreen
                ? "fixed inset-0 z-50 bg-slate-950 p-3 sm:p-6 w-screen h-screen"
                : "bg-slate-50/70 border border-slate-200/80 rounded-2xl min-h-[260px] sm:min-h-[420px] max-h-[850px] p-2 sm:p-4"
            }`}
          >
            {isFullscreen && (
              <div className="absolute top-3 left-3 right-3 sm:top-4 sm:left-4 sm:right-4 z-20 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl border border-white/10 text-white shadow-xl">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-bold text-amber-300 truncate max-w-[160px] sm:max-w-md">
                    {activeInfo.title}
                  </span>
                  <span className="hidden sm:inline text-[11px] text-slate-400">
                    (ໂໝດເຕັມຈໍ 100%)
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="inline-flex items-center bg-white/10 rounded-xl p-1 text-xs text-white">
                    <button
                      onClick={handleZoomOut}
                      className="p-1 rounded-lg hover:bg-white/20"
                      title="ຫຍໍ້ຮູບ"
                    >
                      <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="px-1.5 sm:px-2 font-mono text-[11px] font-bold">
                      {Math.round(zoomScale * 100)}%
                    </span>
                    <button
                      onClick={handleZoomIn}
                      className="p-1 rounded-lg hover:bg-white/20"
                      title="ຂະຫຍາຍຮູບ"
                    >
                      <ZoomIn className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleResetZoom}
                      className="p-1 rounded-lg hover:bg-white/20 border-l border-white/20 ml-1"
                      title="ຣີເຊັດ"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {currentImage && (
                    <a
                      href={currentImage}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
                      title="ເປີດໃນແທັບໃໝ່"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}

                  <button
                    onClick={toggleFullscreen}
                    className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-xs font-bold transition-colors"
                    title="ອອກຈາກເຕັມຈໍ (Esc)"
                  >
                    <Minimize2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">ອອກຈາກເຕັມຈໍ</span>
                    <span className="sm:hidden">ອອກ</span>
                  </button>
                </div>
              </div>
            )}

            {currentImage ? (
              <div
                className={`transition-transform duration-200 ease-out flex justify-center items-center w-full ${
                  isFullscreen ? "pt-14" : ""
                }`}
                style={{ transform: `scale(${zoomScale})` }}
              >
                <img
                  src={currentImage}
                  alt={activeInfo.title}
                  className={`max-w-full h-auto object-contain ${
                    isFullscreen ? "max-h-[85vh]" : "rounded-xl shadow-xs"
                  }`}
                />
              </div>
            ) : (
              <div className="text-center py-16 px-4">
                <div className="w-16 h-16 rounded-full bg-blue-50 text-[#2329c1] flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 opacity-70" />
                </div>
                <h3 className="text-base font-bold text-slate-800 mb-1">
                  ກຳລັງອັບເດດແຜນຜັງໂຄງຮ່າງການຈັດຕັ້ງ
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto">
                  ຂໍ້ມູນກຳລັງໄດ້ຮັບການປັບປຸງຜ່ານລະບົບ EDL Admin Management System.
                </p>
              </div>
            )}
          </div>

          {/* Helper caption */}
          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-600">
            <span className="flex items-start sm:items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-[#2329c1] shrink-0 mt-0.5 sm:mt-0" />
              <span>
                ສາມາດກົດປຸ່ມ <strong>"ເຕັມຈໍ"</strong> ເພື່ອຂະຫຍາຍແຜນຜັງໃຫ້ເຕັມໜ້າຈໍຄອມພິວເຕີ ຫຼື ກົດ <strong>"ແທັບໃໝ່"</strong> ເພື່ອເປີດຮູບຕົ້ນສະບັບ
              </span>
            </span>
            <span className="shrink-0">ອັບເດດລ່າສຸດ: 2026</span>
          </div>
        </div>

        {/* Roles & Responsibilities Section for Active Tab */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 mb-10 sm:mb-12">
          {/* Left Column: Description & Background */}
          <div className="md:col-span-5 bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-[#2329c1] text-xs font-bold mb-3">
                <Building2 className="w-3.5 h-3.5" />
                <span>ຄວາມເປັນມາ ແລະ ພາລະບົດບາດ</span>
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-3">
                {activeInfo.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {activeInfo.description}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-400 text-slate-900 flex items-center justify-center font-black text-xs shrink-0">
                EDL
              </div>
              <div className="text-xs text-slate-500">
                ລັດວິສາຫະກິດໄຟຟ້າລາວ ແຫ່ງ ສປປ ລາວ
              </div>
            </div>
          </div>

          {/* Right Column: Key Mandates / Target Responsibilities */}
          <div className="md:col-span-7 bg-white rounded-3xl p-5 sm:p-8 border border-slate-200/80 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold mb-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ໜ້າທີ່ ແລະ ຄວາມຮັບຜິດຊອບຫຼັກ (Key Mandates)</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mb-4">
              ຂອບເຂດສິດ ແລະ ຄວາມຮັບຜິດຊອບ
            </h3>

            <div className="space-y-3.5">
              {activeInfo.roles.map((role, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-blue-50/40 hover:border-blue-200 transition-colors"
                >
                  <div className="w-6 h-6 rounded-full bg-[#2329c1] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                    {role}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links to Other Corporate Modules */}
        <div className="bg-gradient-to-r from-slate-900 via-[#101357] to-[#2329c1] rounded-3xl p-6 sm:p-10 text-white relative overflow-hidden shadow-xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                ຂໍ້ມູນອື່ນໆ ທີ່ກ່ຽວຂ້ອງ
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white">
                ຕ້ອງການສອບຖາມຂໍ້ມູນ ຫຼື ຕິດຕໍ່ສາຂາທົ່ວປະເທດ?
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-blue-200 max-w-xl">
                ຄົ້ນຫາທີ່ຕັ້ງສາຂາ 18 ແຂວງ ແລະ ຫ້ອງການໄຟຟ້າເມືອງ 152 ແຫ່ງ ທົ່ວປະເທດໄດ້ສະດວກ
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <Link
                href="/services/branches"
                className="px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-xs transition-colors shadow-md active:scale-95 flex items-center gap-2"
              >
                <span>ເບິ່ງສາຂາທົ່ວປະເທດ 18 ແຂວງ</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
