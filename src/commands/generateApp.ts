import * as vscode from 'vscode';
import * as path from 'path';
import { executeCommand } from '../utils/pythonUtils';

/**
 * Auto app creation command
 * Creates a new Django app and configures it in the project
 */
export async function generateApp(context: vscode.ExtensionContext) {
    try {
        // Get workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceFolder) {
            throw new Error('No workspace folder found. Please open a Django project first.');
        }

        // Verify it's a Django project
        try {
            await executeCommand('python manage.py --version', workspaceFolder);
        } catch (error) {
            throw new Error('This does not appear to be a Django project. Please ensure you are in a Django project root directory.');
        }

        // Get app name from user
        const appName = await vscode.window.showInputBox({
            prompt: 'Enter your Django app name',
            placeHolder: 'myapp',
            validateInput: (value: string) => {
                if (!value) {
                    return 'App name cannot be empty';
                }
                if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
                    return 'App name must start with a letter and contain only letters, numbers, and underscores';
                }
                return null;
            }
        });

        if (!appName) {
            return; // User cancelled
        }

        // Create and configure app
        await vscode.window.withProgress({
            location: vscode.ProgressLocation.Notification,
            title: 'Creating Django App...',
            cancellable: false
        }, async (progress) => {
            // Create the app
            progress.report({ message: 'Running startapp command...' });
            await executeCommand(`python manage.py startapp ${appName}`, workspaceFolder);

            // Update settings.py
            progress.report({ message: 'Updating settings.py...' });
            const settingsPath = await findSettingsPath(workspaceFolder);
            const settingsContent = await vscode.workspace.fs.readFile(vscode.Uri.file(settingsPath));
            let settings = settingsContent.toString();
            
            // Add app to INSTALLED_APPS
            settings = settings.replace(
                'INSTALLED_APPS = [',
                `INSTALLED_APPS = [\n    '${appName}',`
            );
            
            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(settingsPath),
                Buffer.from(settings, 'utf8')
            );

            // Create urls.py in the new app
            progress.report({ message: 'Creating URL configuration...' });
            const appUrlsPath = path.join(workspaceFolder, appName, 'urls.py');
            const appUrlsContent = `from django.urls import path
from . import views

app_name = '${appName}'

urlpatterns = [
    path('', views.index, name='index'),
]
`;
            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(appUrlsPath),
                Buffer.from(appUrlsContent, 'utf8')
            );

            // Update views.py
            progress.report({ message: 'Creating views...' });
            const viewsPath = path.join(workspaceFolder, appName, 'views.py');
            const viewsContent = await vscode.workspace.fs.readFile(vscode.Uri.file(viewsPath));
            let views = viewsContent.toString();
            
            // Add index view
            views += `\n\ndef index(request):\n    return render(request, '${appName}/index.html')\n`;
            
            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(viewsPath),
                Buffer.from(views, 'utf8')
            );

            // Create templates directory and index.html
            progress.report({ message: 'Creating templates...' });
            const templatesDir = path.join(workspaceFolder, appName, 'templates', appName);
            await vscode.workspace.fs.createDirectory(vscode.Uri.file(templatesDir));
            
            const indexTemplate = `{% extends 'base.html' %}

{% block content %}
<h1>Welcome to ${appName}</h1>
<p>Your app is now set up and ready to use!</p>
{% endblock %}
`;
            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(path.join(templatesDir, 'index.html')),
                Buffer.from(indexTemplate, 'utf8')
            );

            // Update project urls.py
            progress.report({ message: 'Updating project URLs...' });
            const projectUrlsPath = await findProjectUrlsPath(workspaceFolder);
            const projectUrlsContent = await vscode.workspace.fs.readFile(vscode.Uri.file(projectUrlsPath));
            let projectUrls = projectUrlsContent.toString();
            
            // Add import if needed
            if (!projectUrls.includes('from django.urls import include')) {
                projectUrls = projectUrls.replace(
                    'from django.urls import path',
                    'from django.urls import path, include'
                );
            }
            
            // Add URL pattern
            projectUrls = projectUrls.replace(
                'urlpatterns = [',
                `urlpatterns = [\n    path('${appName}/', include('${appName}.urls')),`
            );
            
            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(projectUrlsPath),
                Buffer.from(projectUrls, 'utf8')
            );
        });

        // Show success message
        const action = await vscode.window.showInformationMessage(
            `Django app '${appName}' created successfully!`,
            'Open Views',
            'Open URLs'
        );

        if (action === 'Open Views') {
            const viewsDoc = await vscode.workspace.openTextDocument(
                path.join(workspaceFolder, appName, 'views.py')
            );
            await vscode.window.showTextDocument(viewsDoc);
        } else if (action === 'Open URLs') {
            const urlsDoc = await vscode.workspace.openTextDocument(
                path.join(workspaceFolder, appName, 'urls.py')
            );
            await vscode.window.showTextDocument(urlsDoc);
        }

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to create app: ${error}`);
    }
}

async function findSettingsPath(workspaceFolder: string): Promise<string> {
    const files = await vscode.workspace.findFiles('**/settings.py', '**/venv/**');
    if (files.length === 0) {
        throw new Error('Could not find settings.py in the project');
    }
    return files[0].fsPath;
}

async function findProjectUrlsPath(workspaceFolder: string): Promise<string> {
    const files = await vscode.workspace.findFiles('**/urls.py', '**/venv/**');
    // Filter to find the project-level urls.py (usually in the same directory as settings.py)
    const settingsDir = path.dirname(await findSettingsPath(workspaceFolder));
    const projectUrls = files.find(file => path.dirname(file.fsPath) === settingsDir);
    
    if (!projectUrls) {
        throw new Error('Could not find project urls.py');
    }
    return projectUrls.fsPath;
} 