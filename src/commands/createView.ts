import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export async function createView() {
    try {
        // Get workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        // Ask for view name
        const viewName = await vscode.window.showInputBox({
            prompt: 'Enter view name (e.g., user_profile)',
            placeHolder: 'view_name',
            validateInput: (value: string) => {
                if (!value.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/)) {
                    return 'View name must be a valid Python identifier';
                }
                return null;
            }
        });

        if (!viewName) {
            return;
        }

        // Ask for URL pattern
        const urlPattern = await vscode.window.showInputBox({
            prompt: 'Enter URL pattern (e.g., user/profile/)',
            placeHolder: 'url/pattern/',
            validateInput: (value: string) => {
                if (!value.startsWith('/') || !value.endsWith('/')) {
                    return 'URL pattern must start and end with a slash';
                }
                return null;
            }
        });

        if (!urlPattern) {
            return;
        }

        // Update views.py
        const viewsPath = path.join(workspaceFolder.uri.fsPath, 'myapp', 'views.py');
        if (fs.existsSync(viewsPath)) {
            let viewsContent = fs.readFileSync(viewsPath, 'utf8');
            
            // Add new view if it doesn't exist
            const viewFunction = `\ndef ${viewName}(request):\n    return render(request, '${viewName}.html')\n`;
            
            if (!viewsContent.includes(`def ${viewName}(request)`)) {
                viewsContent += viewFunction;
                fs.writeFileSync(viewsPath, viewsContent);
            }
        }

        // Update urls.py
        const urlsPath = path.join(workspaceFolder.uri.fsPath, 'myapp', 'urls.py');
        if (fs.existsSync(urlsPath)) {
            let urlsContent = fs.readFileSync(urlsPath, 'utf8');
            
            // Add URL pattern if it doesn't exist
            const urlPatternStr = `\n    path('${urlPattern}', views.${viewName}, name='${viewName}'),`;
            
            if (!urlsContent.includes(`path('${urlPattern}'`)) {
                // Find the urlpatterns list
                const urlPatternsIndex = urlsContent.indexOf('urlpatterns = [');
                if (urlPatternsIndex !== -1) {
                    // Find the closing bracket of urlpatterns
                    let bracketCount = 1;
                    let currentIndex = urlPatternsIndex + 'urlpatterns = ['.length;
                    
                    while (bracketCount > 0 && currentIndex < urlsContent.length) {
                        if (urlsContent[currentIndex] === '[') bracketCount++;
                        if (urlsContent[currentIndex] === ']') bracketCount--;
                        currentIndex++;
                    }
                    
                    // Insert the new URL pattern before the closing bracket
                    urlsContent = urlsContent.slice(0, currentIndex - 1) + urlPatternStr + urlsContent.slice(currentIndex - 1);
                    fs.writeFileSync(urlsPath, urlsContent);
                }
            }
        }

        // Show success message
        vscode.window.showInformationMessage(`Created view: ${viewName} and URL pattern: ${urlPattern}`);

    } catch (error) {
        vscode.window.showErrorMessage(`Error creating view and URL: ${error}`);
    }
} 