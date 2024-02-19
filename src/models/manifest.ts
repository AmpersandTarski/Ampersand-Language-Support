import * as vscode from 'vscode';
import { config, fileUtils, terminalUtils, zipUtils } from "../utils";
import * as path from 'path';

export class manifest{
    private readonly _encodedZipContent: string | undefined;
    
    public get encodedZipContent(): string {
        return (this._encodedZipContent === undefined) ? "" : this._encodedZipContent;
    }
    
    public readonly encodedMainScript: string;
    public readonly templateFileUri: vscode.Uri;
    public readonly fileUri: vscode.Uri;

    constructor(extensionPath: string)
    {
        this._encodedZipContent = zipUtils.zipFolder(extensionPath);
        this.encodedMainScript = btoa(config.mainScriptSetting as string);
        this.templateFileUri = vscode.Uri.file(path.join(extensionPath, 'assets', 'prototype-template.yaml'));

        const fileName = fileUtils.generateWorkspacePath(['ampersand', 'prototype.yaml']);
        this.fileUri = vscode.Uri.file(fileName)
    }
}