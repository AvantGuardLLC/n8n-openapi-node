# Changes

## [Unreleased]

### Added
- Group optional parameters in collections: Required parameters are now displayed directly in the UI, while optional parameters are grouped under "Additional Query Parameters" and "Additional Body Fields" collections with "Add Field" functionality.

### Changed
- Modified the `parseFields` method in `OperationsCollector.ts` to separate parameters into required and optional groups.
- Required parameters are now shown directly in the UI.
- Optional query parameters are now grouped under an "Additional Query Parameters" collection field.
- Optional body fields are now grouped under an "Additional Body Fields" collection field.
- Added tests to verify this behavior.

### Benefits
- Cleaner UI with only required parameters shown by default.
- All optional parameters remain accessible through the "Add Field" functionality.
- Better organization of parameters based on importance.
- Maintains all the routing information and parameter types correctly.

## Usage
When generating n8n node properties from OpenAPI specifications:
- Only required parameters will be shown by default in the n8n UI.
- Optional parameters will be available through "Additional Query Parameters" or "Additional Body Fields" sections.
- Users can click "Add Field" to select and configure optional parameters as needed. 