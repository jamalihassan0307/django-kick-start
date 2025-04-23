import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';

export async function checkPythonInstallation(): Promise<boolean> {
    try {
        await executeCommand('python --version');
        return true;
    } catch (error) {
        try {
            await executeCommand('python3 --version');
            return true;
        } catch (error) {
            return false;
        }
    }
}

export async function checkDjangoInstallation(): Promise<boolean> {
    try {
        await executeCommand('python -c "import django"');
        return true;
    } catch (error) {
        return false;
    }
}

export async function installDjango(): Promise<void> {
    try {
        await executeCommand('python -m pip install django');
    } catch (error) {
        throw new Error('Failed to install Django. Please install it manually using: pip install django');
    }
}

export async function executeCommand(command: string, cwd?: string): Promise<string> {
    return new Promise((resolve, reject) => {
        cp.exec(command, { cwd }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            resolve(stdout.trim());
        });
    });
}

export function validateProjectName(name: string): string | undefined {
    if (!name) {
        return 'Project name cannot be empty';
    }
    if (!/^[a-zA-Z][a-zA-Z0-9_]*$/.test(name)) {
        return 'Project name must start with a letter and contain only letters, numbers, and underscores';
    }
    if (name.toLowerCase() === 'django') {
        return 'Project name cannot be "django"';
    }
    return undefined;
}

export async function runTerminalCommand(command: string): Promise<void> {
    const terminal = vscode.window.createTerminal('Django Kick Start');
    terminal.show();
    terminal.sendText(command);
    
    return new Promise((resolve) => {
        const disposable = vscode.window.onDidCloseTerminal((closedTerminal) => {
            if (closedTerminal === terminal) {
                disposable.dispose();
                resolve();
            }
        });
    });
} 