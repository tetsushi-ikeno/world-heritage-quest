const nativeFetch = globalThis.fetch;
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function withHeaders(init = {}) {
  const headers = new Headers(init.headers || {});
  if (!headers.has('User-Agent')) {
    headers.set('User-Agent', 'world-heritage-quest/1.0 (educational project; GitHub tetsushi-ikeno/world-heritage-quest)');
  }
  headers.set('Accept', headers.get('Accept') || '*/*');
  return { ...init, headers };
}

globalThis.fetch = async function fetchWithRetry(input, init = {}) {
  let lastError;
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      const res = await nativeFetch(input, withHeaders(init));
      if (res.ok || (res.status < 500 && res.status !== 429)) return res;
      const retryAfter = Number(res.headers.get('retry-after') || 0);
      const waitMs = retryAfter > 0
        ? retryAfter * 1000
        : Math.min(30000, 1500 * (2 ** attempt));
      console.warn(`HTTP ${res.status}; retry ${attempt + 1}/8 after ${waitMs}ms: ${String(input)}`);
      await sleep(waitMs);
    } catch (err) {
      lastError = err;
      const waitMs = Math.min(30000, 1500 * (2 ** attempt));
      console.warn(`Fetch error; retry ${attempt + 1}/8 after ${waitMs}ms: ${err.message}`);
      await sleep(waitMs);
    }
  }
  if (lastError) throw lastError;
  return nativeFetch(input, withHeaders(init));
};

await import('./collect-heritage-images.mjs');
