import { config, fileUtils, terminalUtils } from '../utils';

export class generateFunctionalSpecCommand{
    static GenerateFunctionalSpecCommand()
    {
        if(config.mainScriptSetting === undefined || config.folderSetting === undefined)
            return;
        
        const mainScriptPath: string = fileUtils.generateWorkspacePath([config.folderSetting, config.mainScriptSetting]);

        terminalUtils.RunCommandInNewTerminal("ampersand generate spec",`ampersand documentation ${mainScriptPath} --format docx --no-graphics --language=NL --ConceptualAnalysis --verbosity debug`)
    }
}