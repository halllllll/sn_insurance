import React from "react";
import "./index.css";
import ReactDOM from "react-dom/client";
import { App } from "./App";

// biome-ignore lint/style/noNonNullAssertion: <explanation>
ReactDOM.createRoot(document.getElementById("root")!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
