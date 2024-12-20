import { formatDate } from "./formatDate";
import { test, expect } from "vitest";

test("expect the date to be formated to yymmdd/hh", () => {
    const date: Date = new Date(2024, 0, 20, 12, 0, 0, 0);
    expect(formatDate(date)).toEqual("240120/12");
});

test("expect the date to be formated to yymmdd/hh", () => {
    const date: Date = new Date(753, 0, 20, 12, 54, 2, 1);
    expect(formatDate(date)).toEqual("530120/12");
});
