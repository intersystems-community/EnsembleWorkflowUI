# EnsembleWorkflowUI
Angular UI for InterSystems Ensemble Workflow

## Installation
1. Firstly, please import (and build) project from [REST API](https://github.com/intersystems-ru/EnsembleWorkflow)
2. Then create (if you didn't) a web-application for REST in the Portal Management System (for ex. `/api/workflow/`). Set dispatch class to `Workflow.REST`, Authentication methods to `Unauthorized` and `Password`.
3. Then import (and build) all files of this project.
4. Create an application for UI (for ex. `/csp/workflow/`), specify csp-folder to folder with poject files. Set Authentication methods to `Unauthorized` only.
5. Correct appname in `config.json` to name of your REST app.
6. Launch `index.html`.
