import { add } from "src";

describe("Sample 'add' function test", () => {
  it("should add two numbers", () => {
    const result = add(2, 3);
    expect(result).toBe(5);
  });
});
