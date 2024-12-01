ARG IMG='docker.io/node:22'

FROM "$IMG" as build
WORKDIR /app/
COPY package.json package-lock.json .
RUN npm install

FROM "$IMG"
WORKDIR /app/
COPY --from=build /app/node_modules/ node_modules/
COPY src/ src/
COPY dist/ dist/
CMD ["npx", "http-server", "-a0"]
