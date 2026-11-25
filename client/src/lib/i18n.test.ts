import { describe, expect, it } from "vitest";
import { translateText } from "./i18n";

describe("translateText", () => {
  it("substitutes single-brace placeholders", () => {
    expect(translateText("Voir Renault Clio", "en")).toBe("View Renault Clio");
  });

  it("substitutes double-brace placeholders in English and Arabic", () => {
    expect(translateText("Renault Clio à Marrakech", "en")).toBe("Renault Clio in Marrakech");
    expect(translateText("Voir la photo 4", "ar")).toBe("عرض الصورة 4");
  });

  it("keeps the French source and leaves unknown text unchanged", () => {
    expect(translateText("Voir la photo {{photoNumber}}", "fr")).toBe("Voir la photo {{photoNumber}}");
    expect(translateText("Texte libre non répertorié", "en")).toBe("Texte libre non répertorié");
  });
});
