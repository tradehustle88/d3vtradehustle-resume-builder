export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-black to-blue-900 text-white text-center px-6">
      <h1 className="text-5xl font-extrabold text-yellow-400 drop-shadow-lg mb-6">
        WELCOME TO THE GRIND
      </h1>
      <p className="text-xl text-gray-300 max-w-2xl mb-8">
        Built for the Trade. Backed by Hustle. 
        Power up your career with the <span className="text-red-500 font-bold">Trade Hustle Resume Builder</span>.
      </p>
      <a
        href="/resume"
        className="px-6 py-3 bg-red-600 rounded-lg text-lg font-semibold hover:bg-red-700 transition"
      >
        HUSTLE NOW
      </a>
    </main>
  )
}
