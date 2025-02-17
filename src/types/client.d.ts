import type { UserizeAction, UserizeActionUtilityMap } from "types/actions";

/**
 * Options for the Userize client.
 */
export interface UserizeClientOptions {
  /**
   * Actions callbacks may be provided in batch,
   * or registered individually.
   */
  actions?: { [key: string]: UserizeAction } | null;

  /**
   * Action callback that will run before the cascade.
   */
  beforeActions?: UserizeActionUtilityMap["before"] | null;

  /**
   * Action callback that will run after the cascade.
   */
  afterActions?: UserizeActionUtilityMap["after"] | null;

  /**
   * Action callback to run when there are no actions to run,
   * that is when selected actions are not useful to the user's query.
   */
  actionOnEmpty?: UserizeActionUtilityMap["empty"] | null;

  /**
   * Action callback to run in case of error.
   */
  actionOnError?: UserizeActionUtilityMap["error"] | null;

  /**
   * Require named parameters instead of positional arguments.
   */
  namedParams?: boolean;
}
