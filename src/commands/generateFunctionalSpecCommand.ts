import { config, fileUtils, terminalUtils } from '../utils';
import { terminalBuilder } from '../builders';

export class generateFunctionalSpecCommand implements ICommand {
    static commandName: string = "extension.generateFunctionalSpec";

    private builder: terminalBuilder = new terminalBuilder();

    RunCommand() {
        if (config.mainScriptSetting === undefined) {
            console.error("Main script not set in settings");
            return
        };
        console.info("Script setting: " + config.mainScriptSetting);

        if (config.folderSetting === undefined) {
            console.error("Folder not set in settings");
            return;
        };
        console.info("Folder setting: " + config.folderSetting);

        const mainScriptPath: string = fileUtils.generateWorkspacePath([config.folderSetting, config.mainScriptSetting]);

        const terminal = this.builder.setName("Ampersand generate functional spec")
            .setWorkingDir(['.'])
            .getTerminal();

        const documentationCommand: string = [
            "ampersand documentation",
            mainScriptPath,
            "--format " + config.formatSetting,
            config.graphicsSetting ? "--graphics" : "--no-graphics",
            "--language = NL",
            "--ConceptualAnalysis",
            "--verbosity debug"
        ].join(" ")


        terminalUtils.RunCommandsInExistingTerminal(terminal, [documentationCommand]);
    }
}