## ADDED Requirements

### Requirement: Image Generation Batch Processing

The image generation script (`scripts/generate-image.sh`) SHALL support batch generation of multiple images from a JSON configuration file.

#### Scenario: Batch generate images from config file

**Given** a JSON configuration file exists with image generation parameters
**When** the script is executed with `--batch-config <file>` parameter
**Then** the script MUST read the configuration file
**And** the script MUST generate all images defined in the configuration
**And** the script MUST report success or failure for each image

#### Scenario: Batch config file format

**Given** a batch configuration file for image generation
**When** the configuration file is parsed
**Then** it MUST be valid JSON format
**And** it MUST contain an array of image configurations
**And** each configuration MUST include: prompt, output, size, quality, format
**And** each configuration MAY include: context, customPrompt, useBasePrompt

#### Scenario: Batch generation error handling

**Given** a batch configuration with multiple images
**When** one image generation fails
**Then** the script MUST continue generating remaining images
**And** the script MUST report which images failed
**And** the script MUST return non-zero exit code if any generation failed

### Requirement: Prompt Configuration Persistence

The image generation script SHALL support saving and loading complete prompt configurations to enable reproducible image generation.

#### Scenario: Save prompt configuration

**Given** an image is being generated with various prompt components
**When** the script is executed with `--save-prompt <path>` parameter
**Then** the script MUST save the complete prompt configuration to the specified path
**And** the configuration MUST include: basePrompt, context, customPrompt, userPrompt, finalPrompt
**And** the configuration MUST include: generationParams (size, quality, format)
**And** the configuration MUST include metadata: generatedAt, version

#### Scenario: Load and regenerate image

**Given** a previously saved prompt configuration file exists
**When** the script is executed with `--load-prompt <path>` parameter
**Then** the script MUST load the prompt configuration from the specified path
**And** the script MUST use the saved finalPrompt for image generation
**And** the script MUST use the saved generationParams
**And** the script MUST generate an image with identical parameters

#### Scenario: Prompt configuration file format

**Given** a saved prompt configuration file
**When** the file is read
**Then** it MUST be valid JSON format
**And** it MUST contain a `_comment` field describing the configuration purpose
**And** it MUST contain all prompt components that were used
**And** it MUST contain generation parameters used

### Requirement: Product Overview Illustration Workflow

The project SHALL provide convenient npm scripts for generating and regenerating all product overview document illustrations.

#### Scenario: Generate all product overview images

**Given** the batch configuration file for product overview images exists
**When** `npm run generate:product-images` is executed
**Then** the script MUST generate all 12 product overview illustrations
**And** the script MUST save prompt configurations for each image
**And** the script MUST place images in the correct documentation directories

#### Scenario: Regenerate product overview images

**Given** prompt configuration files exist for all product overview images
**When** `npm run regenerate:product-images` is executed
**Then** the script MUST load each saved prompt configuration
**And** the script MUST regenerate each image using the saved parameters
**And** the script MUST overwrite existing images with new versions

#### Scenario: Product overview image organization

**Given** product overview illustrations are being generated
**When** images and configurations are saved
**Then** each image MUST have its own directory under `apps/docs/src/content/docs/img/product-overview/`
**And** each directory MUST contain: `prompt.json` and `illustration.png`
**And** directory names MUST follow kebab-case convention (e.g., `value-proposition-proposal-driven`)

### Requirement: Image Prompt Configuration Management

The system SHALL maintain a structured directory for prompt configurations to enable image reproducibility and style updates.

#### Scenario: Prompt configuration directory structure

**Given** the product overview illustrations directory structure
**When** prompt configurations are saved
**Then** each illustration MUST have a dedicated subdirectory
**And** the subdirectory name MUST reflect the illustration's purpose
**And** each subdirectory MUST contain `prompt.json` with complete configuration
**And** each subdirectory MUST contain `illustration.png` with the generated image

#### Scenario: Traceable prompt configurations

**Given** a generated illustration in the documentation
**When** a reviewer needs to understand how the image was generated
**Then** the corresponding `prompt.json` file MUST exist in the same directory
**And** the file MUST contain the exact prompt used for generation
**And** the file MUST contain generation parameters and timestamp
**And** the file MAY contain a descriptive comment explaining the illustration's purpose

#### Scenario: Batch style updates

**Given** multiple illustrations with saved prompt configurations
**When** the base prompt style needs to be updated
**Then** the system CAN use `npm run regenerate:product-images`
**And** the system MAY update `scripts/image-base-prompt.json` first
**And** regenerating will apply the new base prompt to all images
