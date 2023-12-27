import { expect } from "chai";

import {
  convertPathToPosix,
  getFilesRecursively,
  getMapFilesRecursively,
} from "../../src/path_manipulation";

describe("Test of path manipulations", () => {
  it("Convert a Posix path to Posix path", () => {
    const posixPath = "usr/bin/bash.rc";
    expect(convertPathToPosix(posixPath)).to.be.eql("usr/bin/bash.rc");
  });
});

describe("Test of list of files of a dir with depth", () => {
  it("List all of files of sub a specific folder", () => {
    const testPath = "src/tree/tests/unit/data/multiple_files";
    const listFiles = getFilesRecursively(testPath);
    expect(listFiles).to.be.eql([
      ["/file1.txt", 0],
      ["/file2.env", 0],
      ["/test.xls", 0],
    ]);
  });
  it("List all of files of sub a specific folder with max depth 0", () => {
    const testPath = "src/tree/tests/unit/data/test_folder";
    const listFiles = getFilesRecursively(testPath, 0);
    expect(listFiles).to.be.eql([
      ["/env.test", 0],
      ["/file.txt", 0],
    ]);
  });
  it("List all of files of sub a specific folder with max depth 3", () => {
    const testPath = "src/tree/tests/unit/data/depth";
    const listFiles = getFilesRecursively(testPath, 3);
    expect(listFiles).to.be.eql([["/depth1/depth2/depth3/file3.txt", 3]]);
  });
  it("List all of files of sub a specific folder", () => {
    const testPath = "src/tree/tests/unit/data/test_folder";
    const listFiles = getFilesRecursively(testPath);
    expect(listFiles).to.be.eql([
      ["/env.test", 0],
      ["/file.txt", 0],
      ["/src/test.txt", 1],
    ]);
  });
});

describe("Test of map of files of a dir with depth", () => {
  it("List all of files of sub a specific folder", () => {
    const testPath = "src/tree/tests/unit/data/test_folder";
    const mapFiles = getMapFilesRecursively(testPath);
    const expectedMap: Map<number, string[]> = new Map<number, string[]>([
      [0, ["test_folder/env.test", "test_folder/file.txt"]],
      [1, ["test_folder/src/test.txt"]],
    ]);
    expect(mapFiles).to.be.deep.equal(expectedMap);
  });
  it("List all of files of a unique folder", () => {
    const testPath = "src/tree/tests/unit/data/multiple_files";
    const mapFiles = getMapFilesRecursively(testPath);
    const expectedMap: Map<number, string[]> = new Map<number, string[]>([
      [
        0,
        [
          "multiple_files/file1.txt",
          "multiple_files/file2.env",
          "multiple_files/test.xls",
        ],
      ],
    ]);
    expect(mapFiles).to.be.deep.equal(expectedMap);
  });
  it("List all of files of a folder inside a folder inside a folder ", () => {
    const testPath = "src/tree/tests/unit/data/depth";
    const mapFiles = getMapFilesRecursively(testPath);
    const expectedMap: Map<number, string[]> = new Map<number, string[]>([
      [3, ["depth/depth1/depth2/depth3/file3.txt"]],
      [4, ["depth/depth1/depth2/depth3/depth4/file4.txt"]],
    ]);
    expect(mapFiles).to.be.deep.equal(expectedMap);
  });
  it("return empty map because of depth", () => {
    const testPath = "src/tree/tests/unit/data/depth";
    const mapFiles = getMapFilesRecursively(testPath, 2);
    const expectedMap: Map<number, string[]> = new Map<number, string[]>();
    expect(mapFiles).to.be.deep.equal(expectedMap);
  });
  it("return non empty map with depth", () => {
    const testPath = "src/tree/tests/unit/data/depth";
    const mapFiles = getMapFilesRecursively(testPath, 3);
    const expectedMap: Map<number, string[]> = new Map<number, string[]>([
      [3, ["depth/depth1/depth2/depth3/file3.txt"]],
    ]);
    expect(mapFiles).to.be.deep.equal(expectedMap);
  });
});
