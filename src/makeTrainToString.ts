import { train } from "./intefacetrain";

export function makeTrainToString(train: train): string {
    let minutesZero: string = "";
    let hoursZero: string = "";

    let trainDepartureHour: number = train.departureTime.getHours();
    let trainDepartureMinute: number = train.departureTime.getMinutes();

    if (trainDepartureHour.toString().length === 1) {
        hoursZero = "0";
    }
    if (trainDepartureMinute.toString().length === 1) {
        minutesZero = "0";
    }

    return (
        train.trainLine +
        " " +
        hoursZero +
        train.departureTime.getHours().toString() +
        ":" +
        minutesZero +
        train.departureTime.getMinutes().toString() +
        " Uhr Richtung " +
        train.trainFinalStop
    );
}
