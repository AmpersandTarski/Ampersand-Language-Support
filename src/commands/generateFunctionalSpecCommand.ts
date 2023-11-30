import vscode from 'vscode';
import { fileUtils, terminalUtils } from '../utils';

export class generateFunctionalSpecCommand{
    static GenerateFunctionalSpecCommand()
    {
        const currentActiveFilePath : string | undefined = fileUtils.getCurrentOpenFile();

        if(currentActiveFilePath === undefined)
            return;
    
        terminalUtils.RunCommandInNewTerminal("ampersand generate spec",`ampersand documentation ${currentActiveFilePath} --format docx --no-graphics --language=NL --ConceptualAnalysis --verbosity debug`)
    }
}