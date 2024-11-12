import { test, expect, assert, vi } from "vitest";
import { makeTrainToString } from "./makeTrainToString";
import { isInTheFuture } from "./isInTheFuture";
import { isTowardsStuttgart } from "./isTowardsStuttgart";
import { isAnSBahn } from "./isAnSbahn";
import { formatDate } from "./formatDate";
import { train } from "./intefacetrain";

test("expect the date to be formated to yymmdd/hh", () => {
    const date: Date = new Date(2024, 0, 20, 12, 0, 0, 0);
    expect(formatDate(date)).toEqual("240120/12");
});

test("return true for S-Bahn", () => {
    const sbahn: train = {
        departureTime: new Date(),
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
    assert.isTrue(isAnSBahn(sbahn));
});

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

test("Checks if train hasn't already left the station", () => {
    const sbahn: train = {
        departureTime: new Date(5000, 0, 20, 12, 0, 0, 0),
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

    assert.isTrue(isInTheFuture(sbahn));
});

test("Checks if train is leaving towards Stuttgart", () => {
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
    assert.isTrue(isTowardsStuttgart(sbahn));
});
