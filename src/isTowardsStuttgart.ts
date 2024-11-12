import { train } from "./interfaces";

export function isTowardsStuttgart(train: train): boolean {
    for (let stop of train.trainStops) {
        if (stop.includes("Stuttgart")) {
            return true;
        }
    }
    return false;
}
