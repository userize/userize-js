import type { UserizeActionCascade } from "userize-js";
import data from "../data.json";

// Data might be retrieved from a database
const items = data.map((item) => ({
  ...item,
  addedAt: new Date(item.addedAt),
  lastBoughtAt: new Date(item.lastBoughtAt),
}));

export function search(cascade: UserizeActionCascade, color: string) {
  // Assume a list of "items"

  const filteredItems = items.filter((item) => item.color === color);

  // Optionally, we can run different flows
  // if one of these items will be add to chart or not
  if (cascade.event.next !== null) {
    // Next action will just consume filtered items
    return filteredItems;
  } else {
    // Here we may show filtered items to user
    console.log("Filtered Items: ", filteredItems);
  }
}

export function select(
  cascade: UserizeActionCascade,
  chooseItem: string | undefined,
) {
  // We can retrieve items from the "search" action
  const filteredItems = (cascade.data as typeof items | undefined) ?? items;

  let selectedItem;

  switch (chooseItem) {
    case "newest":
      selectedItem = filteredItems.sort(
        (a, b) => b.addedAt.getTime() - a.addedAt.getTime(),
      )[0];
      break;

    case "cheapest":
      selectedItem = filteredItems.sort((a, b) => a.price - b.price)[0];
      break;

    case "trendy":
      selectedItem = filteredItems.sort(
        (a, b) => b.lastBoughtAt.getTime() - a.lastBoughtAt.getTime(),
      )[0];
      break;
  }

  // We may now addToCart(selectedItem)
  console.log("Selected Item: ", selectedItem);
}
