import fs from 'fs';
import path from 'path';

export interface FolderInfo {
  name: string;
  fullPath: string;
  created: string;
  modified: string;
  accessed: string;
  size: number; // tamanho total em bytes
}

// Função recursiva para calcular o tamanho de uma pasta
function getFolderSize(folderPath: string): number {
  let total = 0;
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(folderPath, entry.name);
    const stats = fs.statSync(fullPath);

    if (entry.isDirectory()) total += getFolderSize(fullPath);
    else total += stats.size;
  }

  return total;
}

export function getFolders(foldersPath = 'pages'): FolderInfo[] {
  const pagesPath = path.join(process.cwd(), foldersPath);
  const entries = fs.readdirSync(pagesPath, { withFileTypes: true });

  const folders = entries
    .filter(
      (entry) =>
        entry.isDirectory() &&
        !entry.name.startsWith('_') &&
        !entry.name.startsWith('api') &&
        !entry.name.startsWith('.') &&
        entry.name !== 'styles'
    )
    .map((entry) => {
      const fullPath = path.join(pagesPath, entry.name);
      const stats = fs.statSync(fullPath);

      return {
        name: entry.name,
        fullPath,
        created: stats.birthtime.toISOString(),
        modified: stats.mtime.toISOString(),
        accessed: stats.atime.toISOString(),
        size: getFolderSize(fullPath),
      };
    });

  return folders;
}
