import dynamic from 'next/dynamic'

const MapWithMarkers = dynamic(() => import('../components/MapWithMarkers'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">Loading map...</div>
  ),
})

export default function Home() {
  return (
    <main className="h-screen flex flex-col">
      <header className="bg-gray-900 text-white p-4 z-10">
        <h1 className="text-2xl font-bold">Beacon Games - Emergency Response Simulator</h1>
      </header>
      <div className="flex-1 relative">
        <MapWithMarkers />
      </div>
    </main>
  )
}
