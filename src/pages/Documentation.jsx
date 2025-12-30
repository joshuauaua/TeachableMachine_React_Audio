import React from 'react';

export default function Documentation() {
  return (
    <div className="min-h-screen bg-gray-900 text-gray-300 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-white bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Documentation
        </h1>
        
        <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">How to Use</h2>
            <p className="mb-4 leading-relaxed">
                This project uses a <span className="text-blue-400 font-semibold">Teachable Machine Audio model</span> to classify audio input from your microphone in real-time.
            </p>
            <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Navigate to the <strong>Tool</strong> page.</li>
                <li>Grant microphone permissions when prompted by the browser.</li>
                <li>Click the <strong>Start</strong> button to begin audio classification.</li>
                <li>View real-time results on the dashboard including the spectrogram and confidence scores.</li>
            </ul>
        </section>

        <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Customizing the Model</h2>
            <p className="mb-4">You can replace the default model with your own trained model from Google's Teachable Machine.</p>
            
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-medium text-white mb-4">Steps to Replace:</h3>
                <ol className="list-decimal list-inside space-y-3 text-gray-400">
                    <li>Train your audio model on <a href="https://teachablemachine.withgoogle.com/" className="text-blue-400 hover:text-blue-300 underline transition-colors" target="_blank" rel="noopener noreferrer">Teachable Machine</a>.</li>
                    <li>Click <strong>“Export Model”</strong> and select the <strong>“TensorFlow.js”</strong> tab.</li>
                    <li>Copy the model URL (it should end with a trailing slash <code>/</code>).</li>
                    <li>Open <code className="bg-gray-700 px-1 py-0.5 rounded text-gray-200">src/pages/Tool.jsx</code> in your editor.</li>
                    <li>Find the <code className="bg-gray-700 px-1 py-0.5 rounded text-gray-200">setupModel</code> function and replace the <code className="bg-gray-700 px-1 py-0.5 rounded text-gray-200">URL</code> constant with your new model URL.</li>
                </ol>
            </div>
        </section>

         <section>
            <h2 className="text-2xl font-semibold mb-4 text-white border-b border-gray-700 pb-2">Troubleshooting</h2>
            <div className="space-y-4">
                <div>
                    <h3 className="text-lg font-medium text-white">Microphone not working?</h3>
                    <p className="text-gray-400">Ensure you have allowed browser permissions. Check your system sound settings to verify the input device.</p>
                </div>
                 <div>
                    <h3 className="text-lg font-medium text-white">Model not loading?</h3>
                    <p className="text-gray-400">Verify your internet connection. Teachable Machine models are hosted online and require network access to fetch the <code>model.json</code> and <code>metadata.json</code> files.</p>
                </div>
            </div>
        </section>
      </div>
    </div>
  );
}
