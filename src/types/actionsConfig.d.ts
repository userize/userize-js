/**
 * Single action parameter info.
 */
export interface UserizeActionConfigParam<
  T extends "string" | "number" | "boolean" | "datetime",
> {
  /**
   * Parameter meaning, and usage within the action.
   */
  description: string;

  /**
   * Parameter type.
   */
  datatype: T;

  /**
   * Argument index in action trigger.
   */
  order: number;

  /**
   * Range for numbers and datetimes.
   */
  range?: T extends "number"
    ? [number, number]
    : T extends "datetime"
    ? [Date, Date]
    : never;

  /**
   * Set of available values.
   */
  values?: T extends "number"
    ? number[]
    : T extends "datetime"
    ? Date[]
    : T extends "string"
    ? string[]
    : never;

  /**
   * Param is an array of selected datatype.
   */
  isArray?: boolean;

  /**
   * Is optional in action trigger.
   */
  isNullable?: boolean;
}

/**
 * Configuration of a single action.
 */
export interface UserizeActionMethodConfig {
  /**
   * Unique name to identify the action.
   */
  name: string;

  /**
   * Description of action and how to use it.
   */
  description: string;

  /**
   * Parameters of the action method.
   */
  params: Record<
    string,
    | UserizeActionConfigParam<"string">
    | UserizeActionConfigParam<"number">
    | UserizeActionConfigParam<"boolean">
    | UserizeActionConfigParam<"datetime">
  >;
}

/**
 * Configuration of a single enum.
 */
export interface UserizeActionEnumConfig {
  /**
   * Unique name to identify the enum.
   */
  name: string;

  /**
   * Optional enum description.
   */
  description?: string;

  /**
   * Datatype of enum values.
   */
  datatype: "string" | "number" | "datetime";

  /**
   * List of enum values.
   */
  values: string[] | number[] | Date[];
}

/**
 * Configuration of the actions api.
 */
export interface UserizeActionConfig {
  /**
   * Project ID.
   */
  projectId: string;

  /**
   * Description of what actions api is used for.
   */
  description?: string;

  /**
   * List of available actions with info.
   */
  actions: UserizeActionMethodConfig[];

  /**
   * List of available enums with info.
   */
  enums: UserizeActionEnumConfig[];
}
