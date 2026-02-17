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
        setIsModelLoading(false);
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
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center relative overflow-hidden p-6 gap-8">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-purple-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
      </div>
      
      {/* Main Content Wrapper */}
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col gap-8">

        {/* Custom Model Input */}
         <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4">Model Configuration</h2>
            <form onSubmit={handleUrlSubmit} className="flex flex-col md:flex-row gap-4">
                <div className="flex-grow">
                     <label htmlFor="model-url" className="sr-only">Teachable Machine Model URL</label>
                    <input
                        type="text"
                        id="model-url"
                        value={inputURL}
                        onChange={(e) => setInputURL(e.target.value)}
                        placeholder="Paste your Teachable Machine model URL here..."
                        className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    />
                </div>
                <button
                    type="submit"
                    disabled={isModelLoading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {isModelLoading ? "Loading Model..." : "Load Model"}
                </button>
            </form>
            {modelError && (
                <div className="mt-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-200 text-sm">
                    {modelError}
                </div>
            )}
             {!modelError && !isModelLoading && labels.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                    <span className="text-gray-400 text-sm py-1">Loaded classes:</span>
                    {labels.map(label => (
                        <span key={label} className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-md border border-gray-600">
                            {label}
                        </span>
                    ))}
                </div>
            )}
        </div>

        {/* Top Split Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left: Microphone Control */}
            <div className="lg:col-span-4 flex flex-col items-center justify-center bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-700 transition-all hover:bg-gray-800 hover:shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-2">Live Analysis</h2>
            <p className="text-gray-400 mb-8 text-center">Click to start real-time classification</p>
            
            <button
                onClick={isListening ? stopListening : startListening}
                className={`
                    w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg
                    ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}
                `}
            >
                    {isListening ? <StopIcon /> : <MicIcon />}
            </button>
            
            <div className={`mt-6 font-semibold px-4 py-1 rounded-full text-sm ${isSaving ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50' : isListening ? 'bg-red-900/30 text-red-400 border border-red-900/50' : 'bg-gray-700 text-gray-400 border border-gray-600'}`}>
                    {isSaving ? "SAVING..." : isListening ? "RECORDING ACTIVE" : "READY TO RECORD"}
            </div>
            
            {!isListening && fullSpectrogramData.length > 0 && (
                <button
                    onClick={handleSaveRecording}
                    disabled={isSaving}
                    className="mt-4 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                    </svg>
                    Save Recording
                </button>
            )}
            </div>

            {/* Right: Live Dashboard Cards */}
            <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Audio Visualizer Card */}
                <div className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md p-4 col-span-1 md:col-span-2 border border-gray-700">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Spectrogram</h3>
                    <div className="h-48 overflow-hidden rounded-lg bg-gray-900/50 border border-gray-700/50 flex items-center justify-center">
                        <AudioVisualizer scores={scores} labels={labels} />
                    </div>
                </div>

                {/* Timeline Live View */}
                <div className="bg-gray-800/80 backdrop-blur-md rounded-xl shadow-md p-4 col-span-1 md:col-span-2 border border-gray-700">
                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Live Timeline</h3>
                    <div className="flex items-center justify-center h-full min-h-[200px] overflow-hidden rounded-lg bg-gray-900/50 border border-gray-700/50">
                    <div className="flex items-center justify-center h-full min-h-[200px] overflow-hidden rounded-lg bg-gray-900/50 border border-gray-700/50">
                        <LiveSpectrogram spectrogramData={spectrogramData} />
                    </div>
                    </div>
                </div>
            </div>
        </div>

        {/* Bottom: Summary Dashboard */}
        <div className="bg-gray-800/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Session Analytics</h2>
                    <p className="text-gray-400">Post-analysis summary of classified audio events</p>
                </div>
            </div>
            <SummaryDashboard history={activations} />
        </div>
      </div>

    </div>
  );
}
