import { useAuth } from "../auth/AuthContext.jsx";
import { authedFetch } from "../lib/fetcher.js";
import { useState } from "react";
import Toast from "./Toast.jsx";

export default function WorkoutCard({ workout, onChanged }) {
  const { token } = useAuth();
  const [toast, setToast] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [date, setDate] = useState(workout.date);
  const [type, setType] = useState(workout.type);
  const [durationMin, setDurationMin] = useState(workout.durationMin);
  const [notes, setNotes] = useState(workout.notes || "");

  function startEdit() {
    setDate(workout.date);
    setType(workout.type);
    setDurationMin(workout.durationMin);
    setNotes(workout.notes || "");
    setIsEditing(true);
  }

  function cancelEdit() {
    setIsEditing(false);
  }

  async function save() {
    await authedFetch(`/api/workouts/${workout._id}`, token, {
      method: "PUT",
      body: JSON.stringify({
        date,
        type,
        durationMin: Number(durationMin),
        notes,
      }),
    });
    setToast("Saved!");
    setIsEditing(false);
    onChanged(); // SWR mutate
  }

  async function del() {
    await authedFetch(`/api/workouts/${workout._id}`, token, { method: "DELETE" });
    setToast("Deleted!");
    onChanged();
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
      {!isEditing ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
            <strong>
              {workout.type} • {workout.durationMin} min
            </strong>
            <div style={{ display: "flex", gap: 8 }}>
              <button data-testid="w-edit" onClick={startEdit}>Edit</button>
              <button data-testid="w-del" onClick={del}>Delete</button>
            </div>
          </div>

          <div style={{ opacity: 0.7, marginTop: 4 }}>{workout.date}</div>
          {workout.notes ? <div style={{ marginTop: 6 }}>{workout.notes}</div> : null}
        </>
      ) : (
        <>
          <div style={{ display: "grid", gap: 8 }}>
            <label>
              Date
              <input data-testid="w-edit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </label>

            <label>
              Type
              <select data-testid="w-edit-type" value={type} onChange={(e) => setType(e.target.value)}>
                <option>Run</option>
                <option>Walk</option>
                <option>Lift</option>
                <option>Yoga</option>
                <option>Bike</option>
              </select>
            </label>

            <label>
              Duration (min)
              <input
                data-testid="w-edit-duration"
                type="number"
                min="1"
                max="600"
                value={durationMin}
                onChange={(e) => setDurationMin(e.target.value)}
              />
            </label>

            <label>
              Notes
              <input data-testid="w-edit-notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </label>

            <div style={{ display: "flex", gap: 8 }}>
              <button data-testid="w-save" onClick={save}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        </>
      )}

      {toast && <Toast text={toast} onDone={() => setToast("")} />}
    </div>
  );
}
