export default function HomePage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Welcome to Dessert99 CRM</h1>
        <p className="mt-2 text-gray-600">Please <a href="/login" className="text-blue-600 underline">login</a> to continue.</p>
      </div>
    </main>
  )
}
