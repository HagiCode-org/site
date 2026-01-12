# docusaurus-site Specification Delta

## ADDED Requirements

### Requirement: Quick Start Proposal Session Documentation

The documentation site SHALL provide a comprehensive guide for creating and using proposal sessions (also called idea sessions) in PCode, as the fourth document in the Quick Start series. This guide shall explain the complete 9-stage proposal lifecycle from idea initialization to archiving.

#### Scenario: User learns about proposal session purpose

- **GIVEN** the user has completed the previous Quick Start guides (installation, project creation, conversation session)
- **WHEN** the user navigates to the Quick Start - Proposal Session guide
- **THEN** the guide shall explain that proposal sessions transform abstract ideas into executable code
- **AND** the guide shall distinguish proposal sessions from conversation sessions (structured workflow vs. free-form chat)
- **AND** the guide shall indicate when to use each session type

#### Scenario: User understands the 9-stage lifecycle

- **GIVEN** the user is reading the proposal session guide
- **WHEN** the user reviews the state machine documentation
- **THEN** the guide shall list all 9 stages (0-8) with their names
- **AND** the guide shall indicate which stages are AI-automatic (1, 3, 5, 7) and which are user-manual (0, 2, 4, 6)
- **AND** the guide shall provide a reference table mapping state numbers to names and types

#### Scenario: User learns State 0-2 (Initialization and Draft)

- **GIVEN** the user is starting a new proposal session
- **WHEN** the user reads about State 0: Initialization
- **THEN** the guide shall explain clicking "New Idea" button
- **AND** the guide shall explain entering title and description (free-form)
- **WHEN** the user reads about State 1: Optimizing
- **THEN** the guide shall explain AI automatically refines description and generates name
- **WHEN** the user reads about State 2: Draft
- **THEN** the guide shall explain user can review and manually edit if needed

#### Scenario: User learns State 3-4 (Generation and Review)

- **GIVEN** the user is in the draft stage
- **WHEN** the user reads about State 3: Generating
- **THEN** the guide shall explain clicking "Generate Plan" button
- **AND** the guide shall list document types AI generates (proposal, task, design, specs)
- **AND** the guide shall mention the Conversation tab for progress viewing
- **WHEN** the user reads about State 4: Review
- **THEN** the guide shall explain the three annotation types (inline, file, global)
- **AND** the guide shall describe the review-adjustment cycle until documents are approved

#### Scenario: User learns State 5-6 (Execution and Completion)

- **GIVEN** the user has approved the proposal documents
- **WHEN** the user reads about State 5: Executing
- **THEN** the guide shall explain clicking "Execute Now" button in Info tab
- **AND** the guide shall mention AI automatically implements the code
- **WHEN** the user reads about State 6: Execution Complete
- **THEN** the guide shall explain user can verify code in IDE
- **AND** the guide shall explain conversation is in edit mode (vs. read-only in normal sessions)
- **AND** the guide shall mention continued conversation for refinements

#### Scenario: User learns State 7-8 (Archiving)

- **GIVEN** the user has verified the executed code
- **WHEN** the user reads about State 7: Archiving
- **THEN** the guide shall explain clicking "Archive Plan" button
- **AND** the guide shall clarify this step does NOT commit code (user decides commit method)
- **WHEN** the user reads about State 8: Archived
- **THEN** the guide shall explain the proposal session lifecycle is complete
- **AND** the guide shall indicate session status changes to archived

#### Scenario: User accesses Chinese translation

- **GIVEN** the user prefers Chinese language
- **WHEN** the user switches to Chinese (zh-CN)
- **THEN** the proposal session guide shall display in Chinese
- **AND** the title shall be "使用提案会话将主意转化为代码" or equivalent
- **AND** all sections shall be translated accurately
- **AND** technical terms shall use consistent Chinese terminology established in other guides
- **AND** the state reference table shall be translated with state numbers preserved

#### Scenario: User learns when to use proposal sessions

- **GIVEN** the user has read both conversation and proposal session guides
- **WHEN** the user reviews the comparison section
- **THEN** the guide shall clarify proposal sessions are for: complex multi-stage tasks, structured implementation planning, requirements traceability
- **AND** the guide shall clarify conversation sessions are for: quick questions, code analysis, simple tasks
- **AND** the guide shall help the user choose the appropriate session type for their needs

#### Scenario: User finds tips for effective proposal sessions

- **GIVEN** the user is preparing to create a proposal session
- **WHEN** the user reads the tips section
- **THEN** the guide shall provide actionable guidance for: writing clear initial descriptions, being specific during review, understanding the adjustment cycle, knowing when minor inaccuracies are acceptable (State 2), leveraging edit-mode conversation after execution

#### Scenario: User navigates to next steps

- **GIVEN** the user has completed the proposal session guide
- **WHEN** the user reaches the "Next Steps" section
- **THEN** the guide shall link to Feature Guides for deeper learning
- **AND** the guide shall suggest exploring specific features relevant to proposal workflows
- **AND** the user shall have completed the Quick Start series and be ready for advanced usage
