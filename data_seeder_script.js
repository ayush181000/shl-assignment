const fs = require('fs');
const xlsx = require('xlsx');
const { MongoClient } = require('mongodb');

// Connection URI
const uri = 'mongodb+srv://ayush123:ayush123@cluster0.wjuoubl.mongodb.net/shl';

// Create a MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

// Excel file path
const excelFilePath = './file.xlsx';

// Function to read Excel file and insert into MongoDB
async function processExcelData() {
    try {
        // Connect to the MongoDB server
        await client.connect();
        console.log('Connected to the database');

        // Read the Excel file
        const workbook = xlsx.readFile(excelFilePath);
        const sheetName = workbook.SheetNames[0];
        const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

        // Get the MongoDB collection
        const collection = client.db().collection('shl');

        // Insert data into MongoDB
        await collection.insertMany(excelData);
        console.log('Data inserted into MongoDB');

    } catch (err) {
        console.error('Error:', err);
    } finally {
        // Close the MongoDB connection
        await client.close();
        console.log('Disconnected from the database');
    }
}

// Call the function to process Excel data
processExcelData();
