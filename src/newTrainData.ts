import("node-fetch");
import { XMLParser } from "fast-xml-parser";

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

    function formatDate(date: Date, secondRequest: boolean) {
        let year: number = date.getFullYear();
        let month: number = date.getMonth() + 1;
        let day: number = date.getDate();
        let hour: number = date.getHours();
        let monthZero: string = "";
        let dayZero: string = "";
        let hourZero: string = "";

        if (secondRequest) {
            hour++;
        }
        if (month.toString().length === 1) {
            monthZero = "0";
        }
        if (day.toString().length === 1) {
            dayZero = "0";
        }
        if (hour.toString().length === 1) {
            hourZero = "0";
        }

        return year.toString()[2] + year.toString()[3] + monthZero + month.toString() + dayZero + day.toString() + "/" + hourZero + hour.toString();
    }

    const presentDate: Date = new Date();

    interface train {
        departureTime: string;
        trainLine: string;
        trainStops: string[];
        trainFinalStop: string;
    }

    let trainList: train[] = [];

    async function getTrainList(fetchTime: string) {
        const fetchLink: string = "https://apis.deutschebahn.com/db-api-marketplace/apis/timetables/v1/plan/08000235/" + fetchTime;
        try {
            const response = await fetch(fetchLink, APIOptions);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

            const body = await response.text();
            const parser = new XMLParser(options);
            const output: Timetable = parser.parse(body);

            const departureInfo: string = "@_pt";
            const trainLineType: string = "@_c";
            const trainLineNumber: string = "@_l";
            const scheduledStops: string = "@_ppth";

            for (let trainInfo of output.timetable.s) {
                let departureTime = trainInfo.dp[departureInfo].substring(trainInfo.dp[departureInfo].length - 4);
                let trainLine = trainInfo.tl[trainLineType] + trainInfo.dp[trainLineNumber];
                let trainStops: string[] = trainInfo.dp[scheduledStops].split("|");
                let trainFinalStop: string = trainStops[trainStops.length - 1];
                let certainTrain: train = {
                    departureTime: departureTime,
                    trainLine: trainLine,
                    trainStops: trainStops,
                    trainFinalStop: trainFinalStop,
                };

                trainList.push(certainTrain);
            }
            trainList.sort(function (train1, train2) {
                return Number(train1.departureTime) - Number(train2.departureTime);
            });
        } catch (error) {
            console.error("Error fetching train data:", error);
            throw error;
        }
    }

    await getTrainList(formatDate(presentDate, false));
    await getTrainList(formatDate(presentDate, true));

    function isAnSBahn(train: train): boolean {
        return train.trainLine[0] === "S";
    }
    function isTowardsStuttgart(train: train): boolean {
        return train.trainFinalStop === "Stuttgart Schwabstr.";
    }
    function isInTheFuture(train: train): boolean {
        const minutes: number = presentDate.getMinutes();
        const hour: number = presentDate.getHours();
        if (Number(train.departureTime[0] + train.departureTime[1]) === hour + 1) {
            return true;
        } else {
            return (
                minutes < Number(train.departureTime[2] + train.departureTime[3]) && hour === Number(train.departureTime[0] + train.departureTime[1])
            );
        }
    }

    function makeTrainToString(train: train): string {
        return (
            train.trainLine +
            " " +
            train.departureTime[0] +
            train.departureTime[1] +
            ":" +
            train.departureTime[2] +
            train.departureTime[3] +
            " Uhr Richtung " +
            train.trainFinalStop
        );
    }

    trainList = trainList.filter(isAnSBahn).filter(isTowardsStuttgart).filter(isInTheFuture);

    const resultTrainList: string[] = trainList.map((train) => makeTrainToString(train));
    const resultSecondHalf: string = resultTrainList.splice(0, 5).join("\n");
    const resultFirstHalf: string = "Die nächsten S-Bahnen Richtung Stuttgart sind: \n";

    return resultFirstHalf + resultSecondHalf;
}
