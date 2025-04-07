# Django Kick Start

A VS Code extension providing a beginner-friendly Django project setup experience with one-click initialization and smart automation tools.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![VS Code Compatibility](https://img.shields.io/badge/vscode-%5E1.99.0-brightgreen.svg)

## 🎯 Features

### 1. Project Wizard (One-click Django Setup)
- Interactive project creation with validation
- Automatic environment checks (Python & Django)
- Default app creation and configuration
- Pre-configured URLs and views
- Initial database setup

### 🚀 Quick Start

1. Install the extension from VS Code Marketplace
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Django: Initialize New Project"
4. Follow the prompts to create your project

### ⚙️ Requirements

- Visual Studio Code ^1.99.0
- Python 3.8 or higher
- Django (will be installed automatically if missing)

### 📋 Command Reference

| Command | Description |
|---------|-------------|
| `Django: Initialize New Project` | Start the project creation wizard |

### 🔄 What Gets Created

When you run the project initialization:

1. A new Django project with your chosen name
2. A 'core' app automatically configured
3. Basic URL patterns and views
4. Initial database migrations
5. Ready-to-run development server

### 📁 Project Structure

```
your-project/
├── manage.py
├── your_project/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
└── core/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── urls.py
    └── views.py
```

### 🔜 Upcoming Features

- Static Files Helper
- Template Scaffolding Tool
- Database Configuration Wizard
- Custom App Generator

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

See the [issue tracker](https://github.com/yourusername/django-kick-start/issues) for current issues.

---

**Enjoy!** 🎉
