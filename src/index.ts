import UsertiseClient from "./UsertiseClient";

const usertise = new UsertiseClient();

export function initClient(
  apiKey?: UsertiseClientOptions["apiKey"],
  options?: Omit<UsertiseClientOptions, "apiKey">,
) {
  usertise.setOptions({ ...options, apiKey });
  return usertise;
}
export const registerAction = usertise.on.bind(usertise);
export const clearAction = usertise.clear.bind(usertise);
export const hasAction = usertise.handles.bind(usertise);

export const query = usertise.query.bind(usertise);
