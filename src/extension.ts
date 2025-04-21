// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { initProject } from './commands/initProject';
import { generateApp } from './commands/generateApp';
import { staticHelper } from './commands/staticHelper';
import { templateScaff } from './commands/templateScaff';
import { createHtml } from './commands/createHtml';
import { createStatic } from './commands/createStatic';
import { runServer } from './commands/runServer';

// Create output channel for logging
let outputChannel: vscode.OutputChannel;

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	// Initialize output channel
	outputChannel = vscode.window.createOutputChannel('Django Kick Start');
	outputChannel.show(true);

	try {
		// Log activation start
		outputChannel.appendLine('Django Kick Start is activating...');

		// Register all commands
		const commands = [
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
			},
			{
				id: 'django-kick-start.createhtml',
				handler: createHtml,
				title: 'Create HTML Template'
			},
			{
				id: 'django-kick-start.createstatic',
				handler: createStatic,
				title: 'Create Static File'
			},
			{
				id: 'django-kick-start.runServer',
				handler: runServer,
				title: 'Run Development Server'
			}
		];

		// Register each command with error handling
		commands.forEach(({ id, handler, title }) => {
			const disposable = vscode.commands.registerCommand(id, async () => {
				try {
					outputChannel.appendLine(`Executing command: ${title}`);
					await handler(context);
					outputChannel.appendLine(`Successfully completed: ${title}`);
				} catch (error) {
					outputChannel.appendLine(`Error in ${title}: ${error}`);
					vscode.window.showErrorMessage(`Failed to execute ${title}: ${error}`);
				}
			});

			context.subscriptions.push(disposable);
			outputChannel.appendLine(`Registered command: ${id}`);
		});

		// Check Python installation
		checkPythonInstallation().then(installed => {
			if (installed) {
				outputChannel.appendLine('Python installation found');
			} else {
				outputChannel.appendLine('Python installation not found');
				vscode.window.showWarningMessage(
					'Python is not installed. Some features may not work properly.',
					'Install Python'
				).then(selection => {
					if (selection === 'Install Python') {
						vscode.env.openExternal(vscode.Uri.parse('https://www.python.org/downloads/'));
					}
				});
			}
		});

		// Log successful activation
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

// Helper function to check Python installation
async function checkPythonInstallation(): Promise<boolean> {
	try {
		const terminal = vscode.window.createTerminal('Python Check');
		terminal.sendText('python --version');
		terminal.dispose();
		return true;
	} catch (error) {
		outputChannel.appendLine(`Python check error: ${error}`);
		return false;
	}
}
