import { fileUtils, terminalUtils } from "../utils";
import * as vscode from 'vscode';
import { terminalBuilder } from "../builders/terminalBuilder";
import { manifest } from '../models/manifest';

export class generatePrototypeCommand {
    static portForwardTerminal: vscode.Terminal | undefined = undefined;
    private builder : terminalBuilder = new terminalBuilder();

    private manifestFile : manifest;

    constructor(context: vscode.ExtensionContext)
    {
        this.manifestFile = new manifest(context.extensionPath);
    }

    public GeneratePrototypeCommand()
    {
        this.tryKillPortForwardedProcessAndTerminal();     

        vscode.workspace.fs.readFile(this.manifestFile.templateFileUri).then((data: Uint8Array) => this.replaceMarkers(data));
    }

    private tryKillPortForwardedProcessAndTerminal()
    {
        if(generatePrototypeCommand.portForwardTerminal === undefined)
            return;
        
        const buildTerminal = this.builder.setName("default name")
                                            .setVisibility(false)
                                            .getTerminal();
        
        //get the processID from the terminal that needs to be killed
        generatePrototypeCommand.portForwardTerminal.processId.then((terminalToKillPID: number | undefined) => {
            terminalUtils.RunCommandsInExistingTerminal(buildTerminal,
            [`PID=$(ps -ef | grep 'kubectl port-forward' | grep -v grep | awk '{print $2}')`,
            `kill $PID`,
            (`kill -9 ${terminalToKillPID}`)])

            //Get own terminal PID to kill it later
            buildTerminal.processId.then((killerTerminalPID: number|undefined) => { 
                
                //Kill self to cleanup
                terminalUtils.RunCommandsInExistingTerminal(buildTerminal,[(`kill -9 ${killerTerminalPID}`)]);
            });
        });
    }

    private replaceMarkers(data: Uint8Array)
    {
        const newData: Uint8Array = fileUtils.replaceMarkers(data, new Map<string, string>(
            [
                ['{{zipFileContent}}', this.manifestFile.encodedZipContent],
                ['{{mainScript}}', this.manifestFile.encodedMainScript]
            ]
            ));

            const term = this.builder.setName("Run prototype in minikube")
                                        .getTerminal();
                                        term.show();
        terminalUtils.RunCommandsInExistingTerminal(term,
            [`${this.manifestFile.fileUri.fsPath}`]);

        vscode.workspace.fs.writeFile(this.manifestFile.fileUri, newData).then(() => { this.runPrototypeCommand; });
    }

    private runPrototypeCommand()
    {
        const deployment: string = 'prototype';
        const service: string = 'prototype'; 
        
        generatePrototypeCommand.portForwardTerminal = this.builder.setName("Run prototype in minikube")
                                        .getTerminal();
        generatePrototypeCommand.portForwardTerminal.show();
        terminalUtils.RunCommandsInExistingTerminal(generatePrototypeCommand.portForwardTerminal,
            [`kubectl apply -f ${this.manifestFile.fileUri.fsPath}`,
            `kubectl rollout status deployment/${deployment} --timeout=300s`,
            `kubectl port-forward svc/${service} -n default 8000:80`,]);
    }
}