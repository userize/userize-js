interface UsertiseClientOptions {
  apiKey?: string;
  callbacks?: { [key: string]: UsertiseAction };
}

// TODO: use generics to better type args
type UsertiseAction = (
  cascade: UsertiseActionCascade,
  ...args: any[]
) => UsertiseActionCascadeData | Promise<UsertiseActionCascadeData> | void;

interface UsertiseActionMap {
  [key: string]: UsertiseAction;
}

type UsertiseActionParam =
  | string
  | number
  | boolean
  | Date
  | string[]
  | number[]
  | boolean[]
  | Date[]
  | undefined;

interface UsertiseActionResponse {
  query: string;
  actions: {
    event: string;
    params: { [key: string]: UsertiseActionParam };
  }[];
}

interface UsertiseActionCascade {
  // event cascade info
  event: {
    // current event index in the cascade
    idx: number;

    // total number of events in the cascade
    length: number;

    // previous event name, null if first event, undefined if previous event's action was not found
    prev: string | null | undefined;

    // next event name, null if last event
    next: string | null;
  };

  // optional data to pass to next event
  data: UsertiseActionCascadeData;
}

type UsertiseActionCascadeData = any;
