/** Minimal Vedic Square digit glyphs — Numora graha map (4 Rahu, 7 Ketu, 8 Shani). */

type Props = {
  digit: number;
  className?: string;
  title?: string;
};

export function VedicSquareGlyph({ digit, className = "", title }: Props) {
  const d = ((digit % 9) || 9) as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  const label = title ?? `Digit ${d} glyph`;

  return (
    <svg
      viewBox="0 0 40 40"
      className={className}
      role="img"
      aria-label={label}
    >
      <title>{label}</title>
      {d === 1 ? (
        // Surya ray
        <>
          <circle cx="20" cy="20" r="5" fill="none" stroke="currentColor" strokeWidth="1.4" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
            const r = (a * Math.PI) / 180;
            return (
              <line
                key={a}
                x1={20 + Math.cos(r) * 8}
                y1={20 + Math.sin(r) * 8}
                x2={20 + Math.cos(r) * 16}
                y2={20 + Math.sin(r) * 16}
                stroke="currentColor"
                strokeWidth="1.2"
                strokeLinecap="round"
              />
            );
          })}
        </>
      ) : null}
      {d === 2 ? (
        // Chandra crescent
        <path
          d="M26 10 A12 12 0 1 0 26 30 A8 8 0 1 1 26 10"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      ) : null}
      {d === 3 ? (
        // Guru spiral
        <path
          d="M20 28 C12 28 12 18 20 18 C26 18 26 24 20 24 C16 24 16 21 20 21"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : null}
      {d === 4 ? (
        // Rahu knot
        <>
          <circle cx="20" cy="20" r="9" fill="none" stroke="currentColor" strokeWidth="1.3" />
          <path
            d="M14 16 C18 12 22 12 26 16 M14 24 C18 28 22 28 26 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </>
      ) : null}
      {d === 5 ? (
        // Budh loop
        <path
          d="M12 22 C12 14 28 14 28 22 C28 28 20 30 20 24 C20 18 28 18 28 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : null}
      {d === 6 ? (
        // Shukra petal
        <path
          d="M20 30 C12 22 12 14 20 10 C28 14 28 22 20 30 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      ) : null}
      {d === 7 ? (
        // Ketu tear
        <path
          d="M20 8 C28 16 28 26 20 32 C12 26 12 16 20 8 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      ) : null}
      {d === 8 ? (
        // Shani square
        <rect
          x="11"
          y="11"
          width="18"
          height="18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          rx="1"
        />
      ) : null}
      {d === 9 ? (
        // Mangal flame
        <path
          d="M20 32 C12 26 13 18 20 8 C27 18 28 26 20 32 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        />
      ) : null}
    </svg>
  );
}
