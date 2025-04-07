# Change Log

All notable changes to the "Django Kick Start" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [1.0.1] - 2024-04-07

### Changed
- Default app name changed from 'core' to 'myapp'
- Updated VS Code engine compatibility to ^1.85.0
- Improved project structure documentation

### Enhanced
- App generation process with better error handling
- User feedback during project creation
- Documentation clarity and completeness

### Fixed
- Various minor bug fixes and improvements
- Documentation inconsistencies

## [1.0.0] - 2024-04-07

### Added
- Project Wizard with one-click Django project initialization
  - Interactive project name input with validation
  - Automatic Python and Django environment checks
  - Django installation helper
  - Workspace folder selection
  - Progress indicators for all operations

- Default App Configuration
  - Automatic app creation
  - INSTALLED_APPS configuration
  - URL patterns setup
  - Basic views implementation

- Project Structure Setup
  - Django project creation with django-admin
  - Default app structure
  - Initial database migrations
  - Ready-to-use development server

### Features
- Environment validation and setup assistance
- Project name validation
- Automatic dependency management
- Post-creation options (Open Project/Run Server)
- Progress notifications
- Error handling and user feedback

### Technical Details
- VS Code ^1.85.0 compatibility
- Python 3.8+ support
- TypeScript implementation
- Modular command structure
- Utility functions for common operations