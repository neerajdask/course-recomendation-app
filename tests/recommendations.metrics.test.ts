import { describe, it, expect } from "vitest";
import { computeRate } from "./utils";

describe("recommendations metrics", () => {
  it("handles zero totals", () => {
    expect(computeRate(0, 0)).toEqual({ total: 0, used: 0, rate: 0 });
  });
  it("caps used to total and computes rate", () => {
    expect(computeRate(10, 3)).toEqual({ total: 10, used: 3, rate: 0.3 });
    expect(computeRate(10, 20)).toEqual({ total: 10, used: 10, rate: 1 });
  });
});
