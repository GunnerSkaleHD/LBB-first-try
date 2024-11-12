import { makeTrainToString } from "./makeTrainToString";
import { isInTheFuture } from "./isInTheFuture";
import { isTowardsStuttgart } from "./isTowardsStuttgart";
import { isAnSBahn } from "./isAnSbahn";
import { train } from "./interfaceTrain";
import { getTrainList } from "./getTrainList";

export async function getTrainData() {
    const presentDate: Date = new Date();
    const nextHourDate: Date = new Date(presentDate.getTime() + 3600000);
    let trainList: train[] = [...(await getTrainList(presentDate)), ...(await getTrainList(nextHourDate))];
    console.log(trainList);
    trainList.sort(function (train1, train2) {
        return train1.departureTime.getTime() - train2.departureTime.getTime();
    });
    trainList = trainList.filter(isAnSBahn).filter(isTowardsStuttgart).filter(isInTheFuture);

    const resultTrainList: string[] = trainList.splice(0, 5).map((train) => makeTrainToString(train));
    const resultSecondHalf: string = resultTrainList.join("\n");
    const resultFirstHalf: string = "Die nächsten S-Bahnen Richtung Stuttgart sind: \n";

    return resultFirstHalf + resultSecondHalf;
}
