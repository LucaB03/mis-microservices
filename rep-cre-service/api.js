const express = require('express');
const { createReport } = require("./pdfCreator");
const { resolve } = require("node:path");
const port = process.env.PORT || 4000;
const reportFilePath = process.env.REPORT_FILE_PATH || process.cwd();
const api = express();


api.get('/create', async (req, res) => {
    let pattern = new RegExp("^\\d{4}-(0[1-9]|1[0-2])$");
    let month = new Date(req.get("month"));
    let currentDate = new Date();
    if (!pattern.test(req.get("month")) || !(month <= currentDate)) {
        res.status(400);
        res.json("{message: 'Invalid month specified'}");
        res.send();
    } else if (await createReport(req.get("month"))) {
        res.status(200);
        let path = resolve(reportFilePath, "report" + req.get("month") + ".pdf");
        res.sendFile(path);
    } else {
        res.status(500);
        res.json("{message: 'Internal server error occurred'}");
        res.send();
    }
})

api.listen(port, () => {
    console.log(`Listening on port ${port}`);
});