
import * as vscode from 'vscode';
import { constants } from '../constants';

export class AmpersandVersionChecker {
	static checkVersion ()  {
		
		// grab the version number from a string that holds the
		// output of ampersand --version
		function grabVersion (xs : string) : string | null {
			
			
			let f = (b : string, isModified : boolean) => {
				if (b == "master" && !isModified) {
			return ""
				} else if (isModified) {
					return " " + b + " (modified)"
				} else {
					return " " + b
				}
			}
			let r1 = /Ampersand-(v[0-9]+\.[0-9]+\.[0-9]+) \[(.*)?\]/ ;
			var m : RegExpMatchArray | null ;
			var result : string | null = null ;
			if (m = xs.match(r1)) {
					let m1 = m ;
					let r2 = /(.*)?:(.*)?([\*]*)$/ ;
					var m2 : RegExpMatchArray | null ;
					if (m2 = m1[2].match(r2)) {
						result = m1[1] + f(m2[1],(null == m2[2]))
						}  
					} else {
						result = null
			}
			return result
		};
		const { exec } = require('child_process');
		let command = `${constants.extension.generatorName} --version`
		exec(command, (err:string, stdout:string) => {
		if (err) {
			// node couldn't execute the command
			console.log(`err: ${err}`);
			vscode.window.showErrorMessage
			('Make sure `ampersand` is in your path if you want to fully leverage this extention. ')
		} else {
				let v = grabVersion(stdout) ;
				// the *entire* stdout and stderr (buffered)
			let message : string = `Your version of ampersand:
				${v}`;
			vscode.window.showInformationMessage(message )
		};
		
		});
	}

	static getVersion() : string {
		const { execSync } = require('child_process');
	// stderr is sent to stderr of parent process
	// you can set options.stdio if you want it to go elsewhere
		let command = `${constants.extension.generatorName} --version`;
	let version = execSync(command);
	var string = new TextDecoder("utf-8").decode(version);  
	return string
		
	}
}