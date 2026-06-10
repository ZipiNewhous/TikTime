// Route group page — home is served by src/app/page.tsx.
// The home page is fully static content, so we let Next prerender + cache it
// instead of forcing a dynamic render on every request.
export { default } from "../page";
