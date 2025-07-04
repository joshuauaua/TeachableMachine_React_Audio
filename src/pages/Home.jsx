import { useEffect, useState } from "react";

export default function Home() {
  const [labels, setLabels] = useState([]);
  const [scores, setScores] = useState([]);

  useEffect(() => {
    const init = async () => {
      const URL = "https://teachablemachine.withgoogle.com/models/QGdTnG0wj/";
      const checkpointURL = URL + "model.json";
      const metadataURL = URL + "metadata.json";

      const recognizer = window.speechCommands.create(
        "BROWSER_FFT",
        undefined,
        checkpointURL,
        metadataURL
      );

      await recognizer.ensureModelLoaded();
      const classLabels = recognizer.wordLabels();
      setLabels(classLabels);

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
    };

    if (window.speechCommands) init();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Teachable Machine Audio Model</h1>
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
