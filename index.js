const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs-extra');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

app.use(cors());
app.use(bodyParser.json());

// Переконаємось, що папка data існує
fs.ensureDirSync(DATA_DIR);

// Допоміжні функції
const getFilePath = (collection) => path.join(DATA_DIR, `${collection}.json`);
const readData = (collection) => fs.readJsonSync(getFilePath(collection), { throws: false }) || {};
const writeData = (collection, data) => fs.writeJsonSync(getFilePath(collection), data, { spaces: 2 });

// CRUD ендпоінти

// Створити / оновити документ
app.post('/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const data = readData(collection);
  data[id] = req.body;
  writeData(collection, data);
  res.json({ success: true, data: data[id] });
});

// Отримати документ
app.get('/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const data = readData(collection);
  if (data[id]) {
    res.json({ success: true, data: data[id] });
  } else {
    res.status(404).json({ success: false, message: "Document not found" });
  }
});

// Отримати всі документи
app.get('/:collection', (req, res) => {
  const { collection } = req.params;
  const data = readData(collection);
  res.json({ success: true, data });
});

// Видалити документ
app.delete('/:collection/:id', (req, res) => {
  const { collection, id } = req.params;
  const data = readData(collection);
  if (data[id]) {
    delete data[id];
    writeData(collection, data);
    res.json({ success: true });
  } else {
    res.status(404).json({ success: false, message: "Document not found" });
  }
});

app.listen(PORT, () => {
  console.log(`MgDB running on http://localhost:${PORT}`);
});
