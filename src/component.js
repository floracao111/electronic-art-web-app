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
    const concept = ctx.request.url.searchParams.get("concept") || "";
    const interactivity = ctx.request.url.searchParams.get("interactivity") ||
        "";
    const materiality = ctx.request.url.searchParams.get("materiality") || "";
    const additionalIdeas =
        ctx.request.url.searchParams.get("additionalIdeas") || "";
    const difficulty = ctx.request.url.searchParams.get("difficulty") || "";

    // Log the request to the terminal
    console.log(
        "someone made a request to /api/component",
        concept,
        interactivity,
        materiality,
        additionalIdeas,
        difficulty,
    );

    console.log("Request params:", {
        concept,
        interactivity,
        materiality,
        additionalIdeas,
        difficulty,
    });

    const component = await promptGPT(
        `You are a creative technology professor. 
    This is a form I filled out about my electronic art project idea:
    - Concept? ${concept}
    - Interaction? ${interactivity}
    - Materiality? ${materiality}
    - Additional notes? ${additionalIdeas}
    - Technical difficulty? ${difficulty}/5

    check if all the questions in the form has been answered. If there is blank, make a section, recognize there's blank and say don't worry you will brainstorm something for me. No title needed for this section. If there is no blanks, do nothing and go on to the next section. 
    section 1: <h3>: a simple name for this project. 
    section 2: Bullet list all needed digital components with specific type. Also software, code library or apis.
    Section 3: Step by step tutorial. 
    Section 4: Tips for potential problems. 
    Please respond in clean HTML format:
    - Use <h3> for section titles in font 'impact'. 
    - Use <ul> and <li> for lists.
    - Use <p> for paragraphs.
    Start each section with its content, don't start with section number.
    Avoid any Markdown formatting or unnecessary characters.no additional text, no unsolicited advice or commentary. Be concise and brief.
    Do not include html and triple backticks in the output.
`,
        {
            temperature: 0.4,
            max_tokens: 1500,
        },
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

