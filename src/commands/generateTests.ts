import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getDjangoApps } from '../utils/pythonUtils';

/**
 * Generate test stubs for Django app
 */
export async function generateTests(context: vscode.ExtensionContext) {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        const apps = await getDjangoApps(workspaceFolder.uri.fsPath);
        if (apps.length === 0) {
            vscode.window.showWarningMessage('No Django apps found.');
            return;
        }

        let appName: string;
        if (apps.length === 1) {
            appName = apps[0];
        } else {
            const selected = await vscode.window.showQuickPick(apps.map(a => ({ label: a })), {
                placeHolder: 'Select app for test scaffolding',
                title: 'Django: Generate Tests'
            });
            if (!selected) return;
            appName = selected.label;
        }

        const testsPath = path.join(workspaceFolder.uri.fsPath, appName, 'tests.py');
        const modelsPath = path.join(workspaceFolder.uri.fsPath, appName, 'models.py');
        const viewsPath = path.join(workspaceFolder.uri.fsPath, appName, 'views.py');

        let models: string[] = [];
        if (fs.existsSync(modelsPath)) {
            const modelsContent = fs.readFileSync(modelsPath, 'utf8');
            const classMatches = modelsContent.matchAll(/class\s+(\w+)\s*\([^)]*Model/g);
            for (const m of classMatches) models.push(m[1]);
        }

        let testContent = `from django.test import TestCase
from django.urls import reverse


class ${appName.charAt(0).toUpperCase() + appName.slice(1)}TestCase(TestCase):
    """Base test case for ${appName} app."""

    def setUp(self):
        pass

    def tearDown(self):
        pass
`;

        if (models.length > 0) {
            testContent += `\n\nclass ModelTests(TestCase):
    """Tests for ${appName} models."""

`;
            for (const model of models) {
                testContent += `    def test_${model.toLowerCase()}_creation(self):
        """Test ${model} model creation."""
        # Add your test here
        pass

`;
            }
        }

        testContent += `\nclass ViewTests(TestCase):
    """Tests for ${appName} views."""

    def test_index_view(self):
        """Test index view returns 200."""
        # response = self.client.get(reverse('${appName}:index'))
        # self.assertEqual(response.status_code, 200)
        pass
`;

        fs.writeFileSync(testsPath, testContent, 'utf8');
        vscode.window.showInformationMessage(`Test stubs generated for ${appName}.`);

        const doc = await vscode.workspace.openTextDocument(testsPath);
        await vscode.window.showTextDocument(doc);
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to generate tests: ${error}`);
    }
}
