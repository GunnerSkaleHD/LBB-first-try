import { train } from "./interfaceTrain";

export function isTowardsStuttgart(train: train): boolean {
    // return train.trainStops.includes("Bietigheim-Bissingen");
    return train.trainStops.includes("Stuttgart Schwabstr.");
}
