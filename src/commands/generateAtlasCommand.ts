import * as vscode from 'vscode';
import { config, fileUtils, terminalUtils } from "../utils";

export class generateAtlasCommand {
    static GenerateAtlasCommand()
    {
        if(config.mainScriptSetting === undefined || config.folderSetting === undefined)
            return;

        const currentActiveFilePath : string | undefined = fileUtils.generateWorkspacePath([config.folderSetting, config.mainScriptSetting]);

        if(currentActiveFilePath === undefined)
            return;

        terminalUtils.RunCommandInNewTerminal("ampersand generate atlas",
        `ampersand population --output-dir='./' --build-recipe Grind --output-format json --verbosity warn ${currentActiveFilePath}`)
    }
}