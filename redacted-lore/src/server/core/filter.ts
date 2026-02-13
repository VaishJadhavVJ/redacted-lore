// src/server/core/filter.ts

export async function validateEntry(text: string): Promise<{ valid: boolean; reason?: string }> {
  
  // --- LAYER 1: THE MATH CHECK (Instant) ---
  
  // 1. Minimum Length (prevent "hi")
  if (text.length < 2) {
    return { valid: false, reason: "Too short. Write a sentence." };
  }

  // 2. Spam Repetition (prevent "aaaaaaaaaa")
  if (/(.)\1{4,}/.test(text)) {
    return { valid: false, reason: "Repetitive text detected." };
  }

  // 3. Consonant Clusters (prevent "sdfsdfdf")
  // FIX: Removed 'y' from this list so "Rhythm" is valid.
  // We now only flag 5+ strictly non-y consonants in a row.
  if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(text)) {
    return { valid: false, reason: "Unreadable text detected." };
  }

  // 4. Word Count (prevent "Supercalifragilistic...")
  // A story line should usually have spaces if it's long.
  if (text.length > 20 && !text.includes(' ')) {
    return { valid: false, reason: "Use spaces." };
  }

  // --- LAYER 2: THE AI CHECK (Simulated for now) ---
  
  await new Promise(resolve => setTimeout(resolve, 1500)); // 1.5s delay to show animation

  return { valid: true };
}