import * as vscode from 'vscode';
import { execSync } from 'child_process';
import { initProject } from './commands/initProject';
import { generateApp } from './commands/generateApp';
import { staticHelper } from './commands/staticHelper';
import { templateScaff } from './commands/templateScaff';
import { createHtml } from './commands/createHtml';
import { createStatic } from './commands/createStatic';
import { runServer } from './commands/runServer';
import { createModel } from './commands/createModel';
import { createView } from './commands/createView';
import { runMigration } from './commands/runMigration';
import { generateDebugConfig } from './commands/generateDebugConfig';
import { generateTests } from './commands/generateTests';

let outputChannel: vscode.OutputChannel;

export function activate(context: vscode.ExtensionContext) {
    outputChannel = vscode.window.createOutputChannel('Django Kick Start');
    
    const commands = [
        {
            id: 'django-kick-start.initProject',
            handler: initProject,
            title: 'Initialize New Django Project'
        },
        {
            id: 'django-kick-start.generateApp',
            handler: generateApp,
            title: 'Generate New Django App'
        },
        {
            id: 'django-kick-start.staticHelper',
            handler: staticHelper,
            title: 'Setup Static Files'
        },
        {
            id: 'django-kick-start.templateScaff',
            handler: templateScaff,
            title: 'Scaffold Templates'
        },
        {
            id: 'django-kick-start.createhtml',
            handler: createHtml,
            title: 'Create HTML Template'
        },
        {
            id: 'django-kick-start.createstatic',
            handler: createStatic,
            title: 'Create Static File'
        },
        {
            id: 'django-kick-start.runServer',
            handler: runServer,
            title: 'Run Development Server'
        },
        {
            id: 'django-kick-start.createModel',
            handler: createModel,
            title: 'Django: Create Model'
        },
        {
            id: 'django-kick-start.createView',
            handler: createView,
            title: 'Django: Create View and URL'
        },
        {
            id: 'django-kick-start.runMigration',
            handler: runMigration,
            title: 'Django: Run Migration'
        },
        {
            id: 'django-kick-start.generateDebugConfig',
            handler: generateDebugConfig,
            title: 'Django: Generate Debug Config'
        },
        {
            id: 'django-kick-start.generateTests',
            handler: generateTests,
            title: 'Django: Generate Tests'
        }
    ];

    commands.forEach(({ id, handler, title }) => {
        const disposable = vscode.commands.registerCommand(id, async () => {
            try {
                await handler(context);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                vscode.window.showErrorMessage(`Failed to execute ${title}: ${errorMessage}`);
            }
        });
        context.subscriptions.push(disposable);
    });

    // Silent Python check without terminal
    checkPythonInstallation().then(installed => {
        if (!installed) {
            vscode.window.showWarningMessage(
                'Python is not installed. Some features may not work properly.',
                'Install Python'
            ).then(selection => {
                if (selection === 'Install Python') {
                    vscode.env.openExternal(vscode.Uri.parse('https://www.python.org/downloads/'));
                }
            });
        }
    });

    return {
        outputChannel,
        getOutputChannel: () => outputChannel
    };
}

export function deactivate() {
    if (outputChannel) {
        outputChannel.dispose();
    }
}

async function checkPythonInstallation(): Promise<boolean> {
    try {
        const isWindows = process.platform === 'win32';
        const command = isWindows ? 'where python' : 'which python';
        execSync(command, { stdio: 'ignore' });
        return true;
    } catch (error) {
        return false;
    }
}