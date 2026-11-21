import React from "react";

export default function OrganizationLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-52 bg-slate-200 rounded-md mb-6" />

        {/* Hero banner skeleton */}
        <div className="h-48 sm:h-60 w-full rounded-3xl bg-slate-300 mb-10 p-6 sm:p-8 flex flex-col justify-end gap-3">
          <div className="h-6 w-36 max-w-full bg-slate-400/50 rounded-full" />
          <div className="h-10 w-96 max-w-full bg-slate-400/50 rounded-xl" />
          <div className="h-4 w-80 max-w-full bg-slate-400/40 rounded-md" />
        </div>

        {/* Tabs skeleton */}
        <div className="flex justify-center mb-8">
          <div className="h-12 w-full max-w-xl bg-slate-200 rounded-2xl" />
        </div>

        {/* Canvas container skeleton */}
        <div className="bg-white rounded-3xl p-4 sm:p-10 border border-slate-200/80 shadow-sm">
          <div className="h-8 w-64 max-w-full bg-slate-200 rounded-lg mb-6" />
          <div className="h-64 sm:h-[500px] w-full bg-slate-100 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
