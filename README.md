# A* (A-star) pathfinding visualization on a hexagonal grid

Silly application to visualize different pathfinding algorithms, mainly A* (A-star), on a hexagonal grid. Written in TypeScript and rendered on a HTML Canvas.

You can play around with it here: http://h-auzian.github.io/a-star-pathfinding-visualization-hexagonal-grid

https://github.com/h-auzian/a-star-pathfinding-visualization-hexagonal-grid/assets/5781534/a064bf5b-2a36-4e8c-9d89-556d5ef5e984

Initially this was supposed to only work with A*, but over time it was adapted to show the following three algorithms, as they are very similar:

- Dijkstra's, which searches considering travel cost only.
- Greedy, which searches considering a heuristic only.
- A*, which searches considering both the travel cost and the heuristic.

## Motivation

While there are several excellent pathfinding visualizations out there, I decided to make this for the following reasons:

- Provide a visualization that not only shows the final result, but also the algorithm step by step, hopefully helping people understand the general gist of the pathfinding search in a visual way.
- Show the algorithms working on a hexagonal grid instead of a square one.
- Learn HTML Canvas.

## Project structure

This visualization is written in a typical update/render loop. All the update logic is inside the `logic` subfolder, while all the rendering functions are inside the `rendering` subfolder. The update and the rendering functions are independent from each other.

The `state` subfolder contains different type definitions to hold the global application state, which is basically a big container of data that includes the map tiles, the character, the pathfinding calculation results, and so on. This state is passed down to the update functions to modify it, and to the rendering functions to draw a frame on the canvas. This is probably not the most elegant way of passing state, so any suggestions to improve this part are welcome.

Finally, this was written in a more procedural style, as I didn't want to rely on OOP as I usually do in other projects, and thus the codebase mostly consists of functions and types, not classes (with a single exception).

## Hexagonal grid representation

Unlike a square grid, which can be easily be represented as a 2-dimensional matrix, there are several ways to represent a hexagonal grid. In this case, the grid is represented in "offset" coordinates, also known as "odd-shift", with "flat top" orientation:

![Hexagonal grid](https://github.com/h-auzian/a-star-pathfinding-visualization-hexagonal-grid/assets/5781534/b35a4435-18e3-490b-84d7-889a9fd42d72)

As shown above, each column with odd index is shifted downwards, so each row as a "wiggly" aspect, while columns follow a straight line.

This representation is probably easier to grasp compared to other representations, but algorithms like rotations, distances, reflections, neighbours, etc, are harder to do, or at least not as straightforward.

Since the only operations needed for this visualization were getting the Manhattan distance between two tiles and getting the immediate neighbours of a given tile, using an offset coordinates representation worked fine in this case, but it may not be appropriate for other purposes, so keep that in mind if you need to implement a hexagonal grid.

## Run locally

Since this project uses TypeScript, it's necessary to transpile it to JavaScript before running it locally in the browser, which can be done by running a development server. The traspiled files are stored in-memory while the server is running.

If you have `npm` installed, install the dependencies and start the local server:

    npm install
    npm start

Or if you have Docker installed, run:

    docker compose build
    docker compose up

And then open 127.0.0.1:8080 in your browser. If any changes are made in the files, the local server will be reloaded automatically.

## Tests

There are a few tests for specific algorithms and functions.

If the project is running locally via `npm`, run:

    npm test

Or if the project is running via Docker, run:

    docker compose exec local_server npm test

## Build

To generate a bundle with a single transpiled JavaScript file, run:

    npm run build

Or if using Docker:

    docker compose exec local_server npm run build

The files will be generated in the `dist` subfolder.

## Resources

This visualization wouldn't be possible without the following resources:

### A* algorithm

- This excellent explanation of the A* algorithm by Amit Patel at Red Blob Games was the main inspiration for this. Please check it out: https://www.redblobgames.com/pathfinding/a-star/introduction.html

- This oldie but goodie video by Sebastian Lague was also a great introduction to the algorithm: https://www.youtube.com/watch?v=-L-WgKMFuhE

### Hexagonal grids

- Also by Amit Patel at Red Blob Games, this fantastic guide to hexagonal grids was a godsend: https://www.redblobgames.com/grids/hexagons/

- This great resource about indexing by Ondřej Žára was really useful to get the Manhattan distance formula on a hexagonal grid with an "odd-shift" coordinate system: http://ondras.github.io/rot.js/manual/#hex/indexing

- This nice article by Izan Pérez Cosano about drawing hexagonal grids on a HTML Canvas was helpful to get started with this project: https://eperezcosano.github.io/hex-grid/

### Other

- While there are tons of resources about the straight line equation, this little page from the University of Newcastle was very handy: https://www.ncl.ac.uk/webtemplate/ask-assets/external/maths-resources/core-mathematics/geometry/equation-of-a-straight-line.html

- A nice series of videos about priority queues by William Fiset were useful in understanding its properties: https://www.youtube.com/watch?v=wptevk0bshY&list=PLDV1Zeh2NRsCLFSHm1nYb9daYf60lCcag
