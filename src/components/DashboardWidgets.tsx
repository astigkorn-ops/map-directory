export default function DashboardWidgets() {
  return (
    <div className="w-full h-full bg-white/40 backdrop-blur-md rounded-3xl shadow-2xl p-8 border border-white/50">
      <div className="grid grid-cols-12 gap-6 h-full">
        <div className="col-span-2 flex flex-col gap-4">
          <div className="w-full aspect-square bg-orange-400 rounded-full shadow-lg"></div>
          <div className="w-full aspect-square bg-orange-400 rounded-full shadow-lg"></div>
        </div>

        <div className="col-span-3 flex flex-col gap-4">
          <div className="h-12 bg-[#2d3561] rounded-2xl shadow-lg"></div>
          <div className="flex-1 flex flex-col gap-3">
            <div className="h-16 bg-[#2d3561] rounded-2xl shadow-lg"></div>
            <div className="h-16 bg-[#2d3561] rounded-2xl shadow-lg"></div>
            <div className="h-16 bg-[#2d3561] rounded-2xl shadow-lg"></div>
            <div className="h-16 bg-[#2d3561] rounded-2xl shadow-lg"></div>
          </div>
          <div className="bg-blue-200/60 rounded-2xl p-4 shadow-lg">
            <div className="w-12 h-12 bg-[#2d3561] rounded-full mb-2"></div>
            <div className="h-8 bg-[#2d3561] rounded-lg w-3/4"></div>
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-4">
          <div className="h-20 bg-sky-400 rounded-3xl shadow-lg"></div>
          <div className="flex-1 bg-blue-200/60 rounded-3xl shadow-lg p-6">
            <div className="h-12 bg-[#2d3561] rounded-2xl mb-4"></div>
            <div className="h-20 bg-[#2d3561] rounded-2xl"></div>
          </div>
          <div className="bg-white/60 rounded-3xl p-6 shadow-lg">
            <div className="w-16 h-16 bg-[#2d3561] rounded-full"></div>
          </div>
          <div className="bg-blue-200/60 rounded-2xl p-4 shadow-lg flex gap-3">
            <div className="w-16 h-16 bg-[#2d3561] rounded-lg"></div>
            <div className="flex-1">
              <div className="h-10 bg-[#2d3561] rounded-xl mb-2"></div>
              <div className="h-10 bg-[#2d3561] rounded-xl"></div>
            </div>
          </div>
        </div>

        <div className="col-span-3 flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-3">
            <div className="h-32 bg-orange-400 rounded-3xl shadow-lg"></div>
            <div className="h-32 bg-orange-400 rounded-3xl shadow-lg"></div>
            <div className="h-32 bg-orange-400 rounded-3xl shadow-lg"></div>
            <div className="h-32 bg-orange-400 rounded-3xl shadow-lg"></div>
          </div>
          <div className="grid grid-cols-4 gap-3">
            <div className="h-32 bg-sky-400 rounded-3xl shadow-lg"></div>
            <div className="h-32 bg-sky-400 rounded-3xl shadow-lg"></div>
            <div className="h-32 bg-sky-400 rounded-3xl shadow-lg"></div>
            <div className="h-32 bg-sky-400 rounded-3xl shadow-lg"></div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="bg-blue-200/60 rounded-3xl shadow-lg"></div>
            <div className="bg-blue-200/60 rounded-3xl shadow-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
