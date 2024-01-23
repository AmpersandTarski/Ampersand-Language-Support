import { config, fileUtils, terminalUtils, zipUtils } from "../utils";
import * as vscode from 'vscode';
import * as path from 'path';

export class generatePrototypeCommand {
    static GeneratePrototypeCommand(context: vscode.ExtensionContext)
    {
        //Get extension path
        if(context === undefined)
            return;

        const extensionPath: string = context.extensionPath;

        const encodedZipContent = zipUtils.zipFolder(extensionPath);

        if(encodedZipContent === undefined)
            return;

        //Encode main script
        const newData = replaceMarkers(encodedZipContent);
        
        if(newData === undefined)
            return;
    
        writeMarkerFile(newData);

        function replaceMarkers(encodedZipContent : string) {
            const encodedMainScript: string = btoa(config.mainScriptSetting as string);

            //Get template file and output path
            const templateFileUri: vscode.Uri = vscode.Uri.file(path.join(extensionPath, 'assets', 'prototype-template.yaml'));

            //Replace markers
            const newData = zipUtils.replaceMarkers(templateFileUri, encodedZipContent, encodedMainScript);
            return newData;
        }

        function writeMarkerFile(newData : Uint8Array) {
            const manifestFileName: string = fileUtils.generateWorkspacePath(['ampersand', 'prototype.yaml']);
            zipUtils.writeMarkerFile(manifestFileName, newData);
        }
    }
}