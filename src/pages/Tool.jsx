import React, { useEffect, useState } from "react";
import AudioVisualizer from "../components/audio_visualizer.jsx";
import TimelineGraph from "../components/timeline_graph.jsx";
import { RadialClassDistribution } from "../components/radial_class_distribution.jsx";
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


  //Update const URL with your own URL from Teachable Machine
  useEffect(() => {
    const setupModel = async () => {
      const URL = "https://teachablemachine.withgoogle.com/models/0ujPt5IIA/";
      const checkpointURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

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
    };

    if (window.speechCommands) setupModel();
  }, []);

  const startListening = () => {
    if (recognizer && !isListening) {
      const startTime = Date.now();

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
        },
        {
          includeSpectrogram: true,
          probabilityThreshold: 0.75,
          invokeCallbackOnNoiseAndUnknown: true,
          overlapFactor: 0.5,
        }
      );
      setIsListening(true);
    }
  };

  const stopListening = () => {
    if (recognizer && isListening) {
      recognizer.stopListening();
      setIsListening(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex flex-col gap-8">
      
      {/* Top Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Microphone Control */}
        <div className="lg:col-span-4 flex flex-col items-center justify-center bg-white rounded-2xl shadow-xl p-8 transition-all hover:shadow-2xl border border-gray-100">
           <h2 className="text-2xl font-bold text-gray-800 mb-2">Live Analysis</h2>
           <p className="text-gray-500 mb-8 text-center">Click to start real-time classification</p>
           
           <button
            onClick={isListening ? stopListening : startListening}
            className={`
                w-32 h-32 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg
                ${isListening ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}
            `}
           >
                {isListening ? <StopIcon /> : <MicIcon />}
           </button>
           
           <div className={`mt-6 font-semibold px-4 py-1 rounded-full text-sm ${isListening ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                {isListening ? "RECORDING ACTIVE" : "READY TO RECORD"}
           </div>
        </div>

        {/* Right: Live Dashboard Cards */}
        <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Audio Visualizer Card */}
             <div className="bg-white rounded-xl shadow-md p-4 col-span-1 md:col-span-2 border border-blue-50">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Spectrogram</h3>
                <div className="h-48 overflow-hidden rounded-lg bg-gray-900 flex items-center justify-center">
                    <AudioVisualizer scores={scores} labels={labels} />
                </div>
            </div>

            {/* Radial Distribution */}
             <div className="bg-white rounded-xl shadow-md p-4 border border-blue-50">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Class Probability</h3>
                <div className="flex items-center justify-center h-full min-h-[200px]">
                     <RadialClassDistribution classScores={scores} />
                </div>
            </div>

             {/* Timeline Live View */}
             <div className="bg-white rounded-xl shadow-md p-4 border border-blue-50">
                 <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Live Timeline</h3>
                <div className="flex items-center justify-center h-full min-h-[200px] overflow-hidden">
                    {/* Reusing Timeline Graph but might need adjustment for container size */}
                    <TimelineGraph activations={activations} />
                </div>
            </div>
        </div>
      </div>

      {/* Bottom: Summary Dashboard */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
         <div className="flex items-center justify-between mb-6">
            <div>
                 <h2 className="text-2xl font-bold text-gray-800">Session Analytics</h2>
                <p className="text-gray-500">Post-analysis summary of classified audio events</p>
            </div>
         </div>
         <SummaryDashboard history={activations} />
      </div>

    </div>
  );
}
