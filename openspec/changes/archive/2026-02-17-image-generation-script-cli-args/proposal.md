# Change: Refactor Image Generation Script to Support CLI Arguments

## Metadata

- **Change ID**: `image-generation-script-cli-args`
- **Status**: Proposed
- **Created**: 2026-02-17
- **Author**: AI Assistant

## Overview

Refactor the existing `run.sh` AI image generation script to support command-line arguments, improving usability and maintainability. The script will be moved to the `scripts/` directory following project conventions and enhanced with parameter validation, error handling, and comprehensive documentation.

### Problem Statement

The current `run.sh` script at the project root has several limitations that hinder its practical use:

1. **Hardcoded parameters**: The prompt, size, quality, and output filename are hardcoded, requiring manual script edits for each generation
2. **Fixed output location**: Images are always saved as `generated_image.png` in the current directory
3. **No input validation**: Missing validation for required environment variables and parameters
4. **Poor error handling**: API failures and errors are not gracefully handled or clearly communicated
5. **Lack of documentation**: No usage instructions or help text for other developers
6. **Non-standard location**: Script resides in project root instead of the `scripts/` directory

These limitations result in:
- Developers needing to edit the script file for each image generation
- Unclear error messages when API calls fail
- Difficulty integrating the script into automated workflows
- Inconsistent project structure

### Solution Overview

Transform `run.sh` into a production-ready `scripts/generate-image.sh` script with:

1. **Command-line argument parsing** using getopts for POSIX compliance
2. **Configurable parameters**: prompt (required), output path, size, quality, format
3. **Comprehensive validation** of environment variables, inputs, and API configuration
4. **Robust error handling** with clear, actionable error messages
5. **Built-in help documentation** accessible via `--help` flag
6. **Verbose mode** for debugging and logging
7. **Project structure compliance** by relocating to `scripts/` directory

## Scope

### In Scope

1. **Script relocation and renaming**
   - Move `run.sh` → `scripts/generate-image.sh`
   - Add executable permissions (`chmod +x`)
   - Update any references to the old script location

2. **Command-line interface**
   - `--prompt`: Required text prompt for image generation
   - `--output`: Output file path (default: `generated_image.webp`)
   - `--size`: Image dimensions (default: `1024x1024`, options: `1024x1024`, `1792x1024`, `1024x1792`)
   - `--quality`: Image quality (default: `medium`, options: `standard`, `hd`)
   - `--format`: Output format (default: `webp`, options: `png`, `webp`)
   - `--verbose`: Enable detailed logging
   - `--help`: Display usage information

3. **Environment variable management**
   - Load `AZURE_ENDPOINT` and `AZURE_API_KEY` from `.env` file
   - Validate presence of required environment variables
   - Support environment variable overrides via parameters (future enhancement)

4. **Input validation**
   - Validate required `--prompt` argument is provided
   - Validate output directory is writable
   - Validate API key and endpoint are configured
   - Validate size, quality, and format parameters against allowed values

5. **Error handling**
   - Catch and report curl request failures
   - Handle JSON parsing errors gracefully
   - Detect and report file write permission issues
   - Provide clear error messages with actionable guidance

6. **Documentation**
   - Inline script comments explaining each section
   - Help text with usage examples
   - Error messages that guide users to solutions

### Out of Scope

1. **Batch image generation** (can be achieved via shell loops)
2. **Async/background generation** (script remains synchronous)
3. **Progress indicators** during API calls
4. **Image preview or display** after generation
5. **Configuration file support** (beyond `.env` for API credentials)
6. **Alternative API providers** (only Azure OpenAI DALL-E supported)
7. **Retry logic** for failed API calls
8. **Image post-processing** (resizing, filters, etc.)

### Affected Components

- **run.sh**: Will be removed/relocated to `scripts/generate-image.sh`
- **scripts/generate-image.sh**: New script with enhanced functionality
- **.env**: Required for `AZURE_ENDPOINT` and `AZURE_API_KEY` (unchanged)
- **scripts/** directory: New script added following project conventions

## Success Criteria

1. **Functional completeness**
   - Script generates images successfully with all parameter combinations
   - All command-line flags work as documented
   - Environment variables are loaded correctly from `.env`

2. **Validation and error handling**
   - Missing required prompt triggers clear error message
   - Invalid parameter values are rejected with helpful guidance
   - API errors are caught and reported with context
   - File write errors are detected and communicated

3. **Documentation quality**
   - `--help` flag provides comprehensive usage information
   - Script includes inline comments for maintainability
   - Error messages guide users toward solutions

4. **Project compliance**
   - Script follows project `scripts/` directory convention
   - Script is executable with proper shebang
   - Script uses POSIX-compatible constructs

5. **Developer experience**
   - Common use cases require minimal command-line arguments
   - Error messages are actionable and specific
   - Script can be integrated into automation workflows

## Impact Analysis

### Benefits

1. **Improved developer productivity**
   - No need to edit script files for different prompts
   - Quick iteration with command-line usage
   - Easy integration into build pipelines or scripts

2. **Better error resolution**
   - Clear validation errors prevent wasted API calls
   - Actionable error messages reduce debugging time
   - Verbose mode aids troubleshooting

3. **Enhanced maintainability**
   - Follows project structure conventions
   - Well-documented code is easier to modify
   - Modular design allows future enhancements

4. **Flexible usage scenarios**
   - Direct output to `public/` directory for web assets
   - Custom filenames for organized asset management
   - Multiple format and size options for different use cases

### Risks

1. **Breaking change for existing users**
   - **Mitigation**: Old `run.sh` can remain during transition period with deprecation notice

2. **Parameter validation may reject previously valid combinations**
   - **Mitigation**: Validation aligns with Azure DALL-E API requirements; rejects only invalid calls

3. **Increased script complexity**
   - **Mitigation**: Code is well-commented and follows single-responsibility principles

### Breaking Changes

- **Script location change**: `run.sh` → `scripts/generate-image.sh`
- **Command-line interface required**: Prompt must be provided via `--prompt` argument
- **Default output format changed**: Now defaults to `webp` (previously PNG)

### Migration Path

For users of the existing `run.sh`:

```bash
# Old usage (no longer supported)
./run.sh

# New usage (explicit prompt, WebP output by default)
./scripts/generate-image.sh --prompt "A photograph of a red fox in an autumn forest"

# Old behavior equivalent (PNG format)
./scripts/generate-image.sh --prompt "A photograph of a red fox in an autumn forest" --format png --output generated_image.png
```

Transition period: Keep `run.sh` with a deprecation message directing users to the new script.

## Dependencies

### External Dependencies

- **curl**: HTTP client for API requests (already required)
- **jq**: JSON parser for extracting base64 image data (already required)
- **base64**: Command-line utility for decoding image data (already required)
- **Azure OpenAI DALL-E API**: Image generation service (already required)

### Internal Dependencies

- **.env file**: Must contain `AZURE_ENDPOINT` and `AZURE_API_KEY`
- **scripts/ directory**: Exists and follows project conventions

### Related Changes

None - this is a standalone script enhancement.

## Implementation Notes

### Parameter Parsing Strategy

Using POSIX `getopts` for broad compatibility:

```bash
while getopts "p:o:s:q:f:vh" opt; do
  case $opt in
    p) PROMPT="$OPTARG" ;;
    o) OUTPUT="$OPTARG" ;;
    s) SIZE="$OPTARG" ;;
    q) QUALITY="$OPTARG" ;;
    f) FORMAT="$OPTARG" ;;
    v) VERBOSE=true ;;
    h) show_help; exit 0 ;;
    *) show_help; exit 1 ;;
  esac
done
```

Long argument support (`--prompt`) via parameter expansion:

```bash
for arg in "$@"; do
  case $arg in
    --prompt=*) PROMPT="${arg#*=}" ;;
    --output=*) OUTPUT="${arg#*=}" ;;
    # ... etc
  esac
done
```

### Validation Rules

- **Prompt**: Non-empty string, max 4000 characters (API limit)
- **Size**: Must be one of `1024x1024`, `1792x1024`, `1024x1792`
- **Quality**: Must be one of `standard`, `hd`
- **Format**: Must be one of `png`, `webp`
- **Output directory**: Must exist and be writable
- **Environment variables**: `AZURE_ENDPOINT` and `AZURE_API_KEY` must be non-empty

### Error Message Format

All errors follow the pattern:

```
Error: [Specific error description]

[What went wrong]: [Details]
[How to fix]: [Actionable guidance]
```

Example:

```
Error: Azure API credentials not configured

What went wrong: The AZURE_API_KEY environment variable is not set or is empty.
How to fix: Ensure your .env file contains AZURE_API_KEY with a valid key.
```

### API Request Structure

Preserve existing API request format:

```json
{
  "prompt": "<user-provided prompt>",
  "size": "<size parameter>",
  "quality": "<quality parameter>",
  "output_compression": 100,
  "output_format": "<format parameter>",
  "n": 1
}
```

### Response Processing

- Validate HTTP status code before parsing JSON
- Check for `data` array in response
- Extract `b64_json` field from first image
- Decode base64 and write to output file
- Verify file was created successfully

## Alternatives Considered

### Alternative 1: Convert to Node.js/TypeScript script

**Approach**: Rewrite the script in TypeScript to match the project's primary language.

**Rationale for rejection**:
- Existing shell script is simpler and more direct for this use case
- Shell scripts are appropriate for wrapper utilities
- No complex logic requiring TypeScript benefits
- Would add node_modules dependency for a simple task
- Existing project has both shell scripts (build scripts) and Node.js scripts

### Alternative 2: Add configuration file support

**Approach**: Allow loading parameters from a config file (e.g., `image-config.json`).

**Rationale for rejection**:
- Command-line arguments are more direct for single generations
- Config files add complexity for limited benefit
- Can be added later if batch generation becomes common
- Current use case is ad-hoc image generation

### Alternative 3: Keep script in project root

**Approach**: Enhance `run.sh` in place without relocating.

**Rationale for rejection**:
- Project convention places utilities in `scripts/` directory
- Root directory should remain minimal
- Inconsistent with project structure patterns
- Makes project organization less clear

### Alternative 4: Use a CLI framework (e.g., Commander.js)

**Approach**: Implement using a Node.js CLI framework.

**Rationale for rejection**:
- Overkill for a simple API wrapper
- Adds JavaScript dependency for a straightforward task
- Shell script is more portable and has fewer dependencies
- Existing script already works well; needs enhancement, not replacement

## Open Questions

None - the requirements are well-defined and implementation is straightforward.

## References

- Existing `run.sh` script: `/run.sh`
- Project scripts directory: `/scripts/`
- Azure DALL-E API documentation: https://learn.microsoft.com/en-us/azure/ai-services/openai/dall-e-quickstart
- OpenSpec agents guide: `openspec/AGENTS.md`
- Existing build-scripts spec: `openspec/specs/build-scripts/spec.md`
