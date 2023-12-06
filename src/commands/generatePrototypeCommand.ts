import { fileUtils, terminalUtils } from "../utils";
import * as fs from 'fs';
import * as vscode from 'vscode';

export class generatePrototypeCommand {
    static GeneratePrototypeCommand()
    {
        const currentActiveFilePath : string | undefined = fileUtils.getCurrentOpenFile();

        if(currentActiveFilePath === undefined)
            return;

        const fileContent : string = fs.readFileSync(currentActiveFilePath, 'utf-8');
        const encodedContent : string = btoa(fileContent);
        
        const manifestFileName : string | undefined = fileUtils.getCurrentOpenFileName();

        const templateFileUri : vscode.Uri = vscode.Uri.file('/workspaces/Ampersand-Language-Support/src/prototype-template.yaml');
        const manifestFileUri : vscode.Uri = vscode.Uri.file(`/workspaces/Ampersand-Language-Support/src/${manifestFileName}`);

        vscode.workspace.fs.readFile(templateFileUri).then(data =>{
            const newData = fileUtils.replaceMarkers(data, new Map<string, string>([['{{scriptContent}}', encodedContent]]));
            vscode.workspace.fs.writeFile(manifestFileUri, newData).then(() => {

                vscode.window.showInformationMessage('Applying prototype');
            });
        });

        // terminalUtils.RunCommandInNewTerminal("Prototype in minikube",
        // `kubectl apply -f ${manifestFileUri.fsPath}`)
        terminalUtils.RunCommandInNewTerminal("Prototype in minikube",
        `sh /workspaces/Ampersand-Language-Support/src/kubernetes.sh ${manifestFileUri.fsPath}`)
    }
}