import { extensionSettings, fileUtils, terminalUtils } from "../utils";
import { terminalBuilder } from "../builders";

export class generatePrototypeCommand implements ICommand {
    static commandName: string = "extension.generatePrototype";

    private builder: terminalBuilder = new terminalBuilder();

    runCommand(): void {
        if (extensionSettings.rootScriptName === undefined) {
            console.error("Main script not set in settings");
            return
        };
        console.info("Script setting: " + extensionSettings.rootScriptName);

        if (extensionSettings.rootScriptFolder === undefined) {
            console.error("Folder not set in settings");
            return;
        };
        console.info("Folder setting: " + extensionSettings.rootScriptFolder);

        const mainScriptPath: string = fileUtils.generateWorkspacePath([extensionSettings.rootScriptFolder, extensionSettings.rootScriptName]);

        const terminal = this.builder.setName("Ampersand generate functional spec")
            .setWorkingDir(['.'])
            .getTerminal();

        const documentationCommand: string = [
            "docker compose up -d --build"
        ]
            .filter((x) => x.trim() !== "")
            .join(" ");


        terminalUtils.runCommandsInExistingTerminal(terminal, [documentationCommand]);
    }
}