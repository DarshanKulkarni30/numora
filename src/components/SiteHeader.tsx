"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { BRAND_NAME } from "@/lib/site";

type Props = {
  email?: string | null;
};

const TOP_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/profile", label: "Profile" },
  { href: "/learning", label: "Learning" },
  { href: "/pricing", label: "Plans" },
] as const;

const EXPLORE_LINKS = [
  { href: "/name", label: "Name" },
  { href: "/years", label: "Years" },
  { href: "/business", label: "Business" },
  { href: "/trivia", label: "Trivia" },
  { href: "/family", label: "Family" },
  { href: "/report/new", label: "New report" },
] as const;

function linkActive(pathname: string | null, href: string) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader({ email }: Props) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [mobileExploreOpen, setMobileExploreOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const panelId = useId();
  const exploreId = useId();
  const exploreRef = useRef<HTMLDivElement>(null);

  const exploreActive = EXPLORE_LINKS.some((l) =>
    linkActive(pathname, l.href),
  );

  useEffect(() => {
    setOpen(false);
    setExploreOpen(false);
    setMobileExploreOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!email) {
      setIsAdmin(false);
      return;
    }
    let cancelled = false;
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) setIsAdmin(Boolean(d.admin));
      })
      .catch(() => {
        if (!cancelled) setIsAdmin(false);
      });
    return () => {
      cancelled = true;
    };
  }, [email]);

  useEffect(() => {
    if (!open && !exploreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        setExploreOpen(false);
        setMobileExploreOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, exploreOpen]);

  useEffect(() => {
    if (!exploreOpen) return;
    const onPointer = (e: MouseEvent) => {
      if (
        exploreRef.current &&
        !exploreRef.current.contains(e.target as Node)
      ) {
        setExploreOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointer);
    return () => document.removeEventListener("mousedown", onPointer);
  }, [exploreOpen]);

  return (
    <header className="mx-auto w-full max-w-6xl px-5 py-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/nw-mark.png?v=3"
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
              {TOP_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={
                    linkActive(pathname, link.href)
                      ? "text-ink"
                      : "hover:text-gold-deep"
                  }
                >
                  {link.label}
                </Link>
              ))}

              <div className="relative" ref={exploreRef}>
                <button
                  type="button"
                  className={`inline-flex items-center gap-1 hover:text-gold-deep ${
                    exploreActive || exploreOpen ? "text-ink" : ""
                  }`}
                  aria-expanded={exploreOpen}
                  aria-controls={exploreId}
                  aria-haspopup="menu"
                  onClick={() => setExploreOpen((v) => !v)}
                >
                  Explore
                  <span aria-hidden className="text-[10px]">
                    {exploreOpen ? "▴" : "▾"}
                  </span>
                </button>
                {exploreOpen ? (
                  <div
                    id={exploreId}
                    role="menu"
                    className="absolute right-0 z-40 mt-2 min-w-[11rem] rounded-xl border border-[var(--line)] bg-paper py-1 shadow-lg"
                  >
                    {EXPLORE_LINKS.map((link) => (
                      <Link
                        key={link.href}
                        role="menuitem"
                        href={link.href}
                        className={`block px-4 py-2.5 hover:bg-mist/70 hover:text-ink ${
                          linkActive(pathname, link.href)
                            ? "bg-mist/50 text-ink"
                            : "text-ink-soft"
                        }`}
                        onClick={() => setExploreOpen(false)}
                      >
                        {link.label}
                      </Link>
                    ))}
                  </div>
                ) : null}
              </div>

              {isAdmin ? (
                <Link
                  href="/admin"
                  className={
                    pathname?.startsWith("/admin")
                      ? "text-ink"
                      : "hover:text-gold-deep"
                  }
                >
                  Admin
                </Link>
              ) : null}
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
            {TOP_LINKS.map((link) => (
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
              <button
                type="button"
                className="flex w-full items-center justify-between rounded-xl px-3 py-3 text-left text-ink-soft hover:bg-mist/60 hover:text-gold-deep"
                aria-expanded={mobileExploreOpen}
                onClick={() => setMobileExploreOpen((v) => !v)}
              >
                Explore
                <span aria-hidden className="text-xs">
                  {mobileExploreOpen ? "▴" : "▾"}
                </span>
              </button>
              {mobileExploreOpen ? (
                <ul className="mb-1 ml-2 border-l border-[var(--line)] pl-2">
                  {EXPLORE_LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="block rounded-xl px-3 py-2.5 text-ink-soft hover:bg-mist/60 hover:text-gold-deep"
                        onClick={() => setOpen(false)}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
            {isAdmin ? (
              <li>
                <Link
                  href="/admin"
                  className="block rounded-xl px-3 py-3 text-ink-soft hover:bg-mist/60 hover:text-gold-deep"
                  onClick={() => setOpen(false)}
                >
                  Admin
                </Link>
              </li>
            ) : null}
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
