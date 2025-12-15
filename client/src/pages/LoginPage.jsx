import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

export default function LoginPage() {
  const nav = useNavigate();
  const { loginWithGoogleIdToken } = useAuth();

  return (
    <div className="page">
      <div className="container narrow">
        <div className="card">
          <h1 className="title">Workout Tracker</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            Track workouts, view trends, and get a daily inspiration.
          </p>

          <div className="hr" />

          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0" }}>
            <GoogleLogin
              onSuccess={async (cred) => {
                try {
                  await loginWithGoogleIdToken(cred.credential);
                  nav("/dashboard");
                } catch {
                  alert("Login failed");
                }
              }}
              onError={() => alert("Login error")}
            />
          </div>

          <p className="muted small" style={{ marginTop: 10 }}>
            OAuth is used for authentication. Your workouts are stored per-user.
          </p>
        </div>
      </div>
    </div>
  );
}
