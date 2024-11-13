import { test, assert } from "vitest";
import { train } from "./interfaces";
import { isTowardsMarbach } from "./isTowardsMarbach";

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
    assert.isFalse(isTowardsMarbach(sbahn));
});

test("Checks if train is leaving towards Stuttgart", () => {
    const sbahn: train = {
        departureTime: new Date(2024, 0, 20, 12, 0, 0, 0),
        trainLine: "S4",
        trainStops: ["Favoritepark", "Freiberg(Neckar)", "Benningen(Neckar)", "Marbach(Neckar)"],
        trainFinalStop: "Marbach(Neckar)",
    };
    assert.isTrue(isTowardsMarbach(sbahn));
});
