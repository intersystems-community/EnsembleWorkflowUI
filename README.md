# EnsembleWorkflowUI
AngularJS UI for the InterSystems Ensemble Workflow

## Installation
1. Please import (and build) [WorkflowAPI](https://github.com/intersystems-ru/WorkflowAPI) project at first.
2. Import (and build) all files of this project.
3. Create a web-application (eg. `/csp/wf`) for UI and set the same values for the "Group by ID" property to this app and the REST App.
4. Set authentication method to `Password`.
5. Set `Login Page` property (eg. `/csp/wf/login.csp`)
6. Specify `CSP Files Physical Path` property to the folder with project files.
7. Correct `restAppName` property in `config.json` to the name of your REST app.
