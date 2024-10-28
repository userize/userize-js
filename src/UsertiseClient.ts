// TODO: may return a promise, or Usertise cascade input
type Callback = (...args: any[]) => any;

export default class UsertiseClient {
  private callbacks: { [key: string]: Callback } = {};

  addCallback(event: string, callback: Callback) {
    this.callbacks[event] = callback;
  }

  removeCallback(event: string) {
    delete this.callbacks[event];
  }

  hasCallback(event: string) {
    return this.callbacks[event] !== undefined;
  }
}
