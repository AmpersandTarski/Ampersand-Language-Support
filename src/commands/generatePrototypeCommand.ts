import { fileUtils, terminalUtils } from "../utils";
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';

export class generatePrototypeCommand {
    static GeneratePrototypeCommand()
    {
        const currentActiveFilePath : string | undefined = fileUtils.getCurrentOpenFile();

        if(currentActiveFilePath === undefined)
            return;

        const fileContent : string = fs.readFileSync(currentActiveFilePath, 'utf-8');
        const encodedContent : string = btoa(fileContent);
        
        const manifestFileName : string | undefined = fileUtils.getCurrentOpenFileName();

        const extension = vscode.extensions.getExtension('ampersandtarski.language-ampersand');

        // check if the extension is found
        if(extension === undefined)
            return;

        // get the extension URI
        const extensionUri = extension.extensionUri;
    
        // get the fs path of the extension folder
        const extensionPath = extensionUri.fsPath;
    
        // append the relative path of the file to the extension path
        const templateFilePath = `${extensionPath}/src/prototype-template.yaml`;
        const manifestFilePath = `${extensionPath}/src/${manifestFileName}`;
    
        const templateFileUri : vscode.Uri = vscode.Uri.file(templateFilePath);
        const manifestFileUri : vscode.Uri = vscode.Uri.file(manifestFilePath);

        vscode.workspace.fs.readFile(templateFileUri).then(data =>{
            const newData = fileUtils.replaceMarkers(data, new Map<string, string>([['{{scriptContent}}', encodedContent]]));
            vscode.workspace.fs.writeFile(manifestFileUri, newData).then(() => {

                vscode.window.showInformationMessage('Applying prototype');
            });
        });

        terminalUtils.RunCommandInNewTerminal("Prototype in minikube",
        `kubectl apply -f ${manifestFileUri.fsPath}`)
        // terminalUtils.RunCommandInNewTerminal("Prototype in minikube",
        // `sh ${extensionPath}/src/kubernetes.sh ${manifestFileUri.fsPath} student student`)
    }
}