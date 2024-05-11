# Penguin Bomberman

## Intro
Penguin Bomberman is inspired by "Pïnguin Bomberman", which used to be available on speeleiland.nl.

This is a recreation of the game as it has become defunct with the removal of Flash from browsers.

## Development info
### Architecture
The client is made up of React and the canvas is rendered with melonJS. The server is powered by websockets.

Both the client and server are running on Deno.

Deno has been chosen for its simplicity in very little configuration for modern code.

Shared code is put into the client 'package' because the server can access files from anywhere but the web framework can't.

### Writing code

It is advised to open the client and server as a separate project in your IDE rather than opening the repository root.

To run deno tasks, go either into the client or server and run "deno task" to see the available commands.
