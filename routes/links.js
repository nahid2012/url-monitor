// const express = require('express');
// const fetch = require('node-fetch');
// const { v4: uuidv4 } = require('uuid');
// const { read, write } = require('../utils/file');
// const auth = require('../middlewares/auth');

// const router = express.Router();

// // Create link
// router.post('/', auth, (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'Missing URL' });

//   const links = read('links');
//   const link = { id: uuidv4(), userId: req.user.id, url, status: 'unknown', lastChecked: null };
//   links.push(link);
//   write('links', links);
//   res.json({ message: 'Link created', link });
// });

// // Delete link
// router.delete('/:id', auth, (req, res) => {
//   let links = read('links');
//   const index = links.findIndex(l => l.id === req.params.id && l.userId === req.user.id);
//   if (index === -1) return res.status(404).json({ error: 'Link not found' });
//   links.splice(index, 1);
//   write('links', links);
//   res.json({ message: 'Link deleted' });
// });

// // Get all links for user
// router.get('/', auth, (req, res) => {
//   const links = read('links').filter(l => l.userId === req.user.id);
//   res.json({ links });
// });

// // Check all links (simple ping)
// const checkLinks = async () => {
//   let links = read('links');
//   for (let link of links) {
//     try {
//       const res = await fetch(link.url);
//       link.status = res.ok ? 'up' : 'down';
//       link.lastChecked = new Date().toISOString();
//     } catch {
//       link.status = 'down';
//       link.lastChecked = new Date().toISOString();
//     }
//   }
//   write('links', links);
// };

// // Run check every 1 min
// setInterval(checkLinks, 60 * 1000);

// module.exports = router;





// Revised implementation with improved structure and error handling
// const express = require('express');
// const { v4: uuidv4 } = require('uuid');
// const auth = require('../middlewares/auth');
// const { read, write } = require('../utils/file');
// const { checkUrl, checkAllLinks } = require('../utils/monitor');

// const router = express.Router();

// // Create link
// router.post('/', auth, async (req, res) => {
//   const { url } = req.body;
//   if (!url) return res.status(400).json({ error: 'Missing URL' });

//   let links = await read('links');
//   const link = { id: uuidv4(), userId: req.user.id, url, status: 'unknown', lastChecked: null };
//   links.push(link);
//   await write('links', links);

//   // Check immediately
//   await checkUrl(link);
//   await write('links', links);

//   res.json({ message: 'Link created and checked', link });
// });

// // Delete link
// router.delete('/:id', auth, async (req, res) => {
//   let links = await read('links');
//   const index = links.findIndex(l => l.id === req.params.id && l.userId === req.user.id);
//   if (index === -1) return res.status(404).json({ error: 'Link not found' });
//   links.splice(index, 1);
//   await write('links', links);
//   res.json({ message: 'Link deleted' });
// });

// // Get user links
// router.get('/', auth, async (req, res) => {
//   const links = (await read('links')).filter(l => l.userId === req.user.id);
//   res.json({ links });
// });

// // Background URL check every 1 min
// const backgroundCheck = async () => {
//   let links = await read('links');
//   links = await checkAllLinks(links, 5); // batch of 5 links at a time
//   await write('links', links);
// };
// setInterval(backgroundCheck, 60 * 1000);

// module.exports = router;







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
