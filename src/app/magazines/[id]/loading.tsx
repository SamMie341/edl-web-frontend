import React from "react";

export default function MagazineDetailLoading() {
  return (
    <div className="min-h-screen bg-slate-50 py-10 md:py-16 animate-pulse">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-4 w-56 bg-slate-200 rounded-md mb-6" />
        <div className="h-10 w-44 bg-slate-200 rounded-xl mb-6" />

        <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-5 flex justify-center">
              <div className="aspect-[3/4] w-full max-w-[300px] bg-slate-200 rounded-2xl" />
            </div>
            <div className="lg:col-span-7 space-y-5">
              <div className="h-6 w-36 bg-slate-200 rounded-full" />
              <div className="h-10 w-full bg-slate-300 rounded-xl" />
              <div className="grid grid-cols-2 gap-3">
                <div className="h-16 bg-slate-100 rounded-2xl" />
                <div className="h-16 bg-slate-100 rounded-2xl" />
              </div>
              <div className="h-28 bg-slate-100 rounded-2xl" />
              <div className="flex gap-3 pt-4">
                <div className="h-12 w-44 bg-slate-200 rounded-2xl" />
                <div className="h-12 w-40 bg-slate-200 rounded-2xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
