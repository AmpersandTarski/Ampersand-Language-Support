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
        
        // const manifestContent : string = fs.readFileSync('/workspaces/Ampersand-Language-Support/src/prototype-template.yaml', 'utf-8');
        // manifestContent.replace('{{scriptContent}}', encodedContent);

        const manifestFileName : string | undefined = fileUtils.getCurrentOpenFileName();

        const templateFileUri : vscode.Uri = vscode.Uri.file('/workspaces/Ampersand-Language-Support/src/prototype-template.yaml');
        const manifestFileUri : vscode.Uri = vscode.Uri.file(`/workspaces/Ampersand-Language-Support/src/${manifestFileName}`);

        // read the file contents as a Uint8Array
        fileUtils.replaceMarker(templateFileUri, manifestFileUri, '{{scriptContent}}', encodedContent);

        terminalUtils.RunCommandInNewTerminal("Prototype in minikube",
        `kubectl apply -f ${manifestFileUri.fsPath}`)
    }
}