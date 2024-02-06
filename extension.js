const vscode = require("vscode")
const screenshot = require("screenshot-desktop")
const path = require("path")

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {

  let disposable = vscode.commands.registerCommand(
    "fireship.StartEditor",
    async function () {
      vscode.window.showInformationMessage("Editor Started")

      vscode.workspace.onDidSaveTextDocument(async (e) => {

        const editor = vscode.window.activeTextEditor;
        const workspaceFolder = vscode.workspace.workspaceFolders[0];

        if (!editor || !workspaceFolder) {
          vscode.window.showInformationMessage("Open a workspace first.");
          return;
        }

        const basename = workspaceFolder.uri.fsPath;
        const filename = path.basename(e.fileName);
        const timeStamp = new Date();

        const shot = await screenshot({ format: "png" });

        const screenshotFilePath = path.join(basename, "screenshots", filename.split(".")[0], `${timeStamp.getTime()}.png`);

        try {
          await vscode.workspace.fs.writeFile(
            vscode.Uri.file(screenshotFilePath),
            shot
          );

        } catch (error) {
          vscode.window.showErrorMessage("Error occured");
        }
      })
    }
  )

  context.subscriptions.push(disposable)
}
exports.activate = activate

function deactivate() { }

module.exports = {
  activate,
  deactivate,
}
