const express = require('express');
const xlsx = require('xlsx');
const path = require('path');

const app = express();
app.use(express.json());

// Load the Excel file
const workbook = xlsx.readFile(path.join(__dirname, 'TestData.xlsx'));
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Convert sheet data to JSON
const data = xlsx.utils.sheet_to_json(worksheet);

// Define the API endpoint
app.post('/get-company-data', (req, res) => {
  const { companyName } = req.body;

  if (!companyName) {
    return res.status(400).json({ error: 'Company name is required' });
  }

  // Filter rows for the requested company name
  const companyData = data.find(row => row['Company Name'] === companyName);

  if (companyData) {
    res.json(companyData);
  } else {
    res.status(404).json({ error: 'Company not found' });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
