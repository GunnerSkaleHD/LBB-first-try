import { train } from "./interfaceTrain";

export function isAnSBahn(train: train): boolean {
    return train.trainLine[0] === "S";
}
