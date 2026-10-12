export default function Loading() {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none h-[2.5px] overflow-hidden" aria-hidden="true">
        <div className="h-full w-full bg-gradient-to-r from-[#4285f4] via-[#ea4335] via-[#fbbc04] to-[#34a853] animate-pulse origin-left" />
      </div>
      <div
        className="fixed inset-0 z-[999998] pointer-events-none flex flex-col items-center justify-center backdrop-blur-[6px] bg-white/40 transition-all"
        aria-hidden="true"
      >
        <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-white/85 shadow-lg border border-slate-200/60 backdrop-blur-md">
          <div className="relative w-10 h-10">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#023858]/15" />
            <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-[#023858] border-r-[#0b57d0] animate-spin" />
            <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-[#023858] animate-pulse" />
          </div>
          <span className="mt-2.5 text-[11px] font-semibold tracking-wide text-[#023858]/90">
            Loading...
          </span>
        </div>
      </div>
    </>
  );
}
