import { train } from "./interfaces";

export function isTowardsStuttgart(train: train): boolean {
    return train.trainStops.includes("Stuttgart Hbf (tief)");
}
