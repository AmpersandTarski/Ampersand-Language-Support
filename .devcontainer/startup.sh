# Exit immediately if a command exits with a non-zero status.
set -e

npm install --global npm@latest
npm install --global @vscode/vsce
npm install --global typescript
npm install @types/node
npm i --global esbuild

# Clear the screen and print welcome text:
clear 
cat .devcontainer/welcome.txt  # /usr/local/etc/vscode-dev-containers/first-run-notice.txt
