"use client";

import { startTransition, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { sileo } from "sileo";

import { AvatarStack } from "@/components/avatar-stack";
import { NavigationBar } from "@/components/navigation-bar";
import { ViewportFrame } from "@/components/viewport-frame";

import styles from "./landing-page.module.css";

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LandingPage() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasTriedSubmit, setHasTriedSubmit] = useState(false);
  const [hasBlurredEmail, setHasBlurredEmail] = useState(false);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const redirectTimerRef = useRef<number | null>(null);
  const router = useRouter();

  const normalizedEmail = email.trim().toLowerCase();
  const isEmailValid = emailPattern.test(normalizedEmail);
  const isFormValid = fullName.trim().length > 1 && isEmailValid;
  const showEmailError = Boolean(normalizedEmail) && (hasBlurredEmail || hasTriedSubmit) && !isEmailValid;

  useEffect(() => {
    return () => {
      if (redirectTimerRef.current) {
        window.clearTimeout(redirectTimerRef.current);
      }
    };
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setHasTriedSubmit(true);

    if (!isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/waitlist", {
        body: JSON.stringify({
          email,
          fullName,
          role,
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });

      const payload = (await response.json().catch(() => null)) as { error?: string } | null;

      if (!response.ok) {
        throw new Error(payload?.error || "We couldn't join the waitlist right now.");
      }

      sileo.success({
        title: "You're on the waitlist!",
      });

      redirectTimerRef.current = window.setTimeout(() => {
        startTransition(() => {
          router.replace("/waitlist-confirmation");
        });
      }, 2600);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We couldn't join the waitlist right now. Please try again.";

      sileo.error({
        description: message,
        title: message === "This email is already on the waitlist." ? "Already joined" : "Unable to join waitlist",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ViewportFrame>
      <section className={styles.page}>
        <NavigationBar
          actionLabel="Join waitlist"
          className={styles.navigation}
          onActionClick={() => nameInputRef.current?.focus()}
          showSocialLinks
        />

        <div className={styles.hero}>
          <h1 className={styles.headline}>
            <span className={styles.headlineLine}>Practice 1:1 interviews with professionals & AI</span>
            <span className={styles.headlineSecondLine}>Get hired</span>
          </h1>

          <div className={styles.subline}>
            <AvatarStack />
            <span className={styles.sublineText}>Join 120+ candidates already on the waitlist!</span>
          </div>
        </div>

        <form className={styles.form} id="waitlist-form" onSubmit={handleSubmit}>
          <label className="srOnly" htmlFor="full-name">
            Full name
          </label>
          <input
            id="full-name"
            ref={nameInputRef}
            autoComplete="name"
            className={styles.field}
            name="fullName"
            onChange={(event) => setFullName(event.target.value)}
            placeholder="Full name"
            type="text"
            value={fullName}
          />

          <label className="srOnly" htmlFor="email-address">
            Email address
          </label>
          <input
            id="email-address"
            autoComplete="email"
            aria-invalid={showEmailError}
            className={`${styles.field} ${showEmailError ? styles.fieldInvalid : ""}`}
            name="email"
            onBlur={() => setHasBlurredEmail(true)}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email address"
            type="email"
            value={email}
          />

          <label className="srOnly" htmlFor="role">
            Role
          </label>
          <input
            id="role"
            autoComplete="organization-title"
            className={styles.field}
            name="role"
            onChange={(event) => setRole(event.target.value)}
            placeholder="Role (optional)"
            type="text"
            value={role}
          />

          <button className={styles.submitButton} disabled={!isFormValid || isSubmitting} type="submit">
            {isSubmitting ? "Joining..." : "Join the waitlist"}
          </button>
        </form>

        <p aria-live="polite" className={styles.formError} role={showEmailError ? "alert" : undefined}>
          {showEmailError ? "Enter a valid email" : ""}
        </p>
      </section>
    </ViewportFrame>
  );
}
