import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export async function createHtml() {
    try {
        // Get workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        // Ask for HTML file path
        const htmlPath = await vscode.window.showInputBox({
            prompt: 'Enter HTML file path (e.g., a/b/index.html)',
            placeHolder: 'path/to/template.html',
            validateInput: (value: string) => {
                if (!value.endsWith('.html')) {
                    return 'File must have .html extension';
                }
                return null;
            }
        });

        if (!htmlPath) {
            return;
        }

        // Create full path
        const fullPath = path.join(workspaceFolder.uri.fsPath, 'templates', htmlPath);
        const dirPath = path.dirname(fullPath);

        // Create directories if they don't exist
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Create HTML file with basic structure
        const fileName = path.basename(htmlPath, '.html');
        const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${fileName}</title>
    {% load static %}
    <link rel="stylesheet" href="{% static 'css/style.css' %}">
</head>
<body>
    <h1>${fileName}</h1>
    <!-- Add your content here -->
</body>
</html>`;

        // Write HTML file
        fs.writeFileSync(fullPath, htmlContent);

        // Update views.py
        const viewsPath = path.join(workspaceFolder.uri.fsPath, 'myapp', 'views.py');
        if (fs.existsSync(viewsPath)) {
            let viewsContent = fs.readFileSync(viewsPath, 'utf8');
            
            // Add new view if it doesn't exist
            const viewName = fileName.replace(/[^a-zA-Z0-9]/g, '_');
            const viewFunction = `\ndef ${viewName}(request):\n    return render(request, '${htmlPath}')\n`;
            
            if (!viewsContent.includes(`def ${viewName}(request)`)) {
                viewsContent += viewFunction;
                fs.writeFileSync(viewsPath, viewsContent);
            }
        }

        // Show success message
        vscode.window.showInformationMessage(`Created HTML template: ${htmlPath}`);
        
        // Open the created file
        const doc = await vscode.workspace.openTextDocument(fullPath);
        await vscode.window.showTextDocument(doc);

    } catch (error) {
        vscode.window.showErrorMessage(`Error creating HTML template: ${error}`);
    }
} 