const { buildClientSchema, getNamedType, isObjectType, isInterfaceType, isUnionType, parse, visit } = require("graphql");
const fetch = require("node-fetch");

// 🔹 Fetch the GraphQL schema using introspection
async function fetchGraphQLSchema(endpoint) {
    const introspectionQuery = `{
        __schema {
            types {
                kind
                name
                possibleTypes { name }
                fields {
                    name
                    type {
                        kind
                        name
                        ofType {
                            kind
                            name
                            ofType {
                                kind
                                name
                            }
                        }
                    }
                }
            }
        }
    }`;

    const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: introspectionQuery }),
    });

    const { data } = await response.json();
    return buildClientSchema(data);
}

// 🔹 Recursively resolve field types from a GraphQL query
function resolveFieldTypesByIntrospection(schema, query) {
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

// 🔹 Traverses a GraphQL selection set
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

// 🔹 Example Usage
async function main() {
    const graphqlEndpoint = "http://localhost:4001/graphql"; // Change this
    const schema = await fetchGraphQLSchema(graphqlEndpoint);

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

    const fieldTypes = resolveFieldTypesByIntrospection(schema, query);
    console.log(fieldTypes);
}

main().catch(console.error);