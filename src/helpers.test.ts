import { test, expect } from "vitest";
import { formatDate } from "./helpers";

test("expect the date to be formated to yymmdd/hh", () => {
    const date: Date = new Date(2024, 0, 20, 12, 0, 0, 0);
    console.log(date);
    expect(formatDate(date)).toEqual("240120/12");
});
