// This version adds a handler for a specific route.

// Try this with
// http://localhost:8000/
// http://localhost:8000/api/test?myParam=abc

// Import the the Application and Router classes from the Oak module
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Import the createExitSignal function from the JS+OAI shared library
import { createExitSignal } from "./shared/server.ts";

// Create an instance of the Application and Router classes
const app = new Application();
const router = new Router();
let hitCount = 0;

// Configure a cutom route
// This function will run when "/api/test" is requested
router.get("/api/test", (ctx) => {
  hitCount++;
  console.log(`Visitor${hitCount} made a request to /api/test`);

  // output some info about the request
  console.log("ctx.request.url.pathname:", ctx.request.url.pathname);
  console.log("myParam:", ctx.request.url.searchParams.get("myParam"));
  console.log("ctx.request.method:", ctx.request.method);

  // send a response back to the browser
  ctx.response.body = `Visitor${hitCount}`;
});

// Tell the app to use the router
app.use(router.routes());
app.use(router.allowedMethods());

// Provide a function to handle requests to unknown routes
app.use((ctx) => {
  console.log("someone made a default request");
  ctx.response.type = "text/html";
  ctx.response.body = `
  Hello! Try this <a href="http://localhost:8000/api/test?myParam=abc">link</a>.`;
});

// Everything is set up, let's start the server
console.log("\nListening on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });
