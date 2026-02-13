
export const PROMPTS = [
  "The day the internet stopped working forever.",
  "You found a door in your house that wasn't there yesterday.",
  "A cat that can predict the stock market.",
  "The last text message you received is now a law.",
  "Someone left a mysterious box on your porch.",
  "It was a dark and stormy night, but the rain was purple.",
  "You wake up, but everyone else is frozen in time.",
  "The coffee machine started speaking binary.",
  "Your reflection in the mirror just blinked at you.",
  "Gravity reversed for exactly 10 seconds."
];

export function getRandomPrompt(): string {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)] || "The story begins...";
}