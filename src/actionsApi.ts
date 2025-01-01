import type {
  UserizeActionRequest,
  UserizeActionResponse,
} from "types/actions";

export const API_ACTIONS_QUERY_PATH = "/actions/query";

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
