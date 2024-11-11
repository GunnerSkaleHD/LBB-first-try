interface train {
    departureTime: Date;
    trainLine: string;
    trainStops: string[];
    trainFinalStop: string;
}

export const pastDate: Date = new Date();
export const presentDate: Date = new Date(pastDate.getTime() + 3600000);
export const nextHourDate: Date = new Date(presentDate.getTime() + 3600000);

export function formatDate(date: Date) {
    let year: number = date.getFullYear();
    let month: number = date.getMonth() + 1; //month is 0-indexed
    let day: number = date.getDate();
    let hour: number = date.getHours();
    let monthZero: string = "";
    let dayZero: string = "";
    let hourZero: string = "";

    if (month.toString().length === 1) {
        monthZero = "0";
    }
    if (day.toString().length === 1) {
        dayZero = "0";
    }
    if (hour.toString().length === 1) {
        hourZero = "0";
    }

    return year.toString()[2] + year.toString()[3] + monthZero + month.toString() + dayZero + day.toString() + "/" + hourZero + hour.toString();
}
export function isAnSBahn(train: train): boolean {
    return train.trainLine[0] === "S";
}
export function isTowardsStuttgart(train: train): boolean {
    // return train.trainStops.includes("Bietigheim-Bissingen");
    return train.trainStops.includes("Stuttgart Schwabstr.");
}
export function isInTheFuture(train: train): boolean {
    return pastDate.getTime() < train.departureTime.getTime();
}

export function makeTrainToString(train: train): string {
    let minutesZero: string = "";
    let hoursZero: string = "";

    if (train.departureTime.getHours().toString().length === 1) {
        hoursZero = "0";
    }
    if (train.departureTime.getMinutes().toString().length === 1) {
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
