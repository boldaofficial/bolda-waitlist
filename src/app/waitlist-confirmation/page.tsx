import type { Metadata } from "next";

import { ConfirmationPage } from "@/components/confirmation-page";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "You’re On The Waitlist",
  description:
    "You’ve joined the Bolda waitlist. Follow along to stay updated and be the first to know when Bolda launches.",
  alternates: {
    canonical: absoluteUrl("/waitlist-confirmation"),
  },
  robots: {
    follow: true,
    index: false,
    googleBot: {
      follow: true,
      index: false,
    },
  },
};

export default function WaitlistConfirmation() {
  return <ConfirmationPage />;
}
