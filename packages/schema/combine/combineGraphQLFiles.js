const fs = require('fs');
const path = require('path');

// Function to recursively read files from a directory
function getGraphQLFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);

    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat && stat.isDirectory()) {
            results = results.concat(getGraphQLFiles(filePath)); // Recurse into subdirectories
        } else if (file.endsWith('.graphql') || file.endsWith('.gql')) {
            results.push(filePath); // Add GraphQL file to results
        }
    });

    return results;
}

// Function to combine all GraphQL files into one
function combineFiles(files) {
    let combinedSchema = '';

    files.forEach(file => {
        const content = fs.readFileSync(file, 'utf8');
        combinedSchema += `\n# From file: ${file}\n${content}\n`;
    });

    return combinedSchema;
}

// Main execution
const dir = process.argv[2]; // Directory passed as argument
const outputFile = process.argv[3] || 'combined-schema.graphql'; // Output file name (default: combined-schema.graphql)

const graphqlFiles = getGraphQLFiles(dir);
const combinedSchema = combineFiles(graphqlFiles);

// Write the combined schema to a file
fs.writeFileSync(outputFile, combinedSchema, 'utf8');
console.log(`Combined schema written to: ${outputFile}`);