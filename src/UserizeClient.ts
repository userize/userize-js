import { dispatchActions } from "./actions";
import type { UserizeAction, UserizeActionMap } from "types/actions";
import type { UserizeClientOptions } from "types/client";

export default class UserizeClient {
  readonly apiUrl: string = "https://api.userize.it";
  readonly apiVersion: string = "v1";
  private apiKey: string | undefined = process.env.USERIZE_API_KEY;
  private actionCallbacks: UserizeActionMap = {};

  constructor(options?: UserizeClientOptions) {
    if (options) this.setOptions(options);
  }

  setOptions(options: UserizeClientOptions) {
    if (options.apiKey != undefined) this.apiKey = options.apiKey;
    if (options.actions != undefined)
      this.actionCallbacks = options.actions || {};
  }

  private resolveApiPath(urlPath: string) {
    const cleanUrlPath = urlPath.replace(/^\//, "");
    return `${this.apiUrl}/${this.apiVersion}/${cleanUrlPath}`;
  }

  /**
   * Returns the API key.
   *
   * @param required - Throw an error if the API key is not set.
   * @returns The API key.
   */
  private getApiKey(required?: boolean) {
    if (required && !this.apiKey) throw new Error("Missing required API key");
    return this.apiKey;
  }

  /**
   * Register an action for an event.
   *
   * @param event - The event name.
   * @param callback - Action callback.
   */
  actionOn(event: string, callback: UserizeAction) {
    this.actionCallbacks[event] = callback;
  }

  /**
   * Remove any action associated with an event.
   *
   * @param event - The event name.
   */
  actionClear(event: string) {
    delete this.actionCallbacks[event];
  }

  /**
   * Check if there is an action callback associated with an event.
   *
   * @param event - The event name.
   * @returns True if there exists an action associated with the event.
   */
  hasAction(event: string) {
    return this.actionCallbacks[event] !== undefined;
  }

  /**
   * Trigger actions reacting to a given user query.
   *
   * Fetch the actions that should be triggered, based on
   * user request, and run them in a cascade fashion.
   *
   * @param query - The user query.
   */
  async actionsQuery(query: string) {
    return this.actionsQueryProxy(query, this.resolveApiPath("/actions/query"));
  }

  /**
   * Trigger actions reacting to a given user query.
   *
   * Fetch the actions that should be triggered, based on
   * user request, and run them in a cascade fashion.
   *
   * @param query - The user query.
   * @param url - URL to API endpoint.
   * @param headers - Optional headers to send with the request.
   */
  async actionsQueryProxy(
    query: string,
    url: string | URL,
    headers?: HeadersInit,
  ) {
    // Get api key
    const apiKey = this.getApiKey();

    // Prepare body and headers
    const reqBody = {
      query,
      filter: Object.keys(this.actionCallbacks),
    };
    const reqHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...(apiKey ? { "x-api-key": apiKey } : {}),
      ...headers,
    };

    // API call
    const response = await fetch(url, {
      method: "POST",
      headers: reqHeaders,
      body: JSON.stringify(reqBody),
    });

    // Handle response
    dispatchActions(await response.json(), this.actionCallbacks);
  }
}
