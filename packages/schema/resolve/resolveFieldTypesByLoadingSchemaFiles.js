const { buildSchema, parse, visit, getNamedType, isObjectType, isInterfaceType, isUnionType } = require("graphql");
const fs = require("fs");
const path = require("path");

// Load GraphQL schema files and merge into a single schema
function loadGraphQLSchema(schemaDir) {
    let schemaContent = "";
    fs.readdirSync(schemaDir).forEach(file => {
        if (file.endsWith(".graphql") || file.endsWith(".graphqls")) {
            schemaContent += fs.readFileSync(path.join(schemaDir, file), "utf8") + "\n";
        }
    });
    return buildSchema(schemaContent);
}

// Recursively resolve field types from a GraphQL query
function resolveFieldTypes(schema, query) {
    const document = parse(query);
    const fieldTypes = {};
    const fragments = {};

    // Extract named fragments
    visit(document, {
        FragmentDefinition(node) {
            fragments[node.name.value] = node;
        }
    });

    // Process main query
    visit(document, {
        OperationDefinition(node) {
            const rootType = schema.getQueryType();
            traverseSelectionSet(rootType, node.selectionSet, "", fieldTypes, schema, fragments);
        }
    });

    return fieldTypes;
}

// Traverses a GraphQL selection set
function traverseSelectionSet(parentType, selectionSet, parentPath, fieldTypes, schema, fragments) {
    if (!selectionSet || !parentType) return;

    selectionSet.selections.forEach(selection => {
        if (selection.kind === "Field") {
            const fieldName = selection.name.value;
            const fullPath = parentPath ? `${parentPath}.${fieldName}` : fieldName;

            if (isObjectType(parentType) || isInterfaceType(parentType)) {
                const fieldDef = parentType.getFields()[fieldName];
                if (fieldDef) {
                    const fieldType = getNamedType(fieldDef.type);
                    fieldTypes[fullPath] = fieldType.toString();

                    if (isObjectType(fieldType) || isInterfaceType(fieldType) || isUnionType(fieldType)) {
                        traverseSelectionSet(fieldType, selection.selectionSet, fullPath, fieldTypes, schema, fragments);
                    }
                }
            }
        } else if (selection.kind === "InlineFragment") {
            const typeCondition = selection.typeCondition.name.value;
            const fragmentType = schema.getType(typeCondition);
            traverseSelectionSet(fragmentType, selection.selectionSet, parentPath, fieldTypes, schema, fragments);
        } else if (selection.kind === "FragmentSpread") {
            const fragment = fragments[selection.name.value];
            if (fragment) {
                const fragmentType = schema.getType(fragment.typeCondition.name.value);
                traverseSelectionSet(fragmentType, fragment.selectionSet, parentPath, fieldTypes, schema, fragments);
            }
        }
    });
}

// Example usage
const schemaDir = "path/to/graphql/schemas"; // Update this
const schema = loadGraphQLSchema(schemaDir);

const query = `
    query {
        user(id: "123") {
            id
            name
            posts {
                title
                comments {
                    text
                    author {
                        username
                    }
                }
            }
        }
    }
`;

const fieldTypes = resolveFieldTypes(schema, query);
console.log(fieldTypes);
