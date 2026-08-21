const nativeFetch = globalThis.fetch;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
let nextAllowedAt = 0;

function withHeaders(init = {}) {
  const headers = new Headers(init.headers || {});
  if (!headers.has('User-Agent')) {
    headers.set('User-Agent', 'world-heritage-quest/1.0 (educational project; GitHub tetsushi-ikeno/world-heritage-quest)');
  }
  headers.set('Accept', headers.get('Accept') || '*/*');
  return { ...init, headers };
}

async function throttle() {
  const now = Date.now();
  if (now < nextAllowedAt) await sleep(nextAllowedAt - now);
  nextAllowedAt = Date.now() + 1400;
}

globalThis.fetch = async function fetchWithRetry(input, init = {}) {
  let lastError;
  for (let attempt = 0; attempt < 6; attempt++) {
    await throttle();
    try {
      const res = await nativeFetch(input, withHeaders(init));
      if (res.ok || (res.status < 500 && res.status !== 429)) return res;
      const retryAfter = Number(res.headers.get('retry-after') || 0);
      const waitMs = retryAfter > 0
        ? retryAfter * 1000
        : Math.min(12000, 2000 * (attempt + 1));
      console.warn(`HTTP ${res.status}; retry ${attempt + 1}/6 after ${waitMs}ms: ${String(input)}`);
      await sleep(waitMs);
    } catch (err) {
      lastError = err;
      const waitMs = Math.min(12000, 2000 * (attempt + 1));
      console.warn(`Fetch error; retry ${attempt + 1}/6 after ${waitMs}ms: ${err.message}`);
      await sleep(waitMs);
    }
  }
  if (lastError) throw lastError;
  await throttle();
  return nativeFetch(input, withHeaders(init));
};

await import('./collect-heritage-images.mjs');
