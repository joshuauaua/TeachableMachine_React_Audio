
import React, { useEffect, useState } from "react";
import AudioVisualizer from "../components/audio_visualizer.jsx";
import TimelineGraph from "../components/timeline_graph.jsx";
import { RadialClassDistribution } from "../components/radial_class_distribution.jsx";
import { SummaryDashboard } from "../components/summary_dashboard.jsx";

export default function Home() {
  const [labels, setLabels] = useState([]);
  const [scores, setScores] = useState({});
  const [recognizer, setRecognizer] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [activations, setActivations] = useState([]);

  useEffect(() => {
    const setupModel = async () => {
      const URL = "https://teachablemachine.withgoogle.com/models/QGdTnG0wj/";
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
          includeSpectrogram: false,
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teachable Machine Audio Model</h1>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p className="font-bold">Microphone Permission Required</p>
        <p>Please allow access to your microphone when prompted.</p>
      </div>

      <div className="flex gap-4 mb-4">
        <button
          onClick={startListening}
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={isListening}
        >
          Start
        </button>
        <button
          onClick={stopListening}
          className="px-4 py-2 bg-red-600 text-white rounded"
          disabled={!isListening}
        >
          Stop
        </button>
      </div>

      {isListening && <div className="text-green-600 font-semibold mb-2">Listening...</div>}

      <AudioVisualizer scores={scores} labels={labels} />
      <TimelineGraph activations={activations} />
      <RadialClassDistribution classScores={scores} />
      <SummaryDashboard history={activations} />
    </div>
  );
}
