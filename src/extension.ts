// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { initProject } from './commands/initProject';
import { generateApp } from './commands/generateApp';
import { staticHelper } from './commands/staticHelper';
import { templateScaff } from './commands/templateScaff';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Django Kick Start extension is now active!');

	// Register commands
	let disposables = [
		vscode.commands.registerCommand('django-kick-start.initProject', () => initProject(context)),
		vscode.commands.registerCommand('django-kick-start.generateApp', () => generateApp(context)),
		vscode.commands.registerCommand('django-kick-start.staticHelper', () => staticHelper(context)),
		vscode.commands.registerCommand('django-kick-start.templateScaff', () => templateScaff(context))
	];

	context.subscriptions.push(...disposables);
}

// This method is called when your extension is deactivated
export function deactivate() {}
