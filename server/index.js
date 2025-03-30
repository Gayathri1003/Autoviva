// server/index.js
const express = require('express');
const PDFServicesSdk = require('@adobe/pdfservices-node-sdk');
const AdmZip = require('adm-zip');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const axios = require('axios');

// Configure multer for file uploads
const upload = multer({ dest: 'uploads/' });

const app = express();
app.use(cors());
app.use(express.json());

// Adobe PDF Services API credentials
const CLIENT_ID = 'b78b08f6e46343a9be23cd6190d1a8de';
const CLIENT_SECRET = 'p8e-Selp0yiUgUI4QQw3qrHbP9hQJ0YR_05x';

// Function to fetch OAuth access token
async function getAccessToken(clientId, clientSecret) {
  try {
    const response = await axios.post(
      'https://ims-na1.adobelogin.com/ims/token/v3',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: clientId,
        client_secret: clientSecret,
        scope: 'openid,AdobeID,read_organizations'
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.response ? error.response.data : error.message);
    throw new Error('Failed to fetch access token');
  }
}

// Configure Adobe PDF Services SDK with the access token
async function createExecutionContext() {
  const accessToken = await getAccessToken(CLIENT_ID, CLIENT_SECRET);

  const credentials = PDFServicesSdk.Credentials.builder()
    .withOAuthServerToServerCredentials(accessToken)
    .build();

  return PDFServicesSdk.ExecutionContext.create(credentials);
}

// Endpoint to extract text from PDF
app.post('/extract-text', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const inputFilePath = req.file.path;
    const outputZipPath = path.join(__dirname, 'output.zip');

    // Create an ExecutionContext with the access token
    const executionContext = await createExecutionContext();

    // Create a new Extract PDF operation
    const extractPDFOperation = PDFServicesSdk.ExtractPDF.Operation.createNew();
    const input = PDFServicesSdk.FileRef.createFromLocalFile(inputFilePath);
    extractPDFOperation.setInput(input);

    // Configure the extraction options
    extractPDFOperation.setOptions(
      PDFServicesSdk.ExtractPDF.options.ExtractPDFOptions.Builder()
        .addElementsToExtract(PDFServicesSdk.ExtractPDF.options.ElementsToExtract.TEXT)
        .build()
    );

    // Execute the operation
    const result = await extractPDFOperation.execute(executionContext);
    await result.saveAsFile(outputZipPath);

    // Extract the JSON from the ZIP file
    const zip = new AdmZip(outputZipPath);
    const zipEntries = zip.getEntries();
    const jsonEntry = zipEntries.find(entry => entry.entryName === 'structuredData.json');
    if (!jsonEntry) {
      throw new Error('structuredData.json not found in ZIP');
    }

    const jsonData = JSON.parse(zip.readAsText(jsonEntry));
    let extractedText = '';

    // Extract text from the JSON
    if (jsonData.elements) {
      jsonData.elements.forEach(element => {
        if (element.Text) {
          extractedText += element.Text + '\n';
        }
      });
    }

    // Clean up files
    fs.unlinkSync(inputFilePath);
    fs.unlinkSync(outputZipPath);

    res.json({ text: extractedText });
  } catch (error) {
    console.error('Error extracting text from PDF:', error);
    res.status(500).json({ error: 'Failed to extract text from PDF' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});