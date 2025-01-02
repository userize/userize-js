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
  | null;

/**
 * Actions callbacks named map.
 */
export interface UserizeActionMap {
  [key: string]: UserizeAction;
}

/**
 * Utility actions callbacks named map.
 *
 * Utility actions are:
 * - before: triggered before any other action.
 * - after: triggered at the end of the action cascade.
 * - empty: triggered when there is no action to run in response of a query.
 * - error: triggered in case of error.
 */
export interface UserizeActionUtilityMap {
  before?: UserizeAction;
  after?: UserizeAction;
  empty?: UserizeAction;
  error?: UserizeAction;
}

/**
 * Raw context data.
 *
 * NOTE: Values must be JSON serializable.
 *       Anything that cannot be converted to string
 *       by `JSON.stringify()` will be discarded.
 *
 * For better results, keys should have a relevant name
 * that describes the context data.
 */
export type UserizeActionContextRaw = Record<string, unknown>;

/**
 * Actions API request interface.
 */
export interface UserizeActionRequest {
  /**
   * User query.
   */
  query: string;

  /**
   * Online context data that can be used to refine results.
   *
   * Should be provided as key-value pairs like:
   * `{ "relevant_key_name": "Natural language description" }`.
   */
  context?: Record<string, string>;

  /**
   * List of actions to include.
   */
  includeActions?: string[];

  /**
   * List of actions to exclude (take precedence over include).
   */
  excludeActions?: string[];

  /**
   * Optional user's timezone to refine results based on datetime.
   */
  timezone?: string;
}

/**
 * Actions API response interface.
 */
export interface UserizeActionResponse {
  /**
   * Unique request/response id.
   *
   * Should not be trusted when an error occurs (i.e. `errorMessage` is set).
   */
  id: string;

  /**
   * Original user query.
   */
  query: string;

  /**
   * List of actions that should be triggered.
   */
  actions:
    | {
        /**
         * Action name.
         */
        action: UserizeActionMethodConfig["name"];

        /**
         * Action parameters.
         */
        params: { name: string; value: UserizeActionParam; order: number }[];

        /**
         * Index of the action in the list.
         */
        index: number;
      }[]
    | null;

  /**
   * Error message, if any.
   */
  errorMessage: string | null;
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
   * Options that are governing the action cascade.
   */
  options: {
    /**
     * If true, action parameters are supplied as key-value pairs.
     * Otherwise, they are supplied as positional arguments.
     */
    namedParams: boolean;
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
