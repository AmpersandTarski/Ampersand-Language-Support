import * as vscode from 'vscode';
import { fileUtils } from './fileUtils';

export class diagnosticUtils {
    static groupDiagnostics(xs: [vscode.Uri, vscode.Diagnostic[]][]): [vscode.Uri, vscode.Diagnostic[]][] {
      let seen = new Map<string, [number, vscode.Uri, vscode.Diagnostic[]]>();
      for (var i = 0; i < xs.length; i++) {
        let key = xs[i][0].path;
        if (seen.has(key)) {
          let v = seen.get(key);
          v![2] = v![2].concat(xs[i][1]);
        } else {
          seen.set(key, [i, xs[i][0], xs[i][1]]);
        }
      }
      return Array.from(seen.values()).sort((a, b) => a[0] - b[0]).map(x => fileUtils.pair(x[1], x[2]));
    }
  }