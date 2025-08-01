import { extensionSettings, fileUtils, terminalUtils } from "../utils";
import { terminalBuilder } from '../builders';

export class generateAtlasCommand implements ICommand {
    static commandName: string = "extension.generateAtlas";

    private builder: terminalBuilder = new terminalBuilder();

    runCommand() {
        if (extensionSettings.rootScriptName === undefined || extensionSettings.rootScriptFolder === undefined)
            return;

        const currentActiveFilePath: string | undefined = fileUtils.generateWorkspacePath([extensionSettings.rootScriptFolder, extensionSettings.rootScriptName]);

        if (currentActiveFilePath === undefined)
            return;

        const terminal = this.builder.setName("Ampersand generate functional spec")
            .getTerminal();

        terminalUtils.runCommandsInExistingTerminal(terminal,
            [`ampersand population --output-dir=${extensionSettings.outputDir} --build-recipe Grind --output-format json --verbosity ${extensionSettings.verbosity} ${currentActiveFilePath}`]);
    }
}