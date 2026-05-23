"use client";

import { useEffect, useRef, useState } from "react";
import { auth, memory } from "@eazo/sdk";
import { useEazo } from "@eazo/sdk/react";

/**
 * SailWorld
 * ─────────────────────────────────────────────────────────────────
 * Hosts the standalone Three.js scene (public/sail.html) inside a
 * full-screen iframe so the scene stays a single hot-editable file.
 *
 * Adds an Eazo SDK layer on top of the iframe:
 *   • a small captain badge (the signed-in user) in the top-left corner
 *   • memory.reportAction() fires whenever the scene posts an
 *     `encounter:open` message from inside the iframe — so the app
 *     learns which figures the user has actually met.
 *
 * The iframe → parent bridge is intentionally optional. If the
 * scene never posts a message, the SDK simply isn't called. The
 * scene runs perfectly fine on its own outside Eazo too.
 */
export function SailWorld() {
  const user = useEazo((s) => s.auth.user);
  const loading = useEazo((s) => s.auth.loading);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeReady, setIframeReady] = useState(false);

  // Forward encounter events posted by sail.html to Eazo memory.
  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data;
      if (!data || typeof data !== "object") return;
      if (data.type === "encounter:open" && data.name) {
        // fire-and-forget — never block the UI on persistence
        memory.reportAction({
          content: `Captain met ${data.name}, who said: "${data.line ?? ""}"`,
          event_type: "encounter_open",
          page: "sail_the_mind",
          metadata: {
            type: "encounter",
            name: String(data.name),
            line: data.line ?? "",
            source: data.source ?? "",
          },
        }).catch(() => undefined);
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="fixed inset-0 w-screen h-screen">
      <iframe
        ref={iframeRef}
        src="/sail.html"
        title="Sail the Mind"
        className="block w-full h-full border-0"
        // sandbox intentionally NOT restrictive — the scene needs
        // pointer events, fullscreen audio, and module imports.
        allow="autoplay; pointer-lock; fullscreen"
        onLoad={() => setIframeReady(true)}
      />

      {/* Captain badge — only when authenticated, only after iframe ready */}
      {iframeReady && !loading && (
        <div
          className="pointer-events-auto fixed top-[94px] left-[22px] z-10"
          style={{
            fontFamily:
              "'Bricolage Grotesque', ui-sans-serif, system-ui, sans-serif",
          }}
        >
          {user ? (
            <div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full text-[11px] tracking-[0.05em]"
              style={{
                background: "color-mix(in oklch, oklch(20% 0.02 80) 32%, transparent)",
                border:
                  "1px solid color-mix(in oklch, oklch(95% 0.015 80) 18%, transparent)",
                color: "oklch(95% 0.015 80)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              <span
                style={{
                  fontFamily: "'Young Serif', serif",
                  fontStyle: "italic",
                  fontSize: "11px",
                  opacity: 0.7,
                }}
              >
                Captain
              </span>
              <span style={{ fontWeight: 500 }}>{user.displayName ?? user.email ?? "—"}</span>
            </div>
          ) : (
            <button
              onClick={() => auth.login().catch(() => undefined)}
              className="px-3 py-1.5 rounded-full text-[11px] tracking-[0.05em] cursor-pointer"
              style={{
                background: "color-mix(in oklch, oklch(20% 0.02 80) 32%, transparent)",
                border:
                  "1px solid color-mix(in oklch, oklch(95% 0.015 80) 18%, transparent)",
                color: "oklch(95% 0.015 80)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
            >
              ↪ Sign in to record your voyage
            </button>
          )}
        </div>
      )}
    </div>
  );
}
