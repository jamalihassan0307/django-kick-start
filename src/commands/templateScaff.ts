import * as vscode from 'vscode';
import * as path from 'path';

/**
 * Template scaffolding command
 * Sets up template structure with base templates and common pages
 */
export async function templateScaff(context: vscode.ExtensionContext) {
    try {
        // Get workspace folder
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            throw new Error('No workspace folder found');
        }

        // Create templates directory
        const templatesDir = path.join(workspaceFolder.uri.fsPath, 'templates');
        await vscode.workspace.fs.createDirectory(vscode.Uri.file(templatesDir));

        // Create base template
        const baseTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{% block title %}Django Project{% endblock %}</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    
    <!-- Custom CSS -->
    {% load static %}
    <link href="{% static 'css/style.css' %}" rel="stylesheet">
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <div class="container">
            <a class="navbar-brand" href="{% url 'home' %}">Your Project</a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link" href="{% url 'home' %}">Home</a>
                    </li>
                    {% if user.is_authenticated %}
                        <li class="nav-item">
                            <a class="nav-link" href="{% url 'dashboard' %}">Dashboard</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="{% url 'logout' %}">Logout</a>
                        </li>
                    {% else %}
                        <li class="nav-item">
                            <a class="nav-link" href="{% url 'login' %}">Login</a>
                        </li>
                    {% endif %}
                </ul>
            </div>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="container main-content">
        {% block content %}
        {% endblock %}
    </div>

    <!-- Footer -->
    <footer class="footer">
        <div class="container text-center">
            <p>&copy; {% now "Y" %} Your Project. All rights reserved.</p>
        </div>
    </footer>

    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    
    <!-- Custom JS -->
    {% block extra_js %}{% endblock %}
</body>
</html>`;

        // Create home template
        const homeTemplate = `{% extends 'base.html' %}

{% block title %}Home{% endblock %}

{% block content %}
<div class="row">
    <div class="col-md-12 text-center">
        <h1 class="display-4">Welcome to Your Django Project</h1>
        <p class="lead">This is a sample home page created by Django Kick Start.</p>
        <hr class="my-4">
        <p>Get started by customizing this template and adding your own content.</p>
        <a class="btn btn-primary btn-lg" href="{% url 'admin:index' %}" role="button">Admin Panel</a>
    </div>
</div>
{% endblock %}`;

        // Create login template
        const loginTemplate = `{% extends 'base.html' %}

{% block title %}Login{% endblock %}

{% block content %}
<div class="row justify-content-center">
    <div class="col-md-6">
        <div class="card">
            <div class="card-header">
                <h3 class="text-center">Login</h3>
            </div>
            <div class="card-body">
                <form method="post">
                    {% csrf_token %}
                    {{ form.as_p }}
                    <div class="d-grid">
                        <button type="submit" class="btn btn-primary">Login</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
{% endblock %}`;

        // Create dashboard template
        const dashboardTemplate = `{% extends 'base.html' %}

{% block title %}Dashboard{% endblock %}

{% block content %}
<div class="row">
    <div class="col-md-12">
        <h2>Dashboard</h2>
        <hr>
        <div class="alert alert-info">
            Welcome back, {{ user.username }}!
        </div>
        <div class="row">
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Profile</h5>
                        <p class="card-text">Manage your profile settings and preferences.</p>
                        <a href="#" class="btn btn-primary">Edit Profile</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Settings</h5>
                        <p class="card-text">Configure your account settings.</p>
                        <a href="#" class="btn btn-primary">Settings</a>
                    </div>
                </div>
            </div>
            <div class="col-md-4">
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Activity</h5>
                        <p class="card-text">View your recent activity.</p>
                        <a href="#" class="btn btn-primary">View Activity</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
{% endblock %}`;

        // Write templates
        const templates = {
            'base.html': baseTemplate,
            'home.html': homeTemplate,
            'login.html': loginTemplate,
            'dashboard.html': dashboardTemplate
        };

        for (const [filename, content] of Object.entries(templates)) {
            await vscode.workspace.fs.writeFile(
                vscode.Uri.file(path.join(templatesDir, filename)),
                Buffer.from(content, 'utf8')
            );
        }

        // Update settings.py to include templates directory
        const settingsPath = await findSettingsPath(workspaceFolder.uri.fsPath);
        if (settingsPath) {
            const settingsContent = await vscode.workspace.fs.readFile(vscode.Uri.file(settingsPath));
            let settings = settingsContent.toString();

            if (!settings.includes('TEMPLATES')) {
                settings = settings.replace(
                    'TEMPLATES = [',
                    `TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },`
                );

                await vscode.workspace.fs.writeFile(
                    vscode.Uri.file(settingsPath),
                    Buffer.from(settings, 'utf8')
                );
            }
        }

        vscode.window.showInformationMessage('Template scaffolding completed successfully!');

    } catch (error) {
        vscode.window.showErrorMessage(`Failed to scaffold templates: ${error}`);
    }
}

async function findSettingsPath(workspaceFolder: string): Promise<string | undefined> {
    const files = await vscode.workspace.findFiles('**/settings.py');
    return files.length > 0 ? files[0].fsPath : undefined;
} 