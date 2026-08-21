const SkeletonTable = ({ rows = 5, cols = 5 }) => (
  <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-pulse">
    <div className="p-4 border-b border-slate-200">
      <div className="h-6 bg-slate-200 rounded w-32"></div>
    </div>
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-slate-50">
          <tr>
            {[...Array(cols)].map((_, i) => (
              <th key={i} className="p-4">
                <div className="h-4 bg-slate-200 rounded w-20"></div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {[...Array(rows)].map((_, i) => (
            <tr key={i} className="border-t border-slate-100">
              {[...Array(cols)].map((_, j) => (
                <td key={j} className="p-4">
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default SkeletonTable;