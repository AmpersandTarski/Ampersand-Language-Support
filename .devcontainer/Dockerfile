# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.191.0/containers/typescript-node/.devcontainer/base.Dockerfile

ARG TYPESCRIPT_NODE_VARIANT
ARG PROTOTYPE_FRAMEWORK_VERSION
FROM mcr.microsoft.com/vscode/devcontainers/typescript-node:${TYPESCRIPT_NODE_VARIANT}

COPY --from=ampersandtarski/prototype-framework:2.0.0-alpha.4 /usr/local/bin/ampersand /usr/local/bin
RUN chmod +x /usr/local/bin/ampersand
RUN apt-get update && apt-get install -y graphviz

# Set `DEVCONTAINER` environment variable to help with orientation
ENV DEVCONTAINER=true

# [Optional] Uncomment this section to install additional OS packages.
# RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
#     && apt-get -y install --no-install-recommends <your-package-list-here>

# [Optional] Uncomment if you want to install an additional version of node using nvm
# ARG EXTRA_NODE_VERSION=10
# RUN su node -c "source /usr/local/share/nvm/nvm.sh && nvm install ${EXTRA_NODE_VERSION}"

# [Optional] Uncomment if you want to install more global node packages
# RUN su node -c "npm install -g <your-package-list -here>"
