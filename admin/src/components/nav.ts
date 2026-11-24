import { ComponentType, SVGProps } from "react";
import {
  IconSpeedometer, IconUsers, IconDiamond, IconBuilding,
  IconDollar, IconBank, IconHistory, IconChart, IconLink, IconShield,
} from "./Icons";

type Icon = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;

export type NavItem =
  | { type: "title"; label: string }
  | { type: "link"; to: string; label: string; icon: Icon; badge?: { text: string; tone: string } }
  | { type: "group"; label: string; icon: Icon; children: { to: string; label: string }[] };

export const NAV: NavItem[] = [
  { type: "link",  to: "/", label: "Dashboard", icon: IconSpeedometer },

  { type: "title", label: "Compliance" },
  { type: "group", label: "KYC", icon: IconShield, children: [
    { to: "/kyc",        label: "KYC Management" },
    { to: "/kyc/status", label: "KYC Status" },
  ]},
  { type: "link",  to: "/users", label: "Users", icon: IconUsers },

  { type: "title", label: "Assets" },
  { type: "link",  to: "/investments", label: "Investments", icon: IconDiamond },
  { type: "link",  to: "/bookings",    label: "Bookings",    icon: IconBuilding },

  { type: "title", label: "Finance" },
  { type: "link",  to: "/revenue", label: "Revenue Analytics", icon: IconDollar },
  { type: "group", label: "Settlements", icon: IconBank, children: [
    { to: "/settlements",         label: "Payout Control" },
    { to: "/settlements/history", label: "Settlement History" },
  ]},

  { type: "title", label: "Operations" },
  { type: "link",  to: "/snapshot-performance", label: "Snapshot & Performance", icon: IconChart },
  { type: "link",  to: "/oracle",               label: "Oracle & Engine",        icon: IconLink },
];

/** Route → breadcrumb trail */
const CRUMBS: { match: RegExp; trail: string[] }[] = [
  { match: /^\/$/,                     trail: ["Dashboard"] },
  { match: /^\/kyc$/,                  trail: ["Compliance", "KYC Management"] },
  { match: /^\/kyc\/status$/,          trail: ["Compliance", "KYC Status"] },
  { match: /^\/kyc\/[^/]+$/,           trail: ["Compliance", "KYC Management", "Review"] },
  { match: /^\/users$/,                trail: ["Compliance", "Users"] },
  { match: /^\/investments$/,          trail: ["Assets", "Investments"] },
  { match: /^\/bookings$/,             trail: ["Assets", "Bookings"] },
  { match: /^\/revenue$/,              trail: ["Finance", "Revenue Analytics"] },
  { match: /^\/settlements$/,          trail: ["Finance", "Payout Control"] },
  { match: /^\/settlements\/history$/, trail: ["Finance", "Settlement History"] },
  { match: /^\/snapshot-performance$/, trail: ["Operations", "Snapshot & Performance"] },
  { match: /^\/oracle$/,               trail: ["Operations", "Oracle & Engine"] },
];

export const breadcrumbFor = (path: string) =>
  CRUMBS.find(c => c.match.test(path))?.trail ?? [];


/** Is a nav target active for the current path? (/kyc also covers /kyc/:id detail pages) */
export const isActivePath = (to: string, path: string) =>
  to === "/kyc"
    ? path === "/kyc" || (/^\/kyc\/[^/]+$/.test(path) && path !== "/kyc/status")
    : path === to;
