module.exports = {
  // Input OpenAPI specification
  path: "http://localhost:8000/api/openapi.json",

  // Output configuration
  output: "src/app/api-generated",
  name: "ApiClient.ts",

  // Templates and naming
  templates: "api-templates",
  "api-class-name": "ApiService",

  // Generation options - Enhanced for proper modularization
  modular: true,
  "module-name-first-tag": true,
  "module-name-index": 0, // Use first tag for module naming
  "add-readonly": false,
  "generate-client": true, // Enable client generation for service files
  "generate-route-types": false,
  "generate-responses": true,
  "to-js": false,
  "extract-enums": false,
  "single-http-client": false, // Generate separate service files per module
  "enum-names-as-values": false,
  "generate-union-enums": false,

  // Extract options
  "extract-request-params": true,
  "extract-request-body": true,
  "extract-response-body": true,
  "unwrap-response-data": true,

  // Cleanup and sorting
  "clean-output": false, // Handle cleanup manually in script
  "sort-types": true,

  // File extensions and naming
  "type-prefix": "",
  "type-suffix": "",
  "default-response-type": "void",

  // Custom template options
  "internal-template-options": {
    "add-util-required-keys-type": true,
    "export-original-types": false, // Set to false to keep original types internal
    "export-method-types-only": true, // Set to true to only export method-specific types
  },
};
