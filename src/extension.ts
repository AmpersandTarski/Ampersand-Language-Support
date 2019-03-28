'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as crypto from 'crypto'
import { constants } from './constants';

function pair<a,b>(a : a, b : b) : [a,b] {return [a,b];}

export function parseAmpersandOutput(dir : string, s : string) : [vscode.Uri, vscode.Diagnostic][] {
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
            return [pair(file, new vscode.Diagnostic(range, msg, sev))];
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
    let cont: any[] = [];
    return cont.concat(... split(lines(s)).map(parse));
	}

function groupDiagnostic(xs : [vscode.Uri, vscode.Diagnostic[]][]) : [vscode.Uri, vscode.Diagnostic[]][] {
    let seen = new Map<string, [number, vscode.Uri, vscode.Diagnostic[]]>();
    for (var i = 0; i < xs.length; i++) {
        let key = xs[i][0].path;
        if (seen.has(key)) {
            let v = seen.get(key);
            v![2] = v![2].concat(xs[i][1]);
        }
        else
            seen.set(key, [i, xs[i][0], xs[i][1]]);
    }
    return Array.from(seen.values()).sort((a,b) => a[0] - b[0]).map(x => pair(x[1],x[2]));
}

function watchOutput(root : string, file : string) : fs.FSWatcher {
    let d = vscode.languages.createDiagnosticCollection('ampersand');
    let last : [vscode.Uri, vscode.Diagnostic][] = [];
    let go = () => {
        let next = parseAmpersandOutput(root, fs.readFileSync(file, "utf8"));
        let next2 = next.map(x => pair(x[0], [x[1]]));
        for (let x of last)
            next2.push(pair(x[0], []));
        d.set(groupDiagnostic(next2));
        last = next;
    };
    let watcher = fs.watch(file, go);
    go();
    return watcher;
}



// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.info(
		`[${constants.extension.name}] v${constants.extension.version} activated!`,
	  );
	checkVersion();

    // Pointer to the last running watcher, so we can undo it
    var oldWatcher : fs.FSWatcher | null = null;
    var oldTerminal : vscode.Terminal | null = null;

    let cleanup = () => {
        if (oldWatcher != null)
            oldWatcher.close();
        oldWatcher = null;
        if (oldTerminal != null)
            oldTerminal.dispose();
        oldTerminal = null;
    }
    context.subscriptions.push({dispose: cleanup});

    let add = (name : string, act : () => fs.FSWatcher | null ) => {
        let dispose = vscode.commands.registerCommand(name, () => {
            try {
                cleanup();
                oldWatcher = act();
            }
            catch (e) {
                console.error("Ampersand extension failed in " + name + ": " + e);
                throw e;
            }
        });
        context.subscriptions.push(dispose);
    }

    add('extension.startDaemon', () => {
        if (!vscode.workspace.rootPath) {
            vscode.window.showWarningMessage("Checking ampersand only works if you work in a workspace.")
            return null;
        }
        // hashing the rootPath ensures we create a finite number of temp files
        var hash = crypto.createHash('sha256').update(vscode.workspace.rootPath).digest('hex').substring(0, 20);
        let file = path.join(os.tmpdir(), "ampersandDaemon-" + hash + ".txt");
        context.subscriptions.push({dispose: () => {try {fs.unlinkSync(file);} catch (e) {};}});
        fs.writeFileSync(file, "");

        let runAmpersandCommand : string = "ampersand --daemon";

        let opts : vscode.TerminalOptions =
            os.type().startsWith("Windows") ?
                {shellPath: "cmd.exe", shellArgs: ["/k", runAmpersandCommand]} :
                {shellPath: runAmpersandCommand, shellArgs: []};
        opts.name = "ampersand daemon";
     //   opts.shellArgs.push("--outputfile=" + file);
        oldTerminal = vscode.window.createTerminal(opts);
        oldTerminal.show();
        return watchOutput(vscode.workspace.rootPath, file);
    });


}



function checkVersion ()  {
	
	// grab the version number from a string that holds the
	// output of ampersand --version
	function grabVersion (xs : string) : string | null {
		
		
		let f = (b : string, isModified : boolean) => {
			if (b == "master" && !isModified) {
        return ""
			} else if (isModified) {
				return " " + b + " (modified)"
			} else {
				return " " + b
			}
		}
		let r1 = /Ampersand-(v[0-9]+\.[0-9]+\.[0-9]+) \[(.*)?\],/ ;
		var m : RegExpMatchArray | null ;
		var result : string | null = null ;
		if (m = xs.match(r1)) {
				let m1 = m ;
				let r2 = /(.*)?:(.*)?([\*]*)$/ ;
				var m2 : RegExpMatchArray | null ;
				if (m2 = m1[2].match(r2)) {
					result = m1[1] + f(m2[1],(null == m2[2]))
					}  
				} else {
					result = null
		}
		return result
	};
	const { exec } = require('child_process');
	let command = `${constants.extension.generatorName} --version`
	exec(command, (err:string, stdout:string) => {
	  if (err) {
		// node couldn't execute the command
		console.log(`err: ${err}`);
		vscode.window.showErrorMessage
		   ('Make sure `ampersand` is in your path if you want to fully leverage this extention. ')
	  } else {
			let v = grabVersion(stdout) ;
			// the *entire* stdout and stderr (buffered)
		  let message : string = `Your version of ampersand:
		       ${v}`;
		  vscode.window.showInformationMessage(message )
	  };
	
	});

}