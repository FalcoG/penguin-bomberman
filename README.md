# Penguin Bomberman

## Intro
Penguin Bomberman is inspired by "Pïnguin Bomberman", which used to be available on speeleiland.nl.

This is a recreation of the game as it has become defunct with the removal of Flash from browsers.

## Development info
### Architecture
The client is made up of React with PIXI.js and the server is made with websockets, running on Deno.

Deno has been chosen for its simplicity in very little configuration for modern code.

This however has caused quite an odd situation where the client compilation runs on node and the server on Deno. This mismatch will have to be fixed by introducing Deno to the client code as well.
