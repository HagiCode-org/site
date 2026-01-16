## ADDED Requirements

### Requirement: Download Package Button
The website navigation bar SHALL provide a "下载安装包" button in the right-hand section that links to the GitHub Releases page.

#### Scenario: User clicks download button
- **WHEN** a user clicks the "下载安装包" button in the navigation bar
- **THEN** the browser navigates to the GitHub Releases page at `https://github.com/HagiCode-org/releases/releases`

#### Scenario: Download button is visible on desktop
- **WHEN** a user views the site on a desktop or tablet screen (>768px width)
- **THEN** the "下载安装包" button is visible in the navigation bar's right-hand section

#### Scenario: Download button moves to mobile menu
- **WHEN** a user views the site on a mobile device (<768px width)
- **THEN** the "下载安装包" button appears in the mobile drawer menu

### Requirement: Docker Hub Button
The website navigation bar SHALL provide a "Docker Hub" button in the right-hand section that links to the project's Docker Hub repository at `https://hub.docker.com/r/newbe36524/hagicode`.

#### Scenario: User clicks Docker Hub button
- **WHEN** a user clicks the "Docker Hub" button in the navigation bar
- **THEN** the browser opens the Docker Hub repository page in a new tab

#### Scenario: Docker Hub button is visible on desktop
- **WHEN** a user views the site on a desktop or tablet screen (>768px width)
- **THEN** the "Docker Hub" button is visible in the navigation bar's right-hand section

#### Scenario: Docker Hub button moves to mobile menu
- **WHEN** a user views the site on a mobile device (<768px width)
- **THEN** the "Docker Hub" button appears in the mobile drawer menu

### Requirement: Footer Download Link
The website footer SHALL provide a "下载安装包" link in the Community section that links to the GitHub Releases page.

#### Scenario: User clicks footer download link
- **WHEN** a user clicks the "下载安装包" link in the footer
- **THEN** the browser navigates to the GitHub Releases page at `https://github.com/HagiCode-org/releases/releases`

### Requirement: Footer Docker Hub Link
The website footer SHALL provide a "Docker Hub" link in the Community section that links to the project's Docker Hub repository.

#### Scenario: User clicks footer Docker Hub link
- **WHEN** a user clicks the "Docker Hub" link in the footer
- **THEN** the browser navigates to `https://hub.docker.com/r/newbe36524/hagicode`

## REMOVED Requirements

### Requirement: GitHub Navigation Link (Navbar)
**Reason**: The GitHub link in the navbar is being replaced with more specific action buttons (Downloads and Docker Hub) that provide direct access to key resources.

**Migration**: Users who previously clicked the GitHub link to access the repository can still reach it through the footer (if preserved) or by navigating to the Releases page and clicking through to the main repository.

### Requirement: GitHub Footer Link
**Reason**: The GitHub link in the footer Community section is being replaced with download and Docker Hub links to match the new navigation structure and provide more direct access to key resources.

**Migration**: Users who previously clicked the footer GitHub link can still access the repository through the Releases page or by clicking through from other project links.
