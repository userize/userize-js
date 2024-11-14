import { dispatchActions } from "./actions";
import {
  UsertiseAction,
  UsertiseActionMap,
  UsertiseClientOptions,
} from "./types";

export default class UsertiseClient {
  readonly apiUrl: string = "https://api.usertise.com";
  readonly apiVersion: string = "v1";
  private apiKey: string | undefined;
  private callbacks: UsertiseActionMap = {};

  constructor(options?: UsertiseClientOptions) {
    if (options) this.setOptions(options);
  }

  setOptions(options: UsertiseClientOptions) {
    this.apiKey = options.apiKey;
    this.callbacks = options.callbacks || {};
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
  on(event: string, callback: UsertiseAction) {
    this.callbacks[event] = callback;
  }

  /**
   * Remove any callback associated with an event.
   *
   * @param event - The event name.
   */
  clear(event: string) {
    delete this.callbacks[event];
  }

  /**
   * Check if there is a callback associated with an event.
   *
   * @param event - The event name.
   * @returns True if there exists a callback associated with the event.
   */
  handles(event: string) {
    return this.callbacks[event] !== undefined;
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
      filter: Object.keys(this.callbacks),
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
    dispatchActions(await response.json(), this.callbacks);
  }
}
