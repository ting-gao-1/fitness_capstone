import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext.jsx";
import { useMachine } from "@xstate/react";
import { createMachine, assign } from "xstate";

const machine = createMachine({
  id: "quote",
  initial: "idle",
  context: {
    quote: null,
    error: "",
  },
  states: {
    idle: {
      on: { FETCH: "loading" },
    },
    loading: {
      on: {
        RESOLVE: {
          target: "success",
          actions: assign({
            quote: ({ event }) => event.data,
            error: () => "",
          }),
        },
        REJECT: {
          target: "failure",
          actions: assign({
            error: ({ event }) => String(event.error || "Failed"),
          }),
        },
      },
    },
    success: {
      on: { REFRESH: "loading" },
    },
    failure: {
      on: { RETRY: "loading" },
    },
  },
});

export default function AdviceWidget() {
  const { token } = useAuth();

  const [state, send] = useMachine(machine);

  async function fetchQuote() {
    try {
      const base = import.meta.env.VITE_API_BASE_URL;
      const r = await fetch(`${base}/api/external/quote`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data?.error || "External API failed");

      send({ type: "RESOLVE", data });
    } catch (e) {
      send({ type: "REJECT", error: e?.message || String(e) });
    }
  }

  // 当进入 loading 状态时，触发一次请求
  useEffect(() => {
    if (!token) return;

    if (state.matches("idle")) {
      send({ type: "FETCH" });
      return;
    }

    if (state.matches("loading")) {
      fetchQuote();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, state.value]);

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
      <strong>Daily Inspiration </strong>

      {state.matches("idle") && <p>Ready</p>}
      {state.matches("loading") && <p>Loading...</p>}

      {state.matches("failure") && (
        <div>
          <p style={{ color: "crimson" }}>Error: {state.context.error}</p>
          <button onClick={() => send({ type: "RETRY" })}>Retry</button>
        </div>
      )}

      {state.matches("success") && (
        <div style={{ marginTop: 8 }}>
          <div>"{state.context.quote?.quote}"</div>
          <div style={{ opacity: 0.7 }}>— {state.context.quote?.author}</div>
          <button style={{ marginTop: 8 }} onClick={() => send({ type: "REFRESH" })}>
            Refresh
          </button>
        </div>
      )}
    </div>
  );
}
