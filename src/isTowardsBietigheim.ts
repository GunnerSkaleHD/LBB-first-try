import { train } from "./interfaces";

export function isTowardsBietigheim(train: train): boolean {
    for (let stop of train.trainStops) {
        if (stop.includes("Bietigheim")) {
            return true;
        }
    }
    return false;
}
