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
    try {
        // Get model name
        const modelName = await vscode.window.showInputBox({
            prompt: 'Enter model name (e.g., Artist)',
            placeHolder: 'Model name'
        });

        if (!modelName) {
            return;
        }

        const fields: Field[] = [];
        let addMoreFields = true;

        while (addMoreFields) {
            // Get field name
            const fieldName = await vscode.window.showInputBox({
                prompt: 'Enter field name (e.g., first_name)',
                placeHolder: 'Field name'
            });

            if (!fieldName) {
                break;
            }

            // Select field type
            const fieldType = await vscode.window.showQuickPick(
                FIELD_TYPES.map(type => ({
                    label: type.label,
                    description: type.description,
                    value: type.value
                })),
                {
                    placeHolder: 'Select field type'
                }
            );

            if (!fieldType) {
                break;
            }

            // Get field options
            const options = await vscode.window.showInputBox({
                prompt: 'Enter field options (e.g., max_length=100, null=True)',
                placeHolder: 'Field options (optional)'
            });

            fields.push({
                name: fieldName,
                type: fieldType.value,
                options: options || ''
            });

            // Ask if user wants to add more fields
            const addMore = await vscode.window.showQuickPick(['Yes', 'No'], {
                placeHolder: 'Add another field?'
            });

            addMoreFields = addMore === 'Yes';
        }

        // Generate model code
        const modelCode = generateModelCode(modelName, fields);
        
        // Get app name
        const appName = await vscode.window.showInputBox({
            prompt: 'Enter app name where model should be created',
            placeHolder: 'App name'
        });

        if (!appName) {
            return;
        }

        // Write model to file
        const workspaceFolders = vscode.workspace.workspaceFolders;
        if (!workspaceFolders) {
            throw new Error('No workspace folder found');
        }

        const appPath = path.join(workspaceFolders[0].uri.fsPath, appName);
        const modelsPath = path.join(appPath, 'models.py');

        if (!fs.existsSync(modelsPath)) {
            throw new Error(`Models file not found at ${modelsPath}`);
        }

        // Append model to models.py
        fs.appendFileSync(modelsPath, '\n\n' + modelCode);

        // Generate views
        const viewsCode = generateViewsCode(modelName, appName);
        const viewsPath = path.join(appPath, 'views.py');
        fs.appendFileSync(viewsPath, '\n\n' + viewsCode);

        // Generate URLs
        const urlsCode = generateUrlsCode(modelName, appName);
        const urlsPath = path.join(appPath, 'urls.py');
        fs.appendFileSync(urlsPath, '\n\n' + urlsCode);

        // Create templates
        createTemplates(modelName, appName, fields);

        // Run migrations
        await runTerminalCommand('python manage.py makemigrations');
        await runTerminalCommand('python manage.py migrate');

        vscode.window.showInformationMessage(`Model ${modelName} created successfully!`);

    } catch (error) {
        vscode.window.showErrorMessage(`Error creating model: ${error}`);
    }
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