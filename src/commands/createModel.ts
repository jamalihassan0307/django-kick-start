import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { runTerminalCommand } from '../utils/pythonUtils';

interface FieldType {
    label: string;
    description: string;
    value: string;
}

const FIELD_TYPES: FieldType[] = [
    { label: 'CharField', value: 'CharField', description: 'Stores a string of characters with a maximum length' },
    { label: 'TextField', value: 'TextField', description: 'Stores a large amount of text' },
    { label: 'IntegerField', value: 'IntegerField', description: 'Stores an integer value' },
    { label: 'FloatField', value: 'FloatField', description: 'Stores a floating-point number' },
    { label: 'BooleanField', value: 'BooleanField', description: 'Stores a boolean value (True/False)' },
    { label: 'DateField', value: 'DateField', description: 'Stores a date' },
    { label: 'DateTimeField', value: 'DateTimeField', description: 'Stores a date and time' },
    { label: 'TimeField', value: 'TimeField', description: 'Stores a time of day' },
    { label: 'EmailField', value: 'EmailField', description: 'Stores an email address' },
    { label: 'URLField', value: 'URLField', description: 'Stores a URL' },
    { label: 'ImageField', value: 'ImageField', description: 'Stores an image file' },
    { label: 'FileField', value: 'FileField', description: 'Stores a file' },
    { label: 'ForeignKey', value: 'ForeignKey', description: 'Stores a foreign key to another model' },
    { label: 'ManyToManyField', value: 'ManyToManyField', description: 'Stores a many-to-many relationship' },
    { label: 'OneToOneField', value: 'OneToOneField', description: 'Stores a one-to-one relationship' }
];

interface Field {
    name: string;
    type: string;
    options: string;
}

export async function createModel(context: vscode.ExtensionContext) {
    // Create and show panel
    const panel = vscode.window.createWebviewPanel(
        'djangoModelCreator',
        'Django Model Creator',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true,
            localResourceRoots: [
                vscode.Uri.joinPath(context.extensionUri, 'media')
            ]
        }
    );

    // Get the HTML content
    panel.webview.html = getWebviewContent(context, panel);

    // Handle messages from the webview
    panel.webview.onDidReceiveMessage(
        async message => {
            console.log('Received message from webview:', message);
            
            switch (message.command) {
                case 'createModel':
                    try {
                        const { modelName, fields, appName } = message;
                        console.log('Creating model:', { modelName, fields, appName });
                        
                        // Validate inputs
                        if (!modelName || !appName || fields.length === 0) {
                            vscode.window.showErrorMessage('Please fill in all required fields');
                            return;
                        }

                        // Show progress
                        vscode.window.withProgress({
                            location: vscode.ProgressLocation.Notification,
                            title: "Creating Django Model",
                            cancellable: false
                        }, async (progress) => {
                            progress.report({ increment: 0 });
                            
                            try {
                                await createModelFiles(modelName, fields, appName);
                                progress.report({ increment: 100 });
                                vscode.window.showInformationMessage(`Model ${modelName} created successfully!`);
                                panel.dispose();
                            } catch (error) {
                                console.error('Error creating model:', error);
                                vscode.window.showErrorMessage(`Error creating model: ${error}`);
                            }
                        });
                    } catch (error) {
                        console.error('Error processing model creation:', error);
                        vscode.window.showErrorMessage(`Error processing model creation: ${error}`);
                    }
                    return;
            }
        },
        undefined,
        context.subscriptions
    );

    // Send initial message to webview
    setTimeout(() => {
        panel.webview.postMessage({ command: 'ready' });
    }, 1000);
}

function getWebviewContent(context: vscode.ExtensionContext, panel: vscode.WebviewPanel): string {
    const styleUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'media', 'model-creator.css'));
    const scriptUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'media', 'model-creator.js'));

    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Django Model Creator</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" rel="stylesheet">
        <link href="${styleUri}" rel="stylesheet">
    </head>
    <body>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card mt-4">
                        <div class="card-header">
                            <h3>Create Django Model</h3>
                        </div>
                        <div class="card-body">
                            <form id="modelForm">
                                <div class="mb-3">
                                    <label for="appName" class="form-label">App Name</label>
                                    <input type="text" class="form-control" id="appName" required>
                                </div>
                                <div class="mb-3">
                                    <label for="modelName" class="form-label">Model Name</label>
                                    <input type="text" class="form-control" id="modelName" required>
                                </div>
                                <div class="mb-3">
                                    <label class="form-label">Fields</label>
                                    <div id="fieldsContainer">
                                        <div class="field-row mb-2">
                                            <div class="row">
                                                <div class="col-4">
                                                    <input type="text" class="form-control field-name" placeholder="Field Name" required>
                                                </div>
                                                <div class="col-4">
                                                    <select class="form-select field-type">
                                                        <option value="CharField">CharField</option>
                                                        <option value="TextField">TextField</option>
                                                        <option value="IntegerField">IntegerField</option>
                                                        <option value="FloatField">FloatField</option>
                                                        <option value="BooleanField">BooleanField</option>
                                                        <option value="DateField">DateField</option>
                                                        <option value="DateTimeField">DateTimeField</option>
                                                        <option value="EmailField">EmailField</option>
                                                        <option value="URLField">URLField</option>
                                                        <option value="ForeignKey">ForeignKey</option>
                                                        <option value="ManyToManyField">ManyToManyField</option>
                                                    </select>
                                                </div>
                                                <div class="col-3">
                                                    <input type="text" class="form-control field-options" placeholder="Options (e.g., max_length=100)">
                                                </div>
                                                <div class="col-1">
                                                    <button type="button" class="btn btn-danger remove-field">×</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <button type="button" class="btn btn-secondary mt-2" id="addField">Add Field</button>
                                </div>
                                <button type="submit" class="btn btn-primary">Create Model</button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/js/bootstrap.bundle.min.js"></script>
        <script src="${scriptUri}"></script>
    </body>
    </html>`;
}

async function createModelFiles(modelName: string, fields: Field[], appName: string) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        throw new Error('No workspace folder found');
    }

    const appPath = path.join(workspaceFolders[0].uri.fsPath, appName);
    const modelsPath = path.join(appPath, 'models.py');
    const viewsPath = path.join(appPath, 'views.py');
    const urlsPath = path.join(appPath, 'urls.py');

    if (!fs.existsSync(appPath)) {
        throw new Error(`App directory not found at ${appPath}`);
    }

    if (!fs.existsSync(modelsPath)) {
        throw new Error(`Models file not found at ${modelsPath}`);
    }

    // Generate model code
    let modelCode = `class ${modelName}(models.Model):\n`;
    fields.forEach(field => {
        // Add max_length for CharField if not specified
        if (field.type === 'CharField') {
            // Remove any existing max_length parameter
            field.options = field.options.replace(/max_length=\d+,\s*/g, '');
            // Add max_length=100 if not present
            if (!field.options.includes('max_length')) {
                field.options = `max_length=100, ${field.options}`;
            }
        }
        modelCode += `    ${field.name} = models.${field.type}(${field.options})\n`;
    });
    modelCode += '\n    def __str__(self):\n';
    modelCode += `        return self.${fields[0]?.name || 'id'}\n`;

    // Append model to models.py
    fs.appendFileSync(modelsPath, '\n\n' + modelCode);

    // Generate views code
    const modelNameLower = modelName.toLowerCase();
    const viewsCode = `
# Create ${modelName}
def create_${modelNameLower}(request):
    if request.method == 'POST':
        ${modelNameLower} = ${modelName}.objects.create(**request.POST.dict())
        return redirect('fetch_${modelNameLower}')
    return render(request, '${appName}/create_${modelNameLower}.html')

# Fetch All ${modelName}s
def fetch_${modelNameLower}(request):
    ${modelNameLower}s = ${modelName}.objects.all()
    context = {'${modelNameLower}s': ${modelNameLower}s}
    return render(request, '${appName}/${modelNameLower}.html', context)

# Delete ${modelName}
def delete_${modelNameLower}(request, id):
    ${modelNameLower} = get_object_or_404(${modelName}, id=id)
    ${modelNameLower}.delete()
    return redirect('fetch_${modelNameLower}')

# Edit ${modelName}
def edit_${modelNameLower}(request, id):
    ${modelNameLower} = get_object_or_404(${modelName}, id=id)
    if request.method == 'POST':
        for key, value in request.POST.items():
            setattr(${modelNameLower}, key, value)
        ${modelNameLower}.save()
        return redirect('fetch_${modelNameLower}')
    return render(request, '${appName}/edit_${modelNameLower}.html', {'${modelNameLower}': ${modelNameLower}})
`;

    // Append views to views.py
    fs.appendFileSync(viewsPath, viewsCode);

    // Generate URLs code with proper indentation
    const urlsCode = `from django.urls import path
from . import views

urlpatterns = [
    path('${modelNameLower}/create/', views.create_${modelNameLower}, name='create_${modelNameLower}'),
    path('${modelNameLower}/', views.fetch_${modelNameLower}, name='fetch_${modelNameLower}'),
    path('${modelNameLower}/delete/<int:id>/', views.delete_${modelNameLower}, name='delete_${modelNameLower}'),
    path('${modelNameLower}/edit/<int:id>/', views.edit_${modelNameLower}, name='edit_${modelNameLower}'),
]
`;

    // Write URLs to urls.py (overwrite if exists)
    fs.writeFileSync(urlsPath, urlsCode);

    // Create migrations
    const terminal = vscode.window.createTerminal('Django Migrations');
    terminal.show();
    terminal.sendText(`cd ${workspaceFolders[0].uri.fsPath}`);
    terminal.sendText('python manage.py makemigrations');
    terminal.sendText('python manage.py migrate');
}

function generateModelCode(modelName: string, fields: Field[]): string {
    let code = `class ${modelName}(models.Model):\n`;
    
    for (const field of fields) {
        code += `    ${field.name} = models.${field.type}(${field.options})\n`;
    }

    code += '\n    def __str__(self):\n';
    code += `        return self.${fields[0]?.name || 'id'}\n`;

    return code;
}

function generateViewsCode(modelName: string, appName: string): string {
    const modelNameLower = modelName.toLowerCase();
    return `
# Create ${modelName}
def create_${modelNameLower}(request):
    if request.method == 'POST':
        ${modelNameLower} = ${modelName}.objects.create(**request.POST.dict())
        return redirect('fetch_${modelNameLower}')
    return render(request, '${appName}/create_${modelNameLower}.html')

# Fetch All ${modelName}s
def fetch_${modelNameLower}(request):
    ${modelNameLower}s = ${modelName}.objects.all()
    context = {'${modelNameLower}s': ${modelNameLower}s}
    return render(request, '${appName}/${modelNameLower}.html', context)

# Delete ${modelName}
def delete_${modelNameLower}(request, id):
    ${modelNameLower} = get_object_or_404(${modelName}, id=id)
    ${modelNameLower}.delete()
    return redirect('fetch_${modelNameLower}')

# Edit ${modelName}
def edit_${modelNameLower}(request, id):
    ${modelNameLower} = get_object_or_404(${modelName}, id=id)
    if request.method == 'POST':
        for key, value in request.POST.items():
            setattr(${modelNameLower}, key, value)
        ${modelNameLower}.save()
        return redirect('fetch_${modelNameLower}')
    return render(request, '${appName}/edit_${modelNameLower}.html', {'${modelNameLower}': ${modelNameLower}})
`;
}

function generateUrlsCode(modelName: string, appName: string): string {
    const modelNameLower = modelName.toLowerCase();
    return `
    path('${modelNameLower}/create/', views.create_${modelNameLower}, name='create_${modelNameLower}'),
    path('${modelNameLower}/', views.fetch_${modelNameLower}, name='fetch_${modelNameLower}'),
    path('${modelNameLower}/delete/<int:id>/', views.delete_${modelNameLower}, name='delete_${modelNameLower}'),
    path('${modelNameLower}/edit/<int:id>/', views.edit_${modelNameLower}, name='edit_${modelNameLower}'),
`;
}

function createTemplates(modelName: string, appName: string, fields: Field[]) {
    const workspaceFolders = vscode.workspace.workspaceFolders;
    if (!workspaceFolders) {
        throw new Error('No workspace folder found');
    }

    const templatesPath = path.join(workspaceFolders[0].uri.fsPath, appName, 'templates', appName);
    if (!fs.existsSync(templatesPath)) {
        fs.mkdirSync(templatesPath, { recursive: true });
    }

    // Create list template
    const listTemplate = generateListTemplate(modelName, fields);
    fs.writeFileSync(path.join(templatesPath, `${modelName.toLowerCase()}.html`), listTemplate);

    // Create create template
    const createTemplate = generateCreateTemplate(modelName, fields);
    fs.writeFileSync(path.join(templatesPath, `create_${modelName.toLowerCase()}.html`), createTemplate);

    // Create edit template
    const editTemplate = generateEditTemplate(modelName, fields);
    fs.writeFileSync(path.join(templatesPath, `edit_${modelName.toLowerCase()}.html`), editTemplate);
}

function generateListTemplate(modelName: string, fields: Field[]): string {
    const modelNameLower = modelName.toLowerCase();
    let template = `
{% extends 'base.html' %}

{% block content %}
<div class="container mt-4">
    <h2>${modelName}s</h2>
    <a href="{% url 'create_${modelNameLower}' %}" class="btn btn-primary mb-3">Create New ${modelName}</a>
    <table class="table">
        <thead>
            <tr>
`;
    
    for (const field of fields) {
        template += `                <th>${field.name}</th>\n`;
    }
    
    template += `                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {% for ${modelNameLower} in ${modelNameLower}s %}
            <tr>
`;
    
    for (const field of fields) {
        template += `                <td>{{ ${modelNameLower}.${field.name} }}</td>\n`;
    }
    
    template += `                <td>
                    <a href="{% url 'edit_${modelNameLower}' ${modelNameLower}.id %}" class="btn btn-sm btn-warning">Edit</a>
                    <a href="{% url 'delete_${modelNameLower}' ${modelNameLower}.id %}" class="btn btn-sm btn-danger">Delete</a>
                </td>
            </tr>
            {% endfor %}
        </tbody>
    </table>
</div>
{% endblock %}
`;
    return template;
}

function generateCreateTemplate(modelName: string, fields: Field[]): string {
    const modelNameLower = modelName.toLowerCase();
    let template = `
{% extends 'base.html' %}

{% block content %}
<div class="container mt-4">
    <h2>Create ${modelName}</h2>
    <form method="post">
        {% csrf_token %}
`;
    
    for (const field of fields) {
        template += `        <div class="form-group">
            <label for="${field.name}">${field.name}</label>
            <input type="text" class="form-control" id="${field.name}" name="${field.name}" required>
        </div>
`;
    }
    
    template += `        <button type="submit" class="btn btn-primary">Create</button>
    </form>
</div>
{% endblock %}
`;
    return template;
}

function generateEditTemplate(modelName: string, fields: Field[]): string {
    const modelNameLower = modelName.toLowerCase();
    let template = `
{% extends 'base.html' %}

{% block content %}
<div class="container mt-4">
    <h2>Edit ${modelName}</h2>
    <form method="post">
        {% csrf_token %}
`;
    
    for (const field of fields) {
        template += `        <div class="form-group">
            <label for="${field.name}">${field.name}</label>
            <input type="text" class="form-control" id="${field.name}" name="${field.name}" value="{{ ${modelNameLower}.${field.name} }}" required>
        </div>
`;
    }
    
    template += `        <button type="submit" class="btn btn-primary">Update</button>
    </form>
</div>
{% endblock %}
`;
    return template;
} 