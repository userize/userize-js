import type { UserizeAction } from "types/actions";

/**
 * Options for the Userize client.
 */
export interface UserizeClientOptions {
  /**
   * The private API key to use for requests.
   * If not provided, will look for `USERIZE_API_KEY` in the environment.
   * Can be ignored if using a proxy API endpoint.
   */
  apiKey?: string;

  /**
   * Actions callbacks may be provided in batch,
   * or registered individually.
   */
  actions?: { [key: string]: UserizeAction };
}
