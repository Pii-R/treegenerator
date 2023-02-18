import { expect } from "chai";
import * as path from "path";
import { isDirectory } from "../../src/path_manipulation";
import {
  ClassicTree,
  ClassicTreeConfiguration,
  DetailedTree,
  DetailedTreeConfiguration,
  FullFilePrefixes,
  FilePrefixes,
} from "../../src/tree";

const testFolderPath = "src/tree/tests/unit/data";

describe("Tests for tree creation", () => {
  it("is directory", () => {
    const dirPath = testFolderPath;
    expect(isDirectory(dirPath)).to.be.true;
  });

  it("is not directory", () => {
    const dirPath = path.join(testFolderPath, "/test_folder/env.test");
    expect(isDirectory(dirPath)).to.be.false;
  });
});

describe("Tree building", () => {
  it("Create simple tree with one depth and a single file", () => {
    const folderPath = "src/tree/tests/unit/data/one_file";
    const configuration = new ClassicTreeConfiguration(
      "🗃️ ",
      new FilePrefixes(""),
      3,
      " ",
      -1
    );

    const tree = new ClassicTree(configuration);
    expect(tree.createTree(folderPath)).to.be.eql([
      "🗃️ one_file",
      "   unique_file",
    ]);
  });
  it("Create simple tree with one depth and multiple files", () => {
    const folderPath = "src/tree/tests/unit/data/multiple_files";
    const configuration = new ClassicTreeConfiguration(
      "🗃️ ",
      new FilePrefixes(""),
      3,
      " ",
      -1
    );
    const tree = new ClassicTree(configuration);
    expect(tree.createTree(folderPath)).to.be.eql([
      "🗃️ multiple_files",
      "   file1.txt",
      "   file2.env",
      "   test.xls",
    ]);
  });
  it("Create simple tree with 2 depths and multiple files", () => {
    const folderPath = "src/tree/tests/unit/data/test_folder";
    const configuration = new ClassicTreeConfiguration(
      "🗃️ ",
      new FilePrefixes(""),
      3,
      " ",
      -1
    );
    const tree = new ClassicTree(configuration);
    expect(tree.createTree(folderPath)).to.be.eql([
      "🗃️ test_folder",
      "   env.test",
      "   file.txt",
      "   🗃️ src",
      "      test.txt",
    ]);
  });
  it("Create simple tree with 2 depths and multiple files with config", () => {
    const folderPath = "src/tree/tests/unit/data/test_folder";
    const configuration = new ClassicTreeConfiguration(
      "🗃️ ",
      new FilePrefixes("-"),
      3,
      " ",
      -1
    );
    const tree = new ClassicTree(configuration);
    expect(tree.createTree(folderPath)).to.be.eql([
      "🗃️ test_folder",
      "   -env.test",
      "   -file.txt",
      "   🗃️ src",
      "      -test.txt",
    ]);
  });

  it("Create simple tree with 3 depths and multiple files with config", () => {
    const folderPath = "src/tree/tests/unit/data/depth";
    const configuration = new ClassicTreeConfiguration(
      "🗃️ ",
      new FilePrefixes(""),
      3,
      " ",
      3
    );
    const tree = new ClassicTree(configuration);
    expect(tree.createTree(folderPath)).to.be.eql([
      "🗃️ depth",
      "   🗃️ depth1",
      "      🗃️ depth2",
      "         🗃️ depth3",
      "            file3.txt",
    ]);
  });

  it("Create simple tree with 3 depths and multiple files with config", () => {
    const folderPath = "src/tree/tests/unit/data/depth";
    const configuration = new ClassicTreeConfiguration(
      "🗃️ ",
      new FilePrefixes(""),
      3,
      " ",
      4
    );
    const tree = new ClassicTree(configuration);
    expect(tree.createTree(folderPath)).to.be.eql([
      "🗃️ depth",
      "   🗃️ depth1",
      "      🗃️ depth2",
      "         🗃️ depth3",
      "            file3.txt",
      "            🗃️ depth4",
      "               file4.txt",
    ]);
  });

  it("Test for complete detailed tree", () => {
    const folderPath = "src/tree/tests/unit/data/multiple_depth_and_files";
    const configuration = new DetailedTreeConfiguration(
      "📦 ",
      "🗃️ ",
      new FullFilePrefixes("┗ ", "┣ ", "┃ ", "┗ "),
      3,
      " ",
      4
    );
    const tree = new DetailedTree(configuration);
    expect(tree.createTree(folderPath)).to.be.eql([
      "📦 multiple_depth_and_files",
      "   ┣ env.test",
      "   ┣ file.txt",
      "   ┗ file1txt",
      "   🗃️ src",
      "      ┗ test.txt",
      "      🗃️ app",
      "         ┣ env.test",
      "         ┣ file.txt",
      "         ┗ file1txt",
    ]);
  });
  it("Test for complete detailed tree without depth", () => {
    const folderPath = "src/tree/tests/unit/data/depth";
    const configuration = new DetailedTreeConfiguration(
      "📦 ",
      "🗃️ ",
      new FullFilePrefixes("┗ ", "┣ ", "┃ ", "┗ "),
      3,
      " ",
      -1
    );
    const tree = new DetailedTree(configuration);
    expect(tree.createTree(folderPath)).to.be.eql([
      "📦 depth",
      "   🗃️ depth1",
      "      🗃️ depth2",
      "         🗃️ depth3",
      "            ┗ file3.txt",
      "            🗃️ depth4",
      "               ┗ file4.txt",
    ]);
  });
  it("Test for complete detailed tree with depth", () => {
    const folderPath = "src/tree/tests/unit/data/depth";
    const configuration = new DetailedTreeConfiguration(
      "📦 ",
      "🗃️ ",
      new FullFilePrefixes("┗ ", "┣ ", "┃ ", "┗ "),
      3,
      " ",
      3
    );
    const tree = new DetailedTree(configuration);
    expect(tree.createTree(folderPath)).to.be.eql([
      "📦 depth",
      "   🗃️ depth1",
      "      🗃️ depth2",
      "         🗃️ depth3",
      "            ┗ file3.txt",
    ]);
  });
});
