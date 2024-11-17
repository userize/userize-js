import type { UserizeClientOptions } from "types/client";
import UserizeClient from "./UserizeClient";

const userize = new UserizeClient();

export function initClient(
  apiKey?: UserizeClientOptions["apiKey"],
  options?: Omit<UserizeClientOptions, "apiKey">,
) {
  userize.setOptions({ ...options, apiKey });
  return userize;
}

export const registerAction = userize.actionOn.bind(userize);
export const clearAction = userize.actionClear.bind(userize);
export const hasAction = userize.hasAction.bind(userize);

export const actionsTrigger = userize.actionsQuery.bind(userize);
export const actionsTriggerWithProxy = userize.actionsQueryProxy.bind(userize);

// Make public types available
// Do not remove!
export * from "./types";
