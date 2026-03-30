"use client";

import Image from "next/image";
import Link from "next/link";
import { FaInstagram, FaLinkedinIn, FaXTwitter } from "react-icons/fa6";

import { siteConfig } from "@/lib/site";

import styles from "./navigation-bar.module.css";

type NavigationBarProps = {
  actionHref?: string;
  actionLabel: string;
  className?: string;
  fullWidth?: boolean;
  onActionClick?: () => void;
  showSocialLinks?: boolean;
};

type SocialIconProps = {
  alt: string;
  href: string;
  icon: React.ReactNode;
};

function SocialIcon({ alt, href, icon }: SocialIconProps) {
  if (!href || href === "#") {
    return (
      <span aria-hidden="true" className={styles.iconPlaceholder}>
        {icon}
      </span>
    );
  }

  return (
    <a
      aria-label={alt}
      className={styles.iconLink}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {icon}
    </a>
  );
}

export function NavigationBar({
  actionHref,
  actionLabel,
  className,
  fullWidth = false,
  onActionClick,
  showSocialLinks = false,
}: NavigationBarProps) {
  return (
    <div className={`${styles.nav} ${fullWidth ? styles.fullWidth : ""} ${className ?? ""}`.trim()}>
      <Link aria-label="Bolda home" className={styles.logoWrap} href="/">
        <Image alt="Bolda" height={20} priority src="/assets/logo-b-full.svg" width={118} />
      </Link>

      <div
        className={`${styles.rightGroup} ${showSocialLinks ? styles.rightGroupWithSocial : ""}`.trim()}
      >
        {showSocialLinks ? (
          <>
            <SocialIcon
              alt="Bolda on LinkedIn"
              href={siteConfig.social.linkedin}
              icon={<FaLinkedinIn className={styles.iconGlyph} />}
            />
            <SocialIcon
              alt="Bolda on X"
              href={siteConfig.social.x}
              icon={<FaXTwitter className={styles.iconGlyph} />}
            />
            <SocialIcon
              alt="Bolda on Instagram"
              href={siteConfig.social.instagram}
              icon={<FaInstagram className={styles.iconGlyph} />}
            />
          </>
        ) : null}

        {onActionClick ? (
          <button className={styles.actionButton} type="button" onClick={onActionClick}>
            {actionLabel}
          </button>
        ) : (
          <Link className={styles.actionLink} href={actionHref ?? "/"}>
            {actionLabel}
          </Link>
        )}
      </div>
    </div>
  );
}
