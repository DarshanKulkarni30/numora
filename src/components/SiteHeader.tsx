"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { BRAND_NAME } from "@/lib/site";

type Props = {
  email?: string | null;
};

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/name", label: "Name" },
  { href: "/business", label: "Business" },
  { href: "/trivia", label: "Trivia" },
  { href: "/family", label: "Family" },
  { href: "/pricing", label: "Plans" },
  { href: "/report/new", label: "New report" },
] as const;

export function SiteHeader({ email }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="mx-auto w-full max-w-6xl px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/nw-mark.png?v=2"
            alt={BRAND_NAME}
            width={36}
            height={36}
            className="h-9 w-9 shrink-0"
            priority
          />
          <span className="brand text-xl text-ink sm:text-2xl">{BRAND_NAME}</span>
        </Link>

        {!email ? (
          <Link
            href="/login"
            className="rounded-full bg-sea px-4 py-2 text-sm text-paper transition hover:bg-sea-deep"
          >
            Sign in
          </Link>
        ) : (
          <>
            <nav
              className="hidden items-center gap-4 text-sm text-ink-soft lg:flex"
              aria-label="Main"
            >
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="hover:text-gold-deep"
                >
                  {link.label}
                </Link>
              ))}
              <form action="/auth/signout" method="post">
                <button type="submit" className="hover:text-gold-deep">
                  Sign out
                </button>
              </form>
            </nav>

            <button
              type="button"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] bg-white/70 text-ink lg:hidden"
              aria-expanded={open}
              aria-controls={panelId}
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              <span aria-hidden className="text-lg leading-none">
                {open ? "✕" : "☰"}
              </span>
            </button>
          </>
        )}
      </div>

      {email && open ? (
        <nav
          id={panelId}
          aria-label="Main mobile"
          className="mt-4 border-t border-[var(--line)] bg-paper/95 pt-2 lg:hidden"
        >
          <ul className="flex flex-col text-base text-ink">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="block rounded-xl px-3 py-3 text-ink-soft hover:bg-mist/60 hover:text-gold-deep"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="block w-full rounded-xl px-3 py-3 text-left text-ink-soft hover:bg-mist/60 hover:text-gold-deep"
                >
                  Sign out
                </button>
              </form>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
