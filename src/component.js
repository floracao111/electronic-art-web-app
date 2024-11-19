// Import the the Application and Router classes from the Oak module
import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";

// Import server helper functions from the class library
import { createExitSignal, staticServer } from "./shared/server.ts";

// Import the promptGPT function from the class library
import { promptGPT } from "./shared/openai.ts";

// Create an instance of the Application and Router classes
const app = new Application();
const router = new Router();

// Create a route to handle requests to /api/joke
router.get("/api/component", async (ctx) => {
    // Get the topic from the query string `?topic=...`
    const concept = ctx.request.url.searchParams.get("concept");
    const interactivity = ctx.request.url.searchParams.get("interactivity");
    const materiality = ctx.request.url.searchParams.get("materiality");
    const difficulty = ctx.request.url.searchParams.get("difficulty");

    // Log the request to the terminal
    console.log(
        "someone made a request to /api/component",
        concept,
        interactivity,
        materiality,
        additionalIdeas,
        difficulty,
    );

    // Ask GPT to generate a joke about the topic
    const component = await promptGPT(
        `Your are a creative technology teacher. This is your student's concept for a project: ${concept}. These are the ways of interaction for the project: ${interactivity}. These are the materials they want to utilize: ${materiality}. Here are some additional ideas: ${additionalIdeas}. The student's wants the technical difficulty level to be a ${difficulty} out of 5.First, in bullet points, list out the main digital components they can use to create the project. Then, new paragraph, in 2 sentence, describe to your student how they can use the components to create the project. `,
    );

    // Send the joke back to the client
    ctx.response.body = component;
});

// Tell the app to use the custom routes
app.use(router.routes());
app.use(router.allowedMethods());

// Try serving undefined routes with static files
app.use(staticServer);

// Everything is set up, let's start the server
console.log("\nListening on http://localhost:8000");
await app.listen({ port: 8000, signal: createExitSignal() });

