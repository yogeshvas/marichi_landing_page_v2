const items = [
  { k: "meta", label: "Official Meta Tech Provider", note: "WhatsApp Business Platform" },
  { k: "tx", label: "Investment raised from Texas AI Ventures", note: "Backed to build AI-native software" },
  { k: "dpiit", label: "DPIIT Registered Startup", note: "Recognised by the Government of India" },
] as const;

function Mark({ k }: { k: string }) {
  if (k === "meta") return <span aria-hidden="true" className="h-5 w-5 shrink-0 bg-[#4C9AFF]" style={{ mask: "url(/brand/partners/meta.svg) center / contain no-repeat", WebkitMask: "url(/brand/partners/meta.svg) center / contain no-repeat" }} />;
  const d = k === "tx" ? "M12 2l2.9 6.9 7.100.6-5.400 4.700 1.700 7.300L12 17.800 5.700 21.500l1.700-7.300L2 9.500l7.100-.6z" : "M12 3l8 3v6c0 5-3.500 8-8 9-4.500-1-8-4-8-9V6zM8.500 12l2.500 2.500 4.500-5";
  const c = k === "tx" ? "#F5B544" : "#3ECF8E";
  return <svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill={k === "tx" ? c : "none"} stroke={c} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" className="shrink-0"><path d={d} /></svg>;
}

// A slow, endless strip along the bottom of the hero. The set is repeated so the loop has no seam.
export default function TrustTicker() {
  const row = (hidden: boolean) => (
    <ul className="tt-row flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((it) => (
        <li key={it.k} className="flex shrink-0 items-center gap-3 px-8">
          <Mark k={it.k} />
          <span className="text-[13.5px] font-semibold tracking-wide text-[#15130f]">{it.label}</span>
          <span className="hidden text-[12.5px] text-[#15130f]/55 md:inline">{it.note}</span>
          <span aria-hidden="true" className="ml-8 h-1.5 w-1.5 rotate-45 bg-[#ee3b2b]" />
        </li>
      ))}
    </ul>
  );
  return (
    <div role="group" aria-label="Credentials" className="tt absolute inset-x-0 bottom-0 z-[5] h-12 overflow-hidden border-t border-[#15130f]/10 bg-white/55 backdrop-blur-md">
      <div className="tt-track flex h-full w-max items-center">
        {row(false)}{row(true)}{row(true)}{row(true)}
      </div>
    </div>
  );
}
