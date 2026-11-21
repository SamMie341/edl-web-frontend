import React from "react";

export default function BranchDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb skeleton */}
        <div className="h-4 w-56 bg-slate-200 rounded-md mb-6" />

        {/* Back button skeleton */}
        <div className="h-10 w-36 bg-slate-200 rounded-xl mb-6" />

        {/* Hero banner skeleton */}
        <div className="h-64 sm:h-72 w-full rounded-3xl bg-slate-300 mb-10 p-8 flex flex-col justify-end gap-3">
          <div className="h-6 w-32 bg-slate-400/50 rounded-full" />
          <div className="h-10 w-80 bg-slate-400/50 rounded-xl" />
          <div className="h-4 w-96 bg-slate-400/40 rounded-md" />
        </div>

        {/* Two-column layout skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-6">
            <div className="h-80 w-full rounded-3xl bg-slate-200" />
            <div className="h-64 w-full rounded-3xl bg-slate-200" />
            <div className="h-72 w-full rounded-3xl bg-slate-200" />
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="h-64 w-full rounded-3xl bg-slate-200" />
            <div className="h-48 w-full rounded-3xl bg-slate-200" />
            <div className="h-56 w-full rounded-3xl bg-slate-200" />
          </div>
        </div>
      </div>
    </div>
  );
}
