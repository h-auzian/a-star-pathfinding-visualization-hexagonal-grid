## Run locally

Even though this project is client-side only, since it uses ES Modules it won't run correctly by simply opening `index.html` in a browser due to CORS errors. Instead, it must run from a local server.

### Python

If you have Python 3 installed, then simply run the following. No need to install any dependencies:

    python3 -m http.server

And then open 127.0.0.1:8000 in your browser. If any changes are made in the files, the server must be restarted manually.

### npm

If you have `npm` installed, install the dependencies and start the local server:

    npm install
    npm start

Then open 127.0.0.1:8080 in your browser. If any changes are made in the files, the server will be reloaded automatically.

### Docker

If you have Docker and Docker Compose installed, simply run:

    docker-compose up

And then open 127.0.0.1:8080 in your browser. If any changes are made in the files, the server will be reloaded automatically.
