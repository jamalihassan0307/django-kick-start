import * as vscode from 'vscode';
import * as path from 'path';
import { checkPythonInstallation, checkDjangoInstallation, installDjango, executeCommand, validateProjectName } from '../utils/pythonUtils';

/**
 * One-click project setup command
 * Handles initial Django project creation and configuration
 */
export async function initProject(context: vscode.ExtensionContext) {
    try {
        // Check if Python is installed
        if (!await checkPythonInstallation()) {
            const action = await vscode.window.showErrorMessage(
                'Python is not installed. Please install Python 3.8 or higher.',
                'Open Python Download Page'
            );
            if (action === 'Open Python Download Page') {
                vscode.env.openExternal(vscode.Uri.parse('https://www.python.org/downloads/'));
            }
            return;
        }

        // Check if Django is installed
        if (!await checkDjangoInstallation()) {
            const action = await vscode.window.showInformationMessage(
                'Django is not installed. Would you like to install it now?',
                'Install Django',
                'Cancel'
            );
            if (action === 'Install Django') {
                await vscode.window.withProgress({
                    location: vscode.ProgressLocation.Notification,
                    title: 'Installing Django...',
                    cancellable: false
                }, async () => {
                    await installDjango();
                });
            } else {
                return;
            }
        }

        // Get project name from user
        const projectName = await vscode.window.showInputBox({
            prompt: 'Enter your Django project name',
            placeHolder: 'myproject',
            validateInput: validateProjectName
        });

        if (!projectName) {
            return; // User cancelled
        }

        // Get workspace folder
        let workspaceFolder: string;
        if (vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0) {
            workspaceFolder = vscode.workspace.workspaceFolders[0].uri.fsPath;
        } else {
            const folderUri = await vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: 'Select Project Location'
            });
            if (!folderUri || folderUri.length === 0) {
                return; // User cancelled
            }
            workspaceFolder = folderUri[0].fsPath;
        }

        // Create project
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Creating Django Project...',
            cancellable: false
        }, async (progress) => {
            progress.report({ message: 'Running django-admin startproject...' });
            await executeCommand(`django-admin startproject ${projectName}`, workspaceFolder);

            const projectPath = path.join(workspaceFolder, projectName);
            
            // Create default app
            progress.report({ message: 'Creating default app...' });
            await executeCommand('python manage.py startapp core', projectPath);

            // Update settings.py
            progress.report({ message: 'Configuring project settings...' });
            const settingsPath = path.join(projectPath, projectName, 'settings.py');
            const settingsContent = await vscode.workspace.fs.readFile(vscode.Uri.file(settingsPath));
            let settings = settingsContent.toString();
            
            // Add 'core' to INSTALLED_APPS
            settings = settings.replace(
                'INSTALLED_APPS = [',
                'INSTALLED_APPS = [\n    \'core\','
            );
            
            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(settingsPath),
                Buffer.from(settings, 'utf8')
            );

            // Update project urls.py
            progress.report({ message: 'Configuring URLs...' });
            const projectUrlsPath = path.join(projectPath, projectName, 'urls.py');
            const urlsContent = await vscode.workspace.fs.readFile(vscode.Uri.file(projectUrlsPath));
            let urls = urlsContent.toString();
            
            urls = urls.replace(
                'from django.urls import path',
                'from django.urls import path, include'
            );
            
            urls = urls.replace(
                'urlpatterns = [',
                'urlpatterns = [\n    path(\'\', include(\'core.urls\')),'
            );
            
            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(projectUrlsPath),
                Buffer.from(urls, 'utf8')
            );

            // Create core/urls.py
            const coreUrlsPath = path.join(projectPath, 'core', 'urls.py');
            const coreUrlsContent = `from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
]
`;
            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(coreUrlsPath),
                Buffer.from(coreUrlsContent, 'utf8')
            );

            // Update core/views.py
            const viewsPath = path.join(projectPath, 'core', 'views.py');
            const viewsContent = `from django.shortcuts import render
from django.http import HttpResponse

def home(request):
    return HttpResponse('<h1>Welcome to your Django project!</h1>')
`;
            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(viewsPath),
                Buffer.from(viewsContent, 'utf8')
            );

            // Run migrations
            progress.report({ message: 'Running initial migrations...' });
            await executeCommand('python manage.py migrate', projectPath);
        });

        // Show success message with next steps
        const action = await vscode.window.showInformationMessage(
            `Django project "${projectName}" created successfully!`,
            'Open Project',
            'Run Development Server'
        );

        if (action === 'Open Project') {
            const projectUri = vscode.Uri.file(path.join(workspaceFolder, projectName));
            vscode.commands.executeCommand('vscode.openFolder', projectUri);
        } else if (action === 'Run Development Server') {
            const terminal = vscode.window.createTerminal('Django Server');
            terminal.sendText(`cd "${path.join(workspaceFolder, projectName)}"`);
            terminal.sendText('python manage.py runserver');
            terminal.show();
        }

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create project: ${error}`);
    }
} 