import UsertiseClient from "./UsertiseClient";

const usertise = new UsertiseClient();

export const addCallback = usertise.addCallback.bind(usertise);
export const removeCallback = usertise.removeCallback.bind(usertise);
export const hasCallback = usertise.hasCallback.bind(usertise);
