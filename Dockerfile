# Stage 1: Build Stage
FROM --platform=linux/amd64 cgr.dev/chainguard/node:latest-dev AS build
WORKDIR /app
COPY ./package.json /app/package.json
USER root
RUN npm install

# Stage 2: Production Stage
FROM --platform=linux/amd64 cgr.dev/chainguard/node:latest
COPY --from=build /app /usr/src/app
WORKDIR /usr/src/app
CMD ["node_modules/@sap/ams/lib/bin/deployDcl"]