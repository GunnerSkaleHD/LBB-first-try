import { test, expect } from "vitest";
import { makeTrainToString } from "./makeTrainToString";
import { train } from "./interfaceTrain";

test("Takes train object and makes string out of it", () => {
    const sbahn: train = {
        departureTime: new Date(2024, 0, 20, 12, 0, 0, 0),
        trainLine: "S4",
        trainStops: [
            "Kornwestheim Pbf",
            "Stuttgart-Zuffenhausen",
            "Stuttgart-Feuerbach",
            "Stuttgart Nord",
            "Stuttgart Hbf (tief)",
            "Stuttgart Stadtmitte",
            "Stuttgart Feuersee",
            "Stuttgart Schwabstr.",
        ],
        trainFinalStop: "Stuttgart Schwabstr.",
    };

    expect(makeTrainToString(sbahn)).toEqual("S4 12:00 Uhr Richtung Stuttgart Schwabstr.");
});
