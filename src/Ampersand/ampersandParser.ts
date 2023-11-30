import * as vscode from 'vscode';
import * as path from 'path';
import { FileUtils } from '../utils';

export class AmpersandParser {
    static parseAmpersandOutput(dir: string, s: string): [vscode.Uri, vscode.Diagnostic][] {
        let cont: any[] = [];
        return cont.concat(... split(lines(s)).map(parse));

        // standard lines, dealing with \r\n as well
        function lines(s : string) : string[] {
            return s.replace('\r','').split('\n').filter(x => x != "");
        }

        // After the file location, message bodies are indented (perhaps prefixed by a line number)
        function isMessageBody(x : string) {
            if (x.startsWith(" "))
                return true;
            let sep = x.indexOf('|');
            if (sep == -1)
                return false;
            return !isNaN(Number(x.substr(0, sep)));
        }

        // split into separate error messages, which all start at col 0 (no spaces) and are following by message bodies
        function split(xs : string[]) : string[][] {
            let cont: any[] = [];
            let res = [];
            for (let x of xs) {
                if (isMessageBody(x))
                    cont.push(x);
                else {
                    if (cont.length > 0) res.push(cont);
                    cont = [x];
                }
            }
            if (cont.length > 0) res.push(cont);
            return res;
        }

        function parse(xs : string[]) : [vscode.Uri, vscode.Diagnostic][] {
            let cont: any[] = [];  
            let r1 = /(..[^:]+):([0-9]+):([0-9]+):/
            let r2 = /(..[^:]+):([0-9]+):([0-9]+)-([0-9]+):/
            let r3 = /(..[^:]+):\(([0-9]+),([0-9]+)\)-\(([0-9]+),([0-9]+)\):/
                    var m1 : RegExpMatchArray | null;
                    var m : RegExpMatchArray;
            let f = (l1: number,c1: number,l2: number,c2: number) => {
                let range = new vscode.Range(parseInt(m[l1])-1,parseInt(m[c1])-1,parseInt(m[l2])-1,parseInt(m[c2]));
                let file = vscode.Uri.file(path.isAbsolute(m[1]) ? m[1] : path.join(dir, m[1]));
                var s : string = xs[0].substring(m[0].length).trim();
                let i = s.indexOf(':');
                var sev = vscode.DiagnosticSeverity.Error;
                if (i !== -1) {
                    if (s.substr(0, i).toLowerCase() == 'warning')
                        sev = vscode.DiagnosticSeverity.Warning;
                    s = s.substr(i+1).trim();
                }
                let msg = cont.concat([s],xs.slice(1)).join('\n');
                return [FileUtils.pair(file, new vscode.Diagnostic(range, msg, sev))];
            };
            if (xs[0].startsWith("All good"))
                return [];
            if (m1 = xs[0].match(r1)) {
                            m = m1 ;
                            return f(2,3,2,3);
                    } else if (m1 = xs[0].match(r2)) {
                            m = m1;
                            return f(2,3,2,4);
                    } else if (m1 = xs[0].match(r3)) {
                            m = m1;
                            return f(2,3,4,5);
                    } else {
                            return [[vscode.Uri.file("") , new vscode.Diagnostic(new vscode.Range(0,0,0,0), xs.join('\n'))]];
                    };		
        }
    }
}