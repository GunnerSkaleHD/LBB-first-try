"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrainData = getTrainData;
import("node-fetch");
const fast_xml_parser_1 = require("fast-xml-parser");
async function getTrainData() {
    const APIOptions = {
        method: "GET",
        headers: {
            "DB-Client-Id": "6d8990a55f6ad319e4bcc664d2a26be8",
            "DB-Api-Key": "23d8111fab821ddb070796f82ab3516e",
            accept: "application/xml",
        },
    };
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
        allowBooleanAttributes: true,
        ignoreDeclaration: true,
        isArray: (name, jpath, isLeafNode, isAttribute) => jpath === "timetable.s",
    };
    const date = new Date();
    // const date = new Date("2024-11-06T15:50:00");
    // console.log(date);
    let minutes = date.getMinutes();
    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let testNumber = 0;
    if (minutes > 39) {
        hour++;
        testNumber++;
    }
    let zero = "";
    if (month.toString().length === 1) {
        zero = "0";
    } else if (day.toString().length) {
        zero = "0";
    }
    let fetchLink =
        "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/plan/08000235/" +
        year.toString()[2] +
        year.toString()[3] +
        month.toString() +
        zero +
        day.toString() +
        "/" +
        hour.toString();
    try {
        // console.log(fetchLink);
        const response = await fetch(fetchLink, APIOptions);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const body = await response.text();
        const parser = new fast_xml_parser_1.XMLParser(options);
        const output = parser.parse(body);
        let trainList = [];
        for (let i of output.timetable.s) {
            if (minutes >= Number(i.dp["@_pt"].substr(i.dp["@_pt"].length - 2)) && testNumber === 0) {
                continue;
            }
            if (i.tl["@_c"] === "S" && i.dp["@_ppth"].includes("Stuttgart Hbf")) {
                let time = i.dp["@_pt"].substr(i.dp["@_pt"].length - 4);
                let train = i.tl["@_c"] + i.dp["@_l"];
                let stops = i.dp["@_ppth"].split("|");
                // console.log(stops);
                trainList.push(time + " " + train + " " + stops[stops.length - 1]);
            }
        }
        trainList.sort();
        let resultFirstHalf = "Die nächsten S-Bahnen Richtung Stuttgart sind: \n";
        let resultSecondHalf = trainList.join("\n");
        if (trainList.length > 6) {
            let enter = "\n";
            resultSecondHalf =
                trainList[0] + enter + trainList[1] + enter + trainList[2] + enter + trainList[3] + enter + trainList[4];
        }
        return resultFirstHalf + resultSecondHalf;
    } catch (error) {
        console.error("Error fetching train data:", error);
        throw error;
    }
}
// getTrainData()
//     .then((result) => {
//         console.log(result);
//     })
//     .catch((error) => {
//         console.error(error);
//     });
