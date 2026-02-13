export type LoreLine = {
  text: string;
  authorId: string;
  authorName: string;
  timestamp: number;
  flags: number; // For the 'Veto' system later
};

export type LockState = {
  userId: string;
  expiresAt: number;
};

// Response when the app loads
export type InitResponse = {
  type: 'init';
  postId: string;
  lines: LoreLine[];
  currentLock: LockState | null;
  username: string;
};

// Response when trying to lock the thread
export type LockResponse = {
  success: boolean;
  message?: string;
  expiresAt?: number;
};

// Response when submitting a line
export type SubmitResponse = {
  success: boolean;
  lines: LoreLine[];
};