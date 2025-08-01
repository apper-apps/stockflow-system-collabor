import React from "react";

const Loading = () => {
  return (
    <div className="animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="w-8 h-8 bg-slate-200 rounded-lg"></div>
              <div className="w-16 h-4 bg-slate-200 rounded"></div>
            </div>
            <div className="w-20 h-8 bg-slate-200 rounded mb-2"></div>
            <div className="w-24 h-4 bg-slate-200 rounded"></div>
          </div>
        ))}
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
        <div className="w-48 h-6 bg-slate-200 rounded mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
              <div className="flex-1">
                <div className="w-32 h-4 bg-slate-200 rounded mb-2"></div>
                <div className="w-48 h-3 bg-slate-200 rounded"></div>
              </div>
              <div className="w-16 h-4 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Loading;