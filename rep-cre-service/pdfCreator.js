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
        let data = await getData(month);
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        doc.text("Club Report, " + month, 10, 10);
        doc.setFontSize(12);
        doc.text("Total cannabis withdrawal: " + data["totalAmount"] + "g", 10, 30);
        doc.text("Member count: " + data["memberCount"], 10, 40);
        doc.text("Withdrawals:", 10, 50);
        let i = 55;
        for (const wd of data["withdrawals"]) {
            if (i >= pageHeight-20-20) {
                i = 0;
                doc.addPage();
            }
            for (const wdItem in wd) {
                doc.text(wdItem + ": " + wd[wdItem] + ((wdItem === "amount") ? "g" : ""), 20, i);
                i+=5;
            }
            i+=5;
        }
        i+=5;
        doc.text("Average per Member:", 10, i)
        i+=5;
        for (const ma of data["avgPerMember"]) {
            if (i >= pageHeight-20-10) {
                i = 10;
                doc.addPage();
            }
            for (const maItem in ma) {
                doc.text(maItem + ": " + ma[maItem] + ((maItem === "average") ? "g" : ""), 20, i);
                i+=5;
            }
            i+=5;
        }
        for (let j = 0; j < doc.getNumberOfPages(); j++) {
            doc.setPage(j+1);
            doc.text(String(j+1), pageWidth-10, pageHeight-10);
        }
        try {
            doc.save("report" + month + ".pdf");
        } catch (error) {
            return false;
        }
        return true;
    }
}