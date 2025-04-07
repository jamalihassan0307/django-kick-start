import * as vscode from 'vscode';

/**
 * One-click project setup command
 * Handles initial Django project creation and configuration
 */
export async function initProject(context: vscode.ExtensionContext) {
    try {
        // Show project creation wizard
        const projectName = await vscode.window.showInputBox({
            prompt: 'Enter your Django project name',
            placeHolder: 'myproject'
        });

        if (!projectName) {
            return; // User cancelled
        }

        // TODO: Implement project creation logic
        // 1. Run django-admin startproject
        // 2. Set up initial configuration
        // 3. Create default app structure

        vscode.window.showInformationMessage(`Created Django project: ${projectName}`);

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create project: ${error}`);
    }
} 