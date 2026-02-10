import * as vscode from 'vscode';
import * as cp from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

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

/**
 * Get list of Django apps in the current workspace (directories with models.py)
 */
export async function getDjangoApps(workspacePath: string): Promise<string[]> {
    const apps: string[] = [];
    const entries = fs.readdirSync(workspacePath, { withFileTypes: true });
    for (const entry of entries) {
        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'venv' && entry.name !== '__pycache__') {
            const modelsPath = path.join(workspacePath, entry.name, 'models.py');
            if (fs.existsSync(modelsPath)) {
                apps.push(entry.name);
            }
        }
    }
    return apps.sort();
}

/**
 * Get Django version from project (e.g., "4.2")
 */
export async function getDjangoVersion(cwd?: string): Promise<string | null> {
    try {
        const output = await executeCommand('python -c "import django; print(django.VERSION)"', cwd);
        const match = output.match(/\((\d+),\s*(\d+)/);
        if (match) {
            return `${match[1]}.${match[2]}`;
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Check if Django version is supported (Django 3.2+)
 */
export async function checkDjangoVersionCompatibility(cwd?: string): Promise<{ supported: boolean; version: string | null; message?: string }> {
    const version = await getDjangoVersion(cwd);
    if (!version) {
        return { supported: true, version: null };
    }
    const [major, minor] = version.split('.').map(Number);
    if (major < 3 || (major === 3 && minor < 2)) {
        return {
            supported: false,
            version,
            message: `Django ${version} is installed. Django 3.2+ is recommended for full compatibility.`
        };
    }
    return { supported: true, version };
} 