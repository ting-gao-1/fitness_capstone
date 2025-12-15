import useSWR from "swr";
import { useAuth } from "../auth/AuthContext.jsx";
import { authedFetch } from "../lib/fetcher.js";
import { useState } from "react";
import AdviceWidget from "../widgets/AdviceWidget.jsx";
import WorkoutCard from "../widgets/WorkoutCard.jsx";

import ActivityChart from "../widgets/ActivityChart.jsx";

function todayStr() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function DashboardPage() {
  const { user, token, logout } = useAuth();

  const [date, setDate] = useState(todayStr());
  const [type, setType] = useState("Run");
  const [durationMin, setDurationMin] = useState(20);
  const [notes, setNotes] = useState("");


  const [rangeDays, setRangeDays] = useState(() => Number(localStorage.getItem("rangeDays") || 7));

  const { data, mutate, error, isLoading } = useSWR(
    token ? ["/api/workouts", token] : null,
    ([path, t]) => authedFetch(path, t)
  );

  async function createWorkout(e) {
    e.preventDefault();
    await authedFetch("/api/workouts", token, {
      method: "POST",
      body: JSON.stringify({
        date,
        type,
        durationMin: Number(durationMin),
        notes,
      }),
    });
    setNotes("");
    mutate();
  }

  const workouts = data?.workouts || [];

  return (
    <div className="page">
      <div className="container">
        <div className="topbar">
          <div>
            <h1 className="title">Dashboard</h1>
            <div className="muted">Welcome, {user?.name}</div>
          </div>
          <button className="btn" onClick={logout}>Logout</button>
        </div>

        <div className="grid2">
          
          <div className="stack">
            <div className="card">
              <strong>Add a workout</strong>
              <div className="hr" />

              <form className="formGrid" onSubmit={createWorkout}>
                <label className="label">
                  Date
                  <input className="input" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                </label>

                <label className="label">
                  Type
                  <select className="select" value={type} onChange={(e) => setType(e.target.value)}>
                    <option>Run</option>
                    <option>Walk</option>
                    <option>Lift</option>
                    <option>Yoga</option>
                    <option>Bike</option>
                  </select>
                </label>

                <label className="label">
                  Duration (min)
                  <input
                    className="input"
                    type="number"
                    min="1"
                    max="600"
                    value={durationMin}
                    onChange={(e) => setDurationMin(e.target.value)}
                  />
                </label>

                <label className="label">
                  Notes
                  <input className="input" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="How did it feel?" />
                </label>

                <button className="btn primary" type="submit">Add Workout</button>
              </form>
            </div>

            <div className="stack">
              {isLoading && <div className="card">Loading workouts...</div>}
              {error && <div className="card" style={{ borderColor: "rgba(255,80,120,0.6)" }}>
                <strong style={{ color: "#ff6b91" }}>Error</strong>
                <div className="muted" style={{ marginTop: 6 }}>{String(error.message || error)}</div>
              </div>}

              {workouts.map((w) => (
                <WorkoutCard key={w._id} workout={w} onChanged={mutate} />
              ))}
            </div>
          </div>


          <div className="stack">
            <AdviceWidget />
            
            <div className="card " style={{ gridColumn: "1 / -1" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                <strong>Activity</strong>
                <select
                  className="select"
                  style={{ width: 160 }}
                  value={rangeDays}
                  onChange={(e) => {
                    const v = Number(e.target.value);
                    setRangeDays(v);
                    localStorage.setItem("rangeDays", String(v));
                  }}
                >
                  <option value={7}>Last 7 days</option>
                  <option value={30}>Last 30 days</option>
                </select>
              </div>
              <div style={{ marginTop: 10 }}>
                <ActivityChart workouts={workouts} days={rangeDays} />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
