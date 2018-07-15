import * as vscode from 'vscode'; 

export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error).
    // This line of code will only be executed once when your extension is activated.
    console.log('Congratulations, your extension "Ampersand" is now active!');

    vscode.languages.setLanguageConfiguration('ampersand', {
        indentationRules: {
            // ^.*\{[^}"']*$
            increaseIndentPattern: vscode.workspace.getConfiguration('ampersand').indentationRules.enabled
                ? /(\bif\b(?!')(.(?!then))*|\b(then|else|m?do|of|let|in|where)\b(?!')|=|->|>>=|>=>|=<<|(^(data)( |\t)+(\w|')+( |\t)*))( |\t)*$/
                : null,
            decreaseIndentPattern: null
        },
        wordPattern: /([\w'_][\w'_\d]*)|([0-9]+\.[0-9]+([eE][+-]?[0-9]+)?|[0-9]+[eE][+-]?[0-9]+)/
    })  	
}