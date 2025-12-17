export default function Loading() {
  return (
    <div className="
      flex items-center justify-center
      min-h-[60vh]
      opacity-0 animate-fadeInLong
    ">
      <div className="
        flex flex-col items-center gap-4
        px-10 py-8
        rounded-2xl
        bg-slate-800/60
        backdrop-blur-md
        border border-slate-700/50
        shadow-xl
      ">
        {/* Spinner */}
        <div className="
          h-10 w-10
          rounded-full
          border-2 border-slate-600/40
          border-t-slate-300
          animate-spin
        " />

        <span className="text-lg font-medium text-slate-200">
          Ładowanie zawartości strony
        </span>

        <span className="text-sm text-slate-400">
          Proszę poczekać
        </span>
      </div>
    </div>
  );
}
