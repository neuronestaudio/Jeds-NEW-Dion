import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { initAnalytics } from "@/lib/analytics";
import { initChatWidgetOffset } from "@/lib/chat-widget-offset";

initAnalytics();
initChatWidgetOffset();

createRoot(document.getElementById("root")!).render(
	<HelmetProvider>
		<App />
	</HelmetProvider>
);
