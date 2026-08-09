import Link from "next/link";

type Props = {
  email?: string | null;
};

export function SiteHeader({ email }: Props) {
  return (
    <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
      <Link href="/" className="brand text-2xl text-ink">
        Numora
      </Link>
      <nav className="flex items-center gap-4 text-sm text-ink-soft">
        {email ? (
          <>
            <Link href="/dashboard" className="hover:text-sea-deep">
              Dashboard
            </Link>
            <Link href="/report/new" className="hover:text-sea-deep">
              New report
            </Link>
            <form action="/auth/signout" method="post">
              <button type="submit" className="hover:text-sea-deep">
                Sign out
              </button>
            </form>
          </>
        ) : (
          <Link
            href="/login"
            className="rounded-full bg-sea px-4 py-2 text-paper transition hover:bg-sea-deep"
          >
            Sign in
          </Link>
        )}
      </nav>
    </header>
  );
}
