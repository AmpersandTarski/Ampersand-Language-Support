import * as path from 'path';
import * as vscode from 'vscode';
import * as Buffer from 'buffer';
import * as fs from 'fs';

export class fileUtils {
  static pair<A, B>(a: A, b: B): [A, B] {
    return [a, b];
  }

  static getCurrentOpenFile(): string | undefined
  {
    if (vscode.workspace.workspaceFolders === undefined) {
      vscode.window.showWarningMessage("Checking ampersand only works if you work in a workspace.");
      return;
    }

    const activeEditorWindow = vscode.window.activeTextEditor;

    if(!activeEditorWindow){
      vscode.window.showWarningMessage("Make sure you have an active editor window.")
      return;
    }

    const currentActiveFilePath : string = activeEditorWindow.document.uri.fsPath;

    if(!currentActiveFilePath.endsWith(".adl"))
    {
      vscode.window.showWarningMessage(`Make sure you have an .adl file open`) 
      return;
    }

    return currentActiveFilePath;
  }

  static generateWorkspacePath(paths: string[]) : string 
  {
    const workspaceFolders: readonly vscode.WorkspaceFolder[] | undefined = vscode.workspace.workspaceFolders;

    if (workspaceFolders === undefined) {
      vscode.window.showWarningMessage("Checking ampersand only works if you work in a workspace.");
      return '';
    }

    const workspacePath: string = workspaceFolders[0].uri.fsPath;

    let filePath: string = workspacePath;

    paths.forEach(p => {
      filePath = path.join(filePath, p);
    });

    return filePath;
  }

  static generateFolderInCurrentWorkspace(folderName: string[])
  {
    const folderPath = fileUtils.generateWorkspacePath(folderName);
    if (!fs.existsSync(folderPath)) 
    {
        fs.mkdirSync(folderPath, { recursive: true });
    }
  }

  static generateFileInCurrentWorkspace(fileName: string[],folderName: string[])
  {
    this.generateFolderInCurrentWorkspace(folderName);

    const combinedPath = this.generateCombinedPath(fileName,folderName)

    const filePath = fileUtils.generateWorkspacePath(combinedPath);
    if (!fs.existsSync(filePath)) 
    {
        fs.appendFile(filePath,'',(err) => {console.log(err)});
    }
  }

  static replaceMarkers(data: Uint8Array, markerValuePairs: Map<string, string>) : Uint8Array
  {
    let text: string = Buffer.Buffer.from(data).toString();

    markerValuePairs.forEach((value, key) => {
      text = text.replace(key, value)
    });

    return Buffer.Buffer.from(text);
  }

  static generateCombinedPath(fileName: string[],folderName: string[]): string[]
  {
    let combinedPath: string[] = [];
      
    folderName.forEach(p => {
      combinedPath = combinedPath.concat(p);
    });

    fileName.forEach(p => {
      combinedPath = combinedPath.concat(p);
    });

    return combinedPath;
  }

}

