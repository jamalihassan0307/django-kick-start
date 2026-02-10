import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getDjangoApps } from '../utils/pythonUtils';

export async function createView() {
    try {
        // Get workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        // Get target app (app selector)
        const apps = await getDjangoApps(workspaceFolder.uri.fsPath);
        let appName: string;
        if (apps.length === 0) {
            const customApp = await vscode.window.showInputBox({
                prompt: 'No Django apps found. Enter app name (e.g., myapp)',
                placeHolder: 'myapp'
            });
            if (!customApp) return;
            appName = customApp.trim();
        } else if (apps.length === 1) {
            appName = apps[0];
        } else {
            const selected = await vscode.window.showQuickPick(apps.map(a => ({ label: a })), {
                placeHolder: 'Select target app',
                title: 'Django: Create View and URL'
            });
            if (!selected) return;
            appName = selected.label;
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

        // Ask for URL pattern (Django path() uses patterns without leading slash, e.g. 'user/profile/')
        const urlPattern = await vscode.window.showInputBox({
            prompt: 'Enter URL pattern (e.g., user/profile/)',
            placeHolder: 'user/profile/',
            validateInput: (value: string) => {
                if (!value || value.trim().length === 0) return 'URL pattern cannot be empty';
                const v = value.trim();
                if (!v.endsWith('/')) return 'URL pattern should end with a slash';
                if (v.startsWith('/')) return 'Django path() does not use leading slash';
                return null;
            }
        });

        if (!urlPattern) {
            return;
        }

        const urlPatternTrimmed = urlPattern.trim();

        // Update views.py
        const viewsPath = path.join(workspaceFolder.uri.fsPath, appName, 'views.py');
        if (fs.existsSync(viewsPath)) {
            let viewsContent = fs.readFileSync(viewsPath, 'utf8');
            if (!viewsContent.includes('from django.http import HttpResponse')) {
                if (viewsContent.includes('from django.http import')) {
                    viewsContent = viewsContent.replace('from django.http import', 'from django.http import HttpResponse, ');
                } else {
                    viewsContent = 'from django.http import HttpResponse\n' + viewsContent;
                }
            }
            const viewFunction = `\ndef ${viewName}(request):\n    return HttpResponse('${viewName} view response')\n`;
            if (!viewsContent.includes(`def ${viewName}(request)`)) {
                viewsContent += viewFunction;
                fs.writeFileSync(viewsPath, viewsContent);
            }
        }

        // Update urls.py - create if doesn't exist
        let urlsPath = path.join(workspaceFolder.uri.fsPath, appName, 'urls.py');
        if (!fs.existsSync(urlsPath)) {
            const initialUrls = `from django.urls import path
from . import views

urlpatterns = [
    path('${urlPatternTrimmed}', views.${viewName}, name='${viewName}'),
]
`;
            fs.writeFileSync(urlsPath, initialUrls);
        } else {
            let urlsContent = fs.readFileSync(urlsPath, 'utf8');
            const urlPatternStr = `\n    path('${urlPatternTrimmed}', views.${viewName}, name='${viewName}'),`;
            if (!urlsContent.includes(`path('${urlPatternTrimmed}'`)) {
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
        vscode.window.showInformationMessage(`Created view: ${viewName} and URL pattern: ${urlPatternTrimmed}`);

    } catch (error) {
        vscode.window.showErrorMessage(`Error creating view and URL: ${error}`);
    }
} 