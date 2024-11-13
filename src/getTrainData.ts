import { makeTrainToString } from "./makeTrainToString";
import { isInTheFuture } from "./isInTheFuture";
import { isTowardsStuttgart } from "./isTowardsStuttgart";
import { isTowardsBietigheim } from "./isTowardsBietigheim";
import { isTowardsMarbach } from "./isTowardsMarbach";
import { isAnSBahn } from "./isAnSbahn";
import { train } from "./interfaces";
import { getTrainList } from "./getTrainList";

export async function getTrainData(direction: string) {
    const presentDate: Date = new Date();
    const nextHourDate: Date = new Date(presentDate.getTime() + 3600000);
    let trainList: train[] = [...(await getTrainList(presentDate)), ...(await getTrainList(nextHourDate))];
    trainList.sort(function (train1, train2) {
        return train1.departureTime.getTime() - train2.departureTime.getTime();
    });

    // console.log(trainList);

    var textDirection: string = "";

    if (direction == "stuttgart") {
        trainList = trainList.filter(isAnSBahn).filter(isTowardsStuttgart).filter(isInTheFuture);
        textDirection = "Stuttgart";
    }
    if (direction == "bietigheim") {
        trainList = trainList.filter(isAnSBahn).filter(isTowardsBietigheim).filter(isInTheFuture);
        textDirection = "Bietigheim";
    }
    if (direction == "marbach") {
        trainList = trainList.filter(isAnSBahn).filter(isTowardsMarbach).filter(isInTheFuture);
        textDirection = "Marbach";
    }

    const resultTrainList: string[] = trainList.splice(0, 5).map((train) => makeTrainToString(train));
    const resultSecondHalf: string = resultTrainList.join("\n");
    const resultFirstHalf: string = `Die nächsten S-Bahnen Richtung ${textDirection} sind: \n`;

    return resultFirstHalf + resultSecondHalf;
}
