import { train } from "./interfaces";

export function isAnSBahn(train: train): boolean {
    return train.trainLine[0] === "S";
}
