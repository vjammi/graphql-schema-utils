const { execSync } = require('child_process');
const fs = require('fs');

const CURRENT = '../../../supergraph/old_supergraph.graphql'; //./supergraph/old_supergraph.graphql
const CONFIG = './federation-config.json';
const NEW = '../../../supergraph/new_supergraph.graphql';

function composeNewSupergraph() {
  console.log('Composing new supergraph from local SDLs...');
  execSync(`npx @apollo/composition-cli compose --config ${CONFIG} > ${NEW}`, { stdio: 'inherit' });
}

async function composeSupergraphViaRover() {
  console.log(`🔧 Composing supergraph with Apollo Rover CLI...`);
  execSync(`rover supergraph compose --config ${federationConfigPath} > ${composedPath}`, {
    stdio: 'inherit',
  });
  console.log(`✅ Supergraph written to ${composedPath}`);
}

function runDiff() {
  console.log('Running GraphQL Inspector diff...');
  execSync(`npx graphql-inspector diff ${CURRENT} ${NEW} --format markdown`, { stdio: 'inherit' });
}

function main() {
  if (!fs.existsSync(CURRENT)) {
    console.error('Current Supergraph does not exist. Run compose.js first to introspect.');
    process.exit(1);
  }
  //composeNewSupergraph();
  //composeSupergraphViaRover();
  runDiff();
}

main();
