import React from "react";

export default function NewsDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16 animate-pulse">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-4 w-48 bg-slate-200 rounded-md mb-6" />
        <div className="h-10 w-36 bg-slate-200 rounded-xl mb-6" />

        <div className="bg-white rounded-3xl p-8 border border-slate-200 space-y-6">
          <div className="flex gap-4">
            <div className="h-6 w-24 bg-slate-200 rounded-full" />
            <div className="h-6 w-32 bg-slate-200 rounded-md" />
          </div>
          <div className="h-10 w-full max-w-2xl bg-slate-300 rounded-xl" />
          <div className="h-4 w-3/4 bg-slate-200 rounded-md" />
          <div className="h-80 w-full bg-slate-200 rounded-2xl" />
          <div className="space-y-3">
            <div className="h-4 w-full bg-slate-200 rounded-md" />
            <div className="h-4 w-full bg-slate-200 rounded-md" />
            <div className="h-4 w-2/3 bg-slate-200 rounded-md" />
          </div>
        </div>
      </div>
    </div>
  );
}
