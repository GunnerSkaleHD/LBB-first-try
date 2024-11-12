import { train } from "./intefacetrain";

export function isInTheFuture(train: train): boolean {
    const compareDate: Date = new Date();
    return compareDate.getTime() < train.departureTime.getTime();
}
