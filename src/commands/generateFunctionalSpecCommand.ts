import { extensionSettings, fileUtils, terminalUtils } from '../utils';
import { terminalBuilder } from '../builders';

export class generateFunctionalSpecCommand implements ICommand {
    static commandName: string = "extension.generateFunctionalSpec";

    private builder: terminalBuilder = new terminalBuilder();

    RunCommand() {
        if (extensionSettings.mainScriptSetting === undefined) {
            console.error("Main script not set in settings");
            return
        };
        console.info("Script setting: " + extensionSettings.mainScriptSetting);

        if (extensionSettings.folderSetting === undefined) {
            console.error("Folder not set in settings");
            return;
        };
        console.info("Folder setting: " + extensionSettings.folderSetting);

        const mainScriptPath: string = fileUtils.generateWorkspacePath([extensionSettings.folderSetting, extensionSettings.mainScriptSetting]);

        const terminal = this.builder.setName("Ampersand generate functional spec")
            .setWorkingDir(['.'])
            .getTerminal();

        const documentationCommand: string = [
            "ampersand documentation",
            mainScriptPath,
            "--format " + extensionSettings.formatSetting,
            extensionSettings.graphicsSetting ? "--graphics" : "--no-graphics",
            "--language=NL",
            "--ConceptualAnalysis",
            "--verbosity debug"
        ].join(" ")


        terminalUtils.RunCommandsInExistingTerminal(terminal, [documentationCommand]);
    }
}