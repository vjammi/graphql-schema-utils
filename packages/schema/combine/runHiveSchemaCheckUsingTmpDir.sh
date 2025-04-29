#!/bin/bash

# Script does the following:
# Creates a temporary directory (~/.temp) under the user's home directory.
# Schema is temporarily stored in ~/.temp/combined-schema.graphql and removed after the process completes successfully.
# Combines all .graphql files from the provided directory into a single file in the temporary directory.
# Runs hive schema:check using the combined schema file.
# Cleans up the temporary files (both the directory and schema file) after the check.


# Check if directory argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-directory-with-graphql-files>"
  exit 1
fi

# Directory containing the .graphql files
GRAPHQL_DIR=$1

# Create a temporary directory under the user's home directory
TEMP_DIR="${HOME}/.temp"
mkdir -p "$TEMP_DIR"

# Optional: Path to the output schema file (default to combined-schema.graphql)
OUTPUT_FILE="${TEMP_DIR}/combined-schema.graphql"

# Path to your JavaScript file
JS_FILE="./combineGraphQLFiles.js"

# Run the JavaScript file to combine all GraphQL files into one
node $JS_FILE $GRAPHQL_DIR $OUTPUT_FILE

# Check if the combined schema file was created
if [ ! -f "$OUTPUT_FILE" ]; then
  echo "Error: Combined schema file not found: $OUTPUT_FILE"
  exit 1
fi

# Run hive schema:check using the combined schema
echo "Running hive schema:check with $OUTPUT_FILE"
hive schema:check --schema $OUTPUT_FILE --endpoint "https://graphql-hive-endpoint.com/graphql"

# Check if the schema check passed
if [ $? -eq 0 ]; then
  echo "Schema check passed successfully!"
else
  echo "Schema check failed!"
  exit 1
fi

# Clean up: Remove the temporary directory and schema file
echo "Cleaning up temporary files..."
rm -rf "$TEMP_DIR"
echo "Temporary files cleaned up."