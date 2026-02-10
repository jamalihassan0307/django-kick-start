import * as vscode from 'vscode';
import * as path from 'path';
import { checkDjangoVersionCompatibility } from '../utils/pythonUtils';

export async function runServer() {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        const versionCheck = await checkDjangoVersionCompatibility(workspaceFolder.uri.fsPath);
        if (!versionCheck.supported && versionCheck.message) {
            vscode.window.showWarningMessage(versionCheck.message);
        }

        // Ask user if they want to run in debug mode
        const debugMode = await vscode.window.showQuickPick(['Run Server', 'Debug Server'], {
            placeHolder: 'Select server mode',
            title: 'Django Server Mode'
        });

        if (!debugMode) {
            return;
        }

        // Create a new terminal
        const terminal = vscode.window.createTerminal('Django Server');
        terminal.show();

        // Change to the project directory
        const projectPath = workspaceFolder.uri.fsPath;
        terminal.sendText(`cd "${projectPath}"`);

        // Run the server with appropriate arguments
        if (debugMode === 'Debug Server') {
            terminal.sendText('python manage.py runserver --noreload');
            vscode.window.showInformationMessage('Django development server is starting in debug mode...');
        } else {
            terminal.sendText('python manage.py runserver');
            vscode.window.showInformationMessage('Django development server is starting...');
        }

    } catch (error) {
        vscode.window.showErrorMessage(`Error starting Django server: ${error}`);
    }
} 