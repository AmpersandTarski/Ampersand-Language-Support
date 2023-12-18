import { fileUtils, terminalUtils } from "../utils";
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';

export class generatePrototypeCommand {
    static GeneratePrototypeCommand(context: vscode.ExtensionContext)
    {
        //Get extension path
        if(context === undefined)
        return;

        const extensionPath = context.extensionPath;

        //Get config settings
        const config = vscode.workspace.getConfiguration('ampersandtarski.language-ampersand');
        const mainScriptSetting : string = config.get('ampersand.mainScriptName');
        const folderSetting : string = config.get('ampersand.folderName');
        
        //Get workspace folders
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if(workspaceFolders === undefined)
            return;

        const workspacePath = workspaceFolders[0].uri.fsPath;
        const folderPath = path.join(workspacePath, folderSetting);

        //Zip folder and encode
        const zipOutPath = path.join(extensionPath, "assets", "out.zip");

        terminalUtils.RunCommandInNewTerminal("Zip", `zip -r - ${folderPath} ${zipOutPath}`);

        const zipContent = fs.readFileSync(zipOutPath, 'utf-8');
        const encodedFolder = btoa(zipContent);

        //Encode main script
        const encodedMainScript = btoa(mainScriptSetting);

        //Get template file and output path
        const templateFileUri = vscode.Uri.file(path.join(extensionPath, 'assets', 'prototype-template.yaml'));
        const manifestFileName : string | undefined = path.join(workspacePath, "ampersand", "prototype.yaml");
        const manifestFileUri = vscode.Uri.file(manifestFileName);

        //Replace markers
        vscode.workspace.fs.readFile(templateFileUri).then((data: Uint8Array) =>{
            const newData = fileUtils.replaceMarkers(data, new Map<string, string>(
                [
                    ['{{zipFileContent}}', encodedFolder],
                    ['{{mainScript}}', encodedMainScript]
                ]
                ));
            vscode.workspace.fs.writeFile(manifestFileUri, newData).then(() => {

                vscode.window.showInformationMessage(`Manifest saved at ${manifestFileUri}`);
            });
        });

        const student : string = 'student';

        //Run prototype in minikube
        terminalUtils.RunCommandInNewTerminal("Run prototype in minikube",
        `sh ${extensionPath}/assets/kubernetes.sh ${manifestFileUri.fsPath} ${student} ${student}`)
    }
}