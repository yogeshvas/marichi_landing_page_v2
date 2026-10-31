import Image from "next/image";

// The MarichiPulse logo (transparent PNG). Black lettering, so on dark sections use `chip`
// to sit it on a white tile.
export default function PulseLogo({ className = "h-14 sm:h-16", chip = false, priority = false }: { className?: string; chip?: boolean; priority?: boolean }) {
  const img = <Image src="/brand/pulse-logo.png" alt="Pulse by Marichi Labs" width={1600} height={533} priority={priority} className={`w-auto ${chip ? "" : "-ml-4 sm:-ml-5"} ${className}`} />;
  return chip ? <span className="inline-block rounded-2xl bg-white px-3 py-1.5">{img}</span> : img;
}
