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

        const encodedZipContent = zipUtils.zipFolder(extensionPath);

        if(encodedZipContent === undefined)
            return;
        
        const encodedMainScript: string = btoa(config.mainScriptSetting as string);
        const templateFileUri: vscode.Uri = vscode.Uri.file(path.join(extensionPath, 'assets', 'prototype-template.yaml'));
        const manifestFileName: string = fileUtils.generateWorkspacePath(['ampersand', 'prototype.yaml']);

        const manifestFileUri: vscode.Uri = vscode.Uri.file(manifestFileName);

        tryKillPortForwardedProcessAndTerminal(this.portForwardTerminalPID);

        vscode.workspace.fs.readFile(templateFileUri).then((data: Uint8Array) =>{
            const newData: Uint8Array = fileUtils.replaceMarkers(data, new Map<string, string>(
                [
                    ['{{zipFileContent}}', encodedZipContent],
                    ['{{mainScript}}', encodedMainScript]
                ]
                ));
            vscode.workspace.fs.writeFile(manifestFileUri, newData).then(() => {

                vscode.window.showInformationMessage(`Manifest saved, running in minikube.`);

                const deployment: string = 'prototype';
                const service: string = 'prototype';

            this.portForwardTerminalPID = terminalUtils.RunCommandsInNewTerminal("Run prototype in minikube",
                [`kubectl apply -f ${manifestFileUri.fsPath}`,
                `kubectl rollout status deployment/${deployment} --timeout=300s`,
                `kubectl port-forward svc/${service} -n default 8000:80`,]);
            });
        });

        function tryKillPortForwardedProcessAndTerminal(terminalPID : vscode.Terminal | undefined)
        {
            if(terminalPID === undefined)
                return;

            let killerTerminalPID = terminalUtils.RunCommandsInNewTerminal("Kill processes",
            [`PID=$(ps -ef | grep 'kubectl port-forward' | grep -v grep | awk '{print $2}')`,
            `kill $PID`,
            (`kill ` + terminalPID.processId)]);
        }
    }
}