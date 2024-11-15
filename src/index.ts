import type { UserizeClientOptions } from "types/actions";
import UserizeClient from "./UserizeClient";

const userize = new UserizeClient();

export function initClient(
  apiKey?: UserizeClientOptions["apiKey"],
  options?: Omit<UserizeClientOptions, "apiKey">,
) {
  userize.setOptions({ ...options, apiKey });
  return userize;
}

export const registerAction = userize.on.bind(userize);
export const clearAction = userize.clear.bind(userize);
export const hasAction = userize.handles.bind(userize);

export const handleRequest = userize.react.bind(userize);
export const handleRequestWithProxy = userize.reactProxy.bind(userize);

// Make public types available
// Do not remove!
export * from "./types";
