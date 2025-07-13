import * as vscode from 'vscode';
import * as fs from 'fs';
import * as child_process from 'child_process';
import * as path from 'path';
import { fileUtils, extensionSettings } from '../utils';

export class zipUtils {
  static zipFolder(extensionPath: string): string | undefined {
    if (extensionSettings.rootScriptName === undefined || extensionSettings.rootScriptFolder === undefined)
      return;

    const folderPath: string = fileUtils.generateWorkspacePath([extensionSettings.rootScriptFolder]);

    //Zip folder and encode
    const zipOutPath: string = path.join(extensionPath, "assets", "out.zip");

    child_process.execSync(`zip -r ${zipOutPath} *`, {
      cwd: folderPath
    });

    const encodedZipContent: string = fs.readFileSync(zipOutPath).toString('base64');

    return encodedZipContent;
  }
}