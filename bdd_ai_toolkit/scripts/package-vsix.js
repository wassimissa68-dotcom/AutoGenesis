// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const repoLicense = path.resolve(rootDir, '..', 'LICENSE');
const extLicense = path.resolve(rootDir, 'LICENSE');

console.log('Preparing to package BDD AI Toolkit extension...');

// Ensure LICENSE file exists in bdd_ai_toolkit for vsce packaging
if (!fs.existsSync(extLicense) && fs.existsSync(repoLicense)) {
    fs.copyFileSync(repoLicense, extLicense);
    console.log('Copied root LICENSE to bdd_ai_toolkit/LICENSE');
}

try {
    console.log('Packaging extension using vsce...');
    execSync('npx @vscode/vsce package --no-dependencies', { cwd: rootDir, stdio: 'inherit' });
    console.log('Successfully packaged VSIX!');
} catch (error) {
    console.error('Failed to package VSIX:', error);
    process.exit(1);
}
