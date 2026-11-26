import { describe, expect, it } from "vitest";
import { isPublicInventorySlug } from "./publicInventory";

describe("public inventory visibility", () => {
  it("hides explicit test and demo fixtures", () => {
    expect(isPublicInventorySlug("test-dacia-logan-marrakech")).toBe(false);
    expect(isPublicInventorySlug("DEMO-kia-sportage")).toBe(false);
  });

  it("keeps ordinary published vehicle slugs visible", () => {
    expect(isPublicInventorySlug("dacia-logan-marrakech-2022")).toBe(true);
  });
});
