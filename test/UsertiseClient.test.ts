import { addCallback, hasCallback, removeCallback } from "src";

describe("Sample 'add' function test", () => {
  it("should not have a callback", () => {
    const result = hasCallback("event");
    expect(result).toBe(false);
  });

  it("should have a callback", () => {
    addCallback("event", () => {});
    const result = hasCallback("event");
    expect(result).toBe(true);
  });

  it("should not have a callback on a different event", () => {
    addCallback("event1", () => {});
    const result = hasCallback("event2");
    expect(result).toBe(false);
  });

  it("should not have a callback after removing it", () => {
    addCallback("event", () => {});
    const resultAdd = hasCallback("event");
    expect(resultAdd).toBe(true);
    removeCallback("event");
    const resultRemove = hasCallback("event");
    expect(resultRemove).toBe(false);
  });
});
