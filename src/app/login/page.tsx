// src/app/login/page.tsx
import { loginAction } from './actions';

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold mb-4">Dessert99 — Sign in</h2>

        <form action={loginAction}>
          <label className="block mb-2">
            <span className="text-sm">Email</span>
            <input name="email" type="email" required className="mt-1 block w-full p-2 border rounded" />
          </label>

          <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
            Send magic link
          </button>
        </form>

        <p className="text-sm mt-4 text-gray-500">
          This sends a magic-link email (email-based signin). You can replace this with password signin or the Auth UI later.
        </p>
      </div>
    </div>
  );
}
