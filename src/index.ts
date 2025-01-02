import type { UserizeClientOptions } from "types/client";
import UserizeClient from "./UserizeClient";

const userize = new UserizeClient();

/**
 * Initialize the Userize client with options.
 *
 * NOTE: Any undefined option will be ignored, keeping the option as it is.
 *       To force option to fallback to default value, use `null` instead.
 *
 * @param apiKey - The API key. If not provided, process.env.USERIZE_API_KEY will be used. Can be null when using a proxy API endpoint.
 * @param options - The client options.
 * @returns The initialized Userize client.
 */
export const initClient = userize.init.bind(userize);

/**
 * Set the client options.
 *
 * NOTE: Any undefined option will be ignored, keeping the option as it is.
 *       To force option to fallback to default value, use `null` instead.
 *
 * @param options - Client options.
 */
export const setOptions = userize.setOptions.bind(userize);

/**
 * Register a named action that can be triggered.
 *
 * @param name - The action name.
 * @param callback - Action callback.
 */
export const registerAction = userize.actionSet.bind(userize);
/**
 * Remove any action associated to a name.
 *
 * @param name - The action name.
 */
export const clearAction = userize.actionClear.bind(userize);
/**
 * Check if there exists an action with given name.
 *
 * @param name - The action name.
 * @returns True if there exists an action with given name, false otherwise.
 */
export const hasAction = userize.hasAction.bind(userize);

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
export const triggerActions = userize.actionsQuery.bind(userize);
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
export const triggerActionsWithProxy = userize.actionsQueryProxy.bind(userize);

// Make public types available
// Do not remove!
export * from "./types";
