import { test, assert, vi } from "vitest";
import { train } from "./interfaceTrain";
import { isInTheFuture } from "./isInTheFuture";

test("Checks if train hasn't already left the station", () => {
    const date = new Date(2024, 0, 21, 0, 0, 0);
    vi.setSystemTime(date);
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

test("Checks if train has left station by one millisecond", () => {
    const date = new Date(2024, 0, 19, 23, 59, 59, 999);
    vi.setSystemTime(date);
    const sbahn: train = {
        departureTime: new Date(2024, 0, 20, 0, 0, 0, 0),
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
