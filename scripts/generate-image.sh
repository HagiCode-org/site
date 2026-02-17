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

# Allowed parameter values
ALLOWED_SIZES=("1024x1024" "1792x1024" "1024x1792")
ALLOWED_QUALITIES=("low" "medium" "high" "auto")
ALLOWED_FORMATS=("png" "jpeg")

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

# Environment variables
AZURE_ENDPOINT=""
AZURE_API_KEY=""

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
    -v, --verbose         Enable detailed debug logging
    -h, --help            Display this help message

ENVIRONMENT VARIABLES:
    AZURE_ENDPOINT        Azure OpenAI API endpoint (loaded from .env)
    AZURE_API_KEY         Azure OpenAI API key (loaded from .env)

EXAMPLES:
    # Generate with default settings
    ./scripts/generate-image.sh --prompt "A red fox in autumn forest"

    # Generate with custom output path
    ./scripts/generate-image.sh --prompt "A sunset" --output ./assets/sunset.png

    # Generate wide image with high quality
    ./scripts/generate-image.sh --prompt "Ocean horizon" --size 1792x1024 --quality high

    # Generate JPEG format
    ./scripts/generate-image.sh --prompt "Abstract art" --format jpeg --output art.jpg

    # Generate with verbose logging
    ./scripts/generate-image.sh --prompt "Test image" --verbose

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

    # Validate prompt length
    if [ ${#PROMPT} -gt ${MAX_PROMPT_LENGTH} ]; then
        show_error \
            "Prompt too long" \
            "Prompt is ${#PROMPT} characters, exceeding the ${MAX_PROMPT_LENGTH} character limit." \
            "Shorten your prompt to ${MAX_PROMPT_LENGTH} characters or less."
        return 1
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

    # Validate user parameters
    if ! validate_parameters; then
        exit 1
    fi

    # Generate the image
    if ! generate_image; then
        exit_code=$?
        exit ${exit_code}
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
