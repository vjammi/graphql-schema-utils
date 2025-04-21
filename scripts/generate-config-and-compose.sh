#!/bin/bash

set -e

echo "🔄 Generating federation config from introspection..."

mkdir -p supergraph

cat > federation-config.json <<EOL
{
  "subgraphs": {
    "accounts": {
      "introspect": { "url": "http://localhost:4001/graphql" }
    },
    "products": {
      "introspect": { "url": "http://localhost:4002/graphql" }
    }
  }
}
EOL

echo "✅ federation-config.json written."

echo "🚀 Composing supergraph with Rover..."

rover supergraph compose --config federation-config.json > supergraph/old_supergraph.graphql

echo "✅ Supergraph written to supergraph/supergraph.graphql"
