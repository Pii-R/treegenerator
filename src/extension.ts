// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import {
  DetailedTree,
  DetailedTreeConfiguration,
  FullFilePrefixes,
} from "./tree/src/tree";
import { convertPathToPosix } from "./tree/src/path_manipulation";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "treegenerator" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let createTree = vscode.commands.registerCommand(
    "treegenerator.createTree",
    (uri: vscode.Uri) => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      vscode.window.showInformationMessage("Hello World from TreeGenerator!");
      console.log(uri.fsPath);
      const uriFile = convertPathToPosix(uri.fsPath);
      const view = vscode.window.createWebviewPanel(
        "type",
        "Vue",
        vscode.ViewColumn.One
      );
      const configuration = new DetailedTreeConfiguration(
        "📦 ",
        "🗃️ ",
        new FullFilePrefixes("┗ ", "┣ ", "┃ ", "┗ "),
        3,
        " ",
        4
      );
      const tree = new DetailedTree(configuration);
      const formatedTree = tree.formatTree(tree.createTree(uriFile), "\r\n");
      console.log(formatedTree);
      view.webview.html = getWebViewContent(formatedTree);
    }
  );

  context.subscriptions.push(createTree);
}

function getWebViewContent(content: string) {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Tree</title>
  </head>
  <body>
      <pre>${content}</pre>
  </body>
  </html>`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
