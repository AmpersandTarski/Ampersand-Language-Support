set -e

npm install
npm install --global @vscode/vsce
npm install --global typescript
npm install @types/node
npm install graphviz

git restore .

vsce package 0.0.0
code --install-extension language-ampersand-0.0.0.vsix