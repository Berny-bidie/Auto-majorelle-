import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const root = process.cwd();
const localeFile = path.join(root, "client/src/locales/translations.ts");
const sourceRoot = path.join(root, "client/src");
const localeSource = ts.createSourceFile(localeFile, fs.readFileSync(localeFile, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const localeKeys = { en: new Set(), ar: new Set() };

function textOf(node) {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  return null;
}

function getPropertyName(node) {
  return node.name && (ts.isIdentifier(node.name) || ts.isStringLiteral(node.name)) ? node.name.text : null;
}

function readLocaleObjects(node) {
  if (!ts.isPropertyAssignment(node) || !ts.isObjectLiteralExpression(node.initializer)) return;
  const locale = getPropertyName(node);
  if (locale !== "en" && locale !== "ar") return;
  for (const entry of node.initializer.properties) {
    if (ts.isPropertyAssignment(entry)) {
      const key = getPropertyName(entry);
      if (key !== null) localeKeys[locale].add(normalize(key));
    }
  }
}

function visitLocaleTree(node) {
  readLocaleObjects(node);
  ts.forEachChild(node, visitLocaleTree);
}

visitLocaleTree(localeSource);

function normalize(value) {
  return value.replace(/\u00a0/g, " ").replace(/\s+/g, " ").trim();
}

function collectFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) return collectFiles(full);
    if (!/\.(tsx|ts)$/.test(entry.name)) return [];
    if (full.endsWith("/ComponentShowcase.tsx")) return [];
    return [full];
  });
}

const frenchAnchors = /\b(?:le|la|les|des|du|une|un|votre|vos|notre|nos|pour|avec|équipe|voiture|véhicule|showroom|contactez|choisissez|découvrez|retrouvez|demandez|vérifiez|appelez|avant|après|chaque|doit|peut|selon|conditions|annonces|horaires|itinéraire|informations|projet|visite|financement|reprise|stock|d’abord|ensuite|parcourez|présentés|confirmé|disponibilité|l’équipe)\b/giu;
const frenchAccents = /[àâçéèêëîïôùûüÿœæÀÂÇÉÈÊÎÏÔÙÛÜŸŒÆ]/;
const arabic = /[\u0600-\u06FF]/;
const englishIndicators = /\b(?:the|your|our|you|with|from|this|that|will|can|please|before|after|team|car|cars|vehicle|available|view|browse|contact|information|services|showroom|website)\b/giu;

function looksLikeFrench(value) {
  if (!value || arabic.test(value)) return false;
  if (frenchAccents.test(value)) return true;
  const french = new Set((value.match(frenchAnchors) ?? []).map(word => word.toLocaleLowerCase("fr")));
  const english = new Set((value.match(englishIndicators) ?? []).map(word => word.toLowerCase()));
  return french.size >= 2 && french.size > english.size;
}

const sources = [path.join(sourceRoot, "pages"), path.join(sourceRoot, "components/site")].flatMap(collectFiles);
const missing = new Map();
for (const file of sources) {
  const source = ts.createSourceFile(file, fs.readFileSync(file, "utf8"), ts.ScriptTarget.Latest, true, file.endsWith(".tsx") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  function visit(node) {
    let value = null;
    if (ts.isJsxText(node)) value = node.text;
    else value = textOf(node);
    if (value && looksLikeFrench(value)) {
      const key = normalize(value);
      const absent = ["en", "ar"].filter(locale => !localeKeys[locale].has(key));
      if (absent.length) {
        const line = source.getLineAndCharacterOfPosition(node.getStart(source)).line + 1;
        const location = `${path.relative(root, file)}:${line}`;
        const previous = missing.get(key) ?? { absent: new Set(), locations: [] };
        absent.forEach(locale => previous.absent.add(locale));
        previous.locations.push(location);
        missing.set(key, previous);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(source);
}

if (missing.size) {
  console.error(`i18n coverage failed: ${missing.size} visitor-facing French source strings are missing EN/AR translations.`);
  for (const [text, data] of missing) console.error(`- [${[...data.absent].join(", ")}] ${data.locations.join(", ")} — ${text.slice(0, 200)}`);
  process.exitCode = 1;
} else {
  console.log(`i18n coverage passed: all detected French source strings in ${sources.length} page/shared files have EN and AR entries.`);
}
