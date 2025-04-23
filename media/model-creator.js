// The webview content
(function() {
    // Acquire VS Code API
    const vscode = acquireVsCodeApi();

    // Initialize state
    vscode.setState({});

    // Log that the script is loaded
    console.log('Model creator script loaded');

    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM Content Loaded');
        
        const form = document.getElementById('modelForm');
        const fieldsContainer = document.getElementById('fieldsContainer');
        const addFieldButton = document.getElementById('addField');

        // Add new field row
        addFieldButton.addEventListener('click', () => {
            console.log('Add field button clicked');
            const fieldRow = document.createElement('div');
            fieldRow.className = 'field-row mb-2';
            fieldRow.innerHTML = `
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
            `;
            fieldsContainer.appendChild(fieldRow);
        });

        // Remove field row
        fieldsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-field')) {
                e.target.closest('.field-row').remove();
            }
        });

        // Handle form submission
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Form submitted');

            const appName = document.getElementById('appName').value.trim();
            const modelName = document.getElementById('modelName').value.trim();
            const fields = [];

            // Validate form
            if (!appName || !modelName) {
                showError('Please fill in all required fields');
                return;
            }

            // Collect field data
            const fieldRows = document.querySelectorAll('.field-row');
            if (fieldRows.length === 0) {
                showError('Please add at least one field');
                return;
            }

            let hasError = false;
            fieldRows.forEach(row => {
                const name = row.querySelector('.field-name').value.trim();
                const type = row.querySelector('.field-type').value;
                const options = row.querySelector('.field-options').value.trim();

                if (!name) {
                    showError('Field name cannot be empty');
                    hasError = true;
                    return;
                }

                fields.push({
                    name,
                    type,
                    options
                });
            });

            if (hasError) {
                return;
            }

            console.log('Sending message to extension:', { appName, modelName, fields });

            // Send message to extension
            vscode.postMessage({
                command: 'createModel',
                appName,
                modelName,
                fields
            });
        });

        // Function to show error message
        function showError(message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'alert alert-danger mt-3';
            errorDiv.textContent = message;
            
            // Remove any existing error messages
            const existingError = document.querySelector('.alert-danger');
            if (existingError) {
                existingError.remove();
            }
            
            form.parentNode.insertBefore(errorDiv, form.nextSibling);
            
            // Auto-remove error message after 5 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }

        // Listen for messages from the extension
        window.addEventListener('message', event => {
            const message = event.data;
            console.log('Received message from extension:', message);

            switch (message.command) {
                case 'ready':
                    console.log('Webview is ready');
                    break;
            }
        });
    });
})();