import { dispatchActions } from "./actions";
import { API_ACTIONS_QUERY_PATH, queryActionApi } from "./actionsApi";
import type {
  UserizeAction,
  UserizeActionMap,
  UserizeActionRequest,
  UserizeActionUtilityMap,
} from "types/actions";
import type { UserizeClientOptions } from "types/client";

export default class UserizeClient {
  // API values
  readonly apiUrl: string = "https://api.userize.it";
  readonly apiVersion: string = "v1";
  private apiKey: string | null = process.env.USERIZE_API_KEY ?? null;

  // Actions
  private actionCallbacks: UserizeActionMap = {};
  private actionCallbacksUtils: UserizeActionUtilityMap = {};

  // Additional action options
  private actionOptions: { namedParams?: UserizeClientOptions["namedParams"] } =
    {};

  constructor(options?: UserizeClientOptions) {
    if (options) this.setOptions(options);
  }

  /**
   * Set the client options.
   *
   * @param options - Client options.
   */
  setOptions(options: UserizeClientOptions) {
    if (options.apiKey !== undefined) this.apiKey = options.apiKey;
    if (options.actions !== undefined)
      this.actionCallbacks = options.actions || {};

    // Set utility callbacks
    if (options.beforeActions !== undefined)
      this.actionCallbacksUtils.before = options.beforeActions ?? undefined;
    if (options.afterActions !== undefined)
      this.actionCallbacksUtils.after = options.afterActions ?? undefined;
    if (options.actionOnEmpty !== undefined)
      this.actionCallbacksUtils.empty = options.actionOnEmpty ?? undefined;
    if (options.actionOnError !== undefined)
      this.actionCallbacksUtils.error = options.actionOnError ?? undefined;

    // Set additional options
    if (options.namedParams !== undefined)
      this.actionOptions.namedParams = options.namedParams;
  }

  /**
   * Convert a relative URL path to an absolute API path.
   *
   * @param urlPath - Relative URL path.
   * @returns Absolute API path.
   */
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
   * Register a named action that can be triggered.
   *
   * @param name - The action name.
   * @param callback - Action callback.
   */
  actionSet(name: string, callback: UserizeAction) {
    this.actionCallbacks[name] = callback;
  }

  /**
   * Remove any action associated to a name.
   *
   * @param name - The action name.
   */
  actionClear(name: string) {
    delete this.actionCallbacks[name];
  }

  /**
   * Check if there exists an action with given name.
   *
   * @param name - The action name.
   * @returns True if there exists an action with given name, false otherwise.
   */
  hasAction(name: string) {
    return this.actionCallbacks[name] !== undefined;
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
    return this.actionsQueryProxy(
      query,
      this.resolveApiPath(API_ACTIONS_QUERY_PATH),
    );
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
    const reqBody: UserizeActionRequest = {
      query,
      includeActions: Object.keys(this.actionCallbacks),
    };
    const reqHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...(apiKey ? { "x-api-key": apiKey } : {}),
      ...headers,
    };

    // Call API and handle response
    const response = await queryActionApi(url, reqHeaders, reqBody);

    dispatchActions(response, this.actionCallbacks, {
      actionUtils: this.actionCallbacksUtils,
      ...this.actionOptions,
    });
  }
}
