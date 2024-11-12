import { test, assert } from "vitest";
import { train } from "./interfaceTrain";
import { isTowardsStuttgart } from "./isTowardsStuttgart";

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

test("Checks if train is leaving towards Stuttgart", () => {
    const sbahn: train = {
        departureTime: new Date(2024, 0, 20, 12, 0, 0, 0),
        trainLine: "S5",
        trainStops: ["Asperg", "Tamm(Württ)", "Bietigheim-Bissingen"],
        trainFinalStop: "Bietigheim-Bissingen",
    };
    assert.isFalse(isTowardsStuttgart(sbahn));
});
