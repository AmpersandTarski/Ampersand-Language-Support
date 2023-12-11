import { fileUtils, terminalUtils } from "../utils";
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as path from 'path';

export class generatePrototypeCommand {
    static GeneratePrototypeCommand(context: vscode.ExtensionContext)
    {
        const currentActiveFilePath : string | undefined = fileUtils.getCurrentOpenFile();

        if(currentActiveFilePath === undefined)
            return;

        const fileContent : string = fs.readFileSync(currentActiveFilePath, 'utf-8');
        const encodedContent : string = btoa(fileContent);
        
        const manifestFileName : string | undefined = fileUtils.getCurrentOpenFileName();

        if(context === undefined)
            return;

        const extensionPath = context.extensionPath;

        const templateFileUri = vscode.Uri.file(path.join(extensionPath, 'assets', 'prototype-template.yaml'))

        const workspaceFolders = vscode.workspace.workspaceFolders;

        if(workspaceFolders === undefined)
            return;

        const workspacePath = workspaceFolders[0].uri.fsPath;
    
        const manifestFileUri = vscode.Uri.file(path.join(workspacePath, 'ampersand', 'deployments', `${manifestFileName}`));

        vscode.workspace.fs.readFile(templateFileUri).then(data =>{
            const newData = fileUtils.replaceMarkers(data, new Map<string, string>([['{{scriptContent}}', encodedContent]]));
            vscode.workspace.fs.writeFile(manifestFileUri, newData).then(() => {

                vscode.window.showInformationMessage(`Manifest saved at ${manifestFileUri}`);
            });
        });

        const student : string = 'student';

        // terminalUtils.RunCommandInNewTerminal("Prototype in minikube",
        // `kubectl apply -f ${manifestFileUri.fsPath}`)
        terminalUtils.RunCommandInNewTerminal("Prototype in minikube",
        `sh ${extensionPath}/assets/kubernetes.sh ${manifestFileUri.fsPath} ${student} ${student}`)
    }
}