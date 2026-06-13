/**
 * Address normalization utilities for case-insensitive comparison.
 * GenLayer addresses may come in different casings from different sources.
 */

export function normalizeAddress(addr: string | undefined | null): string {
  if (!addr) return "";
  return addr.toLowerCase();
}

export function addressEquals(
  a: string | undefined | null,
  b: string | undefined | null
): boolean {
  if (!a || !b) return false;
  return normalizeAddress(a) === normalizeAddress(b);
}

export function shortenAddress(addr: string): string {
  if (!addr) return "";
  if (addr.length <= 10) return addr;
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
}

export function isValidAddress(addr: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(addr);
}
