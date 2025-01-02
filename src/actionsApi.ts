import type {
  UserizeActionContextRaw,
  UserizeActionRequest,
  UserizeActionResponse,
} from "types/actions";

export const API_ACTIONS_QUERY_PATH = "/actions/query";

/**
 * Convert raw context data to context for API call.
 *
 * @param contextRaw - Raw context data.
 * @returns Context data for API call.
 */
export function getContextFromRaw(
  contextRaw: UserizeActionContextRaw,
): UserizeActionRequest["context"] {
  const context: UserizeActionRequest["context"] = Object.fromEntries(
    Object.entries(contextRaw).map(([key, value]) => {
      try {
        return [key, JSON.stringify(value)];
      } catch (error) {
        return [key, "<DATA UNAVAILABLE: CANNOT BE CONVERTED TO STRING>"];
      }
    }),
  );

  return context;
}

/**
 * Perform the API call to query actions.
 *
 * @param url - API full URL.
 * @param headers - API headers.
 * @param request - Action API request.
 * @returns Action API response.
 */
export async function queryActionApi(
  url: string | URL,
  headers: HeadersInit,
  request: UserizeActionRequest,
): Promise<UserizeActionResponse> {
  let response: UserizeActionResponse = {
    id: "0", // dummy
    query: request.query,
    actions: null,
    errorMessage: null,
  };

  // Ensure query is not empty
  if (request.query.length < 2) {
    response.errorMessage = "Query is empty.";
    return response;
  }

  // Perform the call to API
  try {
    const apiResponse = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(request),
    });

    // Get response body
    try {
      response = await apiResponse.json();
    } catch (error) {
      response.errorMessage = `API response status: ${apiResponse.status}. ${apiResponse.statusText}`;
    }
  } catch (error) {
    response.errorMessage = `API error: ${error}`;
  }

  return response;
}
