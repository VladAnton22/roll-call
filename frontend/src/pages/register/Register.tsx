import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { ApiError } from "../../lib/api";
import FormField from "../../components/ui/FormField";
import Input from "../../components/ui/Input";
import PrimaryButton from "../../components/ui/PrimaryButton";

export function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (!username || !email || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (!email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setError(null);
    setSubmitting(true);
    try {
      await register(username, email, password);
      navigate("/", { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        // Backend detail is "Username already exists" / "Email already registered"
        setError(err.message || "That username or email is already taken.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center gap-6 px-6">
      <h1 className="text-2xl font-semibold text-content-primary">Create account</h1>

      <div className="flex flex-col gap-4">
        <FormField label="Username">
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
          />
        </FormField>

        <FormField label="Email">
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
        </FormField>

        <FormField label="Password" hint="At least 8 characters">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
        </FormField>
      </div>

      {error && <p className="text-sm text-weak-text">{error}</p>}

      <PrimaryButton onClick={handleSubmit} disabled={submitting}>
        {submitting ? "Creating account…" : "Create account"}
      </PrimaryButton>

      <p className="text-sm text-content-muted">
        Already have an account?{" "}
        <Link to="/login" className="text-brand-text hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}