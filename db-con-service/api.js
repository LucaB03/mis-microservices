const dbConnector = require("./dbConnector.js");
const express = require('express');
const {getReportData} = require("./dbConnector");
const port = process.env.PORT || 3000;
const api = express();
global.dbConnected = false;

//Standard query for report generation
api.get('/report', async (req, res) => {
    let pattern = new RegExp("^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$");
    if (!pattern.test(req.get("month"))) {
        res.status(400);
        res.json("{message: 'Invalid month specified'}");
    } else if (global.dbConnected) {
        res.status(200);
        res.json(await getReportData(req.get("month")));
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