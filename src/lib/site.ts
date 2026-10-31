// Central place for links and contact details.
export const site = {
  name: "Marichi Labs",
  legalName: "Marichi Solutions Limited",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://marichilabs.com").replace(/\/$/, ""),
  tagline: "Everything your business runs on.",
  description:
    "Marichi Labs builds nine AI-native products to sell, pay, talk, move, verify and grow, in one connected suite. Built in Africa and India. Engineered for the world.",
  email: "hello@marichisolutions.com",
  phone: "+260 773 903 240",
  phoneHref: "+260773903240",
  tpin: "2004302058",
  pacra: "120261040917",
  whatsapp: (process.env.NEXT_PUBLIC_WHATSAPP ?? "260773903240").replace(/\D/g, ""),
  // Confirm these two are your real profiles, or set NEXT_PUBLIC_INSTAGRAM_URL / NEXT_PUBLIC_LINKEDIN_URL.
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "https://www.instagram.com/marichilabs/",
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL ?? "https://www.linkedin.com/company/marichilabs/",
  },
  pulseUrl: process.env.NEXT_PUBLIC_PULSE_URL ?? "https://pulse.marichilabs.com",
  offices: [
    { city: "Lusaka", region: "Zambia, Africa", address: "Plot 58, off Great East Road", country: "ZM" },
    { city: "Gurugram", region: "India", address: "Office 239, Tower B3, Spaze iTech Park, Sector 49, Gurugram 122018", country: "IN" },
    { city: "Dallas", region: "USA", address: "5050 Quorum Dr, Suite 700, Dallas, TX 75254", country: "US" },
  ],
};

export const absoluteUrl = (path = "/") => {
  const clean = path === "/" || /\.[a-z0-9]+$/i.test(path) || path.endsWith("/") ? path : `${path}/`;
  return `${site.url}${clean}`;
};

export const waLink = (message: string) => `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;
