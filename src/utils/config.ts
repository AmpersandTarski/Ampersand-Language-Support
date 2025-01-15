import * as vscode from 'vscode';
export class config {
  static pair<A, B>(a: A, b: B): [A, B] {
    return [a, b];
  }

  static ampersand = vscode.workspace.getConfiguration('ampersand');
  static mainScriptSetting: string | undefined = config.ampersand.get('mainScriptName');
  static folderSetting: string | undefined = config.ampersand.get('folderName');
  static formatSetting: string | undefined = config.ampersand.get('formatOfDocumentation');
  static graphicsSetting: boolean | undefined = config.ampersand.get('graphics');
}