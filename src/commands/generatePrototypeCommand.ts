import { config, fileUtils, terminalUtils, zipUtils } from "../utils";
import * as vscode from 'vscode';
import * as path from 'path';

export class generatePrototypeCommand {
    private static portForwardTerminalPID: vscode.Terminal | undefined;

    static GeneratePrototypeCommand(context: vscode.ExtensionContext)
    {
        //Get extension path
        if(context === undefined)
            return;

        const extensionPath: string = context.extensionPath;

        const encodedZipContent:string|undefined = zipUtils.zipFolder(extensionPath);

        if(encodedZipContent === undefined)
            return;
        
        const encodedMainScript: string = btoa(config.mainScriptSetting as string);
        const templateFileUri: vscode.Uri = vscode.Uri.file(path.join(extensionPath, 'assets', 'prototype-template.yaml'));
        const manifestFileName: string = fileUtils.generateWorkspacePath(['ampersand', 'prototype.yaml']);

        const manifestFileUri: vscode.Uri = vscode.Uri.file(manifestFileName);

        tryKillPortForwardedProcessAndTerminal(this.portForwardTerminalPID);

        vscode.workspace.fs.readFile(templateFileUri).then((data: Uint8Array) => replaceMarkers(data,encodedZipContent));

        function tryKillPortForwardedProcessAndTerminal(terminalToKill : vscode.Terminal | undefined)
        {
            if(terminalToKill === undefined)
                return;
            
            //get the processID from the terminal that needs to be killed
            terminalToKill.processId.then((terminalToKillPID: number | undefined) => {
                let killerTerminal = terminalUtils.RunCommandsInNewTerminal("Kill processes",
                [`PID=$(ps -ef | grep 'kubectl port-forward' | grep -v grep | awk '{print $2}')`,
                `kill $PID`,
                (`kill -9 ${terminalToKillPID}`)],
                false);

                //Get own terminal PID to kill it later
                killerTerminal.processId.then((killerTerminalPID: number|undefined) => { 
                    
                    //Kill self to cleanup
                    terminalUtils.RunCommandsInExistingTerminal(killerTerminal,[(`kill -9 ${killerTerminalPID}`)]);
                });
            });
        }

        function replaceMarkers(data: Uint8Array, encodedZipContent:string)
        {
            const newData: Uint8Array = fileUtils.replaceMarkers(data, new Map<string, string>(
                [
                    ['{{zipFileContent}}', encodedZipContent],
                    ['{{mainScript}}', encodedMainScript]
                ]
                ));
                
                vscode.workspace.fs.writeFile(manifestFileUri, newData).then(runPrototypeCommand)
        }

        function runPrototypeCommand()
        {
            const deployment: string = 'prototype';
            const service: string = 'prototype';

            generatePrototypeCommand.portForwardTerminalPID = terminalUtils.RunCommandsInNewTerminal("Run prototype in minikube",
                [`kubectl apply -f ${manifestFileUri.fsPath}`,
                `kubectl rollout status deployment/${deployment} --timeout=300s`,
                `kubectl port-forward svc/${service} -n default 8000:80`,]);
        }
    }
}