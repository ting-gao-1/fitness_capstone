import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";

function dayKey(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`; 
}

function labelMMDD(d) {
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${mm}-${dd}`;
}

export default function ActivityChart({ workouts, days = 7 }) {

  const byDate = new Map();
  for (const w of workouts) {
    const k = w.date;
    byDate.set(k, (byDate.get(k) || 0) + Number(w.durationMin || 0));
  }

  const data = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = dayKey(d);
    data.push({
      day: labelMMDD(d),
      minutes: byDate.get(key) || 0,
    });
  }

  return (
    <div style={{ border: "1px solid #ddd", borderRadius: 12, padding: 12 }}>
      <strong>Last {days} Days (minutes)</strong>
      <div style={{ width: "100%", height: 260, marginTop: 8 }}>
        <ResponsiveContainer>
          <BarChart data={data}>
            <XAxis dataKey="day" interval={days > 7 ? 3 : 0} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="minutes" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
