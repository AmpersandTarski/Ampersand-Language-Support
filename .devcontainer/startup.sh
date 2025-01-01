# Exit immediately if a command exits with a non-zero status.
set -e

npm install --global npm@latest
npm install --global @vscode/vsce
npm install --global typescript
npm install @types/node
npm i --global esbuild

# git restore .

# npm run esbuild
# vsce package 0.0.0
# echo "Aap"
# code --version
# echo "Noot"
# code --install-extension language-ampersand-0.0.0.vsix