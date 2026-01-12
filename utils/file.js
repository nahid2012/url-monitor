// const fs = require('fs');
// const path = require('path');

// const baseDir = path.join(__dirname, '..', 'data');

// const read = (file) => {
//   const filePath = path.join(baseDir, file + '.json');
//   if (!fs.existsSync(filePath)) return [];
//   const data = fs.readFileSync(filePath, 'utf-8');
//   return JSON.parse(data || '[]');
// };

// const write = (file, data) => {
//   const filePath = path.join(baseDir, file + '.json');
//   fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
// };

// module.exports = { read, write };







// Temporary stub implementation for file operations
const fs = require('fs').promises;
const path = require('path');

const baseDir = path.join(__dirname, '..', 'data');

const read = async (file) => {
  const filePath = path.join(baseDir, file + '.json');
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data || '[]');
  } catch (err) {
    return [];
  }
};

const write = async (file, data) => {
  const filePath = path.join(baseDir, file + '.json');
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
};

module.exports = { read, write };
