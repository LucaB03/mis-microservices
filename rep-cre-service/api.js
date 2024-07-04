const express = require('express');
const { createReport } = require("./pdfCreator");
const port = process.env.PORT || 4000;
const api = express();


api.get('/create', (req, res) => {
    let pattern = new RegExp("^\\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\\d|3[01])$");
    if (!pattern.test(req.get("month"))) {
        res.status(400);
        res.json("{message: 'Invalid month specified'}");
    } else if (createReport(req.get("month"))) {
        res.status(200);
    } else {
        res.status(500);
        res.json("{message: 'Internal server error occurred'}");
    }
    res.send();
})

api.listen(port, () => {
    console.log(`Listening on port ${port}`);
});