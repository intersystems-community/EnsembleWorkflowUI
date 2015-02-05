# EnsembleWorkflowUI
Angular UI for InterSystems Ensemble Workflow

## Installation
1. Firstly, please import (and build) project from next repo: https://github.com/intersystems-ru/EnsembleWorkflow
2. Then create (if you didn't) a web-application for REST in the Portal Management System (for ex. /csp/workflow/rest). Set dispatch class to Workflow.REST, Authentication methods to 'Unauthorized' and 'Password'.
3. Set global value ^Settings("WF", "WebAppName") to name of your REST app.
4. Then import (and build) all files of this project.
5. Launch 'index.csp'.
