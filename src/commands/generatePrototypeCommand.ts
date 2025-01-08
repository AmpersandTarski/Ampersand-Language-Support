import { fileUtils, terminalUtils } from "../utils";
import * as vscode from 'vscode';
import { terminalBuilder } from "../builders/terminalBuilder";

export class generatePrototypeCommand implements ICommand {
    static commandName: string = "extension.generatePrototype";

    static portForwardTerminal: vscode.Terminal | undefined = undefined;
    private builder: terminalBuilder = new terminalBuilder();

    async RunCommand() {
        this.tryKillPortForwardedProcessAndTerminal();


    }

    private async tryKillPortForwardedProcessAndTerminal() {
        if (generatePrototypeCommand.portForwardTerminal === undefined)
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
        terminalUtils.RunCommandsInExistingTerminal(buildTerminal, [(`kill -9 ${killerTerminalPID}`)]);
    }

    private async replaceMarkers(data: Uint8Array) {
        this.runPrototypeCommand();
    }

    private runPrototypeCommand() {
        const deployment: string = 'prototype';
        const service: string = 'prototype';

        generatePrototypeCommand.portForwardTerminal = this.builder.setName("Run prototype")
            .getTerminal();
        generatePrototypeCommand.portForwardTerminal.show();

        terminalUtils.RunCommandsInExistingTerminal(generatePrototypeCommand.portForwardTerminal,
            [`docker compose up -d --build`]);
    }
}