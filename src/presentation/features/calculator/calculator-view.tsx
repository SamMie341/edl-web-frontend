"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Calculator,
  Zap,
  Info,
  TrendingDown,
  Sparkles,
  Building,
  Home as HomeIcon,
  Factory,
  Snowflake,
  Refrigerator,
  Fan,
  Lightbulb,
  Lamp,
  Flame,
  Utensils,
  Shirt,
  Tv,
  Plug,
  Plus,
  Trash2,
  Calendar,
  AlertCircle,
  HelpCircle,
  Sun,
  ShieldCheck,
  Loader2,
} from "lucide-react";
import { formatNumber } from "@/shared/utils";
import {
  ApplianceInputItem,
  CalculatorConfig,
  ElectricityCalculationResponse,
} from "@/domain/entities";
interface CalculatorViewProps {
  initialConfig?: CalculatorConfig;
  initialError?: string | null;
}

export function CalculatorView({ initialConfig, initialError }: CalculatorViewProps) {
  const config: CalculatorConfig = initialConfig ?? {
    categories: [],
    sampleAppliances: [],
    availableSchedules: [],
    defaultSchedule: null,
  };

  // Mode: "appliances" | "quick" (default to quick if no appliance categories in DB)
  const [activeTab, setActiveTab] = useState<"appliances" | "quick">(() => {
    return config.categories && config.categories.length > 0 ? "appliances" : "quick";
  });

  // Period state
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [selectedMonth, setSelectedMonth] = useState<number>(11);

  // Tariff Categories from Module 3.22.1
  const tariffCategories = React.useMemo(
    () =>
      config.tariffCategories && config.tariffCategories.length > 0
        ? config.tariffCategories
        : [
            {
              id: 28,
              nameLa: "ປະເພດທີ່ຢູ່ອາໄສ",
              nameEn: "Residential / Household",
              description: "ການນຳໃຊ້ໄຟຟ້າຕາມເຮືອນຊານບ້ານຊ່ອງ ສຳລັບການດຳລົງຊີວິດປະຈຳວັນ",
              orderIndex: 1,
              categoryGroup: "RESIDENTIAL",
              voltageLevel: "0.4 kV",
            },
          ],
    [config.tariffCategories]
  );

  // Default to 0.4 kV and Residential category (ປະເພດທີ່ຢູ່ອາໄສ - ID 28)
  const defaultResidentialCat = tariffCategories.find(
    (c) => c.categoryGroup === "RESIDENTIAL" || c.nameLa.includes("ທີ່ຢູ່ອາໄສ")
  );

  const [selectedTariffCategoryId, setSelectedTariffCategoryId] = useState<number>(
    () => defaultResidentialCat?.id ?? 28
  );

  // Category Type filter state (Module 3.22.1 & Notice 2870/ຟຟລ.ຝທຜ)
  const [selectedType, setSelectedType] = useState<string>("0.4 kV");

  const TYPE_OPTIONS = [
    { value: "0.4 kV", label: "⚡ ປະເພດແຮງດັນຕ່ຳ 0.4 kV (Low Voltage)" },
    { value: "22 kV", label: "⚡ ປະເພດແຮງດັນກາງ 22 kV (Medium Voltage)" },
    { value: "115 kV", label: "⚡ ປະເພດແຮງດັນສູງ 115 kV (High Voltage)" },
    { value: "RESIDENTIAL", label: "🏠 ປະເພດທີ່ຢູ່ອາໄສ (Residential)" },
    { value: "ALL", label: "ທັງໝົດ (All Categories - 28 ປະເພດ)" },
  ];

  const filteredCategories = React.useMemo(() => {
    let list = tariffCategories;
    if (selectedType === "ALL") {
      list = tariffCategories;
    } else if (selectedType === "RESIDENTIAL") {
      list = tariffCategories.filter((c) => c.categoryGroup === "RESIDENTIAL");
    } else {
      list = tariffCategories.filter((c) => c.voltageLevel === selectedType);
    }

    // Sort to place RESIDENTIAL (ທີ່ຢູ່ອາໄສ) at the very top for 0.4 kV or ALL
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
    let inFilter: typeof tariffCategories;
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
        setSelectedTariffCategoryId(resCat.id);
        return;
      }
    }

    if (inFilter.length > 0 && !inFilter.some((c) => c.id === selectedTariffCategoryId)) {
      setSelectedTariffCategoryId(inFilter[0].id);
    }
  };

  // Quick mode state
  const [quickUnits, setQuickUnits] = useState<number>(180);

  // Appliances state from database configuration (no mock fallback)
  const [appliances, setAppliances] = useState<ApplianceInputItem[]>(() => {
    return config.sampleAppliances ?? [];
  });

  const getCategoryKey = (cat: { code?: string; id: number }) =>
    cat.code ?? String(cat.id);
  const getPresetKey = (preset: { code?: string; id: number }) =>
    preset.code ?? String(preset.id);

  // Selected saving actions derived dynamically from database action templates
  const [selectedActionCodes, setSelectedActionCodes] = useState<string[]>(() => {
    const defaultCodes: string[] = [];
    (config.categories ?? []).forEach((cat) => {
      (cat.actionTemplates ?? []).forEach((tpl) => {
        if (tpl.defaultSelected) {
          defaultCodes.push(tpl.code ?? String(tpl.id));
        }
      });
    });
    return defaultCodes;
  });

  // Selected category to add from presets
  const [selectedCategoryCode, setSelectedCategoryCode] = useState<string>(() =>
    config.categories?.[0] ? getCategoryKey(config.categories[0]) : ""
  );

  const isHotSeason = selectedMonth >= 3 && selectedMonth <= 5;

  // Real API calculation states for Tab 1 (Appliances mode)
  const [rawCalculationResult, setCalculationResult] =
    useState<ElectricityCalculationResponse | null>(null);
  const [rawIsCalculating, setIsCalculating] = useState<boolean>(false);
  const [rawApiError, setApiError] = useState<string | null>(initialError ?? null);

  const calculationResult = appliances.length === 0 ? null : rawCalculationResult;
  const isCalculating = appliances.length === 0 ? false : rawIsCalculating;
  const apiError = appliances.length === 0 ? null : rawApiError;

  // Real API calculation states for Tab 2 (Quick mode)
  const [quickResult, setQuickResult] =
    useState<ElectricityCalculationResponse | null>(null);
  const [isQuickCalculating, setIsQuickCalculating] = useState<boolean>(true);
  const [quickApiError, setQuickApiError] = useState<string | null>(null);

  // 1. Fetch real Appliance Calculation from Backend API (Backend automatically applies official maintenance fee from DB)
  useEffect(() => {
    if (appliances.length === 0) {
      return;
    }

    let isCancelled = false;
    const timer = setTimeout(async () => {
      setIsCalculating(true);
      setApiError(null);
      try {
        const res = await fetch("/api/electricity-calculator/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year: selectedYear,
            month: selectedMonth,
            categoryId: selectedTariffCategoryId,
            appliances,
            selectedActionCodes,
          }),
        });
        const json = await res.json();
        if (!isCancelled) {
          if (!res.ok || json.statusCode >= 400) {
            setApiError(json.message || "ເກີດຂໍ້ຜິດພາດໃນການຄິດໄລ່ຈາກ API");
            setCalculationResult(null);
          } else {
            setCalculationResult(json.data);
            setApiError(null);
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const message = err instanceof Error ? err.message : "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ API ໄດ້";
          setApiError(message);
          setCalculationResult(null);
        }
      } finally {
        if (!isCancelled) setIsCalculating(false);
      }
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [selectedYear, selectedMonth, selectedTariffCategoryId, appliances, selectedActionCodes]);

  // 2. Fetch real Quick Calculation from Backend API (Backend automatically applies official maintenance fee from DB)
  useEffect(() => {
    let isCancelled = false;
    const timer = setTimeout(async () => {
      setIsQuickCalculating(true);
      setQuickApiError(null);
      try {
        const res = await fetch("/api/electricity-calculator/calculate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            year: selectedYear,
            month: selectedMonth,
            categoryId: selectedTariffCategoryId,
            directMonthlyKwh: quickUnits,
          }),
        });
        const json = await res.json();
        if (!isCancelled) {
          if (!res.ok || json.statusCode >= 400) {
            setQuickApiError(json.message || "ເກີດຂໍ້ຜິດພາດໃນການຄິດໄລ່ຈາກ API");
            setQuickResult(null);
          } else {
            setQuickResult(json.data);
            setQuickApiError(null);
          }
        }
      } catch (err: unknown) {
        if (!isCancelled) {
          const message = err instanceof Error ? err.message : "ບໍ່ສາມາດເຊື່ອມຕໍ່ກັບ API ໄດ້";
          setQuickApiError(message);
          setQuickResult(null);
        }
      } finally {
        if (!isCancelled) setIsQuickCalculating(false);
      }
    }, 200);

    return () => {
      isCancelled = true;
      clearTimeout(timer);
    };
  }, [selectedYear, selectedMonth, selectedTariffCategoryId, quickUnits]);

  // Handler: Add appliance from preset
  const handleAddPreset = (categoryKey: string, presetKey: string) => {
    const cat = config.categories.find((c) => getCategoryKey(c) === categoryKey);
    const preset = cat?.presets.find((p) => getPresetKey(p) === presetKey);
    if (!cat || !preset) return;

    const newItem: ApplianceInputItem = {
      categoryId: cat.id,
      categoryCode: getCategoryKey(cat),
      presetId: preset.id,
      presetCode: getPresetKey(preset),
      customName: preset.nameLa,
      watt: preset.defaultWatt,
      quantity: preset.defaultQuantity,
      hoursPerDay: preset.defaultHoursPerDay,
      daysPerMonth: preset.defaultDaysPerMonth,
    };

    setAppliances((prev) => [...prev, newItem]);
  };

  // Handler: Update appliance field
  const handleUpdateAppliance = <K extends keyof ApplianceInputItem>(
    index: number,
    field: K,
    value: ApplianceInputItem[K]
  ) => {
    setAppliances((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  // Handler: Remove appliance
  const handleRemoveAppliance = (index: number) => {
    setAppliances((prev) => prev.filter((_, i) => i !== index));
  };

  // Handler: Toggle saving action
  const handleToggleAction = (actionCode: string) => {
    setSelectedActionCodes((prev) => {
      if (prev.includes(actionCode)) {
        return prev.filter((code) => code !== actionCode);
      } else {
        return [...prev, actionCode];
      }
    });
  };

  // Icon mapping helper
  const getCategoryIcon = (iconName?: string | null) => {
    switch (iconName) {
      case "Snowflake":
        return <Snowflake className="w-4 h-4 text-sky-500" />;
      case "Refrigerator":
        return <Refrigerator className="w-4 h-4 text-blue-500" />;
      case "Fan":
        return <Fan className="w-4 h-4 text-emerald-500" />;
      case "Lightbulb":
        return <Lightbulb className="w-4 h-4 text-amber-500" />;
      case "Lamp":
        return <Lamp className="w-4 h-4 text-amber-600" />;
      case "Flame":
        return <Flame className="w-4 h-4 text-rose-500" />;
      case "Utensils":
        return <Utensils className="w-4 h-4 text-orange-500" />;
      case "Shirt":
        return <Shirt className="w-4 h-4 text-purple-500" />;
      case "Tv":
        return <Tv className="w-4 h-4 text-indigo-500" />;
      case "Plug":
      default:
        return <Plug className="w-4 h-4 text-slate-500" />;
    }
  };

  // Tariff Category icon helper (Module 3.22.1)
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

  const selectedTariffCategory = tariffCategories.find(
    (c) => c.id === selectedTariffCategoryId
  ) || tariffCategories[0];

  return (
    <div className="min-h-screen bg-slate-50/70 py-8 sm:py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Navigation */}
        <nav className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-[#2329c1] transition-colors">
            ໜ້າຫຼັກ
          </Link>
          <span>/</span>
          <Link href="/services/tariffs" className="hover:text-[#2329c1] transition-colors">
            ການບໍລິການ & ອັດຕາໄຟ
          </Link>
          <span>/</span>
          <span className="text-[#2329c1] font-semibold">
            ໂປຣແກຣມຄຳນວນຄ່າໄຟຟ້າ (Electricity Calculator)
          </span>
        </nav>

        {/* Hero Section */}
        <div className="rounded-3xl bg-gradient-to-r from-[#2329c1] via-[#1b209e] to-[#0c0e4a] p-6 sm:p-10 lg:p-12 text-white relative overflow-hidden shadow-xl mb-8 sm:mb-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-amber-300 text-xs font-semibold mb-4 border border-white/15 backdrop-blur-sm">
              <Calculator className="w-3.5 h-3.5" />
              <span>ລະບົບຄິດໄລ່ຄ່າໄຟຟ້າທາງການ 8 ຂັ້ນບັນໄດ (ເຊື່ອມຕໍ່ຖານຂໍ້ມູນ API ຈິງ)</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
              ໂປຣແກຣມຄຳນວນຄ່າໄຟຟ້າ ແລະ ຈຳລອງແຜນປະຢັດໄຟ
            </h1>
            <p className="mt-3 text-sm sm:text-base text-blue-100 leading-relaxed">
              ປະເມີນຄ່າກະແສໄຟຟ້າປະຈຳເດືອນຈາກລາຍການເຄື່ອງໃຊ້ໄຟຟ້າຕົວຈິງ ໂດຍຄິດໄລ່ຜ່ານ API ຖານຂໍ້ມູນ EDL
              ຕາມໂຄງສ້າງອັດຕາຂັ້ນໄດ 8 ຂັ້ນ, ສ່ວນຫຼຸດລະດູຮ້ອນ 5%, VAT 10%, ແລະ ຕາຕະລາງແນວໂນ້ມ 2026–2029.
            </p>

            {/* Status Badges */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {isHotSeason ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400/20 text-amber-300 text-xs font-semibold border border-amber-400/30">
                  <Sun className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                  <span>ຊ່ວງລະດູຮ້ອນ (ມີນາ–ພຶດສະພາ: ສ່ວນຫຼຸດ 5% ຖ້າ ≤ 300 kWh)</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-500/20 text-blue-200 text-xs border border-blue-400/20">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-300" />
                  <span>ອັດຕາປົກກະຕິ (VAT 10%)</span>
                </div>
              )}

              {((activeTab === "appliances" && isCalculating) ||
                (activeTab === "quick" && isQuickCalculating)) && (
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 text-white text-xs">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                  <span>ກຳລັງຄິດໄລ່ຜ່ານ API...</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex flex-col sm:flex-row border-b border-slate-200 mb-6 sm:mb-8 gap-2">
          <button
            type="button"
            onClick={() => setActiveTab("appliances")}
            className={`flex items-center justify-between sm:justify-start gap-2 py-3 sm:pb-3.5 px-3 sm:px-4 font-bold text-xs sm:text-sm text-left transition-all border-b-2 rounded-t-xl sm:rounded-none ${activeTab === "appliances"
              ? "border-[#2329c1] text-[#2329c1] bg-blue-50/50 sm:bg-transparent"
              : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>1. ຈຳລອງຕາມເຄື່ອງໃຊ້ໄຟຟ້າ & ແຜນປະຢັດໄຟ (ລະອຽດ)</span>
            </span>
            <span className="text-[10px] bg-blue-100 text-[#2329c1] px-2 py-0.5 rounded-full shrink-0">
              ແນະນຳ
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("quick")}
            className={`flex items-center gap-2 py-3 sm:pb-3.5 px-3 sm:px-4 font-bold text-xs sm:text-sm text-left transition-all border-b-2 rounded-t-xl sm:rounded-none ${activeTab === "quick"
              ? "border-[#2329c1] text-[#2329c1] bg-blue-50/50 sm:bg-transparent"
              : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
          >
            <Zap className="w-4 h-4 shrink-0" />
            <span>2. ຄິດໄລ່ດ່ວນຕາມຈຳນວນໜ່ວຍໄຟລວມ (Quick Units)</span>
          </button>
        </div>

        {/* TAB 1: APPLIANCE SIMULATOR & SAVING PLAN */}
        {activeTab === "appliances" && (
          <div className="space-y-6 sm:space-y-8">
            {/* Tariff Category Bar for Tab 1 (Module 3.22.1) */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2329c1] flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {getCategoryIconForTariff(selectedTariffCategory.nameLa, selectedTariffCategory.nameEn)}
                </div>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold text-slate-900">
                      ໂຄງສ້າງອັດຕາຄ່າໄຟຟ້າ:{" "}
                      <span className="text-[#2329c1]">
                        {selectedTariffCategory.nameLa}
                      </span>
                    </span>
                    {selectedTariffCategory.voltageLevel && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        {selectedTariffCategory.voltageLevel}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    {selectedTariffCategory.description ||
                      (selectedTariffCategory.categoryGroup === "RESIDENTIAL" ||
                      selectedTariffCategory.nameLa.includes("ທີ່ຢູ່ອາໄສ")
                        ? "ການນຳໃຊ້ໄຟຟ້າຕາມເຮືອນຊານບ້ານຊ່ອງ ສຳລັບການດຳລົງຊີວິດປະຈຳວັນ (ໂຄງສ້າງອັດຕາ 8 ຂັ້ນບັນໄດ)"
                        : "ອັດຕາຄ່າໄຟຕາມແຈ້ງການທາງການຂອງ ຟຟລ")}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 text-xs w-full lg:w-auto">
                {/* Billing Period Selector for Tab 1 */}
                <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:py-1.5 text-xs shadow-xs">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#2329c1] shrink-0" />
                    <span className="font-medium text-slate-500">ຮອບບິນ:</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <select
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(Number(e.target.value))}
                      className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs"
                    >
                      <option value={2026}>ປີ 2026</option>
                      <option value={2027}>ປີ 2027</option>
                      <option value={2028}>ປີ 2028</option>
                      <option value={2029}>ປີ 2029</option>
                    </select>
                    <span>/</span>
                    <select
                      value={selectedMonth}
                      onChange={(e) => setSelectedMonth(Number(e.target.value))}
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

                {/* 2 Cascaded Dropdowns for Tab 1 */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <select
                    value={selectedType}
                    onChange={(e) => handleTypeChange(e.target.value)}
                    className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:py-1.5 text-slate-800 font-semibold cursor-pointer text-xs focus:ring-2 focus:ring-[#2329c1]/20 focus:border-[#2329c1]"
                  >
                    {TYPE_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  <select
                    value={selectedTariffCategoryId}
                    onChange={(e) => setSelectedTariffCategoryId(Number(e.target.value))}
                    className="w-full sm:w-auto sm:max-w-[240px] truncate bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 sm:py-1.5 text-slate-800 font-semibold cursor-pointer text-xs focus:ring-2 focus:ring-[#2329c1]/20 focus:border-[#2329c1]"
                  >
                    {filteredCategories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.nameLa} {cat.nameEn ? `(${cat.nameEn})` : ""}
                      </option>
                    ))}
                  </select>
                </div>
            </div>
          </div>

          {/* Informational banner when database has no appliance items yet */}
            {config.categories.length === 0 && (
              <div className="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="flex items-start gap-3">
                  <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-bold text-sm">ຍັງບໍ່ມີຂໍ້ມູນລາຍການເຄື່ອງໃຊ້ໄຟຟ້າໃນຖານຂໍ້ມູນ API</div>
                    <div className="text-xs text-amber-800 mt-0.5 leading-relaxed">
                      ທ່ານສາມາດຄິດໄລ່ຄ່າໄຟຟ້າຕາມ 27 ປະເພດແຈ້ງການ 2870/ຟຟລ.ຝທຜ ໄດ້ສະດວກຜ່ານໂໝດ &quot;2. ຄິດໄລ່ດ່ວນຕາມຈຳນວນໜ່ວຍໄຟລວມ&quot;
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("quick")}
                  className="px-4 py-2 rounded-xl bg-[#2329c1] text-white text-xs font-bold hover:bg-[#1b209e] transition-colors whitespace-nowrap self-start sm:self-center shadow-xs cursor-pointer"
                >
                  ໄປທີ່ໂໝດຄິດໄລ່ດ່ວນ (Quick Mode) →
                </button>
              </div>
            )}

            {/* API Error Notification */}
            {apiError && (
              <div className="p-5 rounded-3xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 shadow-xs">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-sm text-rose-900">
                    ບໍ່ສາມາດຄິດໄລ່ຄ່າໄຟໄດ້
                  </div>
                  <div className="font-medium text-rose-700">{apiError}</div>
                  <p className="text-[11px] text-rose-600/80">
                    * ຖ້າຂໍ້ມູນຕາຕະລາງອັດຕາຄ່າໄຟຖືກລຶບອອກຈາກຖານຂໍ້ມູນ ລະບົບຈະບໍ່ສາມາດຄິດໄລ່ໄດ້ ຈົນກວ່າຈະເພີ່ມຕາຕະລາງລາຄາໃໝ່.
                  </p>
                </div>
              </div>
            )}

            {/* Top Summary Comparison Metrics */}
            {calculationResult && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">ໜ່ວຍໄຟຟ້າປັດຈຸບັນ (kWh)</div>
                  <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                    {formatNumber(calculationResult.summary.totalMonthlyKwh)}{" "}
                    <span className="text-xs text-slate-400 font-normal">kWh/ເດືອນ</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span>ຂັ້ນສູງສຸດ:</span>
                    <span className="font-bold text-[#2329c1]">
                      ຂັ້ນທີ {calculationResult.summary.currentTierOrder}
                    </span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">ຫຼັງປັບແຜນປະຢັດ (After Plan)</div>
                  <div className="text-2xl font-black text-emerald-600 mt-1 font-mono">
                    {formatNumber(calculationResult.summary.afterPlanKwh)}{" "}
                    <span className="text-xs text-slate-400 font-normal">kWh/ເດືອນ</span>
                  </div>
                  <div className="text-[11px] text-emerald-700 mt-1 flex items-center gap-1 font-semibold">
                    <TrendingDown className="w-3.5 h-3.5" />
                    <span>ປະຢັດໄດ້ {formatNumber(calculationResult.summary.totalSavedKwh)} kWh</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-xs">
                  <div className="text-xs text-slate-500 font-medium">ຍອດຄ່າໄຟປະຈຸບັນ (ລວມ VAT)</div>
                  <div className="text-2xl font-black text-slate-900 mt-1 font-mono">
                    {formatNumber(calculationResult.summary.totalCostKip)}{" "}
                    <span className="text-xs text-slate-400 font-normal">ກີບ</span>
                  </div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    VAT{" "}
                    {Math.round(
                      (calculationResult.currentBill.vatRate ??
                        calculationResult.selectedPeriod.vatRate ??
                        0.1) * 100
                    )}
                    %: {formatNumber(calculationResult.summary.vatCostKip)} ກີບ
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-600 to-teal-800 text-white rounded-2xl p-5 shadow-sm">
                  <div className="text-xs text-emerald-100 font-medium flex items-center justify-between">
                    <span>ເງິນປະຢັດໄດ້ຕໍ່ເດືອນ</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </div>
                  <div className="text-2xl font-black text-white mt-1 font-mono">
                    {formatNumber(calculationResult.summary.monthlySavedKip)}{" "}
                    <span className="text-xs text-emerald-100 font-normal">ກີບ</span>
                  </div>
                  <div className="text-[11px] text-emerald-100/90 mt-1 font-medium">
                    ປະຢັດໄດ້ສູງເຖິງ{" "}
                    <strong className="text-amber-300 font-mono">
                      {formatNumber(calculationResult.summary.yearlySavedKip)}
                    </strong>{" "}
                    ກີບ/ປີ
                  </div>
                </div>
              </div>
            )}

            {/* Main Interactive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Left Column: Appliances List & Editor (Col 7) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Add Appliance Box */}
                <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Plus className="w-4 h-4 text-[#2329c1]" />
                      <span>ເລືອກເພີ່ມເຄື່ອງໃຊ້ໄຟຟ້າ</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      ມີ {appliances.length} ລາຍການ
                    </span>
                  </div>

                  {/* Category Pills */}
                  {config.categories.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-400">
                      ບໍ່ພົບຂໍ້ມູນປະເພດເຄື່ອງໃຊ້ໄຟຟ້າໃນຖານຂໍ້ມູນ API
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {config.categories.map((cat) => {
                        const catKey = getCategoryKey(cat);
                        return (
                          <button
                            key={catKey}
                            type="button"
                            onClick={() => setSelectedCategoryCode(catKey)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all cursor-pointer ${selectedCategoryCode === catKey
                              ? "bg-[#2329c1] text-white shadow-xs"
                              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                              }`}
                          >
                            {getCategoryIcon(cat.iconName)}
                            <span>{cat.nameLa}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Presets in Selected Category */}
                  {config.categories.length > 0 && (() => {
                    const activeCat = config.categories.find(
                      (c) => getCategoryKey(c) === selectedCategoryCode
                    );
                    if (!activeCat || activeCat.presets.length === 0) {
                      return (
                        <p className="text-xs text-slate-400 py-2">
                          ຍັງບໍ່ມີ Preset ໃນໝວດນີ້
                        </p>
                      );
                    }
                    const activeCatKey = getCategoryKey(activeCat);
                    return (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {activeCat.presets.map((preset) => {
                          const presetKey = getPresetKey(preset);
                          return (
                            <button
                              key={presetKey}
                              type="button"
                              onClick={() =>
                                handleAddPreset(activeCatKey, presetKey)
                              }
                              className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-[#2329c1] hover:bg-blue-50/50 text-left transition-all text-xs group cursor-pointer"
                            >
                              <div>
                                <div className="font-semibold text-slate-800 group-hover:text-[#2329c1]">
                                  {preset.nameLa}
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {preset.defaultWatt}W • {preset.defaultHoursPerDay}h/ມື້
                                </div>
                              </div>
                              <span className="text-[11px] font-bold text-[#2329c1] bg-blue-50 px-2 py-1 rounded-lg">
                                + ເພີ່ມ
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>

                {/* Appliances List Table */}
                <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                    <h3 className="font-bold text-sm text-slate-900">
                      ລາຍການເຄື່ອງໃຊ້ໄຟຟ້າທີ່ກຳລັງຄິດໄລ່
                    </h3>
                    <button
                      type="button"
                      onClick={() => setAppliances([])}
                      className="text-xs text-rose-500 hover:underline font-medium shrink-0"
                    >
                      ລ້າງທັງໝົດ
                    </button>
                  </div>

                  {appliances.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 text-xs">
                      ກະລຸນາເລືອກເພີ່ມເຄື່ອງໃຊ້ໄຟຟ້າຈາກກ່ອງຂ້າງເທິງ
                    </div>
                  ) : (
                    <div className="space-y-3.5">
                      {appliances.map((app, idx) => {
                        const monthlyKwh =
                          (app.watt * app.quantity * app.hoursPerDay * (app.daysPerMonth ?? 30)) /
                          1000;
                        return (
                          <div
                            key={idx}
                            className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 transition-all text-xs space-y-3"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                <span className="w-5 h-5 rounded-lg bg-blue-100 text-[#2329c1] flex items-center justify-center font-bold text-[10px] shrink-0">
                                  {idx + 1}
                                </span>
                                <input
                                  type="text"
                                  value={app.customName ?? ""}
                                  onChange={(e) =>
                                    handleUpdateAppliance(
                                      idx,
                                      "customName",
                                      e.target.value
                                    )
                                  }
                                  className="min-w-0 w-full font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-[#2329c1] focus:outline-none"
                                />
                              </div>
                              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                                <div className="text-right">
                                  <span className="font-black text-slate-900 font-mono text-sm">
                                    {formatNumber(monthlyKwh)}
                                  </span>{" "}
                                  <span className="text-[10px] text-slate-400">
                                    kWh/ເດືອນ
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveAppliance(idx)}
                                  className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                                  title="ລຶບລາຍການນີ້"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Quick inputs row: Watt, Quantity, Hours/day */}
                            <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1 border-t border-slate-200/60 text-[10px] sm:text-[11px]">
                              <div>
                                <span className="text-slate-400 block mb-0.5">ກຳລັງໄຟ (Watt)</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={app.watt}
                                  onChange={(e) =>
                                    handleUpdateAppliance(
                                      idx,
                                      "watt",
                                      Math.max(1, Number(e.target.value) || 1)
                                    )
                                  }
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono text-slate-800"
                                />
                              </div>
                              <div>
                                <span className="text-slate-400 block mb-0.5">ຈຳນວນເຄື່ອງ</span>
                                <input
                                  type="number"
                                  min="1"
                                  value={app.quantity}
                                  onChange={(e) =>
                                    handleUpdateAppliance(
                                      idx,
                                      "quantity",
                                      Math.max(1, Number(e.target.value) || 1)
                                    )
                                  }
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono text-slate-800"
                                />
                              </div>
                              <div>
                                <span className="text-slate-400 block mb-0.5">ຊົ່ວໂມງ/ມື້</span>
                                <input
                                  type="number"
                                  step="0.5"
                                  min="0.1"
                                  max="24"
                                  value={app.hoursPerDay}
                                  onChange={(e) =>
                                    handleUpdateAppliance(
                                      idx,
                                      "hoursPerDay",
                                      Math.min(24, Math.max(0.1, Number(e.target.value) || 0.1))
                                    )
                                  }
                                  className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1 font-mono text-slate-800"
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Energy Saving Recommendations Checklist */}
                {calculationResult && calculationResult.savingRecommendations.length > 0 && (
                  <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                      <div>
                        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          <span>ແຜນວິທີປະຢັດໄຟອັດສະລິຍະ (Smart Saving Plan)</span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          ຕິກເລືອກວິທີທີ່ທ່ານຕ້ອງການປະຕິບັດເພື່ອເບິ່ງຜົນການຫຼຸດລົງຂອງຄ່າໄຟທັນທີ
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2.5">
                      {calculationResult.savingRecommendations.map((rec, i) => {
                        const actionCode =
                          rec.actionCode ??
                          rec.templateCode ??
                          String(rec.templateId ?? "");
                        const isSelected = selectedActionCodes.includes(actionCode);
                        const savedKwh =
                          rec.estimatedKwhSaved ?? rec.savedKwhPerMonth ?? 0;
                        const savedKip =
                          rec.estimatedKipSaved ?? rec.savedKipPerMonth ?? 0;
                        return (
                          <label
                            key={actionCode || i}
                            className={`flex items-start gap-3 p-3.5 rounded-2xl border transition-all cursor-pointer ${isSelected
                              ? "bg-emerald-50/60 border-emerald-300/80"
                              : "bg-slate-50 border-slate-200 hover:bg-slate-100/60"
                              }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => actionCode && handleToggleAction(actionCode)}
                              className="mt-1 h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500 border-slate-300"
                            />
                            <div className="flex-1 min-w-0 text-xs">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-2">
                                <span className="font-bold text-slate-900">
                                  {rec.titleLa}
                                </span>
                                <span className="font-mono font-bold text-emerald-700 whitespace-nowrap">
                                  -{formatNumber(savedKwh)} kWh
                                  {savedKip > 0 ? ` (~${formatNumber(savedKip)} ກີບ)` : ""}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-500 mt-0.5">
                                {rec.descriptionLa}
                              </div>
                              <div className="mt-1 flex items-center gap-2 text-[10px] text-slate-400">
                                {(rec.applianceName || rec.appliedApplianceCount) && (
                                  <>
                                    <span className="px-2 py-0.5 rounded-md bg-slate-200/70 text-slate-700">
                                      {rec.applianceName ||
                                        `ໃຊ້ໄດ້ກັບ ${rec.appliedApplianceCount} ເຄື່ອງ`}
                                    </span>
                                    <span>•</span>
                                  </>
                                )}
                                <span>ລະດັບ: {rec.effortLevel}</span>
                              </div>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Progressive Tier Breakdown & Outlook (Col 5) */}
              <div className="lg:col-span-5 space-y-6">
                {/* 8-Tier Progressive Breakdown Card */}
                {calculationResult ? (
                  <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs">
                    <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                        <Info className="w-4 h-4 text-[#2329c1] shrink-0" />
                        <span className="truncate">ການຄິດໄລ່ 8 ຂັ້ນບັນໄດ ({selectedTariffCategory.nameLa} - {selectedYear})</span>
                      </span>
                      <span className="text-xs font-mono font-bold text-[#2329c1] shrink-0">
                        {formatNumber(calculationResult.currentBill.totalKwh)} kWh
                      </span>
                    </div>

                    <div className="space-y-2">
                      {calculationResult.currentBill.tierBreakdown.map((tier) => {
                        const kwhInTier = tier.tierKwh ?? tier.kwhInTier ?? 0;
                        return (
                          <div
                            key={tier.tierOrder}
                            className={`p-2.5 rounded-xl border text-xs transition-all ${kwhInTier > 0
                              ? "bg-blue-50/50 border-blue-200"
                              : "bg-slate-50/50 border-slate-100 opacity-60"
                              }`}
                          >
                            <div className="flex items-center justify-between gap-2 mb-0.5">
                              <span className="font-semibold text-slate-800">
                                ຂັ້ນ {tier.tierOrder}: {tier.label}
                              </span>
                              <span className="font-mono font-bold text-slate-900 shrink-0 text-right">
                                {formatNumber(tier.costKip)} ກີບ
                              </span>
                            </div>
                            <div className="flex items-center justify-between text-[11px] text-slate-400">
                              <span>
                                {kwhInTier} kWh × {formatNumber(tier.rateKipPerKwh)} ກີບ/kWh
                              </span>
                              {kwhInTier > 0 && (
                                <span className="text-[#2329c1] font-semibold">ໃຊ້ງານ</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Summary Totals */}
                    <div className="mt-5 pt-4 border-t border-slate-100 space-y-2 text-xs">
                      <div className="flex justify-between gap-2 text-slate-600">
                        <span>ຄ່າພະລັງງານໄຟຟ້າພື້ນຖານ:</span>
                        <span className="font-mono font-semibold shrink-0 text-right">
                          {formatNumber(calculationResult.currentBill.baseCostKip)} ກີບ
                        </span>
                      </div>

                      {calculationResult.currentBill.hotSeasonDiscountKip > 0 && (
                        <div className="flex justify-between gap-2 text-amber-600 font-semibold">
                          <span>ສ່ວນຫຼຸດລະດູຮ້ອນ (5%):</span>
                          <span className="font-mono shrink-0 text-right">
                            -{formatNumber(calculationResult.currentBill.hotSeasonDiscountKip)} ກີບ
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between gap-2 text-slate-800 font-medium">
                        <span>1. ຄ່າໄຟລວມໃນເດືອນ (ຄ່າພະລັງງານ):</span>
                        <span className="font-mono font-semibold text-slate-900 shrink-0 text-right">
                          {formatNumber(calculationResult.currentBill.netBaseCostKip)} ກີບ
                        </span>
                      </div>

                      {calculationResult.currentBill.maintenanceFeeKip > 0 && (
                        <div className="flex justify-between gap-2 text-slate-600">
                          <span>2. ຄ່າຊ່ອມບຳລຸງ (ຄ່າບຳລຸງຮັກສາ):</span>
                          <span className="font-mono font-semibold text-slate-900 shrink-0 text-right">
                            +{formatNumber(calculationResult.currentBill.maintenanceFeeKip)} ກີບ
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between gap-2 text-slate-700 font-medium pt-1 border-t border-slate-100">
                        <span>ຍອດລວມກ່ອນອາກອນ:</span>
                        <span className="font-mono font-semibold text-slate-900 shrink-0 text-right">
                          {formatNumber(calculationResult.currentBill.subtotalBeforeVatKip)} ກີບ
                        </span>
                      </div>

                      <div className="flex justify-between gap-2 text-slate-600">
                        <span>
                          {calculationResult.currentBill.maintenanceFeeKip > 0 ? "3." : "2."} ອາກອນມູນຄ່າເພີ່ມ (VAT{" "}
                          {Math.round(
                            (calculationResult.currentBill.vatRate ??
                              calculationResult.selectedPeriod.vatRate ??
                              0.1) * 100
                          )}
                          %):
                        </span>
                        <span className="font-mono font-semibold shrink-0 text-right">
                          +{formatNumber(calculationResult.currentBill.vatCostKip)} ກີບ
                        </span>
                      </div>

                      <div className="pt-2 border-t border-slate-200 flex flex-wrap justify-between items-baseline gap-2">
                        <span className="font-bold text-slate-900">ຍອດລວມທັງໝົດໃນເດືອນ:</span>
                        <span className="text-lg sm:text-xl font-black text-[#2329c1] font-mono">
                          {formatNumber(calculationResult.currentBill.totalCostKip)} ກີບ
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        * ຄິດໄລ່ຕາມສູດ: (ຄ່າໄຟລວມ + ຄ່າບຳລຸງຮັກສາ) + VAT
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-3xl p-8 border border-slate-200/80 text-center text-xs text-slate-400">
                    {isCalculating ? "ກຳລັງດຶງຂໍ້ມູນການຄິດໄລ່ຈາກ API..." : "ບໍ່ມີຂໍ້ມູນການຄິດໄລ່"}
                  </div>
                )}

                {/* 4-Year Outlook (2026-2029) Trend Card */}
                {calculationResult && (
                  <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-950 text-white rounded-3xl p-6 shadow-md">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <TrendingDown className="w-4 h-4 text-amber-400" />
                        <h4 className="font-bold text-sm text-white">
                          ແນວໂນ້ມຄ່າໄຟລາຍປີ (Outlook 2026–2029)
                        </h4>
                      </div>
                      <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-amber-300 font-mono">
                        {calculationResult.currentBill.totalKwh} kWh
                      </span>
                    </div>

                    <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                      ການຄາດການຄ່າໄຟຟ້າຕາມໂຄງສ້າງອັດຕາໃໝ່ແຕ່ລະປີ ປຽບທຽບລະຫວ່າງກ່ອນ ແລະ ຫຼັງປະຕິບັດແຜນປະຢັດ
                    </p>

                    <div className="space-y-2.5 text-xs">
                      {calculationResult.yearlyOutlook.map((item) => (
                        <div
                          key={item.year}
                          className={`p-3 rounded-xl border transition-all ${item.year === selectedYear
                            ? "bg-white/15 border-amber-400/50"
                            : "bg-white/5 border-white/10"
                            }`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-1 mb-1">
                            <span className="font-bold text-amber-300">
                              ປີ {item.year} {item.year === selectedYear && "(ປັດຈຸບັນ)"}
                            </span>
                            <span className="text-emerald-400 font-mono font-bold">
                              ປະຢັດ -{formatNumber(item.monthlySavedKip)} ກີບ/ເດືອນ
                            </span>
                          </div>
                          <div className="flex flex-wrap justify-between gap-1 text-[11px] text-slate-400 font-mono">
                            <span>ກ່ອນ: {formatNumber(item.beforeTotalCostKip)} ກີບ</span>
                            <span>ຫຼັງ: {formatNumber(item.afterTotalCostKip)} ກີບ</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: QUICK DIRECT KWH ESTIMATE */}
        {activeTab === "quick" && (
          <div className="bg-white border border-slate-200/80 rounded-3xl p-4 sm:p-8 lg:p-10 shadow-sm max-w-5xl mx-auto">
            {/* Quick API Error Notification */}
            {quickApiError && (
              <div className="mb-6 p-5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-sm text-rose-900">
                    ບໍ່ສາມາດຄິດໄລ່ຄ່າໄຟໄດ້
                  </div>
                  <div className="font-medium text-rose-700">{quickApiError}</div>
                  <p className="text-[11px] text-rose-600/80">
                    * ກະລຸນາກວດສອບຕາຕະລາງອັດຕາຄ່າໄຟຟ້າໃນຖານຂໍ້ມູນ ຫຼື ເພີ່ມຕາຕະລາງລາຄາຂອງເດືອນນີ້
                  </p>
                </div>
              </div>
            )}

            {/* 1. Billing Period Selector (Year & Month) */}
            <div className="mb-8 p-5 bg-slate-50 rounded-2xl border border-slate-200/80 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    1. ເລືອກຮອບບິນ / ເດືອນ (Billing Period)
                  </label>
                  <div className="text-xs text-slate-400 mt-0.5">
                    ເລືອກປີ ແລະ ເດືອນທີ່ຕ້ອງການຄິດໄລ່ຄ່າໄຟຟ້າຕາມຕາຕະລາງລາຄາຂອງ ຟຟລ
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
                  <div className="flex items-center justify-between sm:justify-start gap-2 bg-white border border-slate-200 rounded-xl px-3 py-2 sm:py-1.5 text-xs shadow-xs w-full sm:w-auto">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-[#2329c1] shrink-0" />
                      <span className="font-medium text-slate-500">ຮອບບິນ:</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className="bg-transparent text-slate-800 font-bold focus:outline-none cursor-pointer text-xs"
                      >
                        <option value={2026}>ປີ 2026</option>
                        <option value={2027}>ປີ 2027</option>
                        <option value={2028}>ປີ 2028</option>
                        <option value={2029}>ປີ 2029</option>
                      </select>
                      <span>/</span>
                      <select
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(Number(e.target.value))}
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

                  {isQuickCalculating && (
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
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                2. ເລືອກປະເພດການຊົມໃຊ້ໄຟຟ້າ (Tariff Category - Module 3.22.1)
              </label>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Dropdown 1: Select Type */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#2329c1] text-white flex items-center justify-center text-[10px] font-black">1</span>
                    <span>Dropdown 1: ເລືອກປະເພດ (Select Category / Voltage)</span>
                  </label>
                  <select
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
                  <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-[#2329c1] text-white flex items-center justify-center text-[10px] font-black">2</span>
                    <span>Dropdown 2: ເລືອກຂໍ້ມູນໃນປະເພດນັ້ນ (Select Category Item)</span>
                  </label>
                  <select
                    value={selectedTariffCategoryId}
                    onChange={(e) => setSelectedTariffCategoryId(Number(e.target.value))}
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
              {selectedTariffCategory && (
                <div className="mt-4 p-5 rounded-2xl bg-white border border-blue-100/90 shadow-xs relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-100">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-[#2329c1]/10 text-[#2329c1] flex items-center justify-center flex-shrink-0">
                        {getCategoryIconForTariff(selectedTariffCategory.nameLa, selectedTariffCategory.nameEn)}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-base text-slate-900">
                            {selectedTariffCategory.nameLa}
                          </h3>
                          {selectedTariffCategory.voltageLevel && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              <Zap className="w-3 h-3 text-amber-600" />
                              <span>{selectedTariffCategory.voltageLevel}</span>
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
                            {selectedTariffCategory.categoryGroup === "RESIDENTIAL" ? "🏠 ທີ່ຢູ່ອາໄສ" : "🏢 ບໍ່ແມ່ນທີ່ຢູ່ອາໄສ"}
                          </span>
                        </div>
                        {selectedTariffCategory.nameEn ? (
                          <div className="text-xs text-slate-400 mt-0.5">
                            {selectedTariffCategory.nameEn}
                          </div>
                        ) : (
                          (selectedTariffCategory.categoryGroup === "RESIDENTIAL" ||
                            selectedTariffCategory.nameLa.includes("ທີ່ຢູ່ອາໄສ")) && (
                            <div className="text-xs text-slate-400 mt-0.5">
                              Residential / Household
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* Active Rate Tag */}
                    {quickResult?.currentBill && (
                      <div className="text-left sm:text-right flex-shrink-0 bg-slate-50 px-3.5 py-2 rounded-xl border border-slate-200/80 w-full sm:w-auto">
                        <div className="text-[10px] text-slate-400 font-medium">ອັດຕາຄິດໄລ່:</div>
                        <div className="text-sm font-black text-[#2329c1] font-mono">
                          {quickResult.currentBill.tierBreakdown.length === 1
                            ? `${formatNumber(quickResult.currentBill.tierBreakdown[0].rateKipPerKwh)} ກີບ/kWh`
                            : `${quickResult.currentBill.tierBreakdown.length} ຂັ້ນບັນໄດ`}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Description & Notice metadata */}
                  <div className="pt-3 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-2">
                    <div className="text-slate-500 leading-relaxed max-w-xl">
                      <span className="font-semibold text-slate-700">ລາຍລະອຽດ: </span>
                      {selectedTariffCategory.description ||
                        (selectedTariffCategory.categoryGroup === "RESIDENTIAL" ||
                        selectedTariffCategory.nameLa.includes("ທີ່ຢູ່ອາໄສ")
                          ? "ການນຳໃຊ້ໄຟຟ້າຕາມເຮືອນຊານບ້ານຊ່ອງ ສຳລັບການດຳລົງຊີວິດປະຈຳວັນ (ໂຄງສ້າງອັດຕາ 8 ຂັ້ນບັນໄດ)"
                          : "ອັດຕາຕາມແຈ້ງການທາງການຂອງ ລັດວິສາຫະກິດໄຟຟ້າລາວ")}
                    </div>
                    {quickResult?.selectedPeriod && (
                      <div className="text-[11px] text-slate-500">
                        <span>ເລກທີແຈ້ງການ: </span>
                        <strong className="text-slate-800">{quickResult.selectedPeriod.noticeNumber}</strong>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 3. Units Slider & Numeric Input */}
            <div className="mb-8 sm:mb-10 bg-slate-50 p-4 sm:p-8 rounded-2xl border border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 sm:mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                    3. ລະບຸຈຳນວນໜ່ວຍໄຟຟ້າທີ່ໃຊ້ (kWh / Unit)
                  </label>
                  <div className="text-xs text-slate-400 mt-0.5">
                    ເລື່ອນແຖບ ຫຼື ພິມຕົວເລກຈຳນວນໜ່ວຍຈາກໃບບິນ
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    value={quickUnits}
                    onChange={(e) =>
                      setQuickUnits(Math.max(0, parseInt(e.target.value) || 0))
                    }
                    className="w-28 sm:w-32 text-right text-lg sm:text-xl font-extrabold text-[#2329c1] bg-white border border-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#2329c1] font-mono"
                  />
                  <span className="font-bold text-sm text-slate-600">ໜ່ວຍ</span>
                </div>
              </div>

              {/* Slider */}
              <input
                type="range"
                min="0"
                max="2000"
                step="5"
                value={Math.min(quickUnits, 2000)}
                onChange={(e) => setQuickUnits(Number(e.target.value))}
                className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2329c1]"
              />

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center justify-between gap-2 mt-4 text-xs">
                <span className="text-slate-400 font-medium">ຄ່າເລີ່ມຕົ້ນດ່ວນ:</span>
                <div className="flex flex-wrap gap-1.5">
                  {[25, 150, 300, 450, 750, 1200, 1600].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setQuickUnits(val)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${quickUnits === val
                        ? "bg-[#2329c1] text-white shadow-xs"
                        : "bg-white text-slate-600 hover:bg-slate-200 border border-slate-200"
                        }`}
                    >
                      {val} kWh
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 3. Output Display Grid */}
            {quickResult ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
                {/* Left: Progressive Tier Breakdown */}
                <div className="lg:col-span-7 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80">
                  <div className="flex items-center justify-between gap-2 mb-4 pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5 min-w-0">
                      <Info className="w-4 h-4 text-[#2329c1] shrink-0" />
                      <span className="truncate">ລາຍລະອຽດການຄິດໄລ່ຕາມຂັ້ນໄດ 8 ຂັ້ນ (API ຈິງ)</span>
                    </span>
                    <span className="text-xs text-slate-400 font-mono shrink-0">
                      {quickUnits} kWh
                    </span>
                  </div>

                  <div className="space-y-2">
                    {quickResult.currentBill.tierBreakdown.map((tier) => {
                      const kwhInTier = tier.tierKwh ?? tier.kwhInTier ?? 0;
                      return (
                        <div
                          key={tier.tierOrder}
                          className={`flex items-center justify-between gap-2 text-xs p-2.5 rounded-xl border ${kwhInTier > 0
                            ? "bg-slate-50 border-slate-200"
                            : "bg-white border-slate-100 opacity-60"
                            }`}
                        >
                          <div className="space-y-0.5 min-w-0">
                            <div className="font-semibold text-slate-800">
                              ຂັ້ນ {tier.tierOrder}: {tier.label}
                            </div>
                            <div className="text-[11px] text-slate-400">
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
                        ສະຫຼຸບປະມານການ ({selectedTariffCategory.nameLa})
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300 text-[10px] font-bold tracking-wider uppercase border border-white/10 shrink-0">
                        {selectedTariffCategory.nameEn || "EDL"} {selectedYear}
                      </span>
                    </div>

                    <div className="space-y-2.5 pb-4 border-b border-white/15 text-xs text-blue-100">
                      <div className="flex justify-between gap-2">
                        <span>ຄ່າພະລັງງານໄຟຟ້າ (Base):</span>
                        <span className="font-semibold text-white font-mono shrink-0 text-right">
                          {formatNumber(quickResult.currentBill.baseCostKip)} ກີບ
                        </span>
                      </div>

                      {quickResult.currentBill.hotSeasonDiscountKip > 0 && (
                        <div className="flex justify-between gap-2 text-amber-300 font-semibold">
                          <span>ສ່ວນຫຼຸດລະດູຮ້ອນ (5%):</span>
                          <span className="shrink-0 text-right">-{formatNumber(quickResult.currentBill.hotSeasonDiscountKip)} ກີບ</span>
                        </div>
                      )}

                      <div className="flex justify-between gap-2 text-white/90">
                        <span>1. ຄ່າໄຟລວມໃນເດືອນ (ຄ່າພະລັງງານ):</span>
                        <span className="font-semibold font-mono shrink-0 text-right">
                          {formatNumber(quickResult.currentBill.netBaseCostKip)} ກີບ
                        </span>
                      </div>

                      {quickResult.currentBill.maintenanceFeeKip > 0 && (
                        <div className="flex justify-between gap-2 text-amber-300 font-medium">
                          <span>2. ຄ່າຊ່ອມບຳລຸງ (ຄ່າບຳລຸງຮັກສາ):</span>
                          <span className="font-semibold font-mono shrink-0 text-right">
                            +{formatNumber(quickResult.currentBill.maintenanceFeeKip)} ກີບ
                          </span>
                        </div>
                      )}

                      <div className="flex justify-between gap-2 text-blue-200 pt-1 border-t border-white/10 font-medium">
                        <span>ຍອດລວມກ່ອນອາກອນ (1 + 2):</span>
                        <span className="font-semibold text-white font-mono shrink-0 text-right">
                          {formatNumber(quickResult.currentBill.subtotalBeforeVatKip)} ກີບ
                        </span>
                      </div>

                      <div className="flex justify-between gap-2">
                        <span>
                          {quickResult.currentBill.maintenanceFeeKip > 0 ? "3." : "2."} ອາກອນມູນຄ່າເພີ່ມ (VAT{" "}
                          {Math.round(
                            (quickResult.currentBill.vatRate ??
                              quickResult.selectedPeriod.vatRate ??
                              0.1) * 100
                          )}
                          %):
                        </span>
                        <span className="font-semibold text-white font-mono shrink-0 text-right">
                          +{formatNumber(quickResult.currentBill.vatCostKip)} ກີບ
                        </span>
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="text-xs text-amber-300 font-medium">
                        ຍອດລວມປະມານການທັງໝົດໃນເດືອນ:
                      </div>
                      <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight mt-1 font-mono break-words">
                        {formatNumber(quickResult.currentBill.totalCostKip)}{" "}
                        <span className="text-sm font-normal text-blue-200">
                          ກີບ
                        </span>
                      </div>
                      <div className="text-[11px] text-blue-200/80 mt-1">
                        * ຄິດໄລ່ຕາມສູດ: (ຄ່າໄຟລວມ + ຄ່າບຳລຸງຮັກສາ) + VAT
                      </div>
                    </div>
                  </div>

                  {/* Energy Saving Tip */}
                  <div className="mt-6 pt-4 border-t border-white/15 bg-white/5 rounded-xl p-3 flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-amber-300 flex-shrink-0 mt-0.5" />
                    <div className="text-[11px] text-blue-100 leading-snug">
                      <strong>ແຈ້ງການທາງການ:</strong> {quickResult.selectedPeriod.noticeNumber} (VAT 10%)
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-slate-400 text-xs">
                {isQuickCalculating ? "ກຳລັງຄິດໄລ່ຜ່ານ API..." : "ບໍ່ສາມາດຄິດໄລ່ໄດ້"}
              </div>
            )}
          </div>
        )}

        {/* Informational Guidance / FAQ Section */}
        <div className="mt-12 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-3 mb-6">
            <HelpCircle className="w-6 h-6 text-[#2329c1]" />
            <h3 className="text-lg font-bold text-slate-900">
              ຂໍ້ມູນສຳຄັນກ່ຽວກັບໂຄງສ້າງອັດຕາຄ່າໄຟຟ້າ ແລະ ນະໂຍບາຍໃໝ່
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#2329c1]" />
                <span>ໂຄງສ້າງຂັ້ນໄດ 8 ຂັ້ນ</span>
              </div>
              <p className="text-slate-600 leading-relaxed">
                ການຄິດໄລ່ຄ່າໄຟຟ້າປະເພດທີ່ຢູ່ອາໄສ ໄດ້ແບ່ງອອກເປັນ 8 ຂັ້ນ (ເລີ່ມແຕ່ 0-25 kWh ຈົນເຖິງເກີນ 1,500 kWh) ເພື່ອສະໜັບສະໜູນຄອບຄົວທີ່ໃຊ້ໄຟໜ້ອຍ ແລະ ກະຕຸ້ນການປະຢັດພະລັງງານ.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/60 space-y-1.5">
              <div className="font-bold text-amber-900 text-sm flex items-center gap-2">
                <Sun className="w-4 h-4 text-amber-600" />
                <span>ນະໂຍບາຍລະດູຮ້ອນ (5%)</span>
              </div>
              <p className="text-amber-900/80 leading-relaxed">
                ໃນລະຫວ່າງເດືອນ ມີນາ ຫາ ພຶດສະພາ ຂອງທຸກໆປີ, ຄົວເຮືອນທີ່ຊົມໃຊ້ໄຟຟ້າບໍ່ເກີນ 300 kWh ຈະໄດ້ຮັບສ່ວນຫຼຸດຄ່າພະລັງງານໄຟຟ້າ 5% ເພື່ອບັນເທົາຜົນກະທົບຈາກອາກາດຮ້ອນ.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-200/60 space-y-1.5">
              <div className="font-bold text-blue-900 text-sm flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#2329c1]" />
                <span>ອາກອນມູນຄ່າເພີ່ມ (VAT 10%)</span>
              </div>
              <p className="text-blue-900/80 leading-relaxed">
                ອາກອນມູນຄ່າເພີ່ມຖືກກຳນົດເປັນ 10% ຕາມກົດໝາຍວ່າດ້ວຍສ່ວຍສາອາກອນສະບັບປັບປຸງໃໝ່ ໂດຍຄິດໄລ່ຈາກຍອດລວມຄ່າພະລັງງານໄຟຟ້າຫຼັງຫັກສ່ວນຫຼຸດ (ຖ້າມີ).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
