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
    <a href="https://marketplace.visualstudio.com/items?itemName=jamalihassan.django-kick-start">
      <img src="https://img.shields.io/badge/VS_Code-1.85.0+-373277?style=for-the-badge&logo=visualstudio&logoColor=white" alt="VS Code"/>
    </a>
    <a href="https://www.python.org">
      <img src="https://img.shields.io/badge/Python-3.8+-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
    </a>
    <a href="https://marketplace.visualstudio.com/items?itemName=jamalihassan.django-kick-start">
      <img src="https://img.shields.io/badge/version-1.0.2-blue?style=for-the-badge&logo=visualstudiocode&logoColor=white" alt="Version"/>
    </a>
  </p>
</div>

# Welcome to Django Kick Start Extension

## What's in the folder

* This folder contains all of the files necessary for your extension.
* `package.json` - this is the manifest file that defines:
  * Extension metadata (name, version, description)
  * Commands and their titles
  * Extension activation events
  * Dependencies and development tools
* `src/extension.ts` - this is the main file where the extension logic resides.
  * Implements the `activate` function for extension initialization
  * Registers all Django-related commands
  * Handles environment validation and setup

## Features and Commands

### 1. Project Initialization
* Command: `Django: Initialize New Project`
* Creates a new Django project with:
  * Custom project name validation
  * Default 'myapp' application
  * Configured URLs and views
  * Initial database setup

### 2. App Generation
* Command: `Django: Generate New App`
* Creates new Django apps with:
  * Custom app name support
  * Automatic INSTALLED_APPS registration
  * URL pattern configuration
  * Basic view setup

### 3. Static Files Helper
* Command: `Django: Setup Static Files`
* Helps configure static file handling

### 4. Template Scaffolding
* Command: `Django: Scaffold Templates`
* Sets up template directory structure

## Get up and running straight away

* Press `F5` to open a new window with your extension loaded.
* Run commands from the command palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac)
* Type "Django" to see all available commands
* Set breakpoints in `src/extension.ts` to debug your extension
* Find output from your extension in the debug console

## Make changes

* You can relaunch the extension from the debug toolbar after changes
* You can also reload (`Ctrl+R` or `Cmd+R` on Mac) the VS Code window

## Recent Updates (v1.0.1)

* Changed default app name to 'myapp'
* Improved app generation process
* Enhanced documentation
* Updated VS Code compatibility
* Better error handling

## Explore the API

* You can open the full set of our API when you open the file `node_modules/@types/vscode/index.d.ts`.

## Run tests

* Install the [Extension Test Runner](https://marketplace.visualstudio.com/items?itemName=ms-vscode.extension-test-runner)
* Run the "watch" task via the **Tasks: Run Task** command
* Open the Testing view and click the Run Test button
* See the output of the test result in the Test Results view
* Make changes to `src/test/extension.test.ts` or create new test files inside the `test` folder

## Go further

* [Follow UX guidelines](https://code.visualstudio.com/api/ux-guidelines/overview)
* [Bundle your extension](https://code.visualstudio.com/api/working-with-extensions/bundling-extension)
* [Publish your extension](https://code.visualstudio.com/api/working-with-extensions/publishing-extension)
* [Set up Continuous Integration](https://code.visualstudio.com/api/working-with-extensions/continuous-integration)
* [Integrate issue reporting](https://code.visualstudio.com/api/get-started/wrapping-up#issue-reporting)
