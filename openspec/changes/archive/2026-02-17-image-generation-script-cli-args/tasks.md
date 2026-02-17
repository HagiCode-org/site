# Tasks: Refactor Image Generation Script to Support CLI Arguments

## 1. Environment Setup and Validation

- [ ] 1.1 Verify existing `run.sh` script functionality by running it once
- [ ] 1.2 Confirm `.env` file contains valid `AZURE_ENDPOINT` and `AZURE_API_KEY`
- [ ] 1.3 Test that curl, jq, and base64 utilities are available on the system
- [ ] 1.4 Verify `scripts/` directory exists and is appropriate for the new script

## 2. Script Structure and Parameter Parsing

- [ ] 2.1 Create new `scripts/generate-image.sh` file with proper shebang (`#!/bin/bash`)
- [ ] 2.2 Implement script header with description and usage comment block
- [ ] 2.3 Implement `show_help()` function with comprehensive usage information
- [ ] 2.4 Implement `show_error()` function for consistent error formatting
- [ ] 2.5 Implement `validate_parameters()` function with all validation rules
- [ ] 2.6 Implement `load_env_vars()` function to source `.env` file
- [ ] 2.7 Implement command-line argument parsing using both getopts and long argument support
- [ ] 2.8 Add `--verbose` flag support for debug logging
- [ ] 2.9 Add `--help` flag support to display usage and exit

## 3. Input Validation Implementation

- [ ] 3.1 Implement prompt validation (non-empty, max length check)
- [ ] 3.2 Implement size validation against allowed values (`1024x1024`, `1792x1024`, `1024x1792`)
- [ ] 3.3 Implement quality validation against allowed values (`standard`, `hd`)
- [ ] 3.4 Implement format validation against allowed values (`png`, `webp`)
- [ ] 3.5 Implement output directory writability check
- [ ] 3.6 Implement environment variable presence validation (`AZURE_ENDPOINT`, `AZURE_API_KEY`)
- [ ] 3.7 Add validation error messages with actionable guidance

## 4. API Request Implementation

- [ ] 4.1 Build JSON request payload with user-provided parameters
- [ ] 4.2 Implement curl request with proper headers (Content-Type, Authorization)
- [ ] 4.3 Add HTTP status code validation before parsing response
- [ ] 4.4 Implement JSON parsing error handling
- [ ] 4.5 Implement `data` array presence validation
- [ ] 4.6 Implement `b64_json` field extraction from response
- [ ] 4.7 Add verbose logging for API request/response (when `--verbose` enabled)

## 5. File Output Implementation

- [ ] 5.1 Implement base64 decoding of image data
- [ ] 5.2 Implement file write to output path
- [ ] 5.3 Verify output file was created successfully
- [ ] 5.4 Report success with output file path
- [ ] 5.5 Add error handling for file write failures

## 6. Error Handling Enhancement

- [ ] 6.1 Add trap handler for script interruption (SIGINT, SIGTERM)
- [ ] 6.2 Implement curl error detection and reporting
- [ ] 6.3 Implement JSON parsing error detection and reporting
- [ ] 6.4 Implement API error response parsing and reporting
- [ ] 6.5 Implement file permission error detection and reporting
- [ ] 6.6 Ensure all error messages follow the defined format (description, what went wrong, how to fix)

## 7. Documentation

- [ ] 7.1 Add inline comments explaining each major code section
- [ ] 7.2 Add function-level documentation comments
- [ ] 7.3 Include usage examples in help text
- [ ] 7.4 Document required environment variables in help text
- [ ] 7.5 Document supported parameter values in help text
- [ ] 7.6 Add brief description of API being called

## 8. Testing and Validation

- [ ] 8.1 Run script with `--help` flag and verify output
- [ ] 8.2 Run script without required `--prompt` argument and verify error message
- [ ] 8.3 Run script with invalid `--size` value and verify validation error
- [ ] 8.4 Run script with invalid `--quality` value and verify validation error
- [ ] 8.5 Run script with invalid `--format` value and verify validation error
- [ ] 8.6 Run script with non-writable output directory and verify error message
- [ ] 8.7 Run successful image generation with default parameters
- [ ] 8.8 Run successful image generation with custom output path
- [ ] 8.9 Run successful image generation with each supported size
- [ ] 8.10 Run successful image generation with each supported quality
- [ ] 8.11 Run successful image generation with each supported format
- [ ] 8.12 Run script with `--verbose` flag and verify debug output
- [ ] 8.13 Test with special characters in prompt
- [ ] 8.14 Test with very long prompt (approaching API limit)

## 9. File Permissions and Integration

- [ ] 9.1 Set executable permissions on `scripts/generate-image.sh` (`chmod +x`)
- [ ] 9.2 Verify script can be called with relative path `./scripts/generate-image.sh`
- [ ] 9.3 Add deprecation notice to existing `run.sh` (if keeping during transition)
- [ ] 9.4 Update any documentation or references to old script location
- [ ] 9.5 Verify script works from project root directory
- [ ] 9.6 Verify script works from other directories (if intended)

## 10. OpenSpec Compliance

- [ ] 10.1 Run `openspec validate image-generation-script-cli-args --strict`
- [ ] 10.2 Fix any validation errors reported
- [ ] 10.3 Run `openspec show image-generation-script-cli-args` to verify delta structure
- [ ] 10.4 Verify all tasks are completed and marked as done

## 11. Cleanup (Post-Deployment)

- [ ] 11.1 Remove old `run.sh` from project root after transition period
- [ ] 11.2 Update any CI/CD pipelines or workflows that reference old script
- [ ] 11.3 Update project documentation to reference new script location
