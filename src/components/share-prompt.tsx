"use client";

import { sileo } from "sileo";

import styles from "./confirmation-page.module.css";

export function SharePrompt() {
  async function handleShare() {
    const shareUrl = window.location.origin;

    try {
      if (navigator.share) {
        await navigator.share({
          text: "Practice 1:1 interviews with professionals + AI on Bolda.",
          title: "Join the Bolda waitlist",
          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(shareUrl);
      sileo.success({
        description: "The Bolda waitlist link has been copied to your clipboard.",
        title: "Link copied",
      });
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      sileo.error({
        description: "We couldn't share the link right now. Please try again.",
        title: "Share failed",
      });
    }
  }

  return (
    <p className={styles.sharePrompt}>
      Know someone preparing for an interview?{" "}
      <button className={styles.shareButton} type="button" onClick={handleShare}>
        Share with them
      </button>
    </p>
  );
}
