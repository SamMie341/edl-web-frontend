import React from "react";

export default function MagazinesLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-48 bg-slate-200 rounded-md mb-6" />

        {/* Hero banner skeleton */}
        <div className="h-52 sm:h-60 w-full rounded-3xl bg-slate-300 mb-10 p-8 sm:p-12 flex flex-col justify-end gap-3">
          <div className="h-6 w-48 bg-slate-400/50 rounded-full" />
          <div className="h-10 w-96 max-w-full bg-slate-400/50 rounded-xl" />
          <div className="h-4 w-80 max-w-full bg-slate-400/40 rounded-md" />
        </div>

        {/* Search & filter bar skeleton */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 mb-10 space-y-4">
          <div className="h-12 w-full bg-slate-100 rounded-2xl" />
          <div className="flex gap-2">
            <div className="h-7 w-20 bg-slate-100 rounded-full" />
            <div className="h-7 w-16 bg-slate-100 rounded-full" />
            <div className="h-7 w-16 bg-slate-100 rounded-full" />
          </div>
        </div>

        {/* Magazine cards skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white rounded-3xl p-5 border border-slate-200/80 space-y-4"
            >
              <div className="aspect-[3/4] w-full bg-slate-200 rounded-2xl" />
              <div className="h-4 w-28 bg-slate-200 rounded-full" />
              <div className="h-6 w-full bg-slate-200 rounded-lg" />
              <div className="h-10 w-full bg-slate-100 rounded-xl" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
