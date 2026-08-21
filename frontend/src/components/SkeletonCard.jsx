const SkeletonCard = () => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm animate-pulse">
    <div className="flex justify-between items-start">
      <div className="space-y-2">
        <div className="h-4 bg-slate-200 rounded w-20"></div>
        <div className="h-8 bg-slate-200 rounded w-24"></div>
      </div>
      <div className="h-10 w-10 bg-slate-200 rounded-lg"></div>
    </div>
    <div className="mt-4 flex items-center gap-2">
      <div className="h-4 bg-slate-200 rounded w-12"></div>
      <div className="h-4 bg-slate-200 rounded w-24"></div>
    </div>
  </div>
);

export default SkeletonCard;