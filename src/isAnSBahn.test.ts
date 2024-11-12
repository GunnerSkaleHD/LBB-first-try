import { isAnSBahn } from "./isAnSbahn";
import { train } from "./interfaceTrain";
import { test, assert } from "vitest";

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
