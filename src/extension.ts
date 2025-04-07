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
		outputChannel.appendLine('Django Kick Start is activating...');

		// Register commands
		const commandsToRegister = [
			{
				id: 'django-kick-start.initProject',
				handler: initProject,
				title: 'Initialize New Django Project'
			},
			{
				id: 'django-kick-start.generateApp',
				handler: generateApp,
				title: 'Generate New Django App'
			},
			{
				id: 'django-kick-start.staticHelper',
				handler: staticHelper,
				title: 'Setup Static Files'
			},
			{
				id: 'django-kick-start.templateScaff',
				handler: templateScaff,
				title: 'Scaffold Templates'
			}
		];

		// Register each command
		commandsToRegister.forEach(({ id, handler, title }) => {
			const disposable = vscode.commands.registerCommand(id, () => {
				outputChannel.appendLine(`Executing command: ${title}`);
				return handler(context);
			});
			context.subscriptions.push(disposable);
			outputChannel.appendLine(`Registered command: ${id}`);
		});

		// Check Python installation
		const terminal = vscode.window.createTerminal('Django Check');
		terminal.sendText('python --version');
		terminal.dispose();

		// Show activation success
		outputChannel.appendLine('Django Kick Start activated successfully!');
		vscode.window.showInformationMessage('Django Kick Start is ready!');

	} catch (error) {
		outputChannel.appendLine(`Activation error: ${error}`);
		vscode.window.showErrorMessage('Failed to activate Django Kick Start extension');
		throw error; // Re-throw to show in dev tools
	}

	return {
		outputChannel,
		getOutputChannel: () => outputChannel
	};
}

// This method is called when your extension is deactivated
export function deactivate() {
	if (outputChannel) {
		outputChannel.appendLine('Django Kick Start is deactivating...');
		outputChannel.dispose();
	}
}
