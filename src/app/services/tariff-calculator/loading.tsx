import React from "react";

export default function TariffCalculatorLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-4 w-64 max-w-full bg-slate-200 rounded-md mb-6" />

        <div className="h-64 sm:h-72 w-full rounded-3xl bg-slate-300 mb-10 p-6 sm:p-8 flex flex-col justify-end gap-3">
          <div className="h-6 w-48 max-w-full bg-slate-400/50 rounded-full" />
          <div className="h-10 w-96 max-w-full bg-slate-400/50 rounded-xl" />
          <div className="h-4 w-full max-w-xl bg-slate-400/40 rounded-md" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
          <div className="h-24 rounded-2xl bg-slate-200" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="h-48 rounded-3xl bg-slate-200" />
            <div className="h-80 rounded-3xl bg-slate-200" />
          </div>
          <div className="lg:col-span-5 space-y-6">
            <div className="h-96 rounded-3xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
