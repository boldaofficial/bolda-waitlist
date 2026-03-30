import Image from "next/image";

import { NavigationBar } from "@/components/navigation-bar";
import { SharePrompt } from "@/components/share-prompt";
import { ViewportFrame } from "@/components/viewport-frame";
import { siteConfig } from "@/lib/site";

import styles from "./confirmation-page.module.css";

type SocialTextLinkProps = {
  href: string;
  label: string;
};

function SocialTextLink({ href, label }: SocialTextLinkProps) {
  if (!href || href === "#") {
    return <span className={styles.socialTextPlaceholder}>{label}</span>;
  }

  return (
    <a className={styles.socialTextLink} href={href} rel="noreferrer" target="_blank">
      {label}
    </a>
  );
}

export function ConfirmationPage() {
  return (
    <ViewportFrame>
      <section className={styles.page}>
        <NavigationBar
          actionHref="/#waitlist-form"
          actionLabel="Join waitlist"
          className={styles.navigation}
          fullWidth
        />

        <div className={styles.content}>
          <div className={styles.copyGroup}>
            <Image alt="" height={125} priority src="/assets/joined-waitlist-svg.svg" width={102} />

            <div className={styles.copyGroup}>
              <h1 className={styles.heading}>You’re on the waitlist!</h1>
              <p className={styles.body}>
                Follow us to stay updated and be the first to know when we launch
              </p>
            </div>
          </div>

          <div className={styles.socialTextLinks}>
            <SocialTextLink href={siteConfig.social.linkedin} label="LinkedIn" />
            <SocialTextLink href={siteConfig.social.x} label="Twitter/X" />
            <SocialTextLink href={siteConfig.social.instagram} label="Instagram" />
          </div>
        </div>

        <SharePrompt />
      </section>
    </ViewportFrame>
  );
}
