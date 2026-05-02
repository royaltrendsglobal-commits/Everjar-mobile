export interface Note {
  id: string;
  text: string;
  date: string; // ISO date string
  isLocked: boolean;
  unlockDate?: string; // for future notes
}