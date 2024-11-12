import { train } from "./intefacetrain";

export function isAnSBahn(train: train): boolean {
    return train.trainLine[0] === "S";
}
