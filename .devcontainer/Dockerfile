# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.187.0/containers/javascript-node/.devcontainer/base.Dockerfile

# [Choice] Node.js version: 18, 16, 14
ARG VARIANT="18-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# Install extra tools for CAP development & deployment.
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends curl git jq 

# Install SAP CAP SDK globally
RUN su node -c "npm install -g @sap/cds-dk"
