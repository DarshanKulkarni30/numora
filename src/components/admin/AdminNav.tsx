"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminRole } from "@/lib/admin/rbac";
import { can } from "@/lib/admin/rbac";

const LINKS: Array<{
  href: string;
  label: string;
  action?: Parameters<typeof can>[1];
}> = [
  { href: "/admin", label: "Overview" },
  { href: "/admin/users", label: "Users", action: "read_users" },
  { href: "/admin/activity", label: "Activity", action: "read_activity" },
  { href: "/admin/audit", label: "Audit", action: "read_audit" },
  { href: "/admin/trends", label: "Trends", action: "read_trends" },
  { href: "/admin/research", label: "Research", action: "read_research" },
  { href: "/admin/billing", label: "Billing", action: "read_billing" },
  { href: "/admin/issues", label: "Issues", action: "manage_issues" },
  { href: "/admin/vercel", label: "Vercel", action: "read_vercel" },
  { href: "/admin/settings", label: "Settings", action: "manage_admins" },
];

export function AdminNav({
  role,
}: {
  role: AdminRole;
}) {
  const pathname = usePathname() || "/admin";
  return (
    <aside className="w-full shrink-0 lg:w-52">
      <p className="mb-3 text-[10px] uppercase tracking-wider text-ink-soft">
        Admin · {role}
      </p>
      <nav className="flex flex-wrap gap-1 lg:flex-col">
        {LINKS.filter((l) => !l.action || can(role, l.action)).map((l) => {
          const active =
            l.href === "/admin"
              ? pathname === "/admin"
              : pathname === l.href || pathname.startsWith(`${l.href}/`);
          return (
            <Link
              key={l.href}
              href={l.href}
              className={`btn-tactile rounded-lg px-3 py-2 text-sm ${
                active
                  ? "bg-sea text-paper"
                  : "text-ink-soft hover:bg-mist hover:text-ink"
              }`}
            >
              {l.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
