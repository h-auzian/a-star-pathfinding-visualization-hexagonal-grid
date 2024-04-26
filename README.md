## Run locally

Since this project uses TypeScript, it's necessary to transpile it to JavaScript before running it locally in the browser, which can be done by running a development server. The traspiled files are stored in-memory while the server is running.

If you have `npm` installed, install the dependencies and start the local server:

    npm install
    npm start

Or if you have Docker and Docker Compose installed, run:

    docker-compose build
    docker-compose up

And then open 127.0.0.1:8080 in your browser. If any changes are made in the files, the local server will be reloaded automatically.

## Tests

There are a few tests for specific algorithms and functions.

If the project is running locally via `npm`, run:

    npm test

Or if the project is running via Docker, run:

    docker-compose exec local_server npm test

## Build

To generate a bundle with a single JavaScript file, run:

    npm run build

Or if using Docker:

    docker-compose exec local_server npm run build

The files will be generated in the `dist` subfolder.
