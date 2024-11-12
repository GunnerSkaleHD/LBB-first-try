export interface train {
    departureTime: Date;
    trainLine: string;
    trainStops: string[];
    trainFinalStop: string;
}
export interface Timetable {
    timetable: {
        s: TimetableEntry[];
    };
}

export interface TimetableEntry {
    tl: TrainData;
    dp: {
        "@_ppth": string;
        "@_pt": string;
        "@_l": string;
    };
}

export interface TrainData {
    "@_c": string;
    "@_l": string;
}
