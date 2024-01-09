import * as vscode from 'vscode';
import { config, fileUtils, terminalUtils } from '../utils';

export class generateFunctionalSpecCommand{
    static GenerateFunctionalSpecCommand(context: vscode.ExtensionContext)
    {
        //Get extension path
        if(context === undefined)
            return;

        const extensionPath: string = context.extensionPath;

        if(config.mainScriptSetting === undefined || config.folderSetting === undefined)
            return;
        
        const mainScriptPath: string = fileUtils.generateWorkspacePath([config.folderSetting, config.mainScriptSetting]);

        terminalUtils.RunCommandsInNewTerminal("Ampersand generate functional spec",
        [`ampersand documentation --no-text --format docx ${mainScriptPath}`,
        `ampersand documentation ${mainScriptPath} --format docx --no-graphics --language=NL --ConceptualAnalysis --verbosity debug`],
        ['ampersand']);
    }
}