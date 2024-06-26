const dbConnector = require("./dbConnector.js");
const express = require('express');
const {getReportData} = require("./dbConnector");
const port = process.env.PORT || 3000;
const api = express();
global.dbConnected = false;

//Standard query for report generation
api.get('/report', async (req, res) => {
    let pattern = new RegExp("^(0[1-9]|[12][0-9]|3[01])\\.(0[1-9]|1[0-2])\\.(\\d{4})$");
    if (!pattern.test(req.get("month"))) {
        res.status(400);
        res.json("{message: 'Invalid month specified'}");
    } else if (global.dbConnected) {
        await getReportData();
        res.status(200);
        res.json(await getReportData());
    } else {
        res.status(500);
        res.json("{message: 'Internal server error occurred'}");
    }
    res.send();
})



api.listen(port, async ()=> {
    global.dbConnected = await dbConnector.connect();
    console.log(`Listening on port ${port}`);
})