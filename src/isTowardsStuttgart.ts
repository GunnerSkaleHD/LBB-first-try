import { train } from "./intefacetrain";

export function isTowardsStuttgart(train: train): boolean {
    // return train.trainStops.includes("Bietigheim-Bissingen");
    return train.trainStops.includes("Stuttgart Schwabstr.");
}
