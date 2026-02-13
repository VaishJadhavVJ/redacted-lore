import { InitResponse, LockResponse, SubmitResponse } from '../../shared/types/api';

// Simple wrapper to fetch data from our Devvit Backend
async function post<T>(url: string, body?: any): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body || {}),
  });
  return response.json();
}

async function get<T>(url: string): Promise<T> {
  const response = await fetch(url);
  return response.json();
}

// The 3 Commands our App needs:
export const api = {
  // 1. Load the Game
  init: () => get<InitResponse>('/api/init'),
  
  // 2. Try to get the "Atomic Lock"
  lock: () => post<LockResponse>('/api/lock'),
  
  // 3. Submit a new line
  submit: (text: string) => post<SubmitResponse>('/api/submit', { text }),
};