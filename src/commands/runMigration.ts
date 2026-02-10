import * as vscode from 'vscode';
import { executeCommand, getDjangoApps } from '../utils/pythonUtils';

/**
 * Django migration command
 * Runs makemigrations and/or migrate
 */
export async function runMigration(context: vscode.ExtensionContext) {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        const choice = await vscode.window.showQuickPick(
            [
                { label: 'Makemigrations', description: 'Create migration files for model changes', value: 'makemigrations' },
                { label: 'Migrate', description: 'Apply migrations to database', value: 'migrate' },
                { label: 'Makemigrations + Migrate', description: 'Create and apply migrations', value: 'both' }
            ],
            { placeHolder: 'Select migration action', title: 'Django: Run Migration' }
        );

        if (!choice) return;

        const projectPath = workspaceFolder.uri.fsPath;

        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: `Django: ${choice.label}`,
            cancellable: false
        }, async (progress) => {
            if (choice.value === 'makemigrations' || choice.value === 'both') {
                progress.report({ message: 'Running makemigrations...' });
                try {
                    const output = await executeCommand('python manage.py makemigrations', projectPath);
                    if (output) {
                        vscode.window.showInformationMessage('Makemigrations completed.');
                    }
                } catch (error) {
                    const apps = await getDjangoApps(projectPath);
                    const appChoice = await vscode.window.showQuickPick(
                        apps.map(a => ({ label: a })),
                        { placeHolder: 'No changes detected. Select app to create empty migration:' }
                    );
                    if (appChoice) {
                        await executeCommand(`python manage.py makemigrations ${appChoice.label} --empty`, projectPath);
                        vscode.window.showInformationMessage(`Empty migration created for ${appChoice.label}`);
                    }
                    return;
                }
            }

            if (choice.value === 'migrate' || choice.value === 'both') {
                progress.report({ message: 'Running migrate...' });
                await executeCommand('python manage.py migrate', projectPath);
                vscode.window.showInformationMessage('Migrations applied successfully.');
            }
        });
    } catch (error) {
        vscode.window.showErrorMessage(`Migration failed: ${error}`);
    }
}
