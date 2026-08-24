import React from "react";
import ReactDOM from "react-dom/client";
import { ArrowUpRight } from "lucide-react";
import { CreatorWorkspace } from "./CreatorWorkspace.tsx";
import "./style.css";

function App() {
  const zh = document.documentElement.lang.toLowerCase().startsWith("zh");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-background/95 px-4 backdrop-blur sm:px-6">
        <div className="mx-auto flex min-h-[4.5rem] max-w-6xl items-center justify-between gap-4">
          <a
            href="/"
            aria-label="LovCreate 首页"
            className="inline-flex items-center gap-2.5 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <img
              src="/logo.svg"
              alt=""
              width="34"
              height="34"
              className="rounded-full"
            />
            <span className="font-serif text-lg font-semibold tracking-[-0.025em]">
              LovCreate
            </span>
          </a>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="hidden items-center gap-2 font-mono uppercase tracking-[0.12em] text-muted-foreground sm:inline-flex">
              <i className="h-2 w-2 rounded-full bg-[#77a644] shadow-[0_0_0_4px_rgba(119,166,68,0.14)]" />
              Creator 0.2
            </span>
            <a
              href="https://lovstudio.ai/apps"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-2 transition-colors hover:border-primary/40 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
              LovStudio Apps
              <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      <main>
        <CreatorWorkspace zh={zh} />
      </main>

      <footer className="border-t border-border bg-[#eee9df] px-4 py-7 text-xs text-[#25221f]/65 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>
            LovCreate by{" "}
            <a
              className="underline underline-offset-4"
              href="https://lovstudio.ai"
            >
              LovStudio
            </a>
          </p>
          <p>Start with one sentence. Keep the judgment human.</p>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.querySelector<HTMLDivElement>("#root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
