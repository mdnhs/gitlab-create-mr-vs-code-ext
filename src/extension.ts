import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  // Create a status bar item
  const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
  statusBarItem.text = "Create MR"; // Add icon and label
  statusBarItem.tooltip = "Click to open Merge Request page"; // Tooltip when hovering over the icon
  statusBarItem.command = "extension.openMergeRequest"; // Command to trigger
  statusBarItem.show(); // Display the status bar item

  // Register the command
  let disposable = vscode.commands.registerCommand(
    "extension.openMergeRequest",
    async () => {
      // Retrieve settings from the configuration
      const config = vscode.workspace.getConfiguration("mergeRequest");
      const projectId = config.get<string>("projectId");
      const sourceBranchName = config.get<string>("sourceBranchName");
      const targetBranchName = config.get<string>("targetBranchName", "main");
      const gitlabDomain = config.get<string>("gitlabDomain", "https://gitlab.com");

      // Check if the required fields are set in settings
      if (!projectId || !sourceBranchName) {
        vscode.window.showErrorMessage("Missing required settings.");
        return;
      }

      // Construct the URL for the merge request page
      const mergeRequestUrl = `${gitlabDomain}/-/merge_requests/new?merge_request[source_project_id]=${projectId}&merge_request[source_branch]=${sourceBranchName}&merge_request[target_project_id]=${projectId}&merge_request[target_branch]=${targetBranchName}`;

      // Open the merge request page in the browser
      await vscode.env.openExternal(vscode.Uri.parse(mergeRequestUrl));
    }
  );

  context.subscriptions.push(disposable);
  context.subscriptions.push(statusBarItem); // Add status bar item to subscriptions
}

export function deactivate() {}
