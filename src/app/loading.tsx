export default function Loading() {
  return (
    <div className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none h-[2.5px] overflow-hidden" aria-hidden="true">
      <div className="h-full w-full bg-gradient-to-r from-[#4285f4] via-[#ea4335] via-[#fbbc04] to-[#34a853] animate-pulse origin-left" />
    </div>
  );
}
