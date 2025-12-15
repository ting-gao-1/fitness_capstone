import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

function dayKey(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
function label(d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

export default function WeeklyChart({ workouts }) {
  const byDate = new Map();
  for (const w of workouts) {
    byDate.set(w.date, (byDate.get(w.date) || 0) + Number(w.durationMin || 0));
  }

  const data = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    data.push({ day: label(d), minutes: byDate.get(key) || 0 });
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
      <strong>Last 7 Days (minutes)</strong>
      <div style={{ width: "100%", height: 220, marginTop: 8 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
