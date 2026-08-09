/** Lightweight content guard for generated report text. */

const BLOCKED =
  /\b(stupid|idiot|dumb|ugly|fatshamed|worthless|cursed|unlucky|doomed|hate|kill|suicide|retard|cripple|slave|inferior|superior|racist|slut|whore|bastard|fuck|shit|bitch|asshole|nazi|terrorist|molest|rape|guaranteed success|definitely will|born bad|bad blood)\b/i;

export function assertSafeCopy(text: string, context: string): string {
  if (BLOCKED.test(text)) {
    throw new Error(
      `Unsafe or inappropriate language detected in ${context}. Generation stopped.`,
    );
  }
  return text;
}

export function assertSafeList(items: string[], context: string): string[] {
  return items.map((item, i) => assertSafeCopy(item, `${context}[${i}]`));
}
