import { config, fileUtils, terminalUtils } from '../utils';
import { terminalBuilder } from '../builders';

export class generateFunctionalSpecCommand  implements ICommand {
    commandName: string = "extension.generateFunctionalSpec";

    private builder : terminalBuilder = new terminalBuilder();
    
    RunCommand() {
        if(config.mainScriptSetting === undefined || config.folderSetting === undefined)
            return;
        
        const mainScriptPath: string = fileUtils.generateWorkspacePath([config.folderSetting, config.mainScriptSetting]);

        const terminal = this.builder.setName("Ampersand generate functional spec")
                                        .setWorkingDir(['ampersand'])
                                        .getTerminal();

        terminalUtils.RunCommandsInExistingTerminal(terminal,
        [`ampersand documentation --no-text --format docx ${mainScriptPath}`,
        `ampersand documentation ${mainScriptPath} --format docx --no-graphics --language=NL --ConceptualAnalysis --verbosity debug`],
        );
    }
}