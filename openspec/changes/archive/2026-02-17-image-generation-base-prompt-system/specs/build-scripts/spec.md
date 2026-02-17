# build-scripts Specification Delta

## ADDED Requirements

### Requirement: Image Generation Base Prompt System

The image generation script (`scripts/generate-image.sh`) MUST support a configurable base prompt system that provides consistent visual styling and brand identity for all generated images.

#### Scenario: Base prompt configuration file exists

**Given** the `scripts/image-base-prompt.json` configuration file exists
**And** the file contains valid JSON with `basePrompt`, `defaultEnabled`, and `contexts` fields
**When** the script is executed with `--use-base-prompt` (or default behavior)
**Then** the script MUST load and apply the base prompt from the configuration file
**And** the final prompt sent to the API MUST include the base prompt content
**And** the generated image MUST reflect the configured visual style

#### Scenario: Base prompt disabled explicitly

**Given** the `scripts/image-base-prompt.json` configuration file exists
**When** the script is executed with `--no-base-prompt` flag
**Then** the script MUST NOT include the base prompt in the final prompt
**And** only the user-provided prompt (via `--prompt` and optional `--custom-prompt`) MUST be sent to the API

#### Scenario: Context-specific prompt enhancement

**Given** the `scripts/image-base-prompt.json` configuration file exists
**And** the configuration defines a context named "session-management"
**When** the script is executed with `--context session-management`
**Then** the script MUST combine prompts in order: base prompt + context-specific prompt + user prompt
**And** the final prompt MUST include all applicable prompt components
**And** the generated image MUST reflect both the base style and the context-specific enhancements

#### Scenario: Custom prompt addition

**Given** the script is executed with base prompt enabled
**When** the user provides `--custom-prompt "with a modern interface"`
**Then** the script MUST append the custom prompt to the combined prompt
**And** the final prompt MUST be: base prompt + (context prompt if specified) + custom prompt + user prompt
**And** the total prompt length MUST NOT exceed 4000 characters

#### Scenario: Configuration file missing graceful degradation

**Given** the `scripts/image-base-prompt.json` configuration file does not exist
**When** the script is executed with any base prompt related flags
**Then** the script MUST continue execution without the base prompt
**And** the script MUST log a warning message indicating the configuration file is missing
**And** the script MUST use only the user-provided prompt(s)

#### Scenario: Invalid context type error handling

**Given** the `scripts/image-base-prompt.json` configuration file exists
**When** the script is executed with `--context invalid-context-type`
**And** "invalid-context-type" is not defined in the configuration's `contexts` object
**Then** the script MUST exit with a non-zero status code
**And** the script MUST display an error message listing available context types
**And** the script MUST provide guidance on how to fix the issue

#### Scenario: Prompt length validation

**Given** the script is executed with base prompt, context prompt, custom prompt, and user prompt
**When** the combined prompt length exceeds 4000 characters
**Then** the script MUST exit with a non-zero status code
**And** the script MUST display an error message showing the current length and the limit
**And** the script MUST suggest shortening the custom or user prompt

#### Scenario: Verbose logging for prompt composition

**Given** the script is executed with `--verbose` flag
**And** base prompt system is being used
**When** the script composes the final prompt
**Then** the script MUST log each component being added:
  - Base prompt: [enabled/disabled]
  - Context prompt: [context name or "none"]
  - Custom prompt: [provided or "none"]
  - User prompt: [length]
  - Final prompt length: [character count]

#### Scenario: Help documentation includes new parameters

**Given** a user executes the script with `--help` flag
**When** the help message is displayed
**Then** the help MUST include documentation for:
  - `--use-base-prompt` / `--no-base-prompt` flags
  - `--context <type>` parameter with description
  - `--custom-prompt <text>` parameter with description
**And** examples MUST demonstrate proper usage of the new parameters
