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

        let fileUri = vscode.Uri.file('/workspaces/Ampersand-Language-Support/src/prototype-template.yaml');

        // read the file contents as a Uint8Array
        vscode.workspace.fs.readFile(fileUri).then(data => {

          // convert the Uint8Array to a string
          let text = Buffer.Buffer.from(data).toString();
        
          // replace the text with the new value
          let newText = text.replace('{{scriptContent}}', 'something else');
        
          // convert the string to a Uint8Array
          let newData = Buffer.Buffer.from(newText);
        
          // write the file contents from the Uint8Array
          vscode.workspace.fs.writeFile(fileUri, newData).then(() => {

            // show a message that the file was updated
            vscode.window.showInformationMessage('File updated');
          });
        });

        // terminalUtils.RunCommandInNewTerminal("ampersand generate atlas",
        // `ampersand population --output-dir='./' --build-recipe Grind --output-format json --verbosity warn ${currentActiveFilePath}`)
    }
}