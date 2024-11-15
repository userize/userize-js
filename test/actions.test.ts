import { dispatchActions } from "src/actions";

describe("Test actions triggering", () => {
  it("should not do anything with no callbacks", async () => {
    const result = await dispatchActions(
      { query: "any text", actions: [] },
      {},
    );
    expect(result).toBe(undefined);
  });

  it("should not do anything with callbacks but no input", async () => {
    let testVar = 1;

    const result = await dispatchActions(
      { query: "any text", actions: [] },
      {
        event: () => {
          testVar = 2;
        },
        anotherEvent: () => {
          testVar = 3;
        },
      },
    );
    expect(result).toBe(undefined);
    expect(testVar).toBe(1);
  });

  it("should update data with cascade request", async () => {
    let testVar = 1;

    const result = await dispatchActions(
      {
        query: "any text",
        actions: [{ action: "event", params: {}, index: 0 }],
      },
      {
        event: () => {
          testVar = 2;
        },
        anotherEvent: () => {
          testVar = 3;
        },
      },
    );
    expect(result).toBe(undefined);
    expect(testVar).toBe(2);
  });

  it("should update data with cascade request, according to params", async () => {
    let testVar = 1;

    const result = await dispatchActions(
      {
        query: "any text",
        actions: [{ action: "event", params: { multiplyBy: 10 }, index: 0 }],
      },
      {
        event: (_, multiplyBy) => {
          testVar = 2 * multiplyBy;
        },
        anotherEvent: (_, multiplyBy) => {
          testVar = 3 * multiplyBy;
        },
      },
    );
    expect(result).toBe(undefined);
    expect(testVar).toBe(20);
  });

  it("should run multiple actions with params", async () => {
    let testVar1 = 1;
    let testVar2 = 1;

    const result = await dispatchActions(
      {
        query: "any text",
        actions: [
          { action: "event", params: { multiplyBy: 10 }, index: 0 },
          { action: "anotherEvent", params: { multiplyBy: 30 }, index: 1 },
        ],
      },
      {
        event: (_, multiplyBy) => {
          testVar1 = 2 * multiplyBy;
        },
        anotherEvent: (_, multiplyBy) => {
          testVar2 = 3 * multiplyBy;
        },
      },
    );
    expect(result).toBe(undefined);
    expect(testVar1).toBe(20);
    expect(testVar2).toBe(90);
  });

  it("should run multiple actions passing data", async () => {
    let testVar = 1;

    const result = await dispatchActions(
      {
        query: "any text",
        actions: [
          { action: "event", params: {}, index: 0 },
          { action: "anotherEvent", params: {}, index: 1 },
        ],
      },
      {
        event: (cascade) => {
          return 5;
        },
        anotherEvent: (cascade) => {
          testVar = 3 * cascade.data;
        },
      },
    );
    expect(result).toBe(undefined);
    expect(testVar).toBe(15);
  });

  it("should run multiple actions, passing data with params", async () => {
    let testVar1 = 1;
    let testVar2 = 1;

    const result = await dispatchActions(
      {
        query: "any text",
        actions: [
          { action: "event", params: { multiplyBy: 10 }, index: 0 },
          { action: "anotherEvent", params: { multiplyBy: 30 }, index: 1 },
        ],
      },
      {
        event: (cascade, multiplyBy) => {
          testVar1 = 2 * multiplyBy;
          return 5;
        },
        anotherEvent: (cascade, multiplyBy) => {
          testVar2 = 3 * cascade.data * multiplyBy;
        },
      },
    );
    expect(result).toBe(undefined);
    expect(testVar1).toBe(20);
    expect(testVar2).toBe(450);
  });
});
