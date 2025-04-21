<div align="center">
  <kbd>
    <img src="https://github.com/jamalihassan0307/Projects-Assets/blob/main/globel%20assets/profile/image.jpg?raw=true" width="250" alt="Jamalihassan0307"/>
  </kbd>
  
  <h1>📚 Django Kick Start - Quick Start Guide 📚</h1>
  <p><i>Get started with the Django Kick Start extension in minutes</i></p>
  
  <p align="center">
    <a href="https://github.com/jamalihassan0307">
      <img src="https://img.shields.io/badge/Created_by-Jam_Ali_Hassan-blue?style=for-the-badge&logo=github&logoColor=white" alt="Created by"/>
    </a>
  </p>

  <p align="center">
    <a href="https://marketplace.visualstudio.com/items?itemName=jamalihassan0307.django-kick-start">
      <img src="https://img.shields.io/badge/VS_Code-1.85.0+-373277?style=for-the-badge&logo=visualstudio&logoColor=white" alt="VS Code"/>
    </a>
    <a href="https://www.python.org">
      <img src="https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
    </a>
    <a href="https://marketplace.visualstudio.com/items?itemName=jamalihassan0307.django-kick-start">
      <img src="https://img.shields.io/badge/version-1.1.0-blue?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="Version"/>
    </a>
  </p>
</div>

# Welcome to Django Kick Start Extension

## Features and Commands

### 1. Project Initialization (`Django: Initialize New Project`)
* Creates a new Django project with:
  * Custom project name validation
  * Default 'myapp' application
  * Configured URLs and views
  * Initial database setup

### 2. App Generation (`Django: Generate New App`)
* Creates new Django apps with:
  * Custom app name support
  * Automatic INSTALLED_APPS registration
  * URL pattern configuration
  * Basic view setup

### 3. Static Files Helper (`Django: Setup Static Files`)
* Automatically creates and configures:
  * Static files directory structure (css, js, images)
  * Media files directory
  * Sample CSS file with basic styles
  * Static and media settings in settings.py
  * Development media serving in urls.py

### 4. Template Scaffolding (`Django: Scaffold Templates`)
* Sets up a complete template structure:
  * Base template with Bootstrap 5
  * Responsive navigation bar
  * User authentication views
  * Dashboard layout
  * Mobile-friendly design
  * Custom block structure for easy extension

## Project Structure

```
your-project/
├── manage.py
├── your_project/
│   ├── settings.py
│   └── urls.py
├── myapp/
│   ├── views.py
│   └── urls.py
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

## Get Started

1. Press `F5` to open a new window with your extension loaded
2. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`)
3. Try these commands:
   * `Django: Initialize New Project` - Create a new project
   * `Django: Generate New App` - Add a new app
   * `Django: Setup Static Files` - Configure static files
   * `Django: Scaffold Templates` - Set up templates

## Development

* Use the debug toolbar to relaunch after changes
* Check the Output panel for detailed logs
* Set breakpoints in `src/extension.ts`
* Monitor the Debug Console for errors

## Recent Updates (v1.0.5)

* Updated publisher information
* Refreshed documentation links
* Enhanced version compatibility
* Improved repository references

## Testing

* Run tests with Extension Test Runner
* Monitor test results in Test Results view
* Add new tests in `test` folder
* Use watch mode for continuous testing

## Debugging Tips

1. Check the Output panel for detailed logs
2. Use breakpoints in extension.ts
3. Monitor the Debug Console
4. Review error messages in notifications

## Next Steps

* Review the [VS Code Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)
* Explore the [VS Code API](https://code.visualstudio.com/api/references/vscode-api)
* Check the [Extension Samples](https://github.com/Microsoft/vscode-extension-samples)

## Resources

* [VS Code Extension Development](https://code.visualstudio.com/api)
* [Django Documentation](https://docs.djangoproject.com/)
* [Bootstrap Documentation](https://getbootstrap.com/docs/5.3)
