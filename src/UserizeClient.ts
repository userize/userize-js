import { dispatchActions } from "./actions";
import type { UserizeAction, UserizeActionMap } from "types/actions";
import type { UserizeClientOptions } from "types/client";

export default class UserizeClient {
  readonly apiUrl: string = "https://api.userize.com";
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

  private getApiKey() {
    if (!this.apiKey) throw new Error("Missing required API key");
    return this.apiKey;
  }

  /**
   * Register a callback for an event.
   *
   * @param event - The event name.
   * @param callback - Callback function.
   */
  on(event: string, callback: UserizeAction) {
    this.actionCallbacks[event] = callback;
  }

  /**
   * Remove any callback associated with an event.
   *
   * @param event - The event name.
   */
  clear(event: string) {
    delete this.actionCallbacks[event];
  }

  /**
   * Check if there is a callback associated with an event.
   *
   * @param event - The event name.
   * @returns True if there exists a callback associated with the event.
   */
  handles(event: string) {
    return this.actionCallbacks[event] !== undefined;
  }

  /**
   * React to a given user query.
   *
   * Fetch the actions that should be triggered, based on
   * user request, and run them in a cascade fashion.
   *
   * @param query - The user query.
   */
  async react(query: string) {
    const apiKey = this.getApiKey();

    return this.reactProxy(query, this.resolveApiPath("/actions/query"), {
      "x-api-key": apiKey,
    });
  }

  /**
   * React to a given user query.
   *
   * Fetch the actions that should be triggered, based on
   * user request, and run them in a cascade fashion.
   *
   * @param query - The user query.
   * @param url - URL to API endpoint.
   * @param headers - Optional headers to send with the request.
   */
  async reactProxy(query: string, url: string | URL, headers?: HeadersInit) {
    // Prepare body
    const body = {
      query,
      filter: Object.keys(this.actionCallbacks),
    };

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify(body),
    });

    // Handle response
    dispatchActions(await response.json(), this.actionCallbacks);
  }
}
