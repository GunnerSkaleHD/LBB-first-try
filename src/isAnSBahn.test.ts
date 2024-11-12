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

test("return false for non Sbahn trains", () => {
    const regio: train = {
        departureTime: new Date(),
        trainLine: "RE1",
        trainStops: ["Ingolstadt Hbf", "Pfaffenhofen an der Ilm", "Alershausen"],
        trainFinalStop: "München Hbf",
    };
    assert.isFalse(isAnSBahn(regio));
});
