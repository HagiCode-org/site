# docusaurus-site Specification Delta

## ADDED Requirements

### Requirement: Homepage Video Player Component

The homepage MUST include a video player component that displays the product introduction video from `static/videos/intro` with appropriate loading optimization and responsive design.

#### Scenario: Video player displays on homepage

- **GIVEN** a user navigates to the homepage
- **WHEN** the page loads completely
- **THEN** a video player section SHALL be displayed between FeaturesShowcase and QuickStartSection
- **AND** the section SHALL include a title "产品介绍视频"
- **AND** the section SHALL include a description "快速了解 Hagicode 核心功能"
- **AND** a video player container SHALL be displayed

#### Scenario: Video player loads with poster image

- **GIVEN** the video player component is rendered
- **WHEN** the component first loads
- **THEN** a poster image SHALL be displayed in the video container
- **AND** the video file SHALL NOT be downloaded automatically
- **AND** only video metadata (duration, dimensions) SHALL be preloaded
- **AND** a play button overlay SHALL be visible on the poster

#### Scenario: User plays video

- **GIVEN** the video player is displaying the poster image
- **WHEN** a user clicks the play button or poster
- **THEN** the video file SHALL begin loading from `/videos/intro`
- **AND** a loading indicator SHALL be displayed during loading
- **AND** once loaded, the video SHALL begin playback automatically
- **AND** native video controls SHALL be visible (play/pause, progress, volume, fullscreen)

#### Scenario: Video player matches homepage design

- **GIVEN** the video player component is rendered
- **WHEN** comparing the video player to other homepage sections
- **THEN** the video player SHALL use the same gradient border effect as other cards
- **AND** the video player SHALL have the same border-radius (24px)
- **AND** the video player SHALL use the same shadow effects (`var(--pc-card-shadow)`)
- **AND** the section title SHALL use the same gradient text effect

#### Scenario: Video player is responsive

- **GIVEN** the video player is displayed
- **WHEN** viewed on different screen sizes
- **THEN** on desktop (>1024px) the video container SHALL have a max-width of 900px
- **AND** on tablet (768px-1024px) the video container SHALL have a max-width of 700px
- **AND** on mobile (<768px) the video container SHALL span the full width with 1rem padding
- **AND** the video SHALL maintain its aspect ratio at all screen sizes

#### Scenario: Video player handles loading errors

- **GIVEN** the video player is attempting to load the video file
- **WHEN** the video file fails to load (network error, 404, etc.)
- **THEN** an error message SHALL be displayed to the user
- **AND** the error message SHALL be in Chinese
- **AND** a retry button SHALL be provided
- **AND** the poster image SHALL remain visible

#### Scenario: Video player respects theme changes

- **GIVEN** a user is viewing the homepage
- **WHEN** the user switches between light and dark themes
- **THEN** the video player container SHALL update to match the new theme
- **AND** the video player SHALL use CSS variables for colors
- **AND** no hardcoded colors SHALL ignore theme settings

#### Scenario: Video player is accessible

- **GIVEN** the video player is displayed
- **WHEN** a user navigates using a keyboard
- **THEN** the video element SHALL be focusable
- **AND** native video controls SHALL be keyboard accessible
- **AND** the poster image SHALL have descriptive alt text
- **AND** the video SHALL have a title attribute describing the content
