import React from 'react';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-500">
            About Project
        </h1>

        <div className="prose prose-invert max-w-none">
            <p className="text-lg leading-relaxed mb-6">
                <strong>AudioML</strong> is an open-source audio classification tool designed to demonstrate the power of TensorFlow.js and Google's Teachable Machine. It provides a modern, interactive interface for analyzing audio signals directly in the browser.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 my-10">
                <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500/50 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-3">Real-time Analysis</h3>
                    <p>Instant classification of audio events using a pre-trained neural network running entirely client-side.</p>
                </div>
                 <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-purple-500/50 transition-colors">
                    <h3 className="text-xl font-bold text-white mb-3">Privacy First</h3>
                    <p>No audio data is sent to the server. All processing happens locally on your device, ensuring complete privacy.</p>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Origin Story: The Velosonics Initiative</h2>
            <p className="text-gray-300 mb-4 leading-relaxed">
                AudioML was developed as the technical deliverable for <strong>Velosonics</strong>, a conceptual project exploring data-led design in urban logistics.
            </p>
            <p className="text-gray-300 mb-6 leading-relaxed">
                Driven by <a href="https://sonicassembly.se" className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">Sonic Assembly</a> (Sweden) and MoveByBike Italy, the project tested experimental sound design techniques on cargo bikes in Verona, Italy. This code package was created to process the results—validating that spectrogram analysis can fill gaps in current simulation software for engineering and operational planning.
            </p>

            <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 mt-8 shadow-lg">
                <h3 className="text-lg font-semibold text-white mb-3">Project Support</h3>
                <p className="text-gray-400 mb-4">
                    This project was funded and supported by <strong>Creative FLIP</strong>, the <strong>European Commission</strong>, <strong>European Creative Hubs Network</strong>, and the <strong>Goethe Institute</strong>.
                </p>
                <div className="text-sm text-gray-500 border-t border-gray-700 pt-4 mt-4">
                    A collaboration between Sonic Assembly and MoveByBike.
                </div>
            </div>

            <h2 className="text-2xl font-bold text-white mt-12 mb-4">Credits</h2>
            <p className="mb-4">
                This project was built using:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-400 mb-8">
                <li><a href="https://react.dev/" className="text-blue-400 hover:underline">React</a> - for the UI framework.</li>
                <li><a href="https://tailwindcss.com/" className="text-blue-400 hover:underline">Tailwind CSS</a> - for styling.</li>
                <li><a href="https://www.tensorflow.org/js" className="text-blue-400 hover:underline">TensorFlow.js</a> - for machine learning.</li>
                <li><a href="https://vitejs.dev/" className="text-blue-400 hover:underline">Vite</a> - for build tooling.</li>
            </ul>
        </div>
      </div>
    </div>
  );
}
