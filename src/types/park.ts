/**
 * Core domain types for Park Quest.
 * Extend these as real park data is introduced.
 */
export interface Park {
  id: string;
  name: string;
  description: string;
  location: string;
}
