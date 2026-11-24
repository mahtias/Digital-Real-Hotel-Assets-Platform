// Lightweight inline SVG icon set (stroke icons, CoreUI-style sizing)
import { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };

const base = ({ size = 18, ...rest }: P) => ({
  width: size, height: size, viewBox: "0 0 24 24", fill: "none",
  stroke: "currentColor", strokeWidth: 1.75, strokeLinecap: "round" as const, strokeLinejoin: "round" as const,
  "aria-hidden": true, ...rest,
});

export const IconSpeedometer = (p: P) => (<svg {...base(p)}><path d="M12 14l4-4"/><path d="M3.34 19a10 10 0 1 1 17.32 0"/></svg>);
export const IconId          = (p: P) => (<svg {...base(p)}><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="M15 8h2M15 12h2M7 16h10"/></svg>);
export const IconUsers       = (p: P) => (<svg {...base(p)}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
export const IconDiamond     = (p: P) => (<svg {...base(p)}><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21 8 9l4-6 4 6z"/></svg>);
export const IconBuilding    = (p: P) => (<svg {...base(p)}><rect x="4" y="2" width="16" height="20" rx="1"/><path d="M9 22v-4h6v4M8 6h.01M12 6h.01M16 6h.01M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M16 14h.01"/></svg>);
export const IconDollar      = (p: P) => (<svg {...base(p)}><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>);
export const IconBank        = (p: P) => (<svg {...base(p)}><path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3"/></svg>);
export const IconHistory     = (p: P) => (<svg {...base(p)}><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5M12 7v5l4 2"/></svg>);
export const IconChart       = (p: P) => (<svg {...base(p)}><path d="M3 3v18h18"/><path d="M18 17V9M13 17V5M8 17v-3"/></svg>);
export const IconLink        = (p: P) => (<svg {...base(p)}><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>);
export const IconShield      = (p: P) => (<svg {...base(p)}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>);
export const IconList        = (p: P) => (<svg {...base(p)}><path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/></svg>);
export const IconMenu        = (p: P) => (<svg {...base(p)}><path d="M3 6h18M3 12h18M3 18h18"/></svg>);
export const IconClose       = (p: P) => (<svg {...base(p)}><path d="M18 6 6 18M6 6l12 12"/></svg>);
export const IconChevronDown = (p: P) => (<svg {...base(p)}><path d="m6 9 6 6 6-6"/></svg>);
export const IconChevronLeft = (p: P) => (<svg {...base(p)}><path d="m15 18-6-6 6-6"/></svg>);
export const IconChevronRight= (p: P) => (<svg {...base(p)}><path d="m9 18 6-6-6-6"/></svg>);
export const IconBell        = (p: P) => (<svg {...base(p)}><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/></svg>);
export const IconEnvelope    = (p: P) => (<svg {...base(p)}><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/></svg>);
export const IconLogout      = (p: P) => (<svg {...base(p)}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>);
export const IconUser        = (p: P) => (<svg {...base(p)}><circle cx="12" cy="8" r="4"/><path d="M4 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/></svg>);
export const IconLock        = (p: P) => (<svg {...base(p)}><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>);
export const IconRefresh     = (p: P) => (<svg {...base(p)}><path d="M21 12a9 9 0 0 1-15.36 6.36L3 16M3 12a9 9 0 0 1 15.36-6.36L21 8"/><path d="M21 3v5h-5M3 21v-5h5"/></svg>);
export const IconSearch      = (p: P) => (<svg {...base(p)}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>);
export const IconCamera      = (p: P) => (<svg {...base(p)}><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3z"/><circle cx="12" cy="13" r="3"/></svg>);
export const IconCheck       = (p: P) => (<svg {...base(p)}><path d="M20 6 9 17l-5-5"/></svg>);
export const IconArrowLeft   = (p: P) => (<svg {...base(p)}><path d="M19 12H5M12 19l-7-7 7-7"/></svg>);
export const IconExternal    = (p: P) => (<svg {...base(p)}><path d="M15 3h6v6M10 14 21 3M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>);
export const IconLogo        = (p: P) => (<svg {...base(p)} strokeWidth={1.5}><path d="M6 3h12l4 6-10 12L2 9z"/><path d="M2 9h20M12 21 8 9l4-6 4 6z"/></svg>);
