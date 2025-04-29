#!/bin/bash

# Shell script (runHiveSchemaCheck.sh) that:
# Uses a JavaScript file (combineGraphQLFiles.js) to recursively read all .graphql files from a directory and its subdirectories.
# Combines them into a single .graphql file.
# Runs the hive schema:check command against the schema registry using the combined schema file.

# Check if directory argument is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <path-to-directory-with-graphql-files>"
  exit 1
fi

# Directory containing the .graphql files
GRAPHQL_DIR=$1

# Optional: Path to the output schema file (default to combined-schema.graphql)
OUTPUT_FILE="${2:-combined-schema.graphql}"

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
hive schema:check --schema $OUTPUT_FILE --endpoint "https://your-graphql-hive-endpoint.com/graphql"

# Check if the schema check passed
if [ $? -eq 0 ]; then
  echo "Schema check passed successfully!"
else
  echo "Schema check failed!"
  exit 1
fi

#
# make runHiveSchemaCheck.sh script executable
# chmod +x runHiveSchemaCheck.sh
#  Run the shell script
# ./runHiveSchemaCheck.sh /path/to/your/graphql/files
#  custom output file for the combined schema
# ./runHiveSchemaCheck.sh /path/to/your/graphql/files custom-output.graphql
#
