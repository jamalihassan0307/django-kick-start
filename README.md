<div align="center">
  <kbd>
    <img src="https://github.com/jamalihassan0307/Projects-Assets/blob/main/globel%20assets/profile/image.jpg?raw=true" width="250" alt="Jamalihassan0307"/>
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
    <a href="https://marketplace.visualstudio.com/items?itemName=jamalihassan0307.django-kick-start">
      <img src="https://img.shields.io/badge/version-1.0.6-blue?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="Version"/>
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

[![Version](https://img.shields.io/badge/version-1.0.6-blue.svg)](https://marketplace.visualstudio.com/items?itemName=jamalihassan0307.django-kick-start)
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

### 3. Static Files Helper
- Automatic creation of static file structure
- Configuration of static and media files in settings.py
- Setup of development media serving
- Sample CSS file with basic styles
- Proper static file organization (css, js, images)

### 4. Template Scaffolding
- Bootstrap-powered base template
- Responsive navigation bar
- User authentication templates
- Dashboard layout
- Mobile-friendly design
- Custom block structure

### 🚀 Quick Start

1. Install the extension from VS Code Marketplace
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Django" to see available commands:
   - "Django: Initialize New Project" - Create new project
   - "Django: Generate New App" - Add new app
   - "Django: Setup Static Files" - Configure static files
   - "Django: Scaffold Templates" - Set up templates
   - "Django: Run Development Server" - Start development server

### Debugging Your Project

You can start the development server in three ways:

1. Using the Command Palette:
   - Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
   - Type "Django: Run Development Server"
   - Choose between "Run Server" or "Debug Server" mode
   - The server will start in a new terminal

2. Using VS Code Debug (F5):
   - Press `F5` or click the "Run and Debug" button
   - Select one of these configurations:
     - "Django: Run Server" - For normal development
     - "Django: Debug Server" - For debugging with breakpoints
   - The server will start with appropriate settings

3. Using the Run Button:
   - Click the "Run and Debug" button in the sidebar
   - Select the desired configuration
   - Click the green play button

Debug Mode Tips:
- Use "Django: Debug Server" when you need to set breakpoints
- The `--noreload` flag is automatically added in debug mode
- Breakpoints will work in your views, models, and other Python files
- The debug console will show Django's output and any print statements

The server will run on `http://127.0.0.1:8000/` by default.

### ⚙️ Requirements

- Visual Studio Code ^1.85.0
- Python 3.8 or higher
- Django (will be installed automatically if missing)

### 📋 Command Reference

| Command | Description |
|---------|-------------|
| `Django: Initialize New Project` | Start the project creation wizard |
| `Django: Generate New App` | Create a new Django app in your project |
| `Django: Setup Static Files` | Configure static files and media handling |
| `Django: Scaffold Templates` | Set up Bootstrap-powered templates |
| `Django: Create HTML Template` | Create a new HTML template with automatic view integration |
| `Django: Create Static File` | Creates CSS or JavaScript files with proper structure |
| `Django: Run Development Server` | Start the Django development server |

### 🔄 Project Structure

```
your-project/
├── manage.py
├── your_project/
│   ├── __init__.py
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── myapp/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── urls.py
│   └── views.py
├── static/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   └── images/
├── media/
└── templates/
    ├── base.html
    ├── home.html
    ├── login.html
    └── dashboard.html
```

### 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🐛 Known Issues

See the [issue tracker](https://github.com/jamalihassan0307/django-kick-start/issues) for current issues.

---

**Enjoy!** 🎉
