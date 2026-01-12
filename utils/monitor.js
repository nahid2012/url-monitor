const fetch = require('node-fetch');

// Check a single URL
const checkUrl = async (link) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000); // 8s timeout

    const response = await fetch(link.url, { signal: controller.signal });
    clearTimeout(timeout);

    link.status = response.ok ? 'up' : 'down';
  } catch (err) {
    link.status = 'down';
  }
  link.lastChecked = new Date().toISOString();
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
