import { fileUtils, terminalUtils } from "../utils";
import * as fs from 'fs';
import * as vscode from 'vscode';
import * as Buffer from 'buffer';

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
        vscode.workspace.fs.readFile(templateFileUri).then(data => {

          // convert the Uint8Array to a string
          const text : string = Buffer.Buffer.from(data).toString();
        
          // replace the text with the new value
          const newText : string = text.replace('{{scriptContent}}', encodedContent);
        
          // convert the string to a Uint8Array
          let newData = Buffer.Buffer.from(newText);
        
          // write the file contents from the Uint8Array
          vscode.workspace.fs.writeFile(manifestFileUri, newData).then(() =>{

            // show a message that the file was updated
            vscode.window.showInformationMessage('Applying prototype');
          });
        });

        terminalUtils.RunCommandInNewTerminal("Prototype in minikube",
        `kubectl apply -f ${manifestFileUri.fsPath}`)
    }
}