import React, { useEffect, useState } from "react";
import AudioVisualizer from "../components/audio_visualizer.jsx";
import LiveSpectrogram from "../components/LiveSpectrogram.jsx";

import { SummaryDashboard } from "../components/summary_dashboard.jsx";
import "../components/audio_visualizer.css";

// Icons
const MicIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
);

const StopIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
    </svg>
);


export default function Tool() {
  const [labels, setLabels] = useState([]);
  const [scores, setScores] = useState({});
  const [recognizer, setRecognizer] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [activations, setActivations] = useState([]);
  const [modelURL, setModelURL] = useState("https://teachablemachine.withgoogle.com/models/0ujPt5IIA/");
  const [inputURL, setInputURL] = useState("https://teachablemachine.withgoogle.com/models/0ujPt5IIA/");
  const [isModelLoading, setIsModelLoading] = useState(false);

  const [modelError, setModelError] = useState(null);
  const [spectrogramData, setSpectrogramData] = useState(null);
  const [fullSpectrogramData, setFullSpectrogramData] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('live');



  const setupModel = async (url) => {
    try {
        setIsModelLoading(true);
        setModelError(null);
        
        // Stop existing recognizer if any
        if (recognizer) {
             await recognizer.stopListening();
             setIsListening(false);
        }

        const checkpointURL = url + "model.json";
        const metadataURL = url + "metadata.json";

        const rec = window.speechCommands.create(
            "BROWSER_FFT",
            undefined,
            checkpointURL,
            metadataURL
        );

        await rec.ensureModelLoaded();
        const classLabels = rec.wordLabels();
        setLabels(classLabels);
        setRecognizer(rec);
        setRecognizer(rec);
        setIsModelLoading(false);
        setIsModalOpen(false); // Close modal on success
    } catch (err) {
        console.error("Failed to load model:", err);
        setModelError("Failed to load model. Please check the URL and try again.");
        setIsModelLoading(false);
    }
  };

  useEffect(() => {
    if (window.speechCommands) setupModel(modelURL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelURL]);

  const handleUrlSubmit = (e) => {
      e.preventDefault();
      let url = inputURL.trim();
      if (!url.endsWith('/')) {
          url += '/';
      }
      setModelURL(url);
  };

  const startListening = () => {
    if (recognizer && !isListening) {
      const startTime = Date.now();
      setFullSpectrogramData([]); // Clear previous data

      recognizer.listen(
        (result) => {
          const newScores = {};
          recognizer.wordLabels().forEach((label, i) => {
            newScores[label] = result.scores[i];

            if (result.scores[i] > 0.5) {
              setActivations((prev) => [
                ...prev,
                {
                  timestamp: Date.now() - startTime,
                  label: label,
                  scores: newScores,
                },
              ]);
            }
          });
          setScores(newScores);
          
          if (result.spectrogram) {
              setSpectrogramData(result.spectrogram);
              // Accumulate data: we need to clone it as it might be a typed array view reused by TFJS
              const frameData = Array.from(result.spectrogram.data);
              setFullSpectrogramData(prev => [...prev, {
                  data: frameData,
                  frameSize: result.spectrogram.frameSize,
                  timestamp: Date.now() - startTime
              }]);
          }
        },
        {
          includeSpectrogram: true,
          probabilityThreshold: 0.75,
          invokeCallbackOnNoiseAndUnknown: true,
          overlapFactor: 0.5,
        }
      );
      // Hack to get access to spectrogram data per frame if listen() callback doesn't provide it conveniently enough?
      // Actually recognizer.listen callback receives 'result'.
      // result.spectrogram is { data: Float32Array, frameSize: number }
      
      // We need to hook into the callback properly.
      // The callback above handles predictions.
      // To get raw spectrogram data continuously, we might need to check if 'result' has it.
      // Yes, result.spectrogram should be there.
      
      // Let's wrap the callback to ensure we extract it.
      // The current callback:
      // (result) => { ... }
      
      // I'll update the callback in the previous chunk.
      // Wait, I can't easily replace the *inside* of the callback without replacing the whole block.
      // Let's replace the whole startListening function to be safe and clean.
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognizer && isListening) {
      recognizer.stopListening();
      setIsListening(false);
    }
  };


  const handleSaveRecording = async () => {
        if (fullSpectrogramData.length === 0) return;

        setIsSaving(true);
        try {
            const response = await fetch('http://localhost:3001/api/recordings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    modelName: modelURL,
                    classes: labels,
                    spectrogramData: fullSpectrogramData
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to save recording');
            }

            const data = await response.json();
            alert(`Recording saved! ID: ${data.id}`);
            // Optional: Clear data or keep it?
        } catch (error) {
            console.error('Error saving recording:', error);
            alert('Failed to save recording. Is the backend server running?');
        } finally {
            setIsSaving(false);
        }
  };

  return (
    <div className="h-full flex-grow bg-gray-900 text-white flex flex-col relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
      </div>
      


      <div className="flex flex-1 h-full overflow-hidden relative z-10">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-900/50 backdrop-blur-md border-r border-white/10 flex-col p-4 hidden md:flex">
            <div className="mb-8 px-2">
                <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">Toolbox</h2>
            </div>
            
            <nav className="space-y-2">
                <button
                    onClick={() => setActiveTab('live')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === 'live' 
                        ? 'bg-blue-600 shadow-lg shadow-blue-900/50 text-white' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
                    </svg>
                    <span className="font-medium">Live Analysis</span>
                </button>

                <button
                    onClick={() => setActiveTab('analytics')}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                        activeTab === 'analytics' 
                        ? 'bg-purple-600 shadow-lg shadow-purple-900/50 text-white' 
                        : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
                    </svg>
                    <span className="font-medium">Session Analytics</span>
                </button>
            </nav>
        </aside>

        {/* Mobile Tab Bar (Visible only on small screens) */}
        <div className="md:hidden absolute top-20 left-4 z-40 flex gap-2">
            <button 
                onClick={() => setActiveTab('live')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'live' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400'}`}
            >
                Live
            </button>
            <button 
                onClick={() => setActiveTab('analytics')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${activeTab === 'analytics' ? 'bg-purple-600 text-white' : 'bg-gray-800 text-gray-400'}`}
            >
                Analytics
            </button>
        </div>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
            <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 pt-12 md:pt-0">
                
                {/* Modal Overlay - Moved inside but fixed */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
                        <div className="bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-700 overflow-hidden transform transition-all scale-100 opacity-100">
                            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">Load Custom Model</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="p-6">
                                <p className="text-gray-400 text-sm mb-4">
                                    Paste the URL of your trained sound model from <a href="https://teachablemachine.withgoogle.com/" target="_blank" rel="noreferrer" className="text-blue-400 hover:text-blue-300 underline">Teachable Machine</a>.
                                </p>
                                
                                <form onSubmit={handleUrlSubmit} className="flex flex-col gap-4">
                                    <div>
                                        <label htmlFor="model-url" className="sr-only">Model URL</label>
                                        <input
                                            type="text"
                                            id="model-url"
                                            value={inputURL}
                                            onChange={(e) => setInputURL(e.target.value)}
                                            placeholder="https://teachablemachine.withgoogle.com/models/..."
                                            className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                    
                                    {modelError && (
                                        <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm">
                                            {modelError}
                                        </div>
                                    )}

                                    <div className="flex gap-3 justify-end mt-2">
                                        <button
                                            type="button"
                                            onClick={() => setIsModalOpen(false)}
                                            className="px-4 py-2 text-gray-300 hover:text-white"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={isModelLoading}
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {isModelLoading && (
                                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                            )}
                                            {isModelLoading ? "Loading..." : "Load Model"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content: Live Analysis */}
                {activeTab === 'live' && (
                    <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* Header & Active Model Info */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-gray-700/50 pb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Live Analysis</h2>
                                <p className="text-gray-400 text-sm">Real-time audio classification</p>
                            </div>

                            <div className="flex flex-col md:flex-row items-end md:items-center gap-4">
                                <button 
                                    onClick={() => setIsModalOpen(true)}
                                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg border border-gray-600 shadow-sm flex items-center gap-2 transition-all text-sm font-medium"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                                    </svg>
                                    Load Model
                                </button>
                            {/* Active Model Badge */}
                            {labels.length > 0 && (
                                <div className="flex flex-col items-end gap-2">
                                    <div className="flex items-center gap-2 bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-700">
                                        <span className="text-gray-400 text-xs uppercase tracking-wider font-semibold">Model</span>
                                        <span className="text-blue-400 text-sm font-medium truncate max-w-[200px]" title={modelURL}>{modelURL}</span>
                                    </div>
                                    <div className="flex flex-wrap gap-1 justify-end">
                                        {labels.map(label => (
                                            <span key={label} className="bg-gray-700/50 text-gray-300 text-[10px] px-2 py-0.5 rounded-full border border-gray-600">
                                                {label}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                            {/* Left: Microphone Control */}
                            <div className="lg:col-span-4 flex flex-col items-center justify-center p-4 border-r border-gray-700/50 pr-8">
                                <p className="text-gray-400 mb-8 text-center font-medium">Toggle Microphone</p>
                                
                                <button
                                    onClick={isListening ? stopListening : startListening}
                                    className={`
                                        w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-xl ring-4 ring-offset-4 ring-offset-gray-900
                                        ${isListening ? 'bg-red-500 hover:bg-red-600 ring-red-900/50 animate-pulse' : 'bg-blue-600 hover:bg-blue-700 ring-blue-900/50'}
                                    `}
                                >
                                        {isListening ? <StopIcon /> : <MicIcon />}
                                </button>
                                
                                <div className={`mt-8 font-bold px-6 py-2 rounded-full text-sm tracking-wide ${isSaving ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50' : isListening ? 'bg-red-900/30 text-red-500 border border-red-900/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' : 'bg-gray-800 text-gray-400 border border-gray-600'}`}>
                                        {isSaving ? "SAVING RECORDING..." : isListening ? "● LISTENING" : "READY TO START"}
                                </div>
                                
                                {!isListening && fullSpectrogramData.length > 0 && (
                                    <button
                                        onClick={handleSaveRecording}
                                        disabled={isSaving}
                                        className="mt-6 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2 shadow-lg"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                        </svg>
                                        Save Session to Analytics
                                    </button>
                                )}
                            </div>

                            {/* Right: Visualizations */}
                            <div className="lg:col-span-8 flex flex-col gap-6">
                                {/* Audio Visualizer Section */}
                                <div className="bg-gray-900/30 rounded-xl p-4 border border-white/5">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                        Real-time Spectrogram
                                    </h3>
                                    <div className="h-40 overflow-hidden rounded-lg bg-black/40 border border-gray-700/30 flex items-center justify-center">
                                        <AudioVisualizer scores={scores} labels={labels} />
                                    </div>
                                </div>

                                {/* Timeline Section */}
                                <div className="bg-gray-900/30 rounded-xl p-4 border border-white/5 flex-grow">
                                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                        History Timeline
                                    </h3>
                                    <div className="flex items-center justify-center min-h-[180px] overflow-hidden rounded-lg bg-black/40 border border-gray-700/30">
                                        <LiveSpectrogram spectrogramData={spectrogramData} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Tab Content: Analytics */}
                {activeTab === 'analytics' && (
                    <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Session Analytics</h2>
                                <p className="text-gray-400">Post-analysis summary of classified audio events</p>
                            </div>
                        </div>
                        <SummaryDashboard history={activations} />
                    </div>
                )}

            </div>
        </main>
      </div>
    </div>
  );
}
