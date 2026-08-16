/**
 * @deprecated Prefer resolveEntitlements(). Kept for gradual migration.
 */
import { resolveEntitlements } from "@/lib/entitlements";

export function maxFamilyMembers(email?: string | null): number {
  return resolveEntitlements(email).maxFamily;
}

export function maxPeopleSlots(email?: string | null): number {
  return resolveEntitlements(email).maxPeople;
}
