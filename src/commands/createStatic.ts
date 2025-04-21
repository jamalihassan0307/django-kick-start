import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export async function createStatic() {
    try {
        // Get workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        // Ask for file type
        const fileType = await vscode.window.showQuickPick(['CSS', 'JavaScript'], {
            placeHolder: 'Select file type',
            title: 'Create Static File'
        });

        if (!fileType) {
            return;
        }

        const extension = fileType === 'CSS' ? '.css' : '.js';
        const defaultPath = fileType === 'CSS' ? 'css' : 'js';

        // Ask for file path
        const filePath = await vscode.window.showInputBox({
            prompt: `Enter ${fileType} file path (e.g., ${defaultPath}/path/name${extension})`,
            placeHolder: `${defaultPath}/path/name${extension}`,
            validateInput: (value: string) => {
                if (!value.endsWith(extension)) {
                    return `File must have ${extension} extension`;
                }
                return null;
            }
        });

        if (!filePath) {
            return;
        }

        // Create full path
        const fullPath = path.join(workspaceFolder.uri.fsPath, 'static', filePath);
        const dirPath = path.dirname(fullPath);

        // Create directories if they don't exist
        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        // Create file with basic content
        let fileContent = '';
        if (fileType === 'CSS') {
            fileContent = `/* ${path.basename(filePath)} */
/* Add your CSS styles here */`;
        } else {
            fileContent = `// ${path.basename(filePath)}
// Add your JavaScript code here`;
        }

        // Write file
        fs.writeFileSync(fullPath, fileContent);

        // Show success message
        vscode.window.showInformationMessage(`Created ${fileType} file: ${filePath}`);
        
        // Open the created file
        const doc = await vscode.workspace.openTextDocument(fullPath);
        await vscode.window.showTextDocument(doc);

    } catch (error) {
        vscode.window.showErrorMessage(`Error creating static file: ${error}`);
    }
} 