const fetchDataAndSave = async (symbol, fromTimestamp, toTimestamp) => {
    // Replace with your logic to fetch and save data
    console.log(`Fetching data for symbol: ${symbol} from ${fromTimestamp} to ${toTimestamp}`);
    // Example asynchronous operation
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, 2000); // Replace with actual logic
    });
};
 
const processInput = async (req, res) => {
    const { symbol, fromTimestamp, toTimestamp } = req.query;
  console.log('Received symbol:', symbol);
  console.log('Received fromTimestamp:', fromTimestamp);
  console.log('Received toTimestamp:', toTimestamp);
    try {
        await fetchDataAndSave(symbol, fromTimestamp, toTimestamp);
        res.status(200).json({ message: 'Data fetched and saved successfully.' });
    } catch (error) {
        console.error('Error fetching or saving data:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    processInput
};
