<div align="center">
  <kbd>
    <img src="media/logo.png" width="250" alt="Django Kick Start"/>
  </kbd>
  
  <h1>🚀 Django Kick Start 🚀</h1>
  <p><i>A powerful VS Code extension for seamless Django project initialization and management</i></p>
  
  <p align="center">
    <a href="https://github.com/jamalihassan0307">
      <img src="https://img.shields.io/badge/Created_by-Jam_Ali_Hassan-blue?style=for-the-badge&logo=github&logoColor=white" alt="Created by"/>
    </a>
  </p>

  <p align="center">
    <a href="https://github.com/jamalihassan0307">
      <img src="https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
    </a>
    <a href="https://www.linkedin.com/in/jamalihassan0307">
      <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
    </a>
    <a href="https://jamalihassan0307.github.io/portfolio.github.io">
      <img src="https://img.shields.io/badge/Portfolio-255E63?style=for-the-badge&logo=About.me&logoColor=white" alt="Portfolio"/>
    </a>
  </p>

  <p align="center">
    <a href="https://marketplace.visualstudio.com/items?itemName=jamalihassan.django-kick-start">
      <img src="https://img.shields.io/badge/VS_Code-1.85.0+-373277?style=for-the-badge&logo=visualstudio&logoColor=white" alt="VS Code"/>
    </a>
    <a href="https://www.python.org">
      <img src="https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
    </a>
    <a href="https://opensource.org/licenses/MIT">
      <img src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge" alt="License: MIT"/>
    </a>
  </p>

  <p align="center">
    <a href="https://marketplace.visualstudio.com/items?itemName=jamalihassan.django-kick-start">
      <img src="https://img.shields.io/badge/version-1.0.1-blue?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="Version"/>
    </a>
    <a href="https://www.djangoproject.com">
      <img src="https://img.shields.io/badge/Django-Latest-092E20?style=for-the-badge&logo=django&logoColor=white" alt="Django"/>
    </a>
    <a href="https://marketplace.visualstudio.com/items?itemName=jamalihassan.django-kick-start">
      <img src="https://img.shields.io/badge/VS_Marketplace-Install-blue?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="Install"/>
    </a>
  </p>
</div>

# Django Kick Start

A VS Code extension providing a beginner-friendly Django project setup experience with one-click initialization and smart automation tools.

![Version](https://img.shields.io/badge/version-1.0.1-blue.svg)
![VS Code Compatibility](https://img.shields.io/badge/vscode-%5E1.85.0-brightgreen.svg)

## 🎯 Features

### 1. Project Wizard (One-click Django Setup)
- Interactive project creation with validation
- Automatic environment checks (Python & Django)
- Default app creation and configuration
- Pre-configured URLs and views
- Initial database setup

### 2. App Generation
- Customizable app name (default: 'myapp')
- Automatic app registration in INSTALLED_APPS
- Pre-configured URL patterns
- Basic view setup with welcome page

### 🚀 Quick Start

1. Install the extension from VS Code Marketplace
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Django: Initialize New Project"
4. Follow the prompts to create your project

### ⚙️ Requirements

- Visual Studio Code ^1.85.0
- Python 3.8 or higher
- Django (will be installed automatically if missing)

### 📋 Command Reference

| Command | Description |
|---------|-------------|
| `Django: Initialize New Project` | Start the project creation wizard |
| `Django: Generate New App` | Create a new Django app in your project |
| `Django: Setup Static Files` | Configure static files for your project |
| `Django: Scaffold Templates` | Set up template structure |

### 🔄 What Gets Created

When you run the project initialization:

1. A new Django project with your chosen name
2. A 'myapp' application (default app)
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
└── myapp/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── urls.py
    └── views.py
```

### 🆕 What's New in 1.0.1

- Changed default app name from 'core' to 'myapp'
- Improved app generation process
- Enhanced project structure documentation
- Updated VS Code engine compatibility to ^1.85.0
- Improved error handling and user feedback

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
