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

    public async GeneratePrototypeCommand()
    {
        this.tryKillPortForwardedProcessAndTerminal();     

        const data = await vscode.workspace.fs.readFile(this.manifestFile.templateFileUri);
        this.replaceMarkers(data);
    }

    private async tryKillPortForwardedProcessAndTerminal()
    {
        if(generatePrototypeCommand.portForwardTerminal === undefined)
            return;
        
        const buildTerminal = this.builder.setName("Cleanup")
                                            .setVisibility(false)
                                            .getTerminal();
        
        //get the processID from the terminal that needs to be killed
        const terminalToKillPID = await generatePrototypeCommand.portForwardTerminal.processId;
            
        terminalUtils.RunCommandsInExistingTerminal(buildTerminal,
            [`PID=$(ps -ef | grep 'kubectl port-forward' | grep -v grep | awk '{print $2}')`,
            `kill $PID`,
            (`kill -9 ${terminalToKillPID}`)]);
 
        //Get own terminal PID to kill it later
        const killerTerminalPID = await buildTerminal.processId;
            
            //Kill self to cleanup
        terminalUtils.RunCommandsInExistingTerminal(buildTerminal,[(`kill -9 ${killerTerminalPID}`)]);
    }

    private async replaceMarkers(data: Uint8Array)
    {
        const newData: Uint8Array = fileUtils.replaceMarkers(data, new Map<string, string>(
            [
                ['{{zipFileContent}}', this.manifestFile.encodedZipContent],
                ['{{mainScript}}', this.manifestFile.encodedMainScript]
            ]
            ));

        await vscode.workspace.fs.writeFile(this.manifestFile.fileUri, newData);
        this.runPrototypeCommand();
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