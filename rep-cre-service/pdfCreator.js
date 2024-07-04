const { jsPDF } = require("jspdf");

//Gets data as JSON from other API and returns it as JS object
async function getData(month) {
    let jsonData;
    try {
        jsonData = await fetch("http://localhost:3000/report", {method: "GET", headers: {"Content-Type": "application/json", "month": month}});
    } catch (error) {
        console.error(error);
    }
    jsonData = await jsonData.text();
    return JSON.parse(jsonData);
}

module.exports = {
    createReport: async function(month) {
        const doc = new jsPDF();
        //doc.text("Hello world!", 10, 10);
        //doc.save("a4.pdf");
        await getData(month);
        return true;
    }
}