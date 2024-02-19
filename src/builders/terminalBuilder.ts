import * as vscode from 'vscode';
import { terminalInfo } from "../models/terminal";
import { fileUtils } from '../utils';

export class terminalBuilder
{
    private terminalInfoBuild:terminalInfo = new terminalInfo;

    private reset() {
        this.terminalInfoBuild = new terminalInfo;
    }

    public getTerminal(): vscode.Terminal {
        const toReturn = vscode.window.createTerminal({name:this.terminalInfoBuild.terminalName,cwd:fileUtils.generateWorkspacePath(this.terminalInfoBuild.workingDir)});
        this.reset();
        return toReturn;
    }

    public setName(terminalName:string) : terminalBuilder {
        this.terminalInfoBuild.terminalName = terminalName;
        return this;
    }

    public setVisibility(terminalVisible:boolean) : terminalBuilder {
        this.terminalInfoBuild.terminalVisible = terminalVisible;
        return this;
    }

    public setWorkingDir(workingDir:string[]) : terminalBuilder {
        this.terminalInfoBuild.workingDir = workingDir;
        return this;
    }
}