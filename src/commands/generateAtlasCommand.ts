import { extensionSettings, fileUtils, terminalUtils } from "../utils";
import { terminalBuilder } from '../builders';

export class generateAtlasCommand implements ICommand {
    static commandName: string = "extension.generateAtlas";

    private builder: terminalBuilder = new terminalBuilder();

    RunCommand() {
        if (extensionSettings.mainScriptSetting === undefined || extensionSettings.folderSetting === undefined)
            return;

        const currentActiveFilePath: string | undefined = fileUtils.generateWorkspacePath([extensionSettings.folderSetting, extensionSettings.mainScriptSetting]);

        if (currentActiveFilePath === undefined)
            return;

        const terminal = this.builder.setName("Ampersand generate functional spec")
            .getTerminal();

        terminalUtils.RunCommandsInExistingTerminal(terminal,
            [`ampersand population --output-dir=${extensionSettings.outputFolder} --build-recipe Grind --output-format json --verbosity ${extensionSettings.verbosity} ${currentActiveFilePath}`]);
    }
}