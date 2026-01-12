const express = require('express');
const { v4: uuidv4 } = require('uuid');
const auth = require('../middlewares/auth');
const { read, write } = require('../utils/file');
const { checkUrl, checkAllLinks } = require('../utils/monitor');

const router = express.Router();

// Helper to convert UTC to local time string
const toLocalTime = (utcString) => {
  if (!utcString) return null;
  return new Date(utcString).toLocaleString(); // user's local time
};

// Create link
router.post('/', auth, async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'Missing URL' });

  let links = await read('links');
  const link = { id: uuidv4(), userId: req.user.id, url, status: 'unknown', lastChecked: null, lastHttpStatus: null, lastError: null };
  links.push(link);
  await write('links', links);

  // Check immediately
  await checkUrl(link);
  await write('links', links);

  res.json({ message: 'Link created and checked', link });
});

// Delete link
router.delete('/:id', auth, async (req, res) => {
  let links = await read('links');
  const index = links.findIndex(l => l.id === req.params.id && l.userId === req.user.id);
  if (index === -1) return res.status(404).json({ error: 'Link not found' });
  links.splice(index, 1);
  await write('links', links);
  res.json({ message: 'Link deleted' });
});

// Get user links (with local time)
router.get('/', auth, async (req, res) => {
  const links = (await read('links'))
    .filter(l => l.userId === req.user.id)
    .map(l => ({
      ...l,
      lastChecked: toLocalTime(l.lastChecked) // convert UTC to local
    }));

  res.json({ links });
});

// Background URL check every 1 min
const backgroundCheck = async () => {
  let links = await read('links');
  links = await checkAllLinks(links, 5); // batch of 5 links at a time
  await write('links', links);
  console.log(`[BACKGROUND] Checked ${links.length} links at ${new Date().toLocaleString()}`);
};
setInterval(backgroundCheck, 60 * 1000);

module.exports = router;
