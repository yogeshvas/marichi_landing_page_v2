// "We are a Meta Tech Provider" badge for the hero. Uses the Meta mark (Simple Icons) drawn in Meta's blue.
// Meta publishes official Tech Provider artwork and usage rules: swap the mark for that file when you have it.
export default function MetaBadge() {
  return (
    <div className="r-toast absolute right-4 top-4 z-10 sm:right-8 sm:top-6" role="status">
      <div className="meta-border rounded-2xl p-[1.5px] shadow-[0_18px_40px_-16px_rgba(0,100,224,0.55)]">
        <div className="relative flex items-center gap-3 overflow-hidden rounded-[0.9rem] bg-[#0d0c0b]/90 py-2 pl-2 pr-4 backdrop-blur-xl sm:gap-3.5 sm:py-2.5 sm:pl-2.5 sm:pr-5">
          <span aria-hidden="true" className="meta-shine" />
          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white sm:h-11 sm:w-11">
            <span role="img" aria-label="Meta" className="block h-5 w-8 sm:h-[1.4rem] sm:w-9" style={{ background: "linear-gradient(90deg, #0064E0, #0082FB)", WebkitMaskImage: "url(/brand/partners/meta.svg)", maskImage: "url(/brand/partners/meta.svg)", WebkitMaskRepeat: "no-repeat", maskRepeat: "no-repeat", WebkitMaskSize: "contain", maskSize: "contain", WebkitMaskPosition: "center", maskPosition: "center" }} />
            <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3"><span className="r-ping absolute inline-flex h-full w-full rounded-full bg-[#25D366] opacity-70" /><span className="relative inline-flex h-3 w-3 rounded-full border-2 border-[#0d0c0b] bg-[#25D366]" /></span>
          </span>
          <span className="relative min-w-0 leading-tight">
            <span className="hidden text-[10.5px] font-semibold uppercase tracking-[0.18em] text-white/50 sm:block">WhatsApp Business Platform</span>
            <span className="block whitespace-nowrap text-[13px] font-bold text-white sm:mt-0.5 sm:text-[15px]">We are an <span className="text-[#6db4ff]">Official Meta Tech Provider</span></span>
          </span>
        </div>
      </div>
    </div>
  );
}
