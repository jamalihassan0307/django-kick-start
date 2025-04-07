// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { initProject } from './commands/initProject';
import { generateApp } from './commands/generateApp';
import { staticHelper } from './commands/staticHelper';
import { templateScaff } from './commands/templateScaff';

let outputChannel: vscode.OutputChannel;

// This method is called when your extension is activated
export async function activate(context: vscode.ExtensionContext) {
	// Create output channel
	outputChannel = vscode.window.createOutputChannel('Django Kick Start');
	outputChannel.show(true);

	try {
		// Log activation
		const extensionDetails = vscode.extensions.getExtension('your-publisher-name.django-kick-start');
		const version = extensionDetails?.packageJSON.version || '1.0.0';
		outputChannel.appendLine(`Django Kick Start v${version} is activating...`);

		// Register commands
		const commands = [
			{
				command: 'django-kick-start.initProject',
				callback: () => initProject(context)
			},
			{
				command: 'django-kick-start.generateApp',
				callback: () => generateApp(context)
			},
			{
				command: 'django-kick-start.staticHelper',
				callback: () => staticHelper(context)
			},
			{
				command: 'django-kick-start.templateScaff',
				callback: () => templateScaff(context)
			}
		];

		// Register each command and add to subscriptions
		commands.forEach(({ command, callback }) => {
			const disposable = vscode.commands.registerCommand(command, callback);
			context.subscriptions.push(disposable);
			outputChannel.appendLine(`Registered command: ${command}`);
		});

		// Check Python installation
		const terminal = vscode.window.createTerminal('Django Check');
		terminal.sendText('python --version');
		terminal.dispose();

		outputChannel.appendLine('Django Kick Start extension activated successfully!');
		vscode.window.showInformationMessage('Django Kick Start is ready!');

	} catch (error) {
		outputChannel.appendLine(`Activation error: ${error}`);
		vscode.window.showErrorMessage('Failed to activate Django Kick Start extension');
	}
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (outputChannel) {
		outputChannel.appendLine('Django Kick Start extension is deactivating...');
		outputChannel.dispose();
	}
}

// Export the output channel for use in other files
export function getOutputChannel(): vscode.OutputChannel {
	return outputChannel;
}
