import * as vscode from 'vscode';


export interface ExtensionSettings {
  documentation: {
    intro: boolean;
    sharedLang: boolean;
    diagnosis: boolean;
    conceptualAnalysis: boolean;
    dataAnalysis: boolean;
    format: string;
  };
  folderSetting: string;
  graphicsSetting: boolean;
  mainScriptSetting: string;
  outputDir: string;
  sqlBinaryTables: boolean;
  verbosity: string;
  outputLanguage: string;
}

export let extensionSettings: ExtensionSettings;

// Function to load settings from VS Code
export function loadSettings() {
  const config = vscode.workspace.getConfiguration('ampersand');

  extensionSettings = {
    documentation: config.get<ExtensionSettings['documentation']>('documentation', {
      intro: true,
      sharedLang: true,
      diagnosis: true,
      conceptualAnalysis: true,
      dataAnalysis: true,
      format: "docx"
    }),
    folderSetting: config.get('folderName', "./project"),
    graphicsSetting: config.get('graphics', true),
    mainScriptSetting: config.get('mainScriptName', "main.adl"),
    outputDir: config.get('outputDir', "./output"),
    outputLanguage: config.get('outputLanguage', "NL"),
    sqlBinaryTables: config.get('sqlBinaryTables', false),
    verbosity: config.get<string>('verbosity', "warn"),

  };
  console.log('Updated settings:', extensionSettings);
};

export function activate(context: vscode.ExtensionContext) {
  loadSettings(); // Load settings on activation

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('ampersand')) {
        loadSettings(); // Reload settings when any extension setting changes
      }
    })
  );
}

// Function to watch for changes
export function registerSettingsListener(context: vscode.ExtensionContext) {
  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(event => {
      if (event.affectsConfiguration('ampersand')) {
        loadSettings(); // Reload settings when they change
      }
    })
  );
}