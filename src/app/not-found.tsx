import Link from 'next/link'
 
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h2 className="text-4xl font-bold mb-4">404 - Sector Not Found</h2>
      <p className="text-slate-400 mb-8">The requested path could not be located in the Genesis database.</p>
      <Link href="/" className="px-6 py-3 bg-indigo-600 rounded-lg hover:bg-indigo-700 transition">
        Return to Home Beacon
      </Link>
    </div>
  )
}