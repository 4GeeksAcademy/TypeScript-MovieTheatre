// Entry point: in the browser it starts the seat map website,
// in the terminal (`npm run console`) it runs the console demo.
if (typeof document !== "undefined") {
  import("./style.css");
  import("./web");
} else {
  import("./demo");
}

export {};
