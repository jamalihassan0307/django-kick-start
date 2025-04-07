import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
// import * as myExtension from '../../extension';

suite('Extension Test Suite', () => {
	vscode.window.showInformationMessage('Start all tests.');

	test('Sample test', () => {
		assert.strictEqual(-1, [1, 2, 3].indexOf(5));
		assert.strictEqual(-1, [1, 2, 3].indexOf(0));
	});

	test('Extension should be present', () => {
		assert.ok(vscode.extensions.getExtension('your-publisher-name.django-kick-start'));
	});

	test('Should register all commands', async () => {
		const commands = await vscode.commands.getCommands();
		assert.ok(commands.includes('django-kick-start.initProject'));
		assert.ok(commands.includes('django-kick-start.generateApp'));
		assert.ok(commands.includes('django-kick-start.staticHelper'));
		assert.ok(commands.includes('django-kick-start.templateScaff'));
	});

	test('Static Helper should create required directories', async () => {
		// This test needs a workspace
		assert.ok(vscode.workspace.workspaceFolders?.length);
		
		await vscode.commands.executeCommand('django-kick-start.staticHelper');
		
		const workspaceFolder = vscode.workspace.workspaceFolders![0].uri.fsPath;
		const directories = [
			'static/css',
			'static/js',
			'static/images',
			'media'
		];

		for (const dir of directories) {
			const dirPath = path.join(workspaceFolder, dir);
			assert.ok(fs.existsSync(dirPath), `Directory ${dir} should exist`);
		}

		// Check if style.css was created
		const cssPath = path.join(workspaceFolder, 'static/css/style.css');
		assert.ok(fs.existsSync(cssPath), 'style.css should exist');
	});

	test('Template Scaffolding should create required files', async () => {
		// This test needs a workspace
		assert.ok(vscode.workspace.workspaceFolders?.length);
		
		await vscode.commands.executeCommand('django-kick-start.templateScaff');
		
		const workspaceFolder = vscode.workspace.workspaceFolders![0].uri.fsPath;
		const templates = [
			'base.html',
			'home.html',
			'login.html',
			'dashboard.html'
		];

		const templatesDir = path.join(workspaceFolder, 'templates');
		assert.ok(fs.existsSync(templatesDir), 'Templates directory should exist');

		for (const template of templates) {
			const templatePath = path.join(templatesDir, template);
			assert.ok(fs.existsSync(templatePath), `Template ${template} should exist`);
		}
	});
});
