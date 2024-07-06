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

async function get_all_stock_name() {

    var main_data = {
        name: [],
        symbol: []  // Initialize symbol as an empty array
    };
    for (let i = 0; i <= 9; i++) {
        const FormData = require('form-data');
        let data = new FormData();
        data.append('configuration', 'REZtYjMxT3ZJd2FjTUJxMVgyNWF4SUZPdXYyemExRFl1aFlPT3NiMysrdVM0TW10MzZsMGJZY1FxOVQ5UlViWElMdFhQREUyLytZM2Jmd2RXV1pHSTkzRzM5YUlxbVB0eFpBa0s3T1ZpdGRpTGtqODFQL2VpQ3N5K0VnbitoQjgrdURYYVBLWXlEcWV5ZjdIK0lUb3JRPT0');
        data.append('type', 'company');
        data.append('token', '94c00510.x3VeEsHA2ipYqWi7i2jAgYxuvgT8KOK7ElRoypQ02ic.kyIVJJirnXxpxC3Twy6v-8JX_TGMbaDqXD4ynvYGohCzFxNck6uLXw_KXA');
        data.append('page', i);
        data.append('length', '40');
        data.append('token', '9c6761f9d1810f.jSfWpSSqZ1qDiTv04f39wmhfGdHm7mXT0HQC2-A9M_U.5GOb6GCZUCP0-wvM0rzPlCAQT6auiguHmiF6motZAM3PXazpFZguP-b9TA');
        data.append('mode', 'ch');

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://www.marketscreener.com/async/stock-screener/more',
            headers: {
                'Cookie': 'PHPSESSID=joqautouak4vledpt1brov47cb',
                ...data.getHeaders()
            },
            data: data
        };

        axios.request(config)
            .then((response) => {
                if (!response.error) {
                    const dataHtml = JSON.stringify(response.data);
                    const matches = dataHtml.match(/data-instrument=(\d+)/g);
                    if (matches) {
                        const regex = /\/stock\/([^\/]+)\//g;
                        let ebrahim;
                        let names = [];
                        let saleh = [];
                        while ((ebrahim = regex.exec(dataHtml)) !== null) {
                            names.push(ebrahim[1]);
                        }
                        names = names.map(name => name.split('-').join(' '));

                        str = names.map(x => {
                            let modifiedName = x.replace(/\s+\d+$/, ''); // Remove integer part from the end

                            if (!saleh.includes(modifiedName)) {
                                saleh.push(modifiedName);
                            }

                        });
                        main_data.name.push(...saleh);
                        const instrumentIds = matches.map(match => match.split('=')[1]);
                        main_data.symbol.push(...instrumentIds);

                        console.log('Instrument IDs:', main_data);
                        const newFolderPath = path.join(__dirname, 'save_file_fron_marketscreener');
                        fs.mkdirSync(newFolderPath, { recursive: true });

                        const fileName = `json_data_with_name.json`;
                        const outputPath = path.join(newFolderPath, fileName);

                        fs.writeFileSync(outputPath, JSON.stringify(main_data, null, 2));
                        console.log(`Data saved as JSON to: ${outputPath}`);
                    } else {
                        console.error("No instrument IDs found");
                    }
                } else {
                    console.error("Error in response:", response);
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
}

async function convart_excel(symbol, stockData) {

    const data = [];

    // Iterate over each timestamp in stockData
    try {
        stockData["t"].forEach((timestamp, index) => {
            // Convert timestamp to date
            const date = new Date(timestamp * 1000);
            const formattedDate = date.toLocaleDateString();
            // Extract corresponding data points
            const openPrice = stockData.o[index];
            const closePrice = stockData.c[index];
            const highPrice = stockData.h[index];
            const lowPrice = stockData.l[index];
            const volume = stockData.v[index];

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
                'Volume': volume
            });

            // Log the data for verification
            // console.log(`Date: ${formattedDate}, Open Price: ${openPrice}, Close Price: ${closePrice}, Volume: ${volume}`);
        });
    } catch { }

    // Create a dictionary to save the data
    const save_file = {
        stock_data: data
    };

    // Path to the new folder where the Excel file will be saved
    const folderPath = path.join(__dirname, 'save_file_fron_marketscreener/All XLSX File');

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

    console.log(symbol, "------COMPLETED------------\n", outputPath + "\n")
    // // Delete the file
    // fs.unlink(outputPath, (err) => {
    // if (err) {
    //     console.error(`Error deleting file ${outputPath}:`, err);
    // } else {
    //     console.log(`File ${outputPath} deleted successfully`);
    // }
    // });
    //     console.log(`Excel file has been created successfully at: ${outputPath}`);
    // }

}

async function get_induvidula_data() {

    const filePath = path.join(__dirname, 'save_file_fron_marketscreener');
    const fileName = `json_data_with_name.json`;
    const outputPath = path.join(filePath, fileName);
    const jsonData = fs.readFileSync(outputPath, 'utf8');
    const stockData = JSON.parse(jsonData);

    stockData["symbol"].map((name, id) => {

        let config = {
            method: 'get',
            maxBodyLength: Infinity,
            url: `https://www.zonebourse.com/mods_a/charts/TV/function/history?from=1219964800&to=1720267200&symbol=${name}&resolution=D&requestType=GET&src=itfp`,
            headers: {
                'Cookie': 'lc=fr_FR'
            },
            timeout: 100000000,
        };

        const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
        const delayBetweenRequests = 4000; // 4 seconds delay

        // Function to make Axios request with delay
        const makeDelayedRequest = async (config, delayMs) => {
            try {
                await delay(delayMs); // Introduce delay
                const response = await axios.request(config); // Make Axios request

                // Handle response
                console.log(JSON.stringify(response.data));
                const newFolderPath = path.join(__dirname, 'save_file_from_marketscreener');
                fs.mkdirSync(newFolderPath, { recursive: true });

                // Save response data as JSON file
                const jsonData = response.data;
                const fileName = `${stockData["name"][id]}.json`;
                const outputPath = path.join(newFolderPath, fileName);
                fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
                console.log(`Data saved as JSON to: ${outputPath}`);
            } catch (error) {
                console.error('Error:', error);
                throw error; // Rethrow error to handle in outer scope if needed
            }
        };

        // Example usage
        makeDelayedRequest(config, delayBetweenRequests)
            .then(() => {
                console.log('Request completed');
                // Perform any additional actions after the request completes
            })
            .catch((error) => {
                console.error('Request failed:', error);
                // Handle error scenarios here
            });

    })

}

async function get_excel() {
    const filePath = path.join(__dirname, 'save_file_fron_marketscreener');
    const fileName = `json_data_with_name.json`;
    const outputPath = path.join(filePath, fileName);
    const jsonData = fs.readFileSync(outputPath, 'utf8');
    const stockData = JSON.parse(jsonData);

    stockData["name"].map((name, id) => {
        const filePath = path.join(__dirname, 'save_file_fron_marketscreener');
        const fileName = `${name}.json`;
        const outputPath = path.join(filePath, fileName);
        const jsonData = fs.readFileSync(outputPath, 'utf8');
        const final_data = JSON.parse(jsonData);
        convart_excel(name, final_data)
    })
}

async function main() {
    await get_all_stock_name()
    await get_induvidula_data()
    await get_excel()
}

main()