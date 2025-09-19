export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="p-6 rounded-lg shadow bg-white w-80">
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form className="flex flex-col space-y-3">
          <input
            type="email"
            placeholder="Email"
            className="border rounded p-2"
          />
          <input
            type="password"
            placeholder="Password"
            className="border rounded p-2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </button>
        </form>
      </div>
    </main>
  )
}
