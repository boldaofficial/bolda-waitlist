const rawSiteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

export const siteConfig = {
  name: "Bolda",
  title: "Bolda Waitlist",
  description:
    "Practice 1:1 interviews with professionals and AI. Join the Bolda waitlist and be first to know when we launch.",
  siteUrl: rawSiteUrl.replace(/\/+$/, ""),
  ogImage: "/og-image.png",
  social: {
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() || "",
    x: process.env.NEXT_PUBLIC_X_URL?.trim() || "",
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "",
  },
};

export function absoluteUrl(path = "/") {
  return new URL(path, `${siteConfig.siteUrl}/`).toString();
}
