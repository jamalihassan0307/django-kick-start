// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { initProject } from './commands/initProject';
import { generateApp } from './commands/generateApp';
import { staticHelper } from './commands/staticHelper';
import { templateScaff } from './commands/templateScaff';

// This method is called when your extension is activated
export function activate(context: vscode.ExtensionContext) {
	console.log('Django Kick Start is now active!');

	// Register the commands
	registerCommands(context);

	// Show activation message
	vscode.window.showInformationMessage('Django Kick Start is ready!');
}

function registerCommands(context: vscode.ExtensionContext) {
	// Initialize Project Command
	let initProjectCmd = vscode.commands.registerCommand('django-kick-start.initProject', () => {
		console.log('Executing Initialize Project command');
		return initProject(context);
	});

	// Generate App Command
	let generateAppCmd = vscode.commands.registerCommand('django-kick-start.generateApp', () => {
		console.log('Executing Generate App command');
		return generateApp(context);
	});

	// Static Helper Command
	let staticHelperCmd = vscode.commands.registerCommand('django-kick-start.staticHelper', () => {
		console.log('Executing Static Helper command');
		return staticHelper(context);
	});

	// Template Scaffolding Command
	let templateScaffCmd = vscode.commands.registerCommand('django-kick-start.templateScaff', () => {
		console.log('Executing Template Scaffolding command');
		return templateScaff(context);
	});

	// Add commands to subscriptions
	context.subscriptions.push(initProjectCmd);
	context.subscriptions.push(generateAppCmd);
	context.subscriptions.push(staticHelperCmd);
	context.subscriptions.push(templateScaffCmd);
}

// This method is called when your extension is deactivated
export function deactivate() {
	console.log('Django Kick Start is now deactivated');
}
