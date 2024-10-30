import { initClient, registerAction, hasAction, clearAction } from "src";

describe("Test UsertiseClient interface and methods", () => {
  it("should not have a callback", () => {
    const result = hasAction("event");
    expect(result).toBe(false);
  });

  it("should have a callback", () => {
    registerAction("event", () => {});
    const result = hasAction("event");
    expect(result).toBe(true);
  });

  it("should not have a callback on a different event", () => {
    registerAction("event1", () => {});
    const result = hasAction("event2");
    expect(result).toBe(false);
  });

  it("should not have a callback after removing it", () => {
    registerAction("event", () => {});
    const resultAdd = hasAction("event");
    expect(resultAdd).toBe(true);
    clearAction("event");
    const resultRemove = hasAction("event");
    expect(resultRemove).toBe(false);
  });

  it("should have a callback set by init", () => {
    initClient(undefined, { callbacks: { event: () => {} } });
    const result = hasAction("event");
    expect(result).toBe(true);
  });
});
