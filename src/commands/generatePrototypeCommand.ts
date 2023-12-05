import { fileUtils, terminalUtils } from "../utils";
import * as fs from 'fs';

export class generatePrototypeCommand {
    static GeneratePrototypeCommand()
    {
        const currentActiveFilePath : string | undefined = fileUtils.getCurrentOpenFile();

        if(currentActiveFilePath === undefined)
            return;

        const fileContent : string = fs.readFileSync(currentActiveFilePath, 'utf-8');
        const encodedContent : string = btoa(fileContent);
        
        const manifestContent : string = fs.readFileSync('/workspaces/Ampersand-Language-Support/src/prototype-template.yaml', 'utf-8');
        manifestContent.replace('{{scriptContent}}', encodedContent);

        // terminalUtils.RunCommandInNewTerminal("ampersand generate atlas",
        // `ampersand population --output-dir='./' --build-recipe Grind --output-format json --verbosity warn ${currentActiveFilePath}`)
    }
}