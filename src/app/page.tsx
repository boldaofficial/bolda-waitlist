import type { Metadata } from "next";

import { LandingPage } from "@/components/landing-page";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Practice 1:1 Interviews With Professionals + AI and Get Hired",
  description:
    "Bolda helps you practice 1:1 Interviews with AI and Professionals from leading companies and get hired. Join the Bolda waitlist to get launch updates the moment Bolda goes live.",
  alternates: {
    canonical: absoluteUrl("/"),
  },
};

export default function Home() {
  return <LandingPage />;
}
