import Link from "next/link";

export default function LoginPage() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Login</h1>
      <p>Inicia sesión con:</p>
      <ul>
        <li><Link href="/api/auth/signin/google">Google</Link></li>
        <li><Link href="/api/auth/signin/facebook">Facebook</Link></li>
      </ul>
    </main>
  );
}