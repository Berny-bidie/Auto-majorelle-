import { describe, expect, it } from "vitest";
import { isDemoInventorySlug } from "./publicInventory";

describe("demo inventory identification", () => {
  it("recognizes test and demo fixtures", () => {
    expect(isDemoInventorySlug("test-dacia-logan-marrakech")).toBe(true);
    expect(isDemoInventorySlug("DEMO-kia-sportage")).toBe(true);
  });

  it("does not mark ordinary vehicle slugs as demos", () => {
    expect(isDemoInventorySlug("dacia-logan-marrakech-2022")).toBe(false);
  });
});
