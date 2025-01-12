import { initClient, registerAction, triggerActions } from "userize-js";
import { search, select } from "./actions";

initClient("YOUR-API-KEY");

registerAction("search", search);
registerAction("select", select);

// TRY IT with:
// 1- "I love black, show me something cool"
// 2- "I want to buy the very latest dress for the party"
// 3- "I don't care what to buy, I just need it to be blue and cheap"
triggerActions("Your input text goes here");

/**
 * Example 1: "I love black, show me something cool"
 *
 * Actions run: `search`
 *
 * It should display:
 *
 *   Filtered Items:  [
 *     {
 *       name: 'dress',
 *       color: 'black',
 *       price: 15,
 *       addedAt: 2024-08-15T00:00:00.000Z,
 *       lastBoughtAt: 2024-10-01T00:00:00.000Z
 *     },
 *     {
 *       name: 'socks',
 *       color: 'black',
 *       price: 2,
 *       addedAt: 2024-10-08T00:00:00.000Z,
 *       lastBoughtAt: 2024-10-08T00:00:00.000Z
 *     }
 *   ]
 */

/**
 * Example 2: "I want to buy the very latest dress for the party"
 *
 * Actions run: `select`
 *
 * It should display:
 *
 *   Selected Item:  {
 *     name: 'tshirt',
 *     color: 'red',
 *     price: 5,
 *     addedAt: 2024-09-02T00:00:00.000Z,
 *     lastBoughtAt: 2024-10-05T00:00:00.000Z
 *   }
 */

/**
 * Example 3: "I don't care what to buy, I just need it to be blue and cheap
 *
 * Actions run: `search` -> `select`
 *
 * It should display, from console:
 *
 *   Selected Item:  {
 *     name: 'pants',
 *     color: 'blue',
 *     price: 10,
 *     addedAt: 2024-07-29T00:00:00.000Z,
 *     lastBoughtAt: 2024-09-24T00:00:00.000Z
 *   }
 */
