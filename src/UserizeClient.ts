import { dispatchActions } from "./actions";
import {
  API_ACTIONS_QUERY_PATH,
  getContextFromRaw,
  queryActionApi,
} from "./actionsApi";
import type {
  UserizeAction,
  UserizeActionContextRaw,
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

  constructor(apiKey?: string | null, options?: UserizeClientOptions) {
    this.init(apiKey, options);
  }

  /**
   * Initialize the Userize client.
   *
   * @param apiKey - The API key to use.
   * @param options - The client options.
   * @returns The initialized Userize client.
   */
  init(apiKey?: string | null, options?: UserizeClientOptions) {
    if (apiKey !== undefined) this.setApiKey(apiKey);
    if (options) this.setOptions(options);

    return this;
  }

  /**
   * Set the API key.
   *
   * @param apiKey - The API key.
   */
  setApiKey(apiKey: string | null) {
    this.apiKey = apiKey;
  }

  /**
   * Set the client options.
   *
   * @param options - Client options.
   */
  setOptions(options: UserizeClientOptions) {
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
   * @param context - Context data.
   * @returns True if API call is successful, false if any error message is returned.
   */
  async actionsQuery(
    query: string,
    context?: UserizeActionContextRaw,
  ): Promise<boolean> {
    return this.actionsQueryProxy(
      this.resolveApiPath(API_ACTIONS_QUERY_PATH),
      query,
      context,
    );
  }

  /**
   * Trigger actions reacting to a given user query.
   *
   * Fetch the actions that should be triggered, based on
   * user request, and run them in a cascade fashion.
   *
   * @param proxy - URL to API endpoint, or object with proxy API connection info.
   * @param query - The user query.
   * @param context - Context data.
   * @returns True if API call is successful, false if any error message is returned.
   */
  async actionsQueryProxy(
    proxy: string | URL | { url: string | URL; headers?: HeadersInit },
    query: string,
    context?: UserizeActionContextRaw,
  ): Promise<boolean> {
    // Get api key
    const apiKey = this.getApiKey();

    // Extract proxy info
    const { url, headers } =
      typeof proxy === "string" || proxy instanceof URL
        ? { url: proxy }
        : proxy;

    // Prepare body and headers
    const reqBody: UserizeActionRequest = {
      query,
      ...(context ? { context: getContextFromRaw(context) } : {}),
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

    return response.errorMessage === null;
  }
}
