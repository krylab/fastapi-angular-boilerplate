const fs = require("fs");
const path = require("path");
const { generateApi } = require("swagger-typescript-api");

// Load configuration from generate-api.config.js
function loadConfig() {
  const configPath = path.join(__dirname, "../generate-api.config.js");

  if (!fs.existsSync(configPath)) {
    throw new Error(`Configuration file not found: ${configPath}`);
  }

  // Clear require cache to ensure fresh config load
  delete require.cache[require.resolve(configPath)];
  return require(configPath);
}

// Cleaning functionality from the original clean script
const PATTERNS_TO_REMOVE = [
  /^\/\* eslint-disable \*\/\n/gm,
  /^\/\* tslint:disable \*\/\n/gm,
  /^\/\/ @ts-nocheck\n/gm,
  /^\/\* eslint-disable \*\/$/gm,
  /^\/\* tslint:disable \*\/$/gm,
  /^\/\/ @ts-nocheck$/gm,
];

const HEADER_BLOCK_PATTERN =
  /\/\*\s*\n \* ---------------------------------------------------------------\s*\n \* ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API\s+##\s*\n \* ##\s+##\s*\n \* ## AUTHOR: acacode\s+##\s*\n \* ## SOURCE: https:\/\/github\.com\/acacode\/swagger-typescript-api ##\s*\n \* ---------------------------------------------------------------\s*\n \*\/\s*\n/g;

function cleanFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, "utf8");
    let originalContent = content;

    // Remove lint disable comments
    PATTERNS_TO_REMOVE.forEach(pattern => {
      content = content.replace(pattern, "");
    });

    // Remove duplicate header blocks (keep only the first one)
    const headerMatches = content.match(HEADER_BLOCK_PATTERN);
    if (headerMatches && headerMatches.length > 1) {
      let firstHeaderFound = false;
      content = content.replace(HEADER_BLOCK_PATTERN, match => {
        if (!firstHeaderFound) {
          firstHeaderFound = true;
          return match;
        }
        return "";
      });
    }

    // Remove duplicate empty lines
    content = content.replace(/\n{3,}/g, "\n\n");

    // Clean up any trailing whitespace on lines
    content = content.replace(/[ \t]+$/gm, "");

    // Only write if content changed
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, "utf8");
      console.log(`✓ Cleaned: ${path.relative(process.cwd(), filePath)}`);
    }
  } catch (error) {
    console.error(`✗ Error cleaning ${filePath}:`, error.message);
  }
}

function cleanDirectory(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  Directory not found (skipping clean): ${dirPath}`);
      return;
    }

    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        cleanDirectory(filePath);
      } else if (file.endsWith(".ts")) {
        cleanFile(filePath);
      }
    });
  } catch (error) {
    console.error(`✗ Error reading directory ${dirPath}:`, error.message);
  }
}

function removeDirectoryContents(dirPath) {
  try {
    if (!fs.existsSync(dirPath)) {
      console.log(`⚠️  Directory not found (skipping cleanup): ${dirPath}`);
      return;
    }

    console.log(`🗑️  Removing all contents from: ${path.relative(process.cwd(), dirPath)}`);

    const files = fs.readdirSync(dirPath);

    files.forEach(file => {
      const filePath = path.join(dirPath, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Recursively remove subdirectories
        fs.rmSync(filePath, { recursive: true, force: true });
        console.log(`✓ Removed directory: ${path.relative(process.cwd(), filePath)}`);
      } else {
        // Remove files
        fs.unlinkSync(filePath);
        console.log(`✓ Removed file: ${path.relative(process.cwd(), filePath)}`);
      }
    });

    console.log(`✨ Directory cleanup completed: ${path.relative(process.cwd(), dirPath)}`);
  } catch (error) {
    console.error(`✗ Error removing directory contents ${dirPath}:`, error.message);
    throw error;
  }
}

// Convert config to swagger-typescript-api options
function convertConfigToOptions(config) {
  // Map CLI-style config keys to camelCase for generateApi function
  const options = {
    // Input source
    url: config.path, // Use 'url' for remote OpenAPI spec

    // Output configuration
    output: path.resolve(process.cwd(), config.output || "src/app/api-generated"),
    name: config.name || "ApiClient.ts",

    // Templates and naming
    templates: config.templates ? path.resolve(process.cwd(), config.templates) : undefined,
    apiClassName: config["api-class-name"] || "ApiService",

    // Generation options
    modular: config.modular || false,
    moduleNameFirstTag: config["module-name-first-tag"] || false,

    // Extract options
    extractRequestParams: config["extract-request-params"] || false,
    extractRequestBody: config["extract-request-body"] || false,
    extractResponseBody: config["extract-response-body"] || false,
    unwrapResponseData: config["unwrap-response-data"] || false,

    // Cleanup and sorting
    cleanOutput: config["clean-output"] || false,
    sortTypes: config["sort-types"] || false,

    // Additional options for better type safety
    generateClient: config["generate-client"] || false, // Use config value, default to false for Angular
    generateRouteTypes: false,
    generateResponses: true,
    toJS: false,
    extractEnums: false,

    // Default response type
    defaultResponseType: "void",
    singleHttpClient: config["single-http-client"] || false, // Only relevant when generateClient is true
    enumNamesAsValues: false,
    generateUnionEnums: false,

    // Type naming
    typePrefix: config["type-prefix"] || "",
    typeSuffix: config["type-suffix"] || "",

    // Internal template options (passed to templates)
    internalTemplateOptions: config["internal-template-options"] || {
      addUtilRequiredKeysType: true,
      exportOriginalTypes: false,
      exportMethodTypesOnly: true,
    },

    // Prettier configuration (optional)
    prettier: {
      printWidth: 120,
      tabWidth: 2,
      trailingComma: "all",
      parser: "typescript",
    },
  };

  // Remove undefined values to avoid overriding defaults
  Object.keys(options).forEach(key => {
    if (options[key] === undefined) {
      delete options[key];
    }
  });

  return options;
}

async function generateAndCleanApi() {
  try {
    console.log("🚀 Starting API generation...");

    // Load configuration
    const config = loadConfig();
    console.log("📄 Loaded configuration from generate-api.config.js");

    // Convert config to swagger-typescript-api options
    const options = convertConfigToOptions(config);

    if (process.env.DEBUG) {
      console.log("🐛 Generation options:", JSON.stringify(options, null, 2));
    }

    // Ensure output directory exists
    const outputDir = options.output;
    console.log(`📁 Ensuring output directory exists: ${outputDir}`);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
      console.log(`✓ Created output directory: ${outputDir}`);
    } else {
      // Clean existing contents before generating new files
      console.log("🧹 Cleaning existing generated files...");
      removeDirectoryContents(outputDir);
    }

    // Generate API using swagger-typescript-api module
    console.log("🔄 Generating API from OpenAPI specification...");
    await generateApi(options);

    console.log("✅ API generation completed successfully!");
    console.log(`📁 Generated files in: ${path.relative(process.cwd(), outputDir)}`);

    // Clean generated files (formatting and linting cleanup)
    console.log("🧹 Cleaning generated API files...");
    cleanDirectory(outputDir);

    // Remove http-client.ts as it's not needed for Angular
    const httpClientPath = path.join(outputDir, "http-client.ts");
    if (fs.existsSync(httpClientPath)) {
      fs.unlinkSync(httpClientPath);
      console.log(`✓ Removed: ${path.relative(process.cwd(), httpClientPath)} (not needed for Angular)`);
    }

    console.log("✨ Cleaning completed!");

    return { success: true };
  } catch (error) {
    console.error("❌ API generation failed:");

    if (error.code === "ECONNREFUSED") {
      console.error("🔌 Connection refused - Make sure the API server is running on the specified URL");
      console.error("💡 Check if your backend is running on http://localhost:8000");
    } else if (error.message.includes("fetch")) {
      console.error("🌐 Network error - Unable to fetch OpenAPI specification");
      console.error("💡 Verify the URL in your configuration file");
    } else if (error.message.includes("parse") || error.message.includes("JSON")) {
      console.error("📄 Invalid OpenAPI specification format");
      console.error("💡 Check if the OpenAPI endpoint returns valid JSON");
    } else if (error.code === "ENOENT") {
      console.error("🚫 swagger-typescript-api module not found");
      console.error("💡 Make sure swagger-typescript-api is installed: npm install swagger-typescript-api");
    } else {
      console.error("Details:", error.message);
      if (error.stack && process.env.DEBUG) {
        console.error("Stack trace:", error.stack);
      }
    }

    process.exit(1);
  }
}

// CLI handling
async function main() {
  const args = process.argv.slice(2);

  if (args.includes("--help") || args.includes("-h")) {
    console.log(`
🔧 API Generator Script

Usage:
  node scripts/generate-api.js [options]

Options:
  --help, -h     Show this help message
  --debug        Enable debug output
  --clean-only   Only run the cleaning process (skip generation)

Configuration:
  Reads from generate-api.config.js in the project root.
  
Features:
  - Uses swagger-typescript-api module programmatically for better type safety
  - Provides enhanced error handling and debugging capabilities
  - Supports all swagger-typescript-api options through configuration
  - Automatic complete cleanup of output directory before generation
  - Automatic file cleaning and formatting after generation

Examples:
  node scripts/generate-api.js                 # Generate and clean API
  node scripts/generate-api.js --clean-only    # Only clean existing files
  DEBUG=1 node scripts/generate-api.js --debug # Generate with debug output
`);
    return;
  }

  if (args.includes("--debug")) {
    process.env.DEBUG = "1";
  }

  if (args.includes("--clean-only")) {
    console.log("🧹 Running clean-only mode...");
    const config = loadConfig();
    const outputDir = config.output ? path.resolve(process.cwd(), config.output) : path.join(process.cwd(), "src/app/api-generated");
    cleanDirectory(outputDir);
    console.log("✨ Cleaning completed!");
    return;
  }

  await generateAndCleanApi();
}

// Run if called directly
if (require.main === module) {
  main().catch(error => {
    console.error("💥 Unexpected error:", error);
    process.exit(1);
  });
}

module.exports = {
  generateAndCleanApi,
  cleanDirectory,
  cleanFile,
  removeDirectoryContents,
  loadConfig,
  convertConfigToOptions,
};
