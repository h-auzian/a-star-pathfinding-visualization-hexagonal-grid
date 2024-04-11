## Run locally

Since this project uses ES Modules, it won't run by simply opening `index.html` in the browser due to CORS errors. Instead, it must run from a local server.

If you have Python 3 installed, then simply run the following. No need to install any dependency:

    python3 -m http.server

And then open 127.0.0.1:8000 in your browser.

Or if you have npm installed and want hot-reload on file changes, install `live-server` and then serve the files:

    npm install -g live-server
    live-server

`live-server` should open 127.0.0.1:8080 automatically in the browser.
