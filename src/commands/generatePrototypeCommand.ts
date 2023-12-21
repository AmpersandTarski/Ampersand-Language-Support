import { config, fileUtils, terminalUtils } from "../utils";
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';
import * as child_process from 'child_process';

export class generatePrototypeCommand {
    static GeneratePrototypeCommand(context: vscode.ExtensionContext)
    {
        //Get extension path
        if(context === undefined)
            return;

        const extensionPath = context.extensionPath;

        if(config.mainScriptSetting === undefined || config.folderSetting === undefined)
            return;
        
        const folderPath = fileUtils.generateWorkspacePath([config.folderSetting]); //path.join(workspacePath, config.folderSetting);

        //Zip folder and encode
        const zipOutPath = path.join(extensionPath, "assets", "out.zip");

        child_process.execSync(`zip -r ${zipOutPath} *`, {
          cwd: folderPath
        });

        const encodedZipContent = fs.readFileSync(zipOutPath).toString('base64');

        //Encode main script
        const encodedMainScript = btoa(config.mainScriptSetting);

        //Get template file and output path
        const templateFileUri = vscode.Uri.file(path.join(extensionPath, 'assets', 'prototype-template.yaml'));
        const manifestFileName : string | undefined = fileUtils.generateWorkspacePath(['ampersand', 'prototype']); //path.join(workspacePath, 'ampersand', 'prototype.yaml');
        const manifestFileUri = vscode.Uri.file(manifestFileName);

        //Replace markers
        vscode.workspace.fs.readFile(templateFileUri).then((data: Uint8Array) =>{
            const newData = fileUtils.replaceMarkers(data, new Map<string, string>(
                [
                    ['{{zipFileContent}}', encodedZipContent],
                    ['{{mainScript}}', encodedMainScript]
                ]
                ));
            vscode.workspace.fs.writeFile(manifestFileUri, newData).then(() => {

                vscode.window.showInformationMessage(`Manifest saved, running in minikube.`);

                const deployment : string = 'prototype';
                const service : string = 'prototype';

                // Run prototype in minikube
                terminalUtils.RunCommandInNewTerminal("Run prototype in minikube",
                `sh ${extensionPath}/assets/kubernetes.sh ${manifestFileUri.fsPath} ${deployment} ${service}`);

            });
        });
    }
}