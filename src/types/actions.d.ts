export interface UserizeClientOptions {
  apiKey?: string;
  callbacks?: { [key: string]: UserizeAction };
}

// TODO: use generics to better type args
export type UserizeAction = (
  cascade: UserizeActionCascade,
  ...args: any[]
) => UserizeActionCascadeData | Promise<UserizeActionCascadeData> | void;

export interface UserizeActionMap {
  [key: string]: UserizeAction;
}

export type UserizeActionParam =
  | string
  | number
  | boolean
  | Date
  | string[]
  | number[]
  | boolean[]
  | Date[]
  | undefined;

export interface UserizeActionResponse {
  query: string;
  actions: {
    // action name
    action: ApiActionSingleConfig["name"];

    // action parameters
    params: {
      [name: string]:
        | string
        | number
        | boolean
        | Date
        | string[]
        | number[]
        | boolean[]
        | Date[]
        | undefined;
    };

    // index of the trigger in the list
    index: number;
  }[];
}

export interface UserizeActionCascade {
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
  data: UserizeActionCascadeData;
}

export type UserizeActionCascadeData = any;
