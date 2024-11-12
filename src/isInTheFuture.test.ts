import { test, assert } from "vitest";
import { train } from "./interfaceTrain";
import { isInTheFuture } from "./isInTheFuture";

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
