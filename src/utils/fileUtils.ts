import * as vscode from 'vscode';
import * as fs from 'fs';
import * as Buffer from 'buffer';
export class fileUtils {
  static pair<A, B>(a: A, b: B): [A, B] {
    return [a, b];
  }

  static getCurrentOpenFile(): string | undefined
  {
    if (vscode.workspace.workspaceFolders === undefined) {
      vscode.window.showWarningMessage("Checking ampersand only works if you work in a workspace.")
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

  static getCurrentOpenFileName() : string | undefined
  {
    const openFile = this.getCurrentOpenFile();

    if(!openFile){
      vscode.window.showWarningMessage("Make sure you have an active editor window.")
      return;
    }

    const startOfFileName : number = openFile.lastIndexOf('/') + 1;

    let fileName : string = openFile.substring(startOfFileName);
    fileName = fileName.replace('adl', 'yaml');

    return fileName;
  }

  static replaceMarkers(data: Uint8Array, markerValuePairs: Map<string, string>) : Uint8Array
  {
    let text: string = Buffer.Buffer.from(data).toString();

    markerValuePairs.forEach((value, key) => {
      text = text.replace(key, value)
    });

    return Buffer.Buffer.from(text);
  }

  static async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch (error) {
      return false;
    }
  }
  
  static async waitForFile(filePath: string, timeout: number): Promise<void> {
    let startTime = Date.now();
    while (true) {
      let exists = await this.fileExists(filePath);
      if (exists) {
        break;
      }
      if (Date.now() - startTime > timeout) {
        throw new Error(`Timeout waiting for ${filePath}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
}