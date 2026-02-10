import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Generate launch.json for Django debugging
 */
export async function generateDebugConfig(context: vscode.ExtensionContext) {
    try {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        const vscodeDir = path.join(workspaceFolder.uri.fsPath, '.vscode');
        const launchPath = path.join(vscodeDir, 'launch.json');

        const djangoConfigs = [
            {
                name: 'Django: Run Server',
                type: 'python',
                request: 'launch',
                program: '${workspaceFolder}/manage.py',
                args: ['runserver'],
                django: true,
                justMyCode: false,
                console: 'integratedTerminal',
                cwd: '${workspaceFolder}'
            },
            {
                name: 'Django: Debug Server',
                type: 'python',
                request: 'launch',
                program: '${workspaceFolder}/manage.py',
                args: ['runserver', '--noreload'],
                django: true,
                justMyCode: false,
                console: 'integratedTerminal',
                cwd: '${workspaceFolder}'
            }
        ];

        let config: { version: string; configurations: object[] };
        if (fs.existsSync(launchPath)) {
            const content = JSON.parse(fs.readFileSync(launchPath, 'utf8'));
            const existing = content.configurations || [];
            const toAdd = djangoConfigs.filter(
                dc => !existing.some((e: { name: string }) => e.name === (dc as { name: string }).name)
            );
            if (toAdd.length === 0) {
                vscode.window.showInformationMessage('Django debug configurations already exist in launch.json.');
                return;
            }
            config = { ...content, configurations: [...existing, ...toAdd] };
        } else {
            if (!fs.existsSync(vscodeDir)) {
                fs.mkdirSync(vscodeDir, { recursive: true });
            }
            config = { version: '0.2.0', configurations: djangoConfigs };
        }

        fs.writeFileSync(launchPath, JSON.stringify(config, null, 4), 'utf8');
        vscode.window.showInformationMessage('Django debug configurations added to launch.json.');
    } catch (error) {
        vscode.window.showErrorMessage(`Failed to generate debug config: ${error}`);
    }
}
