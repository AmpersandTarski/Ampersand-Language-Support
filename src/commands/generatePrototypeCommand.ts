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

        if(extension === undefined)
            return;

        const extensionPath = extension.extensionPath;

        const templateFileUri = vscode.Uri.file(path.join(extensionPath, 'src', 'prototype-template.yaml'))

        console.log(templateFileUri);
    
        const workspaceFolders = vscode.workspace.workspaceFolders;

        if(workspaceFolders === undefined)
            return;

        const workspacePath = workspaceFolders[0].uri.fsPath;
    
        const manifestFileUri = vscode.Uri.file(path.join(workspacePath, 'ampersand', 'deployments', `${manifestFileName}`));

        console.log(manifestFileUri);

        vscode.workspace.fs.readFile(templateFileUri).then(data =>{
            console.log(data);
            const newData = fileUtils.replaceMarkers(data, new Map<string, string>([['{{scriptContent}}', encodedContent]]));
            console.log(newData);
            vscode.workspace.fs.writeFile(manifestFileUri, newData).then(() => {

                vscode.window.showInformationMessage(`Manifest saved at ${manifestFileUri}`);
            });
        });

        // terminalUtils.RunCommandInNewTerminal("Prototype in minikube",
        // `kubectl apply -f ${manifestFileUri.fsPath}`)
        // terminalUtils.RunCommandInNewTerminal("Prototype in minikube",
        // `sh ${extensionPath}/src/kubernetes.sh ${manifestFileUri.fsPath} student student`)
    }
}