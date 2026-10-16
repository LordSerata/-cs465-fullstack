// Builds fake tokens for tests. The signature part is junk, which is fine
// because the browser only reads the payload; the server checks signatures.
export function makeToken(payload: object): string {
  const b64 = (o: object) => btoa(JSON.stringify(o)).replace(/=+$/, '');
  return `${b64({ alg: 'HS256', typ: 'JWT' })}.${b64(payload)}.fakesignature`;
}

export const nowSeconds = () => Math.floor(Date.now() / 1000);

export const validToken = () =>
  makeToken({ email: 'admin@travlr.com', name: 'Admin', exp: nowSeconds() + 3600 });

export const expiredToken = () =>
  makeToken({ email: 'admin@travlr.com', name: 'Admin', exp: nowSeconds() - 60 });

// Fake localStorage that lives only in memory
export class MockStorage {
  private data = new Map<string, string>();
  getItem(key: string) { return this.data.has(key) ? this.data.get(key)! : null; }
  setItem(key: string, value: string) { this.data.set(key, value); }
  removeItem(key: string) { this.data.delete(key); }
  clear() { this.data.clear(); }
}
