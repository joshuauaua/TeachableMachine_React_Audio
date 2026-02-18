import React, { useState } from 'react';

const DocSection = ({ title, children }) => (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        <h2 className="text-3xl font-bold mb-6 text-white border-b border-gray-700 pb-4">{title}</h2>
        <div className="text-gray-300 space-y-4 leading-relaxed">
            {children}
        </div>
    </div>
);

export default function Documentation() {
  const [activeTab, setActiveTab] = useState('getting-started');

  const menuItems = [
    { id: 'background', label: 'Background', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
        </svg>
    )},
    { id: 'getting-started', label: 'Getting Started', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
        </svg>
    )},
    { id: 'teachable-machine', label: 'Teachable Machine', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23-.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        </svg>
    )},
    { id: 'live-analysis', label: 'Live Analysis', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
             <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
        </svg>
    )},
    { id: 'session-analytics', label: 'Session Analytics', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
        </svg>
    )},
    { id: 'repository', label: 'Repository', icon: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75L16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
        </svg>
    )}
  ];

  const renderContent = () => {
    switch (activeTab) {
        case 'background':
            return (
                <DocSection title="Background">
                    <p>
                        This project explores the intersection of machine learning and audio processing in the web browser. 
                        Leveraging standard web technologies, it demonstrates real-time audio classification using pre-trained models.
                    </p>
                    <p>
                        Built with React and TensorFlow.js, this application provides a platform for experimenting with 
                        sound recognition models trained on Google's Teachable Machine, offering visual feedback and session analytics.
                    </p>
                </DocSection>
            );
        case 'getting-started':
            return (
                <DocSection title="Getting Started">
                    <p>
                        This project uses a <span className="text-blue-400 font-semibold">Teachable Machine Audio model</span> to classify audio input from your microphone in real-time.
                    </p>
                    <h3 className="text-xl font-semibold text-white mt-6 mb-3">Quick Start</h3>
                    <ul className="list-disc list-inside space-y-2 ml-4 mb-6">
                        <li>Navigate to the <strong>Tool</strong> page.</li>
                        <li>Grant microphone permissions when prompted by the browser.</li>
                        <li>Click the <strong>microhone icon</strong> to begin audio classification.</li>
                        <li>View real-time results on the dashboard including the spectrogram and confidence scores.</li>
                    </ul>
                    
                     <h3 className="text-xl font-semibold text-white mt-6 mb-3">Prerequisites</h3>
                     <p>
                        Ensure you are using a modern web browser (Edge, Chrome, Firefox, Safari) that supports the Web Audio API and microphone access.
                     </p>
                </DocSection>
            );
        case 'teachable-machine':
            return (
                <DocSection title="Teachable Machine Integration">
                     <p className="mb-4">You can replace the default model with your own trained model from Google's Teachable Machine.</p>
            
                        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
                            <h3 className="text-lg font-medium text-white mb-4">Steps to Replace:</h3>
                            <ol className="list-decimal list-inside space-y-3 text-gray-400">
                                <li>Train your audio model on <a href="https://teachablemachine.withgoogle.com/" className="text-blue-400 hover:text-blue-300 underline transition-colors" target="_blank" rel="noopener noreferrer">Teachable Machine</a>.</li>
                                <li>Click <strong>“Export Model”</strong> and select the <strong>“TensorFlow.js”</strong> tab.</li>
                                <li>Copy the model URL (it should end with a trailing slash <code>/</code>).</li>
                                <li>Open the Tool page and click <strong>"Load Custom Model"</strong>.</li>
                                <li>Paste your URL to load your custom model instantly.</li>
                            </ol>
                        </div>
                </DocSection>
            );
        case 'live-analysis':
            return (
                <DocSection title="Live Analysis">
                    <p>
                        The Live Analysis view provides real-time visualization of the audio input and classification results.
                    </p>
                     <h3 className="text-xl font-semibold text-white mt-6 mb-3">Features</h3>
                     <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Spectrogram:</strong> A visual representation of the spectrum of frequencies of a signal as it varies with time.</li>
                        <li><strong>Confidence Scores:</strong> Real-time probability bars showing the model's confidence for each trained class.</li>
                        <li><strong>Timeline:</strong> A scrolling history of detected events over the session.</li>
                    </ul>
                </DocSection>
            );
        case 'session-analytics':
            return (
                <DocSection title="Session Analytics">
                    <p>
                        The Session Analytics dashboard aggregates data from your recording session to provide insights into the audio events detected.
                    </p>
                    <h3 className="text-xl font-semibold text-white mt-6 mb-3">Key Metrics</h3>
                     <ul className="list-disc list-inside space-y-2 ml-4">
                        <li><strong>Event Count:</strong> Total number of times each class was detected.</li>
                        <li><strong>Duration:</strong> Total time spent in each state.</li>
                        <li><strong>Confidence Distribution:</strong> How confident the model was for specific detections.</li>
                    </ul>
                </DocSection>
            );
        case 'repository':
             return (
                <DocSection title="Repository">
                    <p>
                        This project is open source and available on GitHub.
                    </p>
                    <div className="mt-6">
                        <a 
                            href="https://github.com/joshua-huang/audio-ml-react" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-600 px-6 py-3 rounded-lg transition-colors text-white"
                        >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                            </svg>
                            <span>View on GitHub</span>
                        </a>
                    </div>
                </DocSection>
            );
        default:
            return <div className="text-gray-400">Select a section from the sidebar.</div>;
    }
  };

  return (
    <div className="h-full flex-grow bg-gray-900 text-white flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[10%] left-[20%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[150px] opacity-10 animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[40%] h-[40%] bg-purple-600 rounded-full blur-[150px] opacity-10 animate-pulse"></div>
      </div>

      <div className="flex flex-1 h-full overflow-hidden relative z-10">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/50 backdrop-blur-md border-r border-white/10 flex-col p-4 hidden md:flex">
            <div className="mb-8 px-2 pt-4">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Documentation</h2>
            </div>
            
            <nav className="space-y-2 overflow-y-auto">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                            activeTab === item.id 
                            ? 'bg-blue-600 shadow-lg shadow-blue-900/50 text-white' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        {item.icon}
                        <span className="font-medium text-sm text-left">{item.label}</span>
                    </button>
                ))}
            </nav>
        </aside>

        {/* Mobile Tab Bar (Visible only on small screens) */}
        <div className="md:hidden flex overflow-x-auto p-4 gap-2 bg-gray-900/80 backdrop-blur border-b border-gray-800">
             {menuItems.map((item) => (
                 <button 
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-medium ${activeTab === item.id ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 border border-gray-700'}`}
                >
                    {item.label}
                </button>
             ))}
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="w-full max-w-4xl mx-auto pt-4 pb-12">
                {renderContent()}
            </div>
        </main>
      </div>
    </div>
  );
}
