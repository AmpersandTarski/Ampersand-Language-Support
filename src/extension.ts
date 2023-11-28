'use strict';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as crypto from 'crypto'
import * as AmpersandParser from './AmpersandParser';
import * as AmpersandVersionChecker from './AmpersandVersionChecker';
import { constants } from './constants';


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
    return Array.from(seen.values()).sort((a,b) => a[0] - b[0]).map(x => AmpersandParser.pair(x[1],x[2]));
}

function watchOutput(root : string, file : string) : fs.FSWatcher {
    let d = vscode.languages.createDiagnosticCollection('ampersand');
    let last : [vscode.Uri, vscode.Diagnostic][] = [];
    let go = () => {
        let next = AmpersandParser.parseAmpersandOutput(root, fs.readFileSync(file, "utf8"));
        let next2 = next.map(x => AmpersandParser.pair(x[0], [x[1]]));
        for (let x of last)
            next2.push(AmpersandParser.pair(x[0], []));
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

	AmpersandVersionChecker.checkVersion();

    watch(context);

    pushDisposable(context, "extension.checkVersion", () => checkVersionCommand())
    pushDisposable(context, "extension.generateFunctionalSpec", () => GenerateFunctionalSpecCommand())
}

function pushDisposable(context: vscode.ExtensionContext,extensionName : string, commandFunction: (...args: any[]) => any)
{
    let dispose = vscode.commands.registerCommand(extensionName,commandFunction);
    context.subscriptions.push(dispose);
}
// Setup last running watcher, so we can undo it
function watch(context: vscode.ExtensionContext)
{
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

    add('extension.startDaemon', () => runDaemonCommand(context, oldTerminal));
}

function GenerateFunctionalSpecCommand()
{
    if (vscode.workspace.workspaceFolders === undefined) {
        vscode.window.showWarningMessage("Checking ampersand only works if you work in a workspace.")
        return null;
    }

    let activeEditorWindow = vscode.window.activeTextEditor;

    if(!activeEditorWindow){
        vscode.window.showWarningMessage("Make sure you have an active editor window.")
        return null;
    }

    let currentActiveFilePath : string = activeEditorWindow.document.uri.fsPath;

    if(!currentActiveFilePath.endsWith(".adl"))
    {
        vscode.window.showWarningMessage(`Make sure you have an .adl file open`) 
        return null;
    }

    RunCommandInNewTerminal("ampersand generate spec",`ampersand documentation ${currentActiveFilePath} --format docx --no-graphics --language=NL --ConceptualAnalysis --verbosity debug`)
}

function runDaemonCommand(context : vscode.ExtensionContext, oldTerminal : vscode.Terminal | null = null)
{
    if (!vscode.workspace.rootPath) {
        vscode.window.showWarningMessage("Checking ampersand only works if you work in a workspace.")
        return null;
    }
    // hashing the rootPath ensures we create a finite number of temp files
    var hash = crypto.createHash('sha256').update(vscode.workspace.rootPath).digest('hex').substring(0, 20);
    let file = path.join(os.tmpdir(), "ampersandDaemon-" + hash + ".txt");
    context.subscriptions.push({dispose: () => {try {fs.unlinkSync(file);} catch (e) {};}});
    fs.writeFileSync(file, "");
    let versionString : string = AmpersandVersionChecker.getVersion();
    let runAmpersandCommand : string = "ampersand";
    var runAmpersandArgs : string = "";
    let version : string = versionString.substr(10,3) 
    if (version === "v4.") {
      runAmpersandArgs = "daemon"
    } else if (version === "v3.") {
      runAmpersandArgs = "--daemon"
    } else {
           vscode.window.showErrorMessage
            ('The version of ampersand you have installed, is not supported: '+versionString)

    }
    
    let opts : vscode.TerminalOptions =
        os.type().startsWith("Windows") ?
            {shellPath: "cmd.exe", shellArgs: ["/k", runAmpersandCommand , runAmpersandArgs]} :
            {shellPath: runAmpersandCommand, shellArgs: [runAmpersandArgs]};
    opts.name = "ampersand daemon";
 //   opts.shellArgs.push("--outputfile=" + file);
    oldTerminal = vscode.window.createTerminal(opts);
    oldTerminal.show();
    return watchOutput(vscode.workspace.rootPath, file);
}

function checkVersionCommand()
{
    if (!vscode.workspace.rootPath) {
        vscode.window.showWarningMessage("Checking ampersand only works if you work in a workspace.")
        return null;
    }

    let versionString : string = AmpersandVersionChecker.getVersion();
    vscode.window.setStatusBarMessage("your current ampersand version is: " + versionString,10000);
}

function RunCommandInNewTerminal(terminalName : string, runAmpersandCommand : string)
{
    let terminal = vscode.window.createTerminal(terminalName);
    terminal.sendText(runAmpersandCommand)
    terminal.show();
}