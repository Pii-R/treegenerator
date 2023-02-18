import { getAscOrderedFiles, getAscOrderedMapFiles } from "./path_manipulation";
import { dirname } from "path";
export class FilePrefixes {
  middle: string;
  constructor(middle: string) {
    this.middle = middle;
  }
}
export class FullFilePrefixes extends FilePrefixes {
  unique: string;
  start: string;
  end: string;

  constructor(unique: string, start: string, middle: string, end: string) {
    super(middle);
    this.unique = unique;
    this.start = start;
    this.end = end;
  }
}
export interface TreeConfiguration {
  folderPrefix: string;
  filePrefix: FilePrefixes;
  recurrence: number;
  separator: string;
  maxDepth: number;
}

interface Tree {
  configuration: TreeConfiguration;
  createTree(folderPath: string): string[];
  formatTree(tree: string[], sep: string): string;
}

export class ClassicTreeConfiguration {
  folderPrefix: string;
  filePrefix: FilePrefixes;
  recurrence: number;
  separator: string;
  maxDepth: number;

  constructor(
    folderPrefix: string,
    filePrefix: FilePrefixes,
    recurrence: number,
    separator: string,
    maxDepth: number
  ) {
    this.folderPrefix = folderPrefix;
    this.filePrefix = filePrefix;
    this.recurrence = recurrence;
    this.separator = separator;
    this.maxDepth = maxDepth;
  }
}

export class DetailedTreeConfiguration {
  parentFolderPrefix: string;
  folderPrefix: string;
  filePrefix: FullFilePrefixes;
  recurrence: number;
  separator: string;
  maxDepth: number;

  constructor(
    parentFolderPrefix: string,
    folderPrefix: string,
    filePrefix: FullFilePrefixes,
    recurrence: number,
    separator: string,
    maxDepth: number
  ) {
    this.parentFolderPrefix = parentFolderPrefix;
    this.folderPrefix = folderPrefix;
    this.filePrefix = filePrefix;
    this.recurrence = recurrence;
    this.separator = separator;
    this.maxDepth = maxDepth;
  }
}
export class ClassicTree implements Tree {
  configuration: ClassicTreeConfiguration;

  constructor(configuration: ClassicTreeConfiguration) {
    this.configuration = configuration;
  }
  createTree(folderPath: string): string[] {
    const tree: string[] = [];
    const fullPathFiles = getAscOrderedFiles(folderPath, this.configuration);

    fullPathFiles.forEach((element) => {
      const fullPathFiles = element[0];
      const depth = element[1];
      const relativePathFiles = fullPathFiles
        .replace(dirname(folderPath) + "/", "")
        .split("/");

      for (let i = 0; i <= relativePathFiles.length - 2; i++) {
        const folderName = relativePathFiles[i] || "";
        const formatedFolderName = this.formatFolderName(
          this.configuration,
          folderName,
          i
        );
        if (!tree.find((element) => element === formatedFolderName)) {
          tree.push(formatedFolderName);
        }
      }

      const fileName = relativePathFiles[relativePathFiles.length - 1] || "";
      const formatedFileName = this.formatFileName(
        this.configuration,
        fileName,
        depth
      );
      tree.push(formatedFileName);
    });
    return tree;
  }
  formatTree(tree: string[], sep: string): string {
    return tree.join(sep);
  }
  formatFolderName(
    configuration: TreeConfiguration,
    folderName: string,
    depth: number
  ): string {
    return configuration.separator
      .repeat(configuration.recurrence)
      .repeat(depth)
      .concat(configuration.folderPrefix + folderName);
  }

  formatFileName(
    configuration: TreeConfiguration,
    fileName: string,
    depth: number
  ): string {
    const recurrence = configuration.separator
      .repeat(configuration.recurrence)
      .repeat(depth + 1);
    return recurrence + configuration.filePrefix.middle + fileName;
  }
}

export class DetailedTree implements Tree {
  configuration: DetailedTreeConfiguration;

  constructor(configuration: DetailedTreeConfiguration) {
    this.configuration = configuration;
  }
  createTree(folderPath: string): string[] {
    const tree: string[] = [];
    const fullPathFiles = getAscOrderedMapFiles(folderPath, this.configuration);
    fullPathFiles.forEach((value: string[], key: number) => {
      const fullPathFilesSameLevel = value;
      const depth = key;
      fullPathFilesSameLevel.forEach((fullPathFile) => {
        const relativePathFileFolders = fullPathFile
          .replace(dirname(folderPath) + "/", "")
          .split("/");
        for (let i = 0; i <= relativePathFileFolders.length - 2; i++) {
          const folderName = relativePathFileFolders[i] || "";
          const formatedFolderName = this.formatFolderName(
            this.configuration,
            folderName,
            i
          );
          if (!tree.find((element) => element === formatedFolderName)) {
            tree.push(formatedFolderName);
          }
        }
        const fileName =
          relativePathFileFolders[relativePathFileFolders.length - 1] || "";
        const formatedFileName = this.formatFileName(
          this.configuration,
          fileName,
          fullPathFilesSameLevel,
          depth
        );
        tree.push(formatedFileName);
      });
    });
    return tree;
  }
  formatFolderName(
    configuration: DetailedTreeConfiguration,
    folderName: string,
    depth: number
  ): string {
    let folderPrefix = configuration.folderPrefix;
    if (depth === 0) {
      folderPrefix = configuration.parentFolderPrefix;
    }
    return configuration.separator
      .repeat(configuration.recurrence)
      .repeat(depth)
      .concat(folderPrefix + folderName);
  }
  formatTree(tree: string[], sep: string): string {
    return tree.join(sep);
  }

  formatFileName(
    configuration: DetailedTreeConfiguration,
    fileName: string,
    sameLevelFiles: string[],
    depth: number
  ): string {
    const fileNamePosition = sameLevelFiles.findIndex(
      (file) => file.indexOf(fileName) >= 1
    );
    let filePrefix = "";
    if (fileNamePosition === sameLevelFiles.length - 1) {
      filePrefix = configuration.filePrefix.unique;
    } else {
      filePrefix = configuration.filePrefix.start;
    }

    const recurrence = configuration.separator
      .repeat(configuration.recurrence)
      .repeat(depth + 1);

    return recurrence + filePrefix + fileName;
  }
}
