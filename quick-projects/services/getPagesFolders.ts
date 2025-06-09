import fs from "fs";
import path from "path";

export function getPagesFolders(): string[] {
  const pagesPath = path.join(process.cwd(), "pages");
  const entries = fs.readdirSync(pagesPath, { withFileTypes: true });

  const folders = entries
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith("_") &&
        !entry.name.startsWith("api") &&
        !entry.name.startsWith(".") &&
        entry.name !== "styles"
    )
    .map((entry) => entry.name);

  return folders;
}