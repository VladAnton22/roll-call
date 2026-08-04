import { useState } from "react";
import {Link, useNavigate} from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";
import { ApiError } from "../../lib/api.ts";
import FormField from "../../components/ui/FormField.tsx";
import PrimaryButton from "../../components/ui/PrimaryButton.tsx";
import Input from "../../components/ui/Input.tsx";

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setError(null);
    setSubmitting(true);
    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(
        err instanceof ApiError && err.status === 401
          ? "Incorrect username or password"
          : "Something went wrong. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <h1 className="text-2xl font-semibold text-content-primary">Sign in</h1>

      <div className="flex flex-col gap-4">
        <FormField label="Username">
          <Input type="text" value={username}
            onChange={(e) => setUsername(e.target.value)} autoComplete="username" />
        </FormField>

        <FormField label="Password">

          <Input type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} autoComplete="password" />
        </FormField>
      </div>

      {error && <p className="text-sm text-weak-text">{error}</p>}

      <PrimaryButton onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Signing in…" : "Sign in"}
      </PrimaryButton>
      <p className="text-sm text-content-muted">
        Don't have an account?{" "}
        <Link to="/register" className="text-brand-text hover:underline">
          Create one
        </Link>
      </p>
    </div>
  );
}