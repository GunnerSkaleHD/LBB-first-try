import { train } from "./interfaceTrain";

export function isInTheFuture(train: train): boolean {
    const compareDate: Date = new Date();
    return compareDate.getTime() < train.departureTime.getTime();
}
