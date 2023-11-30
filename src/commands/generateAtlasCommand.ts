import { fileUtils, terminalUtils } from "../utils";

export class generateAtlasCommand {
    static GenerateAtlasCommand()
    {
        const currentActiveFilePath : string | undefined = fileUtils.getCurrentOpenFile();

        if(currentActiveFilePath === undefined)
            return;

        terminalUtils.RunCommandInNewTerminal("ampersand generate atlas",
        `ampersand population --output-dir='./' --build-recipe Grind --output-format json --verbosity warn ${currentActiveFilePath}`)
    }
}