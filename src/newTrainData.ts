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

    function formatDate(date: Date) {
        let year: number = date.getFullYear();
        let month: number = date.getMonth() + 1;
        let day: number = date.getDate();
        let hour: number = date.getHours();
        let monthZero: string = "";
        let dayZero: string = "";
        let hourZero: string = "";

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

    const pastDate: Date = new Date();
    const presentDate: Date = new Date(pastDate.getTime() + 3600000);
    const nextHourDate: Date = new Date(presentDate.getTime() + 3600000);

    // console.log(presentDate);
    // console.log(nextHourDate);

    interface train {
        departureTime: Date;
        trainLine: string;
        trainStops: string[];
        trainFinalStop: string;
    }

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

    function isAnSBahn(train: train): boolean {
        return train.trainLine[0] === "S";
    }
    function isTowardsStuttgart(train: train): boolean {
        // return train.trainStops.includes("Bietigheim-Bissingen");
        return train.trainStops.includes("Stuttgart Schwabstr.");
    }
    function isInTheFuture(train: train): boolean {
        return pastDate.getTime() < train.departureTime.getTime();
    }

    function makeTrainToString(train: train): string {
        let minutesZero: string = "";
        let hoursZero: string = "";

        if (train.departureTime.getHours().toString().length === 1) {
            hoursZero = "0";
        }
        if (train.departureTime.getMinutes().toString().length === 1) {
            minutesZero = "0";
        }

        return (
            train.trainLine +
            " " +
            hoursZero +
            train.departureTime.getHours().toString() +
            ":" +
            minutesZero +
            train.departureTime.getMinutes().toString() +
            " Uhr Richtung " +
            train.trainFinalStop
        );
    }

    trainList = trainList.filter(isAnSBahn).filter(isTowardsStuttgart).filter(isInTheFuture);

    const resultTrainList: string[] = trainList.splice(0, 5).map((train) => makeTrainToString(train));

    const resultSecondHalf: string = resultTrainList.join("\n");
    const resultFirstHalf: string = "Die nächsten S-Bahnen Richtung Stuttgart sind: \n";

    return resultFirstHalf + resultSecondHalf;
}
