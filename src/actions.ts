import type {
  UserizeAction,
  UserizeActionCascade,
  UserizeActionCascadeData,
  UserizeActionMap,
  UserizeActionParam,
  UserizeActionResponse,
} from "types/actions";

/**
 * Dispatch API response to selected actions.
 *
 * @param response - API response.
 * @param actions - Available action callbacks.
 */
export async function dispatchActions(
  response: UserizeActionResponse,
  actions: UserizeActionMap,
) {
  // Prepare initial data
  const cascade = initActionCascade(response);

  for (let [actionIdx, actionInfo] of response.actions.entries()) {
    // Set next event
    cascade.event.idx = actionIdx;
    cascade.event.next = response.actions[actionIdx + 1]?.action ?? null;

    // Run action callback
    const action: UserizeAction | undefined = actions[actionInfo.action];
    if (!action) {
      // Set previous event as undefined since action is not found
      cascade.event.prev = undefined;
    } else {
      cascade.data = await triggerAction(action, cascade, actionInfo.params);

      // Set previous event
      cascade.event.prev = actionInfo.action;
    }
  }
}

/**
 * Initialize action cascade.
 *
 * @param fromResponse - Optional action cascade response from which to initialize.
 * @returns Default action cascade.
 */
function initActionCascade(
  fromResponse?: UserizeActionResponse,
): UserizeActionCascade {
  return {
    event: {
      idx: 0,
      length: fromResponse?.actions.length ?? 0,
      prev: null,
      next: null,
    },
    data: null,
  };
}

/**
 * Run a single action callback.
 *
 * @param action - Action callback.
 * @param cascade - Actions cascade parameters.
 * @param params - Action-specific parameters.
 * @returns Optional data to pass to the next action.
 */
async function triggerAction(
  action: UserizeAction,
  cascade: UserizeActionCascade,
  params: { [key: string]: UserizeActionParam },
): Promise<UserizeActionCascadeData | null> {
  const res = await action(cascade, ...Object.values(params));

  return res ?? null;
}
