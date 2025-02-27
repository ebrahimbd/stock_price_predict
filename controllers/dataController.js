const fs = require('fs');
const { url } = require('inspector');
const path = require('path');
const xlsx = require('xlsx');
const axios = require('axios');
const { json } = require('stream/consumers');
require('dotenv').config();
const puppeteer = require('puppeteer');

const URL = process.env.URL;
const port = process.env.Port;


// Function to fetch data based on parameters and cookies, and save as JSON
async function fetchDataAndSave(symbol, fromTimestamp, toTimestamp, headers, res) {

    const url = `${URL}history?symbol=${symbol}&resolution=D&from=${fromTimestamp}&to=${toTimestamp}&dataType=0`;
  
    // const cookies = [
    // process.env.COOKIE1,
    // process.env.COOKIE2,
    // process.env.COOKIE3,
    // process.env.COOKIE4,
    // process.env.COOKIE5,
    // process.env.COOKIE6,
    // process.env.COOKIE7,
    // process.env.COOKIE8,
    // process.env.COOKIE9,
    // process.env.COOKIE10,
    // ];
    // const browser = await puppeteer.launch({ headless: false });
    // const page = await browser.newPage();
    // const domain = process.env.Domain;

    // const cookieObjects = cookies.map(cookieString => {
    //     const [name, ...rest] = cookieString.split('=');
    //     const value = rest.join('=').split(';')[0];
    //     return {
    //         name: name.trim(),
    //         value: value.trim(),
    //         domain: domain,  
    //         path: '/', // Adjust path as necessary
    //     };
    // });

    // for (const cookie of cookieObjects) {
    //     if (!cookie.name || !cookie.value || !cookie.domain || !cookie.path) {
    //         console.error('Invalid cookie fields:', cookie);
    //         return;
    //     }
    // }
    // await page.setCookie(...cookieObjects);
    // await page.goto(url, { waitUntil: 'networkidle2' });

    // const scrapedData = await page.evaluate(() => {
    //     return document.body.innerText; // Change to appropriate selector and data extraction logic
    // });

    // console.log(scrapedData);
    
    try {
 
        // const response = await axios.get(url, {
        //     headers: {
        //         'Cookie': cookies.join('; ')// Set cookies here
        //     }
        // });

        const response = await axios.get(url, {
                headers: headers
            });

       console.log(response.data);

        const newFolderPath = path.join(__dirname, '../save_file/json_data');
        fs.mkdirSync(newFolderPath, { recursive: true });
        // Save response data as JSON file
        const jsonData = response.data;
        const fileName = `${symbol}.json`;
        const outputPath = path.join(newFolderPath, fileName);

        fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
        
        await convart_excel(symbol, file_read(symbol, false, true))

        res.status(200).json({ message: 'Stock updated successfully' + `Data saved as JSON to: ${outputPath}` });
    } catch (error) {
        if (error.response) {
            res.status(500).json({
                'Request failed with status code:': error.response.status,
                'Response data': error.response.data
            });
        } else if (error.request) {
            res.status(500).json({ message: error.request });
        } else {
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}

function file_read(symbol, bool, res) {
    const filePath = path.join(__dirname, '../save_file/json_data');
    const fileName = `${symbol}.json`;
    const outputPath = path.join(filePath, fileName);
    const jsonData = fs.readFileSync(outputPath, 'utf8');
    const stockData = JSON.parse(jsonData);
    if (res) {
        return stockData
    }
    if (bool) {
        return outputPath
    }
}

async function get_stock_json_file(symbol, fromTimestamp, toTimestamp) {
    const stockData = file_read(symbol, false, true);
    // Convert to Date objects
    const fromDate = new Date(fromTimestamp * 1000); // Multiply by 1000 to convert to milliseconds
    const toDate = new Date(toTimestamp * 1000);
    // Format the dates
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    const fromDateString = fromDate.toLocaleString(undefined, options);
    const toDateString = toDate.toLocaleString(undefined, options);
    // console.log(`From: ${fromDateString}`);
    // console.log(`To: ${toDateString}`);
    return stockData

}

async function convart_excel(symbol, stockData) {
    const data = [];
    // Convert timestamps to dates and log the data
    stockData.t.forEach((timestamp, index) => {
        const date = new Date(timestamp * 1000);
        const formattedDate = date.toLocaleDateString();
        const openPrice = stockData.o[index];
        const closePrice = stockData.c[index];
        const highPrice = stockData.h[index];
        const lowPrice = stockData.l[index];
        const transactions = stockData.tr[index];
        const volume = stockData.v[index];
        const volumeThousands = stockData.vl[index];

        // Calculate Change in Price and Percentage Change
        const changePrice = closePrice - openPrice;
        const percentageChange = ((closePrice - openPrice) / openPrice) * 100;

        // Add the formatted data to the array
        data.push({
            'Date': formattedDate,
            'Close Price': closePrice,
            'Open Price': openPrice,
            'Change in Price': changePrice,
            'Percentage Change': percentageChange,
            'High Price': highPrice,
            'Low Price': lowPrice,
            'Transactions': transactions,
            'Volume': volume,
            'Volume in Thousands': volumeThousands
        });
        // console.log(`Date: ${formattedDate}, Open Price: ${openPrice}, Close Price: ${closePrice}, Volume: ${volume}`);
    });


    // Create a dictionary to save the data
    const save_file = {
        stock_data: data
    };

    // Path to the new folder where the Excel file will be saved
    const folderPath = path.join(__dirname, '../save_file');

    // Ensure the directory exists or create it
    fs.mkdirSync(folderPath, { recursive: true });

    // Prepare the data for the Excel file from the dictionary
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(save_file.stock_data);

    // Append the worksheet to the workbook
    xlsx.utils.book_append_sheet(wb, ws, 'Stock Data');

    // Write the workbook to a file inside the new folder
    const outputPath = path.join(folderPath, `${symbol}.xlsx`);
    xlsx.writeFile(wb, outputPath);
    console.log(`Excel file has been created successfully at: ${outputPath}`);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Function to read stock names from an Excel file
function readStockNamesFromExcel(filePath) {
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);
    return data.map(row => row.Name);
}

const symbols = readStockNamesFromExcel(path.join(__dirname, '../stock_name.xlsx'));

async function main() {
    // const symbols = [
    // 'DOREENPWR',
    // 'NAVANAPHAR',
    // 'NPOLYMER',
    // 'AMANFEED',
    // 'ACMELAB',
    // 'SQUARETEXT',
    // 'RENATA',
    // 'BSCPLC',
    // 'KDSALTD',
    // 'SUMITPOWER',
    // 'CROWNCEMNT',
    // 'ROBI',
    // 'SINOBANGLA',
    // 'BXPHARMA',
    // 'BSC',
    // 'OLYMPIC',
    // 'AAMRANET',
    // 'BPML',
    // 'EGEN',
    // 'LHBL',
    // 'SQURPHARM',
    // 'UPGDCL',
    // 'AAMRATECH'
    // ];
    const fromTimestamp = 1356998400; // Replace with your desired from timestamp
    const toTimestamp = 1720123590;   // Replace with your desired to timestamp

    // for (const symbol of symbols) {
    //     await fetchDataAndSave(symbol, fromTimestamp, toTimestamp);
    //     await convart_excel(symbol, file_read(symbol, false, true))
    //     await get_stock_json_file(symbol, fromTimestamp, toTimestamp)
    // }

    // for (const symbol of symbols) {
    //     await fetchDataAndSave(symbol, fromTimestamp, toTimestamp);
    //     await convart_excel(symbol, file_read(symbol, false, true))
    //     console.log("Done ----> "+symbol)
    //     await new Promise(resolve => setTimeout(resolve, 200)); // Sleep for 5 seconds between requests
    // }

}

function checkNameExists(name) {
    return symbols.includes(name);
}

const processInput = async (req, res) => {
    const { Name, fromTimestamp, toTimestamp } = req.query;
    const name = Name.toUpperCase();
    var Data = {}
    if (checkNameExists(name)) {
        Data = await get_stock_json_file(name)
    } else {
        res.status(200).json({ message: 'Invalid Stock Name' });
    }
    try {
        res.status(200).json({ message: 'Data fetched and saved successfully.', Data: Data });
    } catch (error) {
        console.error('Error fetching or saving data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const stock_name = async (req, res) => {
    const { Name } = req.query;
    const name = Name.toUpperCase();
    let Data = {};

    if (checkNameExists(name)) {
        res.status(200).json({ message: 'Stock available in DSE BD', Data: Data });
    } else {
        res.status(200).json({ message: 'Invalid Stock Name' });
    }
};

const all_stock_name = async (req, res) => {
    try {
        res.status(200).json({ message: 'Data fetched successfully.', Data: symbols });
    } catch (error) {
        console.error('Error fetching or saving data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


const update_stock = async (req, res) => {
    const { Name, fromTimestamp, toTimestamp, COOKIE1, COOKIE2, COOKIE3, COOKIE4, COOKIE5, COOKIE6, COOKIE7, COOKIE8 } = req.query;
    // Construct the cookies object from query parameters
    const cookies = {
        COOKIE1: COOKIE1 || '',
        COOKIE2: COOKIE2 || '',
        COOKIE3: COOKIE3 || '',
        COOKIE4: COOKIE4 || '',
        COOKIE5: COOKIE5 || '',
        COOKIE6: COOKIE6 || '',
        COOKIE7: COOKIE7 || '',
        COOKIE8: COOKIE8 || '',
    };
    // Prepare request headers with cookies
    const headers = {
        'Port': '4000',
        'Domain': 'ost.ecosoftbd.com',
        'Cookie': Object.values(cookies).join('; ')
    };
    await fetchDataAndSave(Name, fromTimestamp, toTimestamp, headers, res);
};



module.exports = {
    processInput, stock_name, all_stock_name, update_stock
};
