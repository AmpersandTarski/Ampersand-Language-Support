import * as vscode from 'vscode';
import { config, fileUtils, terminalUtils } from "../utils";
import { terminalBuilder } from '../builders';

export class generateAtlasCommand {
    private builder : terminalBuilder = new terminalBuilder();
    
    public GenerateAtlasCommand()
    {
        if(config.mainScriptSetting === undefined || config.folderSetting === undefined)
            return;

        const currentActiveFilePath : string | undefined = fileUtils.generateWorkspacePath([config.folderSetting, config.mainScriptSetting]);

        if(currentActiveFilePath === undefined)
            return;

        const terminal = this.builder.setName("Ampersand generate functional spec")
                                        .getTerminal();

        terminalUtils.RunCommandsInExistingTerminal(terminal,
        [`ampersand population --output-dir='./' --build-recipe Grind --output-format json --verbosity warn ${currentActiveFilePath}`])
    }
}