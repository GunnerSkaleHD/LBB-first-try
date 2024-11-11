import { isAnSBahn, isInTheFuture, isTowardsStuttgart, makeTrainToString, train } from "./helpers";
import { presentDate, nextHourDate } from "./dates";
import { getTrainList } from "./getTrainList";

export async function getTrainData() {
    let trainList: train[] = [...(await getTrainList(presentDate)), ...(await getTrainList(nextHourDate))];

    trainList.sort(function (train1, train2) {
        return train1.departureTime.getTime() - train2.departureTime.getTime();
    });
    trainList = trainList.filter(isAnSBahn).filter(isTowardsStuttgart).filter(isInTheFuture);

    const resultTrainList: string[] = trainList.splice(0, 5).map((train) => makeTrainToString(train));
    const resultSecondHalf: string = resultTrainList.join("\n");
    const resultFirstHalf: string = "Die nächsten S-Bahnen Richtung Stuttgart sind: \n";

    return resultFirstHalf + resultSecondHalf;
}
