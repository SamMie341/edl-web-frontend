"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calculator,
  Zap,
  Info,
  ArrowRight,
  Sparkles,
  Building,
  Home as HomeIcon,
  Factory,
  Sun,
  ShieldCheck,
  Calendar,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { formatNumber } from "@/shared/utils";
import { TariffCategoryInfo, ElectricityCalculationResponse } from "@/domain/entities";

export function InteractiveBillCalculator() {
  const [tariffCategories, setTariffCategories] = useState<TariffCategoryInfo[]>([
    {
      id: 28,
      nameLa: "ປະເພດທີ່ຢູ່ອາໄສ",
      nameEn: "Residential / Household",
      categoryGroup: "RESIDENTIAL",
      voltageLevel: "0.4 kV",
      description: "ການນຳໃຊ້ໄຟຟ້າຕາມເຮືອນຊານບ້ານຊ່ອງ ສຳລັບການດຳລົງຊີວິດປະຈຳວັນ (ໂຄງສ້າງອັດຕາ 8 ຂັ້ນບັນໄດ)",
      orderIndex: 1,
    },
  ]);
  const [selectedType, setSelectedType] = useState<string>("0.4 kV");
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(28);
  const [units, setUnits] = useState<number>(180);
  const [year, setYear] = useState<number>(2026);
  const [month, setMonth] = useState<number>(11);

  const [calculation, setCalculation] =
    useState<ElectricityCalculationResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string | null>(null);

  const isHotSeason = month >= 3 && month <= 5;

  // Load config on mount to fetch dynamic Tariff Categories (Module 3.22.1)
  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetch("/api/electricity-calculator/config");
        const json = await res.json();
        if (json?.data?.tariffCategories && json.data.tariffCategories.length > 0) {
          setTariffCategories(json.data.tariffCategories);
          // Default to 0.4 kV and Residential category (ປະເພດທີ່ຢູ່ອາໄສ)
          const resCat = json.data.tariffCategories.find(
            (c: any) => c.categoryGroup === "RESIDENTIAL" || c.nameLa.includes("ທີ່ຢູ່ອາໄສ")
          );
          if (resCat) {
            setSelectedCategoryId(resCat.id);
            setSelectedType("0.4 kV");
          } else if (json.data.defaultSchedule?.categoryId) {
            setSelectedCategoryId(json.data.defaultSchedule.categoryId);
          }
        }
      } catch (err) {
        console.error("Failed to load calculator config", err);
      }
    }
    loadConfig();
  }, []);

  // Query real Backend API for calculation (Backend automatically applies official maintenance fee from DB)
  useEffect(() => {
    let isCancelled = false;
    const timer = setTimeout(async () => {
      setIsLoading(true);
      setApiError(null);
      try {
        const res = await fetch("/api/electricity-calculator/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year,
            month,
            categoryId: selectedCategoryId,
            directMonthlyKwh: units,
          }),
        });
        const json = await res.json();
        if (!isCancelled) {
          if (!res.ok || json.statusCode >= 400) {
            setApiError(json.message || "ບໍ່ພົບຕາຕະລາງອັດຕາຄ່າໄຟໃນຖານຂໍ້ມູນ");
            setCalculation(null);
          } else {
            setCalculation(json.data);
            setApiError(null);
          }
        }
      } catch (err: any) {
        if (!isCancelled) {
          setApiError(err.message || "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ API ໄດ້");
          setCalculation(null);
        }
      } finally {
        if (!isCancelled) setIsLoading(false);
      }
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [year, month, selectedCategoryId, units]);

  const selectedCategory =
    tariffCategories.find((c) => c.id === selectedCategoryId) ||
    tariffCategories[0];

  const TYPE_OPTIONS = [
    { value: "0.4 kV", label: "⚡ ປະເພດແຮງດັນຕ່ຳ 0.4 kV (Low Voltage)" },
    { value: "22 kV", label: "⚡ ປະເພດແຮງດັນກາງ 22 kV (Medium Voltage)" },
    { value: "115 kV", label: "⚡ ປະເພດແຮງດັນສູງ 115 kV (High Voltage)" },
    { value: "RESIDENTIAL", label: "🏠 ປະເພດທີ່ຢູ່ອາໄສ (Residential)" },
    { value: "ALL", label: "ທັງໝົດ (All Categories - 28 ປະເພດ)" },
  ];

  const filteredCategories = React.useMemo(() => {
    let list: TariffCategoryInfo[];
    if (selectedType === "ALL") {
      list = tariffCategories;
    } else if (selectedType === "RESIDENTIAL") {
      list = tariffCategories.filter((c) => c.categoryGroup === "RESIDENTIAL");
    } else {
      list = tariffCategories.filter((c) => c.voltageLevel === selectedType);
    }

    // Sort to place RESIDENTIAL (ທີ່ຢູ່ອາໄສ) at the very top for 0.4 kV
    return [...list].sort((a, b) => {
      const aIsRes = a.categoryGroup === "RESIDENTIAL" || a.nameLa.includes("ທີ່ຢູ່ອາໄສ");
      const bIsRes = b.categoryGroup === "RESIDENTIAL" || b.nameLa.includes("ທີ່ຢູ່ອາໄສ");
      if (aIsRes && !bIsRes) return -1;
      if (!aIsRes && bIsRes) return 1;
      return (a.orderIndex ?? 0) - (b.orderIndex ?? 0);
    });
  }, [selectedType, tariffCategories]);

  const handleTypeChange = (type: string) => {
    setSelectedType(type);
    let inFilter: TariffCategoryInfo[];
    if (type === "ALL") {
      inFilter = tariffCategories;
    } else if (type === "RESIDENTIAL") {
      inFilter = tariffCategories.filter((c) => c.categoryGroup === "RESIDENTIAL");
    } else {
      inFilter = tariffCategories.filter((c) => c.voltageLevel === type);
    }

    // If switching to 0.4 kV or RESIDENTIAL, default to the residential category
    if (type === "0.4 kV" || type === "RESIDENTIAL") {
      const resCat = inFilter.find(
        (c) => c.categoryGroup === "RESIDENTIAL" || c.nameLa.includes("ທີ່ຢູ່ອາໄສ")
      );
      if (resCat) {
        setSelectedCategoryId(resCat.id);
        return;
      }
    }

    if (inFilter.length > 0 && !inFilter.some((c) => c.id === selectedCategoryId)) {
      setSelectedCategoryId(inFilter[0].id);
    }
  };

  // Helper icon for tariff category
  const getCategoryIconForTariff = (nameLa: string, nameEn?: string | null) => {
    const text = `${nameLa} ${nameEn || ""}`.toLowerCase();
    if (text.includes("ທີ່ຢູ່ອາໄສ") || text.includes("residential") || text.includes("household")) {
      return <HomeIcon className="w-5 h-5" />;
    }
    if (text.includes("ທຸລະກິດ") || text.includes("commercial") || text.includes("business")) {
      return <Building className="w-5 h-5" />;
    }
    if (text.includes("ອຸດສາຫະກຳ") || text.includes("industrial")) {
      return <Factory className="w-5 h-5" />;
    }
    if (text.includes("ກະສິກຳ") || text.includes("agriculture")) {
      return <Zap className="w-5 h-5" />;
    }
    return <ShieldCheck className="w-5 h-5" />;
  };

  return (
    <section id="calculator" className="py-12 sm:py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-[#2329c1] text-[11px] sm:text-xs font-semibold mb-3 border border-blue-100/80 shadow-xs">
            <Calculator className="w-3.5 h-3.5 shrink-0" />
            <span>ໂປຣແກຣມຈຳລອງຄິດໄລ່ຄ່າໄຟຟ້າ 8 ຂັ້ນບັນໄດ (API ຖານຂໍ້ມູນຈິງ)</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
            ຄຳນວນຄ່າກະແສໄຟຟ້າ ປະຈຳເດືອນ
          </h2>
          <p className="mt-3 text-xs sm:text-sm text-slate-500">
            ທົດລອງປັບຈຳນວນໜ່ວຍໄຟຟ້າ (kWh) ເພື່ອປະມານການຄ່າໄຟຟ້າຕາມໂຄງສ້າງອັດຕາຂັ້ນໄດ 8 ຂັ້ນທາງການ
            ພ້ອມນະໂຍບາຍຫຼຸດ 5% ໃນລະດູຮ້ອນ ແລະ ອາກອນມູນຄ່າເພີ່ມ 10%
          </p>

          {/* Quick Nav to Full Calculator */}
          <div className="mt-4">
            <Link
              href="/services/tariff-calculator"
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-50 text-[#2329c1] hover:bg-blue-100 text-xs font-bold transition-all border border-blue-200 shadow-xs group text-left sm:text-center"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>ຕ້ອງການຄິດໄລ່ລະອຽດຕາມເຄື່ອງໃຊ້ໄຟຟ້າ (ແອ, ຕູ້ເຢັນ, ດອກໄຟ)? ຄລິກທີ່ນີ້</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>

        {/* Main Calculator Card */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-3xl p-4 sm:p-8 lg:p-12 shadow-sm max-w-5xl mx-auto">
          {/* Database API Error Alert */}
          {apiError && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">ແຈ້ງເຕືອນຈາກຖານຂໍ້ມູນ: </span>
                <span>{apiError}</span>
                <div className="text-[11px] text-rose-600/80 mt-0.5">
                  * ບໍ່ພົບຕາຕະລາງລາຄາຂອງຮອບບິນນີ້ໃນຖານຂໍ້ມູນ ກະລຸນາກວດສອບ ຫຼື ເພີ່ມຕາຕະລາງລາຄາໃນລະບົບ
                </div>
              </div>
            </div>
          )}

          {/* 1. Billing Period Selector (Year & Month) */}
          <div className="mb-6 sm:mb-8 p-4 sm:p-5 bg-white rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  1. ເລືອກຮອບບິນ / ເດືອນ (Billing Period)
                </div>
                <div className="text-xs text-slate-600 mt-0.5">
                  ເລືອກປີ ແລະ ເດືອນທີ່ຕ້ອງການຄິດໄລ່ຄ່າໄຟຟ້າຕາມຕາຕະລາງລາຄາຂອງ ຟຟລ
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                <div className="flex items-center justify-between sm:justify-start gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:py-1.5 text-xs shadow-xs w-full sm:w-auto">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#2329c1] shrink-0" />
                    <span className="font-medium text-slate-600">ຮອບບິນ:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <label htmlFor="home-calc-year" className="sr-only">
                      ເລືອກປີ (Billing Year)
                    </label>
                    <select
                      id="home-calc-year"
                      aria-label="ເລືອກປີ"
                      value={year}
                      onChange={(e) => setYear(Number(e.target.value))}
                      className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs"
                    >
                      <option value={2026}>ປີ 2026</option>
                      <option value={2027}>ປີ 2027</option>
                      <option value={2028}>ປີ 2028</option>
                      <option value={2029}>ປີ 2029</option>
                    </select>
                    <span>/</span>
                    <label htmlFor="home-calc-month" className="sr-only">
                      ເລືອກເດືອນ (Billing Month)
                    </label>
                    <select
                      id="home-calc-month"
                      aria-label="ເລືອກເດືອນ"
                      value={month}
                      onChange={(e) => setMonth(Number(e.target.value))}
                      className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                        <option key={m} value={m}>
                          ເດືອນ {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {isHotSeason ? (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-semibold border border-amber-200">
                    <Sun className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                    <span>ຊ່ວງລະດູຮ້ອນ (ຫຼຸດ 5% ຖ້າ ≤ 300 kWh)</span>
                  </div>
                ) : (
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-100/70 text-[#2329c1] text-xs font-medium border border-blue-200">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#2329c1]" />
                    <span>ຮອບບິນປົກກະຕິ (VAT 10%)</span>
                  </div>
                )}

                {isLoading && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-[#2329c1] font-medium">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>ກຳລັງຄິດໄລ່...</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* 2. Category Selection (2 Cascaded Dropdowns) */}
          <div className="mb-8">
            <div className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              2. ເລືອກປະເພດການຊົມໃຊ້ໄຟຟ້າ (Tariff Category)
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Dropdown 1: Select Type */}
              <div className="space-y-1.5">
                <label htmlFor="home-calc-type" className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#2329c1] text-white flex items-center justify-center text-[10px] font-black">1</span>
                  <span>Dropdown 1: ເລືອກປະເພດ (Select Category / Voltage)</span>
                </label>
                <select
                  id="home-calc-type"
                  value={selectedType}
                  onChange={(e) => handleTypeChange(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 hover:border-[#2329c1]/50 focus:border-[#2329c1] rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#2329c1]/10 transition-all cursor-pointer shadow-xs"
                >
                  {TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Dropdown 2: Select Data in that Type */}
              <div className="space-y-1.5">
                <label htmlFor="home-calc-category" className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-[#2329c1] text-white flex items-center justify-center text-[10px] font-black">2</span>
                  <span>Dropdown 2: ເລືອກຂໍ້ມູນໃນປະເພດນັ້ນ (Select Category Item)</span>
                </label>
                <select
                  id="home-calc-category"
                  value={selectedCategoryId}
                  onChange={(e) => setSelectedCategoryId(Number(e.target.value))}
                  className="w-full bg-white border-2 border-slate-200 hover:border-[#2329c1]/50 focus:border-[#2329c1] rounded-2xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:ring-4 focus:ring-[#2329c1]/10 transition-all cursor-pointer shadow-xs"
                >
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.nameLa} {cat.nameEn ? `(${cat.nameEn})` : ""}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Selected Category Details Card ("ແລ້ວຄ່ອຍສະແດງ ຂໍ້ມູນຂອງປະເພດນັ້ນ") */}
            {selectedCategory && (
              <div className="mt-4 p-5 rounded-2xl bg-white border border-blue-100/90 shadow-xs relative overflow-hidden">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                  <div className="flex items-start sm:items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#2329c1]/10 text-[#2329c1] flex items-center justify-center flex-shrink-0">
                      {getCategoryIconForTariff(selectedCategory.nameLa, selectedCategory.nameEn)}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-base text-slate-900">
                          {selectedCategory.nameLa}
                        </h3>
                        {selectedCategory.voltageLevel && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                            <Zap className="w-3 h-3 text-amber-600" />
                            <span>{selectedCategory.voltageLevel}</span>
                          </span>
                        )}
                        <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                          {selectedCategory.categoryGroup === "RESIDENTIAL" ? "🏠 ທີ່ຢູ່ອາໄສ" : "🏢 ບໍ່ແມ່ນທີ່ຢູ່ອາໄສ"}
                        </span>
                      </div>
                      {(selectedCategory.nameEn || selectedCategory.categoryGroup === "RESIDENTIAL") && (
                        <div className="text-xs text-slate-600 mt-0.5">
                          {selectedCategory.nameEn || "Residential / Household"}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Active Rate Tag */}
                  {calculation?.currentBill && (
                    <div className="text-left sm:text-right flex-shrink-0 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 w-full sm:w-auto">
                      <div className="text-[10px] text-slate-600 font-medium">ອັດຕາຄິດໄລ່:</div>
                      <div className="text-sm font-black text-[#2329c1] font-mono">
                        {calculation.currentBill.tierBreakdown.length === 1
                          ? `${formatNumber(calculation.currentBill.tierBreakdown[0].rateKipPerKwh)} ກີບ/kWh`
                          : `${calculation.currentBill.tierBreakdown.length} ຂັ້ນບັນໄດ`}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description & Notice metadata */}
                <div className="pt-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-slate-500 leading-relaxed max-w-xl">
                    <span className="font-semibold text-slate-700">ລາຍລະອຽດ: </span>
                    {selectedCategory.description ||
                      (selectedCategory.categoryGroup === "RESIDENTIAL"
                        ? "ການນຳໃຊ້ໄຟຟ້າຕາມເຮືອນຊານບ້ານຊ່ອງ ສຳລັບການດຳລົງຊີວິດປະຈຳວັນ (ໂຄງສ້າງອັດຕາ 8 ຂັ້ນບັນໄດ)"
                        : "ອັດຕາຕາມແຈ້ງການທາງການຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ")}
                    {selectedCategory.description || "ອັດຕາຕາມແຈ້ງການທາງການຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ"}
                  </div>
                  {calculation?.selectedPeriod && (
                    <div className="text-[11px] text-slate-500">
                      <span>ເລກທີແຈ້ງການ: </span>
                      <strong className="text-slate-800">{calculation.selectedPeriod.noticeNumber}</strong>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* 3. Units Slider & Numeric Input */}
          <div className="mb-8 sm:mb-10 bg-white p-4 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
              <div>
                <label htmlFor="home-calc-units-input" className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  3. ລະບຸຈຳນວນໜ່ວຍໄຟຟ້າທີ່ໃຊ້ (kWh / Unit)
                </label>
                <div className="text-xs text-slate-600 mt-0.5">
                  ເລື່ອນແຖບ ຫຼື ພິມຕົວເລກຈຳນວນໜ່ວຍຈາກໃບບິນ
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="home-calc-units-input"
                  type="number"
                  min="0"
                  max="5000"
                  value={units}
                  onChange={(e) =>
                    setUnits(Math.max(0, parseInt(e.target.value) || 0))
                  }
                  aria-label="ຈຳນວນໜ່ວຍໄຟຟ້າ (kWh)"
                  className="w-28 sm:w-32 text-right text-lg sm:text-xl font-extrabold text-[#2329c1] bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2329c1] focus:bg-white transition-all font-mono"
                />
                <span className="font-bold text-sm text-slate-700">ໜ່ວຍ</span>
              </div>
            </div>

            {/* Slider */}
            <input
              id="home-calc-units-slider"
              type="range"
              min="0"
              max="1500"
              step="5"
              value={Math.min(units, 1500)}
              onChange={(e) => setUnits(Number(e.target.value))}
              aria-label="ເລື່ອນປັບຈຳນວນໜ່ວຍໄຟຟ້າ (kWh)"
              className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2329c1]"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-xs">
              <span className="text-slate-600 font-medium">ຄ່າເລີ່ມຕົ້ນດ່ວນ:</span>
              <div className="flex flex-wrap gap-1.5">
                {[25, 150, 300, 450, 600, 1000, 1500].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setUnits(val)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      units === val
                        ? "bg-[#2329c1] text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {val} kWh
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 3. Output Display Grid */}
          {calculation ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
              {/* Left: Progressive Tier Breakdown */}
              <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                    <Info className="w-4 h-4 text-[#2329c1] shrink-0" />
                    <span className="truncate">ລາຍລະອຽດການຄິດໄລ່ 8 ຂັ້ນບັນໄດ ({selectedCategory.nameLa})</span>
                  </span>
                  <span className="text-xs text-slate-600 font-mono shrink-0">
                    {units} kWh
                  </span>
                </div>

                <div className="space-y-2">
                  {calculation.currentBill.tierBreakdown.map((tier) => {
                    const kwhInTier = tier.tierKwh ?? tier.kwhInTier ?? 0;
                    return (
                      <div
                        key={tier.tierOrder}
                        className={`flex items-center justify-between gap-2 text-xs p-2.5 rounded-xl border ${
                          kwhInTier > 0
                            ? "bg-slate-50 border-slate-200"
                            : "bg-white border-slate-100 opacity-75"
                        }`}
                      >
                        <div className="space-y-0.5 min-w-0">
                          <div className="font-semibold text-slate-800">
                            ຂັ້ນ {tier.tierOrder}: {tier.label}
                          </div>
                          <div className="text-[11px] text-slate-600">
                            {kwhInTier} ໜ່ວຍ × {formatNumber(tier.rateKipPerKwh)} ກີບ
                          </div>
                        </div>
                        <div className="font-bold text-slate-900 font-mono shrink-0 text-right">
                          {formatNumber(tier.costKip)} ກີບ
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right: Bill Summary Total Card */}
              <div className="lg:col-span-5 bg-gradient-to-br from-[#2329c1] via-[#1a1f9e] to-[#0c0e4a] text-white p-5 sm:p-7 rounded-2xl shadow-lg flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <span className="text-xs font-medium text-blue-200">
                      ສະຫຼຸບປະມານການ ({selectedCategory.nameLa})
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold tracking-wider uppercase border border-white/10 shrink-0">
                      {selectedCategory.nameEn || "EDL"} {year}
                    </span>
                  </div>

                  <div className="space-y-2.5 pb-4 border-b border-white/15 text-xs text-blue-100">
                    <div className="flex justify-between gap-2">
                      <span>ຄ່າພະລັງງານໄຟຟ້າ (Base):</span>
                      <span className="font-semibold text-white font-mono shrink-0 text-right">
                        {formatNumber(calculation.currentBill.baseCostKip)} ກີບ
                      </span>
                    </div>

                    {calculation.currentBill.hotSeasonDiscountKip > 0 && (
                      <div className="flex justify-between gap-2 text-amber-300 font-semibold">
                        <span>ສ່ວນຫຼຸດລະດູຮ້ອນ (5%):</span>
                        <span className="shrink-0 text-right">-{formatNumber(calculation.currentBill.hotSeasonDiscountKip)} ກີບ</span>
                      </div>
                    )}

                    <div className="flex justify-between gap-2 text-white/90">
                      <span>1. ຄ່າໄຟລວມໃນເດືອນ (ຄ່າພະລັງງານ):</span>
                      <span className="font-semibold font-mono shrink-0 text-right">
                        {formatNumber(calculation.currentBill.netBaseCostKip)} ກີບ
                      </span>
                    </div>

                    <div className="flex justify-between gap-2 text-amber-300 font-medium">
                      <span>2. ຄ່າຊ່ອມບຳລຸງ (ຄ່າບຳລຸງຮັກສາ):</span>
                      <span className="font-semibold font-mono shrink-0 text-right">
                        +{formatNumber(calculation.currentBill.maintenanceFeeKip)} ກີບ
                      </span>
                    </div>

                    <div className="flex justify-between gap-2 text-blue-200 pt-1 border-t border-white/10 font-medium">
                      <span>ຍອດລວມກ່ອນອາກອນ (1 + 2):</span>
                      <span className="font-semibold text-white font-mono shrink-0 text-right">
                        {formatNumber(calculation.currentBill.subtotalBeforeVatKip)} ກີບ
                      </span>
                    </div>

                    <div className="flex justify-between gap-2">
                      <span>
                        3. ອາກອນມູນຄ່າເພີ່ມ (VAT{" "}
                        {Math.round(
                          (calculation.currentBill.vatRate ??
                            calculation.selectedPeriod.vatRate ??
                            0.1) * 100
                        )}
                        %):
                      </span>
                      <span className="font-semibold text-white font-mono shrink-0 text-right">
                        +{formatNumber(calculation.currentBill.vatCostKip)} ກີບ
                      </span>
                    </div>
                  </div>

                  <div className="pt-4">
                    <div className="text-xs text-amber-300 font-medium">
                      ຍອດລວມປະມານການທັງໝົດໃນເດືອນ:
                    </div>
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mt-1 font-mono break-words">
                      {formatNumber(calculation.currentBill.totalCostKip)}{" "}
                      <span className="text-sm font-normal text-blue-200">
                        ກີບ
                      </span>
                    </div>
                    <div className="text-[11px] text-blue-200/80 mt-1">
                      * ຄິດໄລ່ຕາມສູດ: ຄ່າໄຟລວມ + ຄ່າຊ່ອມບຳລຸງ + VAT
                    </div>
                  </div>
                </div>

                {/* Notice Tip */}
                <div className="mt-6 pt-4 border-t border-white/15 bg-white/5 rounded-xl p-3 flex items-start gap-2.5">
                  <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                  <div className="text-[11px] text-blue-100 leading-snug">
                    <strong>ແຈ້ງການເລກທີ:</strong> {calculation.selectedPeriod.noticeNumber}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-600 text-xs">
              {isLoading ? "ກຳລັງຄິດໄລ່ຜ່ານ API..." : "ບໍ່ສາມາດສະແດງຜົນການຄິດໄລ່ໄດ້"}
            </div>
          )}

          {/* Full Appliance Calculator Callout */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-blue-50/50 p-4 sm:p-5 rounded-2xl border border-blue-100">
            <div className="space-y-1">
              <div className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2329c1]" />
                <span>ຕ້ອງການຄິດໄລ່ແບບລະອຽດແຍກຕາມແອ, ຕູ້ເຢັນ ແລະ ແຜນປະຢັດໄຟ?</span>
              </div>
              <p className="text-xs text-slate-500">
                ເລືອກເຄື່ອງໃຊ້ໄຟຟ້າແຕ່ລະລາຍການພາຍໃນເຮືອນ ພ້ອມຕາຕະລາງຄາດການແນວໂນ້ມຄ່າໄຟປີ 2026–2029
              </p>
            </div>
            <Link
              href="/services/tariff-calculator"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#2329c1] hover:bg-[#1a1f9e] text-white text-xs font-bold transition-all shadow-sm flex-shrink-0"
            >
              <span>ເປີດໂປຣແກຣມຄຳນວນເຕັມຮູບແບບ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
