import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as crypto from 'crypto'
import { AmpersandParser, AmpersandVersionChecker } from '../Ampersand';
import { DiagnosticUtils, FileUtils} from '../utils';

export class DaemonCommand {
    static runDaemonCommand(context : vscode.ExtensionContext, oldTerminal : vscode.Terminal | null = null)
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
        //opts.shellArgs.push("--outputfile=" + file);
        oldTerminal = vscode.window.createTerminal(opts);
        oldTerminal.show();
        return watchOutput(vscode.workspace.rootPath, file);

        function watchOutput(root : string, file : string) : fs.FSWatcher {
            const d = vscode.languages.createDiagnosticCollection('ampersand');
            let last : [vscode.Uri, vscode.Diagnostic][] = [];
            const go = () => {
                let next = AmpersandParser.parseAmpersandOutput(root, fs.readFileSync(file, "utf8"));
                let next2 = next.map(x => FileUtils.pair(x[0], [x[1]]));
                for (let x of last)
                    next2.push(FileUtils.pair(x[0], []));
                d.set(DiagnosticUtils.groupDiagnostics(next2));
                last = next;
            };
            let watcher = fs.watch(file, go);
            go();
            return watcher;
        }
    }
}
