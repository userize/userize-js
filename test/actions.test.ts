import { dispatchActions } from "src/actions";

describe("Test actions triggering", () => {
  it("should not do anything with no callbacks", async () => {
    const result = await dispatchActions(
      { query: "any text", actions: [], errorMessage: null },
      {},
    );
    expect(result).toBe(undefined);
  });

  it("should not do anything with callbacks but no input", async () => {
    let testVar = 1;

    const result = await dispatchActions(
      { query: "any text", actions: [], errorMessage: null },
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
        actions: [{ action: "event", params: [], index: 0 }],
        errorMessage: null,
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
        actions: [
          {
            action: "event",
            params: [{ name: "multiplyBy", value: 10, order: 0 }],
            index: 0,
          },
        ],
        errorMessage: null,
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
          {
            action: "event",
            params: [{ name: "multiplyBy", value: 10, order: 0 }],
            index: 0,
          },
          {
            action: "anotherEvent",
            params: [{ name: "multiplyBy", value: 30, order: 0 }],
            index: 1,
          },
        ],
        errorMessage: null,
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
          { action: "event", params: [], index: 0 },
          { action: "anotherEvent", params: [], index: 1 },
        ],
        errorMessage: null,
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
          {
            action: "event",
            params: [{ name: "multiplyBy", value: 10, order: 0 }],
            index: 0,
          },
          {
            action: "anotherEvent",
            params: [{ name: "multiplyBy", value: 30, order: 0 }],
            index: 1,
          },
        ],
        errorMessage: null,
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

  it("should run actions in order", async () => {
    let testVar = 5;

    await dispatchActions(
      {
        query: "any text",
        actions: [
          {
            action: "event1",
            params: [{ name: "add", value: 5, order: 0 }],
            index: 2,
          },
          {
            action: "event2",
            params: [{ name: "subtract", value: 3, order: 0 }],
            index: 0,
          },
          {
            action: "event3",
            params: [{ name: "multiply", value: 2, order: 0 }],
            index: 1,
          },
        ],
        errorMessage: null,
      },
      {
        event1: (_, add) => {
          testVar += add;
        },
        event2: (_, subtract) => {
          testVar -= subtract;
        },
        event3: (_, multiply) => {
          testVar *= multiply;
        },
      },
    );
    expect(testVar).toBe(9);
  });

  it("should run fallback method if no action is found", async () => {
    let testVar = 1;

    await dispatchActions(
      { query: "any text", actions: [], errorMessage: null },
      {
        event: ({ data }) => {
          return data * 2;
        },
        anotherEvent: ({ data }) => {
          return data * 3;
        },
      },
      {
        actionUtils: {
          before: () => 1,
          after: ({ data }) => data * 4,
          empty: ({ data }) => (testVar = data * 5),
        },
      },
    );
    expect(testVar).toBe(5);
  });
});
