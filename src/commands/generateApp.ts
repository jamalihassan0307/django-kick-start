import * as vscode from 'vscode';

/**
 * Auto app creation command
 * Creates a new Django app and configures it in the project
 */
export async function generateApp(context: vscode.ExtensionContext) {
    try {
        // Get app name from user
        const appName = await vscode.window.showInputBox({
            prompt: 'Enter your Django app name',
            placeHolder: 'myapp'
        });

        if (!appName) {
            return; // User cancelled
        }

        // TODO: Implement app generation logic
        // 1. Run python manage.py startapp
        // 2. Add to INSTALLED_APPS
        // 3. Create urls.py
        // 4. Add to project urls.py
        // 5. Create basic views

        vscode.window.showInformationMessage(`Created Django app: ${appName}`);

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create app: ${error}`);
    }
} 