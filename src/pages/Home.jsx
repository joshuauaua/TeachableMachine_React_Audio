import { useEffect, useState } from "react";

export default function Home() {
  const [labels, setLabels] = useState([]);
  const [scores, setScores] = useState([]);
  const [recognizer, setRecognizer] = useState(null);
  const [isListening, setIsListening] = useState(false);

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
      recognizer.listen(
        result => {
          const newScores = result.scores.map(score => score.toFixed(2));
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
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teachable Machine Audio Model</h1>

      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-4" role="alert">
        <p className="font-bold">Microphone Permission Required</p>
        <p>Please allow access to your microphone when prompted. This is required for the model to capture and analyze audio.</p>
      </div>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">How to Use</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click the <strong>Start</strong> button below to begin audio recognition.</li>
          <li>Ensure your microphone is connected and permission is granted.</li>
          <li>Speak or play the audio you want the model to recognize.</li>
          <li>Click <strong>Stop</strong> to end the recognition.</li>
        </ol>
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

      <div className="space-y-2">
        {labels.map((label, i) => (
          <div key={i}>
            {label}: {scores[i] || "0.00"}
          </div>
        ))}
      </div>
    </div>
  );
}
