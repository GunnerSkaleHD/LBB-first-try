import("node-fetch");
import { XMLParser } from "fast-xml-parser";
import { formatDate, isAnSBahn, isInTheFuture, isTowardsStuttgart, makeTrainToString, train } from "./helpers";
import { pastDate, presentDate, nextHourDate } from "./dates";

export async function getTrainData() {
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
        isArray: (name: string, jpath: string, isLeafNode: boolean, isAttribute: boolean) => jpath === "timetable.s",
    };

    interface TrainData {
        "@_c": string;
        "@_l": string;
    }

    interface TimetableEntry {
        tl: TrainData;
        dp: {
            "@_ppth": string;
            "@_pt": string;
            "@_l": string;
        };
    }

    interface Timetable {
        timetable: {
            s: TimetableEntry[];
        };
    }

    // console.log(presentDate);
    // console.log(nextHourDate);

    async function getTrainList(date: Date) {
        let formatedDateAndTime: string = formatDate(date);
        const fetchLink: string = "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/plan/08000235/" + formatedDateAndTime;
        try {
            const response = await fetch(fetchLink, APIOptions);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const body = await response.text();
            const parser = new XMLParser(options);
            const output: Timetable = parser.parse(body);
            let trainList: train[] = [];
            const departureInfo: string = "@_pt";
            const trainLineType: string = "@_c";
            const trainLineNumber: string = "@_l";
            const scheduledStops: string = "@_ppth";

            for (let trainInfo of output.timetable.s) {
                let departureYear: string = "20" + trainInfo.dp[departureInfo].substring(0, 2);
                let departureMonth: string = trainInfo.dp[departureInfo].substring(2, 4);
                let departureDay: string = trainInfo.dp[departureInfo].substring(4, 6);
                let departureHour: string = trainInfo.dp[departureInfo].substring(6, 8);
                let departureMinute: string = trainInfo.dp[departureInfo].substring(8, 10);
                let departureTime: Date = new Date(
                    departureYear + "-" + departureMonth + "-" + departureDay + "T" + departureHour + ":" + departureMinute + ":" + "00"
                );

                let trainLine: string = trainInfo.tl[trainLineType] + trainInfo.dp[trainLineNumber];
                let trainStops: string[] = trainInfo.dp[scheduledStops].split("|");
                let trainFinalStop: string = trainStops[trainStops.length - 1];

                let currentTrain: train = {
                    departureTime: departureTime,
                    trainLine: trainLine,
                    trainStops: trainStops,
                    trainFinalStop: trainFinalStop,
                };

                trainList.push(currentTrain);
            }
            return trainList;
        } catch (error) {
            console.error("Error fetching train data:", error);
            throw error;
        }
    }

    let trainList: train[] = [...(await getTrainList(presentDate)), ...(await getTrainList(nextHourDate))];

    trainList.sort(function (train1, train2) {
        return train1.departureTime.getTime() - +train2.departureTime.getTime();
    });
    console.log(trainList);
    trainList = trainList.filter(isAnSBahn).filter(isTowardsStuttgart).filter(isInTheFuture);

    const resultTrainList: string[] = trainList.splice(0, 5).map((train) => makeTrainToString(train));

    const resultSecondHalf: string = resultTrainList.join("\n");
    const resultFirstHalf: string = "Die nächsten S-Bahnen Richtung Stuttgart sind: \n";
    console.log(resultSecondHalf);
    return resultFirstHalf + resultSecondHalf;
}
