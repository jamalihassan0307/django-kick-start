import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Static files helper command
 * Sets up static and media file handling for Django
 */
export async function staticHelper(context: vscode.ExtensionContext) {
    try {
        // Get workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        // Create static and media directories
        const folders = [
            'static/css',
            'static/js',
            'static/images',
            'media'
        ];

        // Create directories
        for (const folder of folders) {
            const folderPath = path.join(workspaceFolder.uri.fsPath, folder);
            await vscode.workspace.fs.createDirectory(vscode.Uri.file(folderPath));
        }

        // Add sample CSS file
        const cssContent = `/* Custom styles */
.navbar-brand {
    font-weight: bold;
}

.main-content {
    padding: 2rem 0;
}

.footer {
    margin-top: 3rem;
    padding: 1rem 0;
    background-color: #f8f9fa;
}`;
        
        await vscode.workspace.fs.writeFile(
            vscode.Uri.file(path.join(workspaceFolder.uri.fsPath, 'static/css/style.css')),
            Buffer.from(cssContent, 'utf8')
        );

        // Find settings.py
        const settingsPath = await findSettingsPath(workspaceFolder.uri.fsPath);
        if (!settingsPath) {
            throw new Error('settings.py not found');
        }

        // Update settings.py
        const settingsContent = await vscode.workspace.fs.readFile(vscode.Uri.file(settingsPath));
        let settings = settingsContent.toString();

        // Add static files configuration
        if (!settings.includes('STATIC_URL')) {
            settings += `\n# Static files (CSS, JavaScript, Images)
STATIC_URL = 'static/'
STATICFILES_DIRS = [
    BASE_DIR / 'static',
]
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Media files
MEDIA_URL = 'media/'
MEDIA_ROOT = BASE_DIR / 'media'\n`;

            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(settingsPath),
                Buffer.from(settings, 'utf8')
            );
        }

        // Update urls.py for media serving in development
        const urlsPath = path.join(path.dirname(settingsPath), 'urls.py');
        const urlsContent = await vscode.workspace.fs.readFile(vscode.Uri.file(urlsPath));
        let urls = urlsContent.toString();

        if (!urls.includes('static.serve')) {
            // Add imports
            urls = urls.replace(
                'from django.urls import',
                'from django.urls import path, include'
            );

            if (!urls.includes('settings')) {
                urls = 'from django.conf import settings\n' + urls;
            }
            if (!urls.includes('static')) {
                urls = 'from django.conf.urls.static import static\n' + urls;
            }

            // Add media serving
            urls = urls.replace(
                ']',
                '] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)'
            );

            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(urlsPath),
                Buffer.from(urls, 'utf8')
            );
        }

        vscode.window.showInformationMessage('Static files configuration completed successfully!');

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to configure static files: ${error}`);
    }
}

async function findSettingsPath(workspaceFolder: string): Promise<string | undefined> {
    const files = await vscode.workspace.findFiles('**/settings.py');
    return files.length > 0 ? files[0].fsPath : undefined;
} 