export default function ResumePage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      <h1 className="text-4xl font-bold text-yellow-400 mb-6 drop-shadow-lg">
        Resume Builder
      </h1>
      <p className="text-lg text-gray-300 max-w-xl text-center mb-8">
        Start building your trade resume right here.
      </p>
      <a
        href="/"
        className="px-6 py-3 bg-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-700 transition"
      >
        Back Home
      </a>
    </main>
  )
}
