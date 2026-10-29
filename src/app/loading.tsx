export default function Loading() {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="fixed top-0 left-0 right-0 z-[999999] pointer-events-none h-[2.5px] overflow-hidden"
    >
      {/* ── Non-blocking Top Progress Bar ── */}
      <div
        className="h-full w-full origin-left motion-safe:animate-[progress_1.4s_ease-in-out_infinite]"
        style={{
          background:
            'linear-gradient(to right, #4285f4, #ea4335, #fbbc04, #34a853)',
        }}
      />
      <span className="sr-only">Loading content, please wait...</span>
    </div>
  );
}
