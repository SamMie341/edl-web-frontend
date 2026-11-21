"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  FileText,
  Download,
  Clock,
  Calendar,
  Briefcase,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from "lucide-react";
import type { Procurement, JobPosting } from "@/domain";
import { getStorageUrl } from "@/infrastructure";
import { formatLaoDate, sanitizeHtmlContent } from "@/shared";

interface ProcurementPreviewProps {
  procurements?: Procurement[];
  jobPostings?: JobPosting[];
}

export function ProcurementPreview({
  procurements,
  jobPostings,
}: ProcurementPreviewProps) {
  const [activeTab, setActiveTab] = useState<"procurement" | "career">(
    "procurement"
  );
  const procurementList = procurements || [];
  const careerList = jobPostings || [];

  return (
    <section
      id="procurements"
      className="py-12 sm:py-16 md:py-24 bg-slate-50 border-t border-b border-slate-200/80"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100/70 text-[#2329c1] text-xs font-semibold mb-2">
              <FileText className="w-3.5 h-3.5" />
              <span>ແຈ້ງການທາງການ & ຄວາມໂປ່ງໃສ</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              ການຈັດຊື້-ຈັດຈ້າງ & ປະກາດຮັບສະໝັກງານ
            </h2>
            <p className="mt-1 text-sm text-slate-500 max-w-xl">
              ຕິດຕາມການປະກາດປະມູນໂຄງການ, ຈັດຊື້ວັດສະດຸ ແລະ ປະກາດຮັບສະໝັກບຸກຄະລາກອນ ຈາກຖານຂໍ້ມູນທາງການ ຟຟລ
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex sm:inline-flex w-full sm:w-auto p-1 bg-slate-200/70 rounded-2xl shrink-0">
            <button
              onClick={() => setActiveTab("procurement")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === "procurement"
                  ? "bg-white text-[#2329c1] shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>ການຈັດຊື້-ຈັດຈ້າງ ({procurementList.length})</span>
            </button>
            <button
              onClick={() => setActiveTab("career")}
              className={`flex-1 sm:flex-none px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 whitespace-nowrap ${
                activeTab === "career"
                  ? "bg-white text-emerald-700 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 shrink-0" />
              <span>ຮັບສະໝັກງານ ({careerList.length})</span>
            </button>
          </div>
        </div>

        {/* Tab Content: Procurement */}
        {activeTab === "procurement" && (
          <div>
            {procurementList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">
                  ຍັງບໍ່ມີລາຍການປະກາດປະມູນໃນຂະນະນີ້
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {procurementList.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-blue-300 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-mono font-bold text-[#2329c1] bg-blue-50 px-2.5 py-1 rounded-lg">
                          {item.tenderNumber || `EDL-PROC-${item.id}`}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                            item.status === "OPEN"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {item.status === "OPEN" ? "ເປີດຮັບຊອງ" : item.status}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 leading-snug mb-3">
                        {item.title}
                      </h3>

                      {item.description && (
                        <div
                          className="text-xs text-slate-600 line-clamp-2 mb-3"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtmlContent(item.description),
                          }}
                        />
                      )}

                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          ປິດຮັບຊອງ:{" "}
                          <strong>
                            {item.endDate
                              ? formatLaoDate(item.endDate)
                              : item.deadline || "ຕາມແຈ້ງການ"}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-slate-500 font-medium">
                        ເລີ່ມ:{" "}
                        {item.startDate
                          ? formatLaoDate(item.startDate)
                          : "ເປີດຮັບແລ້ວ"}
                      </span>
                      {item.fileUrl ? (
                        <a
                          href={getStorageUrl(item.fileUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-[#2329c1] hover:bg-[#2329c1] hover:text-white text-xs font-semibold transition-all duration-200"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>ດາວໂຫຼດ TOR (PDF)</span>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400">
                          ຕິດຕໍ່ຫ້ອງການ ຟຟລ
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Careers / Job Postings */}
        {activeTab === "career" && (
          <div>
            {careerList.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-3xl border border-slate-200">
                <Briefcase className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-semibold text-slate-600">
                  ຍັງບໍ່ມີຕຳແໜ່ງງານວ່າງໃນຂະນະນີ້
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                {careerList.map((job) => (
                  <div
                    key={job.id}
                    className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-sm hover:shadow-lg hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-100">
                          {job.position?.positionName || "ຕຳແໜ່ງງານ"}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                            job.status === "OPEN"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-600 border-slate-200"
                          }`}
                        >
                          {job.status === "OPEN" ? "ເປີດຮັບສະໝັກ" : job.status}
                        </span>
                      </div>

                      <h3 className="text-base sm:text-lg font-bold text-slate-900 line-clamp-2 leading-snug mb-1">
                        {job.title}
                      </h3>

                      {job.subtitle && (
                        <p className="text-xs text-slate-500 mb-3">
                          {job.subtitle}
                        </p>
                      )}

                      {job.description && (
                        <div
                          className="text-xs text-slate-600 line-clamp-3 mb-3 bg-slate-50 p-3 rounded-xl border border-slate-100"
                          dangerouslySetInnerHTML={{
                            __html: sanitizeHtmlContent(job.description),
                          }}
                        />
                      )}

                      <div className="flex items-center gap-2 text-xs text-slate-500 mb-2">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          ໝົດເຂດຮັບສະໝັກ:{" "}
                          <strong>
                            {job.endDate
                              ? formatLaoDate(job.endDate)
                              : "ຕາມແຈ້ງການ"}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                      <span className="text-xs text-slate-400">
                        ເລີ່ມ:{" "}
                        {job.startDate
                          ? formatLaoDate(job.startDate)
                          : "ເປີດຮັບແລ້ວ"}
                      </span>
                      {job.imageUrl ? (
                        <a
                          href={getStorageUrl(job.imageUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 hover:bg-emerald-700 hover:text-white text-xs font-semibold transition-all duration-200"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          <span>ເບິ່ງໃບປະກາດ</span>
                        </a>
                      ) : (
                        <span className="text-xs font-medium text-emerald-700">
                          ຍື່ນເອກະສານທີ່ ຟຟລ
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
