import { train } from "./interfaces";

export function isTowardsMarbach(train: train): boolean {
    for (let stop of train.trainStops) {
        if (stop.includes("Marbach")) {
            return true;
        }
    }
    return false;
}
