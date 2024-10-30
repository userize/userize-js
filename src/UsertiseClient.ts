import { dispatchActions } from "./actions";

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

  async query(text: string) {
    const apiKey = this.getApiKey();

    return this.queryProxy(text, this.resolveApiPath("/query"), {
      "x-api-key": apiKey,
    });
  }

  async queryProxy(text: string, url: string | URL, headers?: HeadersInit) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: JSON.stringify({ text }),
    });

    // Handle response
    dispatchActions(await response.json(), this.callbacks);
  }
}
