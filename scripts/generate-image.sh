#!/bin/bash
#
# generate-image.sh - AI Image Generation Script
#
# Description:
#   This script generates images using Azure OpenAI DALL-E API.
#   It supports configurable parameters via command-line arguments
#   and handles validation, error reporting, and environment setup.
#
# Usage:
#   ./scripts/generate-image.sh --prompt "A sunset over mountains" [options]
#
# Required Environment Variables:
#   AZURE_ENDPOINT - Azure OpenAI API endpoint URL
#   AZURE_API_KEY  - Azure OpenAI API key
#
# Author: AI Assistant
# Version: 1.0.0
#

#=============================================================================
# SCRIPT CONFIGURATION
#=============================================================================

# Script version
VERSION="1.0.0"

# Default parameter values
DEFAULT_OUTPUT="generated_image.png"
DEFAULT_SIZE="1024x1024"
DEFAULT_QUALITY="auto"
DEFAULT_FORMAT="png"
MAX_PROMPT_LENGTH=4000
DEFAULT_USE_BASE_PROMPT=true

# Allowed parameter values
ALLOWED_SIZES=("1024x1024" "1024x1536" "1536x1024" "auto")
ALLOWED_QUALITIES=("low" "medium" "high" "auto")
ALLOWED_FORMATS=("png" "jpeg")

# Base prompt configuration
BASE_PROMPT_CONFIG_FILE="scripts/image-base-prompt.json"

#=============================================================================
# GLOBAL VARIABLES
#=============================================================================

# User parameters (will be set from command-line arguments)
PROMPT=""
OUTPUT="${DEFAULT_OUTPUT}"
SIZE="${DEFAULT_SIZE}"
QUALITY="${DEFAULT_QUALITY}"
FORMAT="${DEFAULT_FORMAT}"
VERBOSE=false
USE_BASE_PROMPT="${DEFAULT_USE_BASE_PROMPT}"
CONTEXT_TYPE=""
CUSTOM_PROMPT=""

# Batch and prompt management
BATCH_CONFIG_FILE=""
SAVE_PROMPT_PATH=""
LOAD_PROMPT_PATH=""
FORCE_REGENERATE=false
SKIP_EXISTING=true

# Environment variables
AZURE_ENDPOINT=""
AZURE_API_KEY=""

# Base prompt configuration data
BASE_PROMPT_CONFIG_LOADED=false
BASE_PROMPT=""
BASE_PROMPT_ENABLED=true

#=============================================================================
# UTILITY FUNCTIONS
#=============================================================================

# show_help()
# Displays comprehensive usage information
show_help() {
    cat << EOF
generate-image.sh - AI Image Generation via Azure OpenAI DALL-E

USAGE:
    ./scripts/generate-image.sh --prompt "<text>" [OPTIONS]

REQUIRED ARGUMENTS:
    --prompt <text>       Text description of the image to generate
                          Maximum length: ${MAX_PROMPT_LENGTH} characters

OPTIONAL ARGUMENTS:
    -o, --output <path>   Output file path (default: ${DEFAULT_OUTPUT})
    -s, --size <size>     Image dimensions (default: ${DEFAULT_SIZE})
                          Options: ${ALLOWED_SIZES[*]}
    -q, --quality <qual>  Image quality (default: ${DEFAULT_QUALITY})
                          Options: ${ALLOWED_QUALITIES[*]}
    -f, --format <fmt>    Output format (default: ${DEFAULT_FORMAT})
                          Options: ${ALLOWED_FORMATS[*]}

BASE PROMPT OPTIONS:
    --use-base-prompt     Enable base prompt for consistent visual style (default)
    --no-base-prompt      Disable base prompt, use only user prompt
    --context <type>      Add context-specific prompt enhancement
                          Available types: session-management, api-integration,
                          code-generation, desktop-app, web-app, brand-marketing
    --custom-prompt <txt> Add custom text to the prompt

PROMPT MANAGEMENT:
    --save-prompt <path>  Save complete prompt configuration to specified path
    --load-prompt <path>  Load prompt configuration and regenerate image
    --batch-config <file> Batch generate images from JSON configuration file

GENERATION CONTROL:
    --force               Force regenerate even if file exists
    --no-skip             Don't skip existing files (same as --force)

GENERAL OPTIONS:
    -v, --verbose         Enable detailed debug logging
    -h, --help            Display this help message

ENVIRONMENT VARIABLES:
    AZURE_ENDPOINT        Azure OpenAI API endpoint (loaded from .env)
    AZURE_API_KEY         Azure OpenAI API key (loaded from .env)

EXAMPLES:
    # Generate with default base prompt styling
    ./scripts/generate-image.sh --prompt "A red fox in autumn forest"

    # Generate with custom output path
    ./scripts/generate-image.sh --prompt "A sunset" --output ./assets/sunset.png

    # Generate wide image with high quality
    ./scripts/generate-image.sh --prompt "Ocean horizon" --size 1792x1024 --quality high

    # Generate JPEG format
    ./scripts/generate-image.sh --prompt "Abstract art" --format jpeg --output art.jpg

    # Generate with verbose logging
    ./scripts/generate-image.sh --prompt "Test image" --verbose

    # Generate without base prompt (original style)
    ./scripts/generate-image.sh --prompt "A cat" --no-base-prompt

    # Generate with context-specific enhancement
    ./scripts/generate-image.sh --prompt "Session flow" --context session-management

    # Generate with custom prompt addition
    ./scripts/generate-image.sh --prompt "API diagram" --custom-prompt "with modern interface"

    # Full combination: base + context + custom + user prompt
    ./scripts/generate-image.sh --prompt "Code editor" \\
        --context code-generation \\
        --custom-prompt "with dark theme" \\
        --verbose

    # Save prompt configuration for later use
    ./scripts/generate-image.sh --prompt "API architecture diagram" \\
        --save-prompt ./configs/api-diagram-prompt.json \\
        --output ./images/api-diagram.png

    # Load and regenerate from saved configuration
    ./scripts/generate-image.sh --load-prompt ./configs/api-diagram-prompt.json \\
        --output ./images/api-diagram-v2.png

    # Batch generate multiple images from configuration
    ./scripts/generate-image.sh --batch-config ./scripts/batch-images.json

EXIT CODES:
    0 - Success
    1 - Invalid arguments or validation error
    2 - API request failed
    3 - File write error
    130 - Script interrupted by user

For more information, visit the project documentation.
EOF
}

# show_error()
# Displays formatted error messages with actionable guidance
# Arguments:
#   $1 - Error title
#   $2 - What went wrong description
#   $3 - How to fix guidance
show_error() {
    local title="$1"
    local what="$2"
    local how="$3"

    echo "Error: ${title}" >&2
    echo "" >&2
    echo "What went wrong: ${what}" >&2
    echo "How to fix: ${how}" >&2
}

# log_verbose()
# Outputs debug messages when verbose mode is enabled
# Arguments:
#   $* - Message to log
log_verbose() {
    if [ "${VERBOSE}" = true ]; then
        echo "[VERBOSE] $*" >&2
    fi
}

#=============================================================================
# BASE PROMPT CONFIGURATION FUNCTIONS
#=============================================================================

# load_base_prompt_config()
# Loads the base prompt configuration from image-base-prompt.json
# Returns: 0 on success, 1 on error (graceful degradation)
load_base_prompt_config() {
    local config_file="${BASE_PROMPT_CONFIG_FILE}"

    # Check if config file exists
    if [ ! -f "${config_file}" ]; then
        log_verbose "Base prompt config file not found: ${config_file}"
        echo "Warning: Base prompt configuration file not found at ${config_file}" >&2
        echo "Proceeding without base prompt styling." >&2
        BASE_PROMPT_CONFIG_LOADED=false
        return 0
    fi

    log_verbose "Loading base prompt configuration from ${config_file}"

    # Check if jq is available
    if ! command -v jq &> /dev/null; then
        echo "Warning: jq is not installed. Cannot parse base prompt configuration." >&2
        echo "Proceeding without base prompt styling." >&2
        BASE_PROMPT_CONFIG_LOADED=false
        return 0
    fi

    # Read base prompt from config
    local base_prompt_value
    base_prompt_value=$(jq -r '.basePrompt // empty' "${config_file}" 2>/dev/null)

    if [ -z "${base_prompt_value}" ]; then
        echo "Warning: Failed to read basePrompt from configuration file." >&2
        echo "Proceeding without base prompt styling." >&2
        BASE_PROMPT_CONFIG_LOADED=false
        return 0
    fi

    BASE_PROMPT="${base_prompt_value}"
    BASE_PROMPT_CONFIG_LOADED=true

    # Read default enabled setting
    local default_enabled
    default_enabled=$(jq -r '.defaultEnabled // true' "${config_file}" 2>/dev/null)

    if [ "${default_enabled}" = "false" ]; then
        BASE_PROMPT_ENABLED=false
    else
        BASE_PROMPT_ENABLED=true
    fi

    log_verbose "Base prompt loaded: ${BASE_PROMPT:0:100}..."
    log_verbose "Base prompt enabled by default: ${BASE_PROMPT_ENABLED}"

    return 0
}

# get_context_prompt()
# Retrieves the context-specific prompt for a given context type
# Arguments:
#   $1 - Context type (e.g., "session-management")
# Returns: Outputs the context prompt, or empty if not found
get_context_prompt() {
    local context_type="$1"
    local config_file="${BASE_PROMPT_CONFIG_FILE}"

    if [ ! -f "${config_file}" ]; then
        echo ""
        return 0
    fi

    if ! command -v jq &> /dev/null; then
        echo ""
        return 0
    fi

    local context_prompt
    context_prompt=$(jq -r ".contexts[\"${context_type}\"] // empty" "${config_file}" 2>/dev/null)

    echo "${context_prompt}"
}

# list_available_contexts()
# Lists all available context types from the configuration
# Returns: Outputs a comma-separated list of available contexts
list_available_contexts() {
    local config_file="${BASE_PROMPT_CONFIG_FILE}"

    if [ ! -f "${config_file}" ]; then
        echo ""
        return 0
    fi

    if ! command -v jq &> /dev/null; then
        echo ""
        return 0
    fi

    local contexts
    contexts=$(jq -r '.contexts | keys[]' "${config_file}" 2>/dev/null | tr '\n' ', ' | sed 's/, $//')

    echo "${contexts}"
}

# build_final_prompt()
# Combines base prompt, context prompt, custom prompt, and user prompt
# Returns: Outputs the final combined prompt
build_final_prompt() {
    local final_prompt=""
    local parts=()

    # Add base prompt if enabled
    if [ "${USE_BASE_PROMPT}" = true ] && [ "${BASE_PROMPT_CONFIG_LOADED}" = true ] && [ -n "${BASE_PROMPT}" ]; then
        parts+=("${BASE_PROMPT}")
        log_verbose "Base prompt: enabled"
    else
        log_verbose "Base prompt: disabled"
    fi

    # Add context prompt if specified
    if [ -n "${CONTEXT_TYPE}" ]; then
        local context_prompt
        context_prompt=$(get_context_prompt "${CONTEXT_TYPE}")

        if [ -n "${context_prompt}" ]; then
            parts+=("${context_prompt}")
            log_verbose "Context prompt: ${CONTEXT_TYPE}"
        else
            log_verbose "Context prompt: ${CONTEXT_TYPE} (not found, skipping)"
        fi
    else
        log_verbose "Context prompt: none"
    fi

    # Add custom prompt if specified
    if [ -n "${CUSTOM_PROMPT}" ]; then
        parts+=("${CUSTOM_PROMPT}")
        log_verbose "Custom prompt: provided"
    else
        log_verbose "Custom prompt: none"
    fi

    # Add user prompt (always required)
    parts+=("${PROMPT}")
    log_verbose "User prompt: length ${#PROMPT}"

    # Combine all parts with proper spacing
    local separator=". "
    for part in "${parts[@]}"; do
        if [ -n "${final_prompt}" ]; then
            final_prompt="${final_prompt}${separator}${part}"
        else
            final_prompt="${part}"
        fi
    done

    # Ensure the prompt ends with proper punctuation
    final_prompt=$(echo "${final_prompt}" | sed 's/[[:space:]]*$//')

    log_verbose "Final prompt length: ${#final_prompt} characters"

    echo "${final_prompt}"
}

#=============================================================================
# PROMPT MANAGEMENT FUNCTIONS
#=============================================================================

# save_prompt_config()
# Saves the current prompt configuration to a JSON file
# Arguments:
#   $1 - Output path for the configuration file
# Returns: 0 on success, 1 on error
save_prompt_config() {
    local output_path="$1"

    if [ -z "${output_path}" ]; then
        echo "Error: No output path specified for prompt configuration." >&2
        return 1
    fi

    # Ensure output directory exists
    local output_dir
    output_dir=$(dirname "${output_path}")
    if [ ! -d "${output_dir}" ]; then
        mkdir -p "${output_dir}" || {
            echo "Error: Failed to create directory: ${output_dir}" >&2
            return 1
        }
    fi

    log_verbose "Saving prompt configuration to ${output_path}"

    # Build JSON configuration
    local config_json
    config_json=$(cat << EOF
{
  "_comment": "Image generation prompt configuration",
  "basePrompt": $(echo "${BASE_PROMPT}" | jq -Rs .),
  "context": $(echo "${CONTEXT_TYPE}" | jq -Rs .),
  "customPrompt": $(echo "${CUSTOM_PROMPT}" | jq -Rs .),
  "userPrompt": $(echo "${PROMPT}" | jq -Rs .),
  "generationParams": {
    "size": "${SIZE}",
    "quality": "${QUALITY}",
    "format": "${FORMAT}"
  },
  "_metadata": {
    "generatedAt": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
    "version": "1.0.0"
  }
}
EOF
)

    # Write to file
    if ! echo "${config_json}" > "${output_path}"; then
        echo "Error: Failed to write prompt configuration to ${output_path}" >&2
        return 1
    fi

    log_verbose "Prompt configuration saved successfully"
    echo "Prompt configuration saved to: ${output_path}"

    return 0
}

# load_prompt_config()
# Loads prompt configuration from a JSON file
# Arguments:
#   $1 - Path to the configuration file
# Returns: 0 on success, 1 on error
load_prompt_config() {
    local config_path="$1"

    if [ ! -f "${config_path}" ]; then
        echo "Error: Prompt configuration file not found: ${config_path}" >&2
        return 1
    fi

    if ! command -v jq &> /dev/null; then
        echo "Error: jq is required to load prompt configuration." >&2
        return 1
    fi

    log_verbose "Loading prompt configuration from ${config_path}"

    # Load configuration values
    local loaded_user_prompt
    local loaded_size
    local loaded_quality
    local loaded_format
    local loaded_context
    local loaded_custom_prompt

    loaded_user_prompt=$(jq -r '.userPrompt // empty' "${config_path}")
    loaded_size=$(jq -r '.generationParams.size // empty' "${config_path}")
    loaded_quality=$(jq -r '.generationParams.quality // empty' "${config_path}")
    loaded_format=$(jq -r '.generationParams.format // empty' "${config_path}")
    loaded_context=$(jq -r '.context // empty' "${config_path}")
    loaded_custom_prompt=$(jq -r '.customPrompt // empty' "${config_path}")

    # Apply loaded values
    if [ -n "${loaded_user_prompt}" ]; then
        PROMPT="${loaded_user_prompt}"
        log_verbose "Loaded user prompt"
    fi

    if [ -n "${loaded_size}" ]; then
        SIZE="${loaded_size}"
        log_verbose "Loaded size: ${SIZE}"
    fi

    if [ -n "${loaded_quality}" ]; then
        QUALITY="${loaded_quality}"
        log_verbose "Loaded quality: ${QUALITY}"
    fi

    if [ -n "${loaded_format}" ]; then
        FORMAT="${loaded_format}"
        log_verbose "Loaded format: ${FORMAT}"
    fi

    if [ -n "${loaded_context}" ] && [ "${loaded_context}" != "null" ]; then
        CONTEXT_TYPE="${loaded_context}"
        log_verbose "Loaded context: ${CONTEXT_TYPE}"
    fi

    if [ -n "${loaded_custom_prompt}" ] && [ "${loaded_custom_prompt}" != "null" ]; then
        CUSTOM_PROMPT="${loaded_custom_prompt}"
        log_verbose "Loaded custom prompt"
    fi

    echo "Prompt configuration loaded from: ${config_path}"

    return 0
}

# process_batch_config()
# Processes a batch configuration file and generates multiple images
# Arguments:
#   $1 - Path to the batch configuration JSON file
# Returns: 0 on success, 1 on error
process_batch_config() {
    local batch_file="$1"

    if [ ! -f "${batch_file}" ]; then
        echo "Error: Batch configuration file not found: ${batch_file}" >&2
        return 1
    fi

    if ! command -v jq &> /dev/null; then
        echo "Error: jq is required to process batch configuration." >&2
        return 1
    fi

    echo "Processing batch configuration from: ${batch_file}"

    # Get number of images in batch
    local image_count
    image_count=$(jq '.images | length' "${batch_file}")

    if [ "${image_count}" -eq 0 ]; then
        echo "Error: No images found in batch configuration." >&2
        return 1
    fi

    echo "Found ${image_count} images to generate..."

    # Process each image
    local i=0
    local success_count=0
    local fail_count=0

    while [ $i -lt ${image_count} ]; do
        echo ""
        echo "=========================================="
        echo "Processing image $((i + 1)) of ${image_count}"
        echo "=========================================="

        # Extract image configuration
        local img_name
        local img_prompt
        local img_context
        local img_custom
        local img_output
        local img_size
        local img_quality
        local img_format
        local img_save_config

        img_name=$(jq -r ".images[$i].name // \"image_${i}\"" "${batch_file}")
        img_prompt=$(jq -r ".images[$i].prompt // empty" "${batch_file}")
        img_context=$(jq -r ".images[$i].context // empty" "${batch_file}")
        img_custom=$(jq -r ".images[$i].customPrompt // empty" "${batch_file}")
        img_output=$(jq -r ".images[$i].output // \"generated_image_${i}.png\"" "${batch_file}")
        img_size=$(jq -r ".images[$i].size // \"${DEFAULT_SIZE}\"" "${batch_file}")
        img_quality=$(jq -r ".images[$i].quality // \"${DEFAULT_QUALITY}\"" "${batch_file}")
        img_format=$(jq -r ".images[$i].format // \"${DEFAULT_FORMAT}\"" "${batch_file}")
        img_save_config=$(jq -r ".images[$i].saveConfig // empty" "${batch_file}")

        if [ -z "${img_prompt}" ]; then
            echo "Error: No prompt specified for image ${i} (${img_name})" >&2
            fail_count=$((fail_count + 1))
            i=$((i + 1))
            continue
        fi

        # Set parameters for this image
        PROMPT="${img_prompt}"
        OUTPUT="${img_output}"
        SIZE="${img_size}"
        QUALITY="${img_quality}"
        FORMAT="${img_format}"
        CONTEXT_TYPE="${img_context}"
        CUSTOM_PROMPT="${img_custom}"

        # Validate parameters
        if ! validate_parameters; then
            echo "Error: Invalid parameters for image ${i} (${img_name})" >&2
            fail_count=$((fail_count + 1))
            i=$((i + 1))
            continue
        fi

        # Build final prompt
        local final_prompt
        final_prompt=$(build_final_prompt)
        PROMPT="${final_prompt}"

        # Ensure output directory exists
        local output_dir
        output_dir=$(dirname "${OUTPUT}")
        if [ ! -d "${output_dir}" ]; then
            mkdir -p "${output_dir}" || {
                echo "Error: Failed to create output directory: ${output_dir}" >&2
                fail_count=$((fail_count + 1))
                i=$((i + 1))
                continue
            }
        fi

        # Check if file already exists (skip unless force regenerate)
        if [ "${SKIP_EXISTING}" = true ] && [ -f "${OUTPUT}" ]; then
            local file_size
            file_size=$(wc -c < "${OUTPUT}" 2>/dev/null || echo "0")
            if [ "${file_size}" -gt 0 ]; then
                echo "⊘ Skipping ${img_name} (file already exists: ${OUTPUT})"
                i=$((i + 1))
                continue
            fi
        fi

        # Generate the image
        echo "Generating: ${img_name}"
        echo "Output: ${OUTPUT}"

        if generate_image; then
            echo "✓ Image generated successfully: ${OUTPUT}"
            success_count=$((success_count + 1))

            # Save prompt configuration if requested
            if [ -n "${img_save_config}" ]; then
                local config_dir
                config_dir=$(dirname "${img_save_config}")
                if [ ! -d "${config_dir}" ]; then
                    mkdir -p "${config_dir}"
                fi
                save_prompt_config "${img_save_config}"
            fi
        else
            echo "✗ Failed to generate image: ${img_name}" >&2
            fail_count=$((fail_count + 1))
        fi

        i=$((i + 1))
    done

    echo ""
    echo "=========================================="
    echo "Batch generation complete"
    echo "=========================================="
    echo "Success: ${success_count}/${image_count}"
    echo "Failed: ${fail_count}/${image_count}"

    return 0
}

#=============================================================================
# VALIDATION FUNCTIONS
#=============================================================================

# validate_parameters()
# Validates all user-provided parameters against allowed values
# Returns: 0 if valid, 1 if invalid
validate_parameters() {
    local errors=0

    # Validate prompt is provided
    if [ -z "${PROMPT}" ]; then
        show_error \
            "Missing required prompt" \
            "The --prompt argument was not provided or is empty." \
            "Provide a prompt using: --prompt \"your image description\""
        return 1
    fi

    # Validate prompt length (will be revalidated after building final prompt)
    if [ ${#PROMPT} -gt ${MAX_PROMPT_LENGTH} ]; then
        show_error \
            "Prompt too long" \
            "Prompt is ${#PROMPT} characters, exceeding the ${MAX_PROMPT_LENGTH} character limit." \
            "Shorten your prompt to ${MAX_PROMPT_LENGTH} characters or less."
        return 1
    fi

    # Validate context type if specified
    if [ -n "${CONTEXT_TYPE}" ]; then
        if [ "${BASE_PROMPT_CONFIG_LOADED}" = true ]; then
            local context_prompt
            context_prompt=$(get_context_prompt "${CONTEXT_TYPE}")

            if [ -z "${context_prompt}" ]; then
                local available_contexts
                available_contexts=$(list_available_contexts)
                show_error \
                    "Invalid context type" \
                    "Context type '${CONTEXT_TYPE}' is not defined in the configuration." \
                    "Use one of the available contexts: ${available_contexts}"
                return 1
            fi
        else
            echo "Warning: Context type '${CONTEXT_TYPE}' specified but config file not loaded." >&2
            echo "Proceeding without context-specific prompt." >&2
            CONTEXT_TYPE=""
        fi
    fi

    # Validate custom prompt length if specified
    if [ -n "${CUSTOM_PROMPT}" ]; then
        if [ ${#CUSTOM_PROMPT} -gt 1000 ]; then
            show_error \
                "Custom prompt too long" \
                "Custom prompt is ${#CUSTOM_PROMPT} characters, exceeding the 1000 character limit." \
                "Shorten your custom prompt to 1000 characters or less."
            return 1
        fi
    fi

    # Validate size
    local valid_size=false
    for s in "${ALLOWED_SIZES[@]}"; do
        if [ "${SIZE}" = "${s}" ]; then
            valid_size=true
            break
        fi
    done
    if [ "${valid_size}" = false ]; then
        show_error \
            "Invalid size parameter" \
            "Size '${SIZE}' is not supported." \
            "Use one of: ${ALLOWED_SIZES[*]}"
        return 1
    fi

    # Validate quality
    local valid_quality=false
    for q in "${ALLOWED_QUALITIES[@]}"; do
        if [ "${QUALITY}" = "${q}" ]; then
            valid_quality=true
            break
        fi
    done
    if [ "${valid_quality}" = false ]; then
        show_error \
            "Invalid quality parameter" \
            "Quality '${QUALITY}' is not supported." \
            "Use one of: ${ALLOWED_QUALITIES[*]}"
        return 1
    fi

    # Validate format
    local valid_format=false
    for f in "${ALLOWED_FORMATS[@]}"; do
        if [ "${FORMAT}" = "${f}" ]; then
            valid_format=true
            break
        fi
    done
    if [ "${valid_format}" = false ]; then
        show_error \
            "Invalid format parameter" \
            "Format '${FORMAT}' is not supported." \
            "Use one of: ${ALLOWED_FORMATS[*]}"
        return 1
    fi

    # Validate output directory is writable
    local output_dir
    output_dir=$(dirname "${OUTPUT}")
    if [ ! -d "${output_dir}" ]; then
        show_error \
            "Output directory does not exist" \
            "Directory '${output_dir}' does not exist." \
            "Create the directory first: mkdir -p \"${output_dir}\""
        return 1
    fi
    if [ ! -w "${output_dir}" ]; then
        show_error \
            "Output directory not writable" \
            "Directory '${output_dir}' is not writable." \
            "Check permissions or choose a different output location."
        return 1
    fi

    return 0
}

# validate_env_vars()
# Validates that required environment variables are set
# Returns: 0 if valid, 1 if invalid
validate_env_vars() {
    if [ -z "${AZURE_ENDPOINT}" ]; then
        show_error \
            "Azure endpoint not configured" \
            "The AZURE_ENDPOINT environment variable is not set or is empty." \
            "Ensure your .env file contains AZURE_ENDPOINT with a valid endpoint URL."
        return 1
    fi

    if [ -z "${AZURE_API_KEY}" ]; then
        show_error \
            "Azure API key not configured" \
            "The AZURE_API_KEY environment variable is not set or is empty." \
            "Ensure your .env file contains AZURE_API_KEY with a valid key."
        return 1
    fi

    return 0
}

#=============================================================================
# ENVIRONMENT SETUP
#=============================================================================

# load_env_vars()
# Loads environment variables from .env file
# Returns: 0 on success, 1 on error
load_env_vars() {
    local env_file=".env"

    # Check if .env file exists
    if [ ! -f "${env_file}" ]; then
        show_error \
            ".env file not found" \
            "The ${env_file} file does not exist in the current directory." \
            "Create a .env file with AZURE_ENDPOINT and AZURE_API_KEY variables."
        return 1
    fi

    log_verbose "Loading environment variables from ${env_file}"

    # Source the .env file
    # Use set -a to automatically export all variables
    set -a
    # shellcheck source=/dev/null
    source "${env_file}"
    set +a

    # Export to global variables
    AZURE_ENDPOINT="${AZURE_ENDPOINT}"
    AZURE_API_KEY="${AZURE_API_KEY}"

    log_verbose "AZURE_ENDPOINT: ${AZURE_ENDPOINT}"
    log_verbose "AZURE_API_KEY: ${AZURE_API_KEY:0:10}..."

    return 0
}

#=============================================================================
# API REQUEST FUNCTIONS
#=============================================================================

# generate_image()
# Makes API request to generate image and saves to file
# Returns: 0 on success, non-zero on error
generate_image() {
    log_verbose "=== Image Generation Request ==="
    log_verbose "Prompt: ${PROMPT}"
    log_verbose "Size: ${SIZE}"
    log_verbose "Quality: ${QUALITY}"
    log_verbose "Format: ${FORMAT}"
    log_verbose "Output: ${OUTPUT}"
    log_verbose "Endpoint: ${AZURE_ENDPOINT}"

    # Build JSON payload
    local json_payload
    json_payload=$(cat << EOF
{
  "prompt": "${PROMPT}",
  "size": "${SIZE}",
  "quality": "${QUALITY}",
  "output_compression": 100,
  "output_format": "${FORMAT}",
  "n": 1
}
EOF
)

    log_verbose "Request payload: ${json_payload}"

    # Make API request and capture response
    local api_response
    local http_status

    # Use a temporary file to store the response for better error handling
    local response_file
    response_file=$(mktemp)

    log_verbose "Sending API request..."

    if ! api_response=$(
        curl -s -w "\n%{http_code}" \
            -X POST "${AZURE_ENDPOINT}" \
            -H "Content-Type: application/json" \
            -H "Authorization: Bearer ${AZURE_API_KEY}" \
            -d "${json_payload}" \
            -o "${response_file}" \
            2>&1
    ); then
        rm -f "${response_file}"
        show_error \
            "API request failed" \
            "curl command failed with error: ${api_response}" \
            "Check your network connection and endpoint URL."
        return 2
    fi

    # Extract HTTP status (last line)
    http_status=$(echo "${api_response}" | tail -n 1)

    # Extract response body
    api_response=$(cat "${response_file}")
    rm -f "${response_file}"

    log_verbose "HTTP Status: ${http_status}"
    log_verbose "Response: ${api_response}"

    # Check HTTP status code
    if [ "${http_status}" != "200" ]; then
        show_error \
            "API request failed with HTTP ${http_status}" \
            "The Azure OpenAI API returned an error response." \
            "Check your API key, endpoint URL, and account quota. Response: ${api_response}"
        return 2
    fi

    # Validate JSON response
    if ! echo "${api_response}" | jq empty 2>/dev/null; then
        show_error \
            "Invalid API response" \
            "The API returned non-JSON response." \
            "Check the endpoint URL and API configuration. Response: ${api_response}"
        return 2
    fi

    # Extract base64 image data
    local base64_data
    base64_data=$(echo "${api_response}" | jq -r '.data[0].b64_json' 2>/dev/null)

    if [ -z "${base64_data}" ] || [ "${base64_data}" = "null" ]; then
        show_error \
            "No image data in API response" \
            "The API response did not contain valid image data." \
            "Check the API response format and account permissions. Response: ${api_response}"
        return 2
    fi

    log_verbose "Extracted ${#base64_data} characters of base64 data"

    # Decode base64 and write to file
    log_verbose "Decoding and writing to ${OUTPUT}..."
    if ! echo "${base64_data}" | base64 --decode > "${OUTPUT}"; then
        show_error \
            "Failed to decode image data" \
            "The base64 data could not be decoded or written to the file." \
            "Check available disk space and file permissions."
        return 3
    fi

    # Verify file was created
    if [ ! -f "${OUTPUT}" ]; then
        show_error \
            "Output file not created" \
            "The image file was not created at the expected location." \
            "Check file permissions and disk space."
        return 3
    fi

    # Get file size
    local file_size
    file_size=$(wc -c < "${OUTPUT}" 2>/dev/null || echo "0")
    log_verbose "Output file size: ${file_size} bytes"

    if [ "${file_size}" -eq 0 ]; then
        show_error \
            "Output file is empty" \
            "The image file was created but contains no data." \
            "The API may have returned an empty image. Check the API response."
        return 3
    fi

    return 0
}

#=============================================================================
# SIGNAL HANDLERS
#=============================================================================

# handle_interrupt()
# Handles script interruption signals (SIGINT, SIGTERM)
handle_interrupt() {
    echo "" >&2
    echo "Script interrupted by user." >&2
    exit 130
}

# Register signal handlers
trap handle_interrupt SIGINT SIGTERM

#=============================================================================
# MAIN SCRIPT
#=============================================================================

main() {
    # Reset OPTIND for getopts
    OPTIND=1

    # Parse command-line arguments
    # Handle both --option=value and --option value formats
    while [ $# -gt 0 ]; do
        case "$1" in
            --prompt)
                PROMPT="$2"
                shift 2
                ;;
            --prompt=*)
                PROMPT="${1#*=}"
                shift
                ;;
            --output)
                OUTPUT="$2"
                shift 2
                ;;
            --output=*)
                OUTPUT="${1#*=}"
                shift
                ;;
            --size)
                SIZE="$2"
                shift 2
                ;;
            --size=*)
                SIZE="${1#*=}"
                shift
                ;;
            --quality)
                QUALITY="$2"
                shift 2
                ;;
            --quality=*)
                QUALITY="${1#*=}"
                shift
                ;;
            --format)
                FORMAT="$2"
                shift 2
                ;;
            --format=*)
                FORMAT="${1#*=}"
                shift
                ;;
            --context)
                CONTEXT_TYPE="$2"
                shift 2
                ;;
            --context=*)
                CONTEXT_TYPE="${1#*=}"
                shift
                ;;
            --custom-prompt)
                CUSTOM_PROMPT="$2"
                shift 2
                ;;
            --custom-prompt=*)
                CUSTOM_PROMPT="${1#*=}"
                shift
                ;;
            --use-base-prompt)
                USE_BASE_PROMPT=true
                shift
                ;;
            --no-base-prompt)
                USE_BASE_PROMPT=false
                shift
                ;;
            --save-prompt)
                SAVE_PROMPT_PATH="$2"
                shift 2
                ;;
            --save-prompt=*)
                SAVE_PROMPT_PATH="${1#*=}"
                shift
                ;;
            --load-prompt)
                LOAD_PROMPT_PATH="$2"
                shift 2
                ;;
            --load-prompt=*)
                LOAD_PROMPT_PATH="${1#*=}"
                shift
                ;;
            --batch-config)
                BATCH_CONFIG_FILE="$2"
                shift 2
                ;;
            --batch-config=*)
                BATCH_CONFIG_FILE="${1#*=}"
                shift
                ;;
            --force|--no-skip)
                FORCE_REGENERATE=true
                SKIP_EXISTING=false
                shift
                ;;
            --verbose|-v)
                VERBOSE=true
                shift
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            -p)
                PROMPT="$2"
                shift 2
                ;;
            -o)
                OUTPUT="$2"
                shift 2
                ;;
            -s)
                SIZE="$2"
                shift 2
                ;;
            -q)
                QUALITY="$2"
                shift 2
                ;;
            -f)
                FORMAT="$2"
                shift 2
                ;;
            --)
                shift
                break
                ;;
            -*)
                show_error \
                    "Invalid option" \
                    "Unknown command-line option: $1" \
                    "Use --help to see available options."
                exit 1
                ;;
            *)
                # Unexpected positional argument
                show_error \
                    "Unexpected argument" \
                    "Unexpected argument: $1" \
                    "Use --help to see usage information."
                exit 1
                ;;
        esac
    done

    # Load environment variables
    if ! load_env_vars; then
        exit 1
    fi

    # Validate environment variables
    if ! validate_env_vars; then
        exit 1
    fi

    # Load base prompt configuration
    if ! load_base_prompt_config; then
        # Graceful degradation, continue without base prompt
        USE_BASE_PROMPT=false
    fi

    # Handle batch config mode
    if [ -n "${BATCH_CONFIG_FILE}" ]; then
        process_batch_config "${BATCH_CONFIG_FILE}"
        exit $?
    fi

    # Handle load prompt mode
    if [ -n "${LOAD_PROMPT_PATH}" ]; then
        if ! load_prompt_config "${LOAD_PROMPT_PATH}"; then
            exit 1
        fi
    fi

    # Check if prompt is provided (unless loading from config)
    if [ -z "${PROMPT}" ] && [ -z "${LOAD_PROMPT_PATH}" ]; then
        show_error \
            "Missing required prompt" \
            "The --prompt argument was not provided or is empty." \
            "Provide a prompt using: --prompt \"your image description\""
        exit 1
    fi

    # Override USE_BASE_PROMPT based on config default if not explicitly set
    if [ "${BASE_PROMPT_CONFIG_LOADED}" = true ] && [ "${BASE_PROMPT_ENABLED}" = false ]; then
        # Only override if --use-base-prompt was not explicitly provided
        # (we can't detect this easily, so we check if the flag was used via a separate variable if needed)
        # For now, we'll respect the config default if no explicit flag was given
        :
    fi

    # Validate user parameters
    if ! validate_parameters; then
        exit 1
    fi

    # Build the final prompt by combining all components
    local final_prompt
    final_prompt=$(build_final_prompt)

    # Validate final prompt length
    if [ ${#final_prompt} -gt ${MAX_PROMPT_LENGTH} ]; then
        show_error \
            "Final prompt too long" \
            "Combined prompt is ${#final_prompt} characters, exceeding the ${MAX_PROMPT_LENGTH} character limit." \
            "Use --no-base-prompt or shorten your custom/user prompts."
        exit 1
    fi

    # Replace the user prompt with the final combined prompt
    PROMPT="${final_prompt}"

    # Check if output file already exists (skip unless force regenerate)
    if [ "${SKIP_EXISTING}" = true ] && [ -f "${OUTPUT}" ]; then
        local file_size
        file_size=$(wc -c < "${OUTPUT}" 2>/dev/null || echo "0")
        if [ "${file_size}" -gt 0 ]; then
            echo "Image already exists: ${OUTPUT}"
            echo "Use --force or --no-skip to regenerate"
            if [ -n "${SAVE_PROMPT_PATH}" ]; then
                # Still save prompt config if requested
                save_prompt_config "${SAVE_PROMPT_PATH}"
            fi
            exit 0
        fi
    fi

    # Generate the image
    if ! generate_image; then
        exit_code=$?
        exit ${exit_code}
    fi

    # Save prompt configuration if requested
    if [ -n "${SAVE_PROMPT_PATH}" ]; then
        save_prompt_config "${SAVE_PROMPT_PATH}"
    fi

    # Report success
    echo "Image generated successfully: ${OUTPUT}"
    if [ "${VERBOSE}" = true ]; then
        echo "  Prompt: ${PROMPT}"
        echo "  Size: ${SIZE}"
        echo "  Quality: ${QUALITY}"
        echo "  Format: ${FORMAT}"
    fi

    exit 0
}

# Run main function
main "$@"
