import { UserizeActionMethodConfig } from "types/actionsConfig";

/**
 * Action method, triggered by actions API.
 */
export type UserizeAction = (
  cascade: UserizeActionCascade,
  ...params: any[] // TODO: use generics to better type params
) => UserizeActionCascadeData | Promise<UserizeActionCascadeData> | void;

/**
 * Generic action parameter type.
 */
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

/**
 * Actions callbacks named map.
 */
export interface UserizeActionMap {
  [key: string]: UserizeAction;
}

/**
 * Actions API response interface.
 */
export interface UserizeActionResponse {
  /**
   * Original user query.
   */
  query: string;

  /**
   * List of actions that should be triggered.
   */
  actions: {
    /**
     * Action name.
     */
    action: UserizeActionMethodConfig["name"];

    /**
     * Action parameters.
     */
    params: { [name: string]: UserizeActionParam };

    /**
     * Index of the action in the list.
     */
    index: number;
  }[];
}

/**
 * Action cascade info, supplied as first argument
 * to action callbacks.
 */
export interface UserizeActionCascade {
  /**
   * Event cascade info.
   */
  event: {
    /**
     * Current event index in the cascade.
     */
    idx: number;

    /**
     * Total number of events in the cascade.
     */
    length: number;

    /**
     * Previous event name. Is null for first event,
     * undefined if previous event's action was not found.
     */
    prev: string | null | undefined;

    /**
     * Next event name. Is null for last event.
     */
    next: string | null;
  };

  /**
   * Optional custom data to pass to next event.
   */
  data: UserizeActionCascadeData;
}

/**
 * Data to pass from one action to the next.
 */
export type UserizeActionCascadeData = any;
