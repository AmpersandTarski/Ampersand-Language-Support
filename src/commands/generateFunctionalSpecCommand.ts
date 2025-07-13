import { extensionSettings, fileUtils, terminalUtils } from '../utils';
import { terminalBuilder } from '../builders';

export class generateFunctionalSpecCommand implements ICommand {
    static commandName: string = "extension.generateFunctionalSpec";

    private builder: terminalBuilder = new terminalBuilder();

    /**
     * Executes the command to generate the functional specification documentation
     * using the Ampersand tool. This method performs the following steps:
     * 
     * 1. Checks if the main script setting is defined in the extension settings.
     *    If not, logs an error and returns.
     * 2. Logs the main script setting.
     * 3. Checks if the folder setting is defined in the extension settings.
     *    If not, logs an error and returns.
     * 4. Logs the folder setting.
     * 5. Generates the path to the main script using the folder and main script settings.
     * 6. Configures a terminal for running the Ampersand documentation command.
     * 7. Constructs the documentation command with various options based on the extension settings.
     * 8. Runs the constructed command in the configured terminal.
     */
    runCommand(): void {
        if (extensionSettings.rootScriptName === undefined) {
            console.error("Main script not set in settings");
            return
        };
        console.info("Script setting: " + extensionSettings.rootScriptName);

        if (extensionSettings.rootScriptFolder === undefined) {
            console.error("Folder not set in settings");
            return;
        };
        console.info("Folder setting: " + extensionSettings.rootScriptFolder);

        const mainScriptPath: string = fileUtils.generateWorkspacePath([extensionSettings.rootScriptFolder, extensionSettings.rootScriptName]);

        const terminal = this.builder.setName("Ampersand generate functional spec")
            .setWorkingDir(['.'])
            .getTerminal();

        const documentationCommand: string = [
            "ampersand documentation",
            mainScriptPath,
            "--format " + extensionSettings.documentation.format,
            extensionSettings.graphicsSetting ? "" : "--no-graphics",
            extensionSettings.documentation.intro ? "" : "--no-Intro",
            extensionSettings.documentation.sharedLang ? "" : "--no-SharedLang",
            extensionSettings.documentation.diagnosis ? "" : "--no-Diagnosis",
            extensionSettings.documentation.conceptualAnalysis ? "" : "--no-ConceptualAnalysis",
            extensionSettings.documentation.dataAnalysis ? "" : "--no-DataAnalysis",
            "--language=" + extensionSettings.outputLanguage,
            "--output-dir " + extensionSettings.outputDir,
            extensionSettings.sqlBinaryTables ? "--sql-binary-tables" : "",
            "--verbosity " + extensionSettings.verbosity
        ]
            .filter((x) => x.trim() !== "")
            .join(" ");


        terminalUtils.runCommandsInExistingTerminal(terminal, [documentationCommand]);
    }
}