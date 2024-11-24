import type {
  UserizeAction,
  UserizeActionCascade,
  UserizeActionCascadeData,
  UserizeActionMap,
  UserizeActionParam,
  UserizeActionResponse,
  UserizeActionUtilityMap,
} from "types/actions";

/**
 * Dispatch API response to selected actions.
 *
 * @param response - API response.
 * @param actions - Available action callbacks.
 * @param actionUtils - Action utility callbacks.
 */
export async function dispatchActions(
  response: UserizeActionResponse,
  actions: UserizeActionMap,
  { actionUtils }: { actionUtils?: UserizeActionUtilityMap } = {},
) {
  // Prepare initial data
  const cascade = initActionCascade(response);

  // Run error action, if needed
  if (!response.actions) {
    if (actionUtils?.error)
      await triggerAction(actionUtils.error, cascade, [
        {
          name: "errorMessage",
          value: response.errorMessage ?? null,
          order: 0,
        },
      ]);
    return;
  }

  // Run action cascade with before/after callbacks

  if (actionUtils?.before) await triggerAction(actionUtils.before, cascade, []);

  if (response.actions.length === 0) {
    if (actionUtils?.empty) await triggerAction(actionUtils.empty, cascade, []);
  } else await runActionCascade(response.actions, actions, cascade);

  if (actionUtils?.after) await triggerAction(actionUtils.after, cascade, []);
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
      length: fromResponse?.actions?.length ?? 0,
      prev: null,
      next: null,
    },
    data: null,
  };
}

/**
 * Run actions cascade in sequence, updating cascade info.
 *
 * @param actions - Actions to run.
 * @param callbacks - Available action callbacks.
 * @param cascade - Actions cascade parameters, that will be updated.
 */
async function runActionCascade(
  actions: NonNullable<UserizeActionResponse["actions"]>,
  callbacks: UserizeActionMap,
  cascade: UserizeActionCascade,
) {
  // Sort actions by order
  actions.sort((a, b) => a.index - b.index);

  // Run actions
  for (let [actionIdx, actionInfo] of actions.entries()) {
    // Set next event
    cascade.event.idx = actionIdx;
    cascade.event.next = actions[actionIdx + 1]?.action ?? null;

    // Run action callback
    const action: UserizeAction | undefined = callbacks[actionInfo.action];
    if (!action) {
      // Set previous event as undefined since action is not found
      cascade.event.prev = undefined;
    } else {
      await triggerAction(action, cascade, actionInfo.params);

      // Set previous event
      cascade.event.prev = actionInfo.action;
    }
  }
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
  params: NonNullable<UserizeActionResponse["actions"]>[number]["params"],
): Promise<UserizeActionCascadeData | null> {
  const paramValues: UserizeActionParam[] = params
    .sort((a, b) => a.order - b.order)
    .map((p) => p.value);
  const res = await action(cascade, ...paramValues);

  // Update cascade data
  cascade.data = res;

  return res;
}
