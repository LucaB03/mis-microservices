/*  dbConnector.js
*
*   This file implements the database connection
*   and handling of queries.
*/
const mongoose = require('mongoose');
const conString = process.env.CONSTR || "mongodb://127.0.0.1:27017/cannabis";

module.exports = {
    connect: async function() {
        try {
            await mongoose.connect(conString);
            console.log("Connected to the database successfully.");
            return true;
        } catch (error) {
            console.error("Error connecting to the database:", error);
            return false;
        }
    },
    getReportData: async function(month) {
        let db = await mongoose.connection.db;
        let lastDay = new Date(month);
        lastDay.setMonth(lastDay.getMonth() + 1);
        lastDay.setDate(1);
        lastDay.setDate(lastDay.getDate() - 1);
        let firstDay = new Date(month);
        //Format of the returned data
        let data = {"withdrawals": [], "totalAmount": 0, "memberCount": 0, "avgPerMember": []};
        //Adding all withdrawals to data and computing total amount
        let query = await db.collection("withdrawals").find({time: {$gte: firstDay, $lte: lastDay}});
        let doc;
        let amount = 0;
        while ((doc = await query.next()) != null) {
            let entry = {}
            entry["withdrawalId"] = doc["_id"].toString();
            let member = await db.collection("members").findOne({_id: doc["withdrawerId"]});
            entry["member"] = member["firstName"] + " " + member["lastName"];
            entry["time"] = doc["time"];
            entry["amount"] = doc["amount"];
            amount += doc["amount"];
            data["withdrawals"].push(entry);
        }
        data["totalAmount"] = amount;
        //Adding all member averages and the member count to data
        let memCount = 0;
        query = await db.collection("members").find();
        while ((doc = await query.next()) != null) {
            memCount++;
            let entry = {};
            entry["member"] = doc["firstName"] + " " + doc["lastName"];
            let avg = 0;
            let count = 0;
            let subquery = await db.collection("withdrawals").find({withdrawerId: doc["_id"]});
            let withd = null;
            while ((withd = await subquery.next()) != null) {
                avg += withd["amount"];
                count++;
            }
            entry["average"] = avg/count;
            data["avgPerMember"].push(entry);
        }
        data["memberCount"] = memCount;

        return data;
    }
}