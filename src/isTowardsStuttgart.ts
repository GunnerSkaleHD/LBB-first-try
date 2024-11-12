import { train } from "./interfaces";

export function isTowardsStuttgart(train: train): boolean {
    // return train.trainStops.includes("Bietigheim-Bissingen");
    return train.trainStops.includes("Stuttgart Hbf (tief)");
}
