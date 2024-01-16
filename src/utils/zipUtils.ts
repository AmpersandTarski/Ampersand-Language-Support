import * as vscode from 'vscode';
import * as fs from 'fs';
import * as child_process from 'child_process';
import * as path from 'path';
import { fileUtils, config, terminalUtils } from '../utils';

export class zipUtils{
    static zipFolder(extensionPath: string): string | undefined
    {
        if(config.mainScriptSetting === undefined || config.folderSetting === undefined)
        return;

        const folderPath: string = fileUtils.generateWorkspacePath([config.folderSetting]);

        //Zip folder and encode
        const zipOutPath: string = path.join(extensionPath, "assets", "out.zip");

        child_process.execSync(`zip -r ${zipOutPath} *`, {
          cwd: folderPath
        });

        const encodedZipContent: string = fs.readFileSync(zipOutPath).toString('base64');

        return encodedZipContent;
    }

    static replaceMarkers(templateFileUri : vscode.Uri, encodedZipContent: string, encodedMainScript: string): Uint8Array | undefined
        {
            let newData = undefined;

            vscode.workspace.fs.readFile(templateFileUri).then((data: Uint8Array) =>{
                 newData = fileUtils.replaceMarkers(data, new Map<string, string>(
                    [
                        ['{{zipFileContent}}', encodedZipContent],
                        ['{{mainScript}}', encodedMainScript]
                    ]
                    ));
            });

            return newData;
        }

        static writeMarkerFile(manifestFileName : string, newData: Uint8Array)
        {
            const manifestFileUri: vscode.Uri = vscode.Uri.file(manifestFileName);

            vscode.workspace.fs.writeFile(manifestFileUri, newData).then(() => {
    
                vscode.window.showInformationMessage(`Manifest saved, running in minikube.`);

                const deployment: string = 'prototype';
                const service: string = 'prototype';

            terminalUtils.RunCommandsInNewTerminal("Run prototype in minikube",
                [`kubectl apply -f ${manifestFileUri.fsPath}`,
                `kubectl rollout status deployment/${deployment} --timeout=300s`,
                `kubectl port-forward svc/${service} -n default 8000:80`,]);
            });
        }
}