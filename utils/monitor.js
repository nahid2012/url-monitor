// utils/monitor.js
const checkUrl = async (link) => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

  try {
    const response = await fetch(link.url, {
      signal: controller.signal,
      redirect: 'follow', // follow 301/302 redirects
      headers: { 'User-Agent': 'URL-Monitor/1.0' } // prevent blocking
    });

    console.log(`[CHECK] ${link.url} responded with status ${response.status}`);
    link.status = response.ok ? 'up' : 'down';
    link.lastHttpStatus = response.status;
    link.lastError = null; // no error
  } catch (err) {
    console.log(`[ERROR] Failed to check ${link.url}: ${err.message}`);
    link.status = 'down';
    link.lastHttpStatus = null;
    link.lastError = err.message;
  } finally {
    clearTimeout(timeout);
    link.lastChecked = new Date().toISOString(); // store UTC internally
  }

  return link;
};

// Check all links in batches
const checkAllLinks = async (links, batchSize = 5) => {
  for (let i = 0; i < links.length; i += batchSize) {
    const batch = links.slice(i, i + batchSize);
    await Promise.all(batch.map(checkUrl));
  }
  return links;
};

module.exports = { checkUrl, checkAllLinks };