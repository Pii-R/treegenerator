import * as path from "path";
import * as fs from "fs";
import { TreeConfiguration } from "./tree";

export function convertPathToPosix(pathToConvert: string): string {
  return pathToConvert.split(path.sep).join(path.posix.sep);
}

export function getParentFolder(folderPath: string): string {
  return path.dirname(folderPath);
}

export function getFilesRecursively(
  directory: string,
  maxDepth = -1,
  depth = -1
): [string, number][] {
  const files: [string, number][] = [];
  const filesInDirectory = fs.readdirSync(directory);
  let parentDir = directory
    .split("/")
    .slice(0, directory.split("/").length - depth - 1)
    .join("/");
  depth = depth + 1;
  const isMaxDepthReached = maxDepth !== -1 && depth >= maxDepth + 1;
  if (isMaxDepthReached) {
    return files;
  }
  for (const file of filesInDirectory) {
    const absolute = convertPathToPosix(path.join(directory, file));
    const finalAbsolute = absolute.replace(parentDir, "");

    if (fs.statSync(absolute).isDirectory()) {
      files.push(...getFilesRecursively(absolute, maxDepth, depth));
    } else {
      files.push([finalAbsolute, depth]);
    }
  }

  depth = 0;
  return files;
}

export function getMapFilesRecursively(
  directory: string,
  maxDepth = -1,
  depth = -1,
  files: Map<number, string[]> = new Map<number, string[]>()
): Map<number, string[]> {
  const filesInDirectory = fs.readdirSync(directory);

  depth = depth + 1;
  let parentDir = directory
    .split("/")
    .slice(0, directory.split("/").length - depth - 1)
    .join("/");
  const isMaxDepthReached = maxDepth !== -1 && depth >= maxDepth + 1;
  if (isMaxDepthReached) {
    return files;
  }
  for (const file of filesInDirectory) {
    const absolute = convertPathToPosix(path.join(directory, file));
    const finalAbsolute = absolute.replace(parentDir, "");
    const currentFiles = files.get(depth) || [];

    if (fs.statSync(absolute).isDirectory()) {
      getMapFilesRecursively(absolute, maxDepth, depth, files);
    } else {
      files.set(depth, []);

      currentFiles?.push(finalAbsolute.substring(1));
      files.set(depth, currentFiles);
    }
  }

  depth = 0;
  return files;
}

export function getAscOrderedFiles(
  folderPath: string,
  configuration: TreeConfiguration
): [string, number][] {
  return getFilesRecursively(folderPath, configuration.maxDepth).sort(function (
    a,
    b
  ) {
    return a[1] - b[1];
  });
}

export function getAscOrderedMapFiles(
  folderPath: string,
  configuration: TreeConfiguration
): Map<number, string[]> {
  return new Map(
    [
      ...getMapFilesRecursively(folderPath, configuration.maxDepth).entries(),
    ].sort()
  );
}

/**
 * Tells if a path is a dir or not
 *
 * @export
 * @param {string} dirPath path to check
 * @return {*}  {boolean} true if path is a dir false otherwise
 */
export function isDirectory(dirPath: string): boolean {
  return fs.lstatSync(dirPath).isDirectory();
}
