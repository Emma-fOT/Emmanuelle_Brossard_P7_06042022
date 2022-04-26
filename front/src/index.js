import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
// Used for the posts
// https://gitlab.com/catamphetamine/react-time-ago
// Default style is in minutes : https://github.com/catamphetamine/javascript-time-ago#custom
import TimeAgo from "javascript-time-ago";
import fr from "javascript-time-ago/locale/fr.json";
TimeAgo.addDefaultLocale(fr);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
