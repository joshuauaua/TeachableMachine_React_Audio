export default function About() {
  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">How to Use</h1>
      <p className="mb-2">
        This project uses a Teachable Machine Audio model to classify audio input from the user's microphone.
      </p>
      <h2 className="text-xl font-semibold mt-4">Steps to Replace the Model</h2>
      <ol className="list-decimal list-inside space-y-1 mt-2">
        <li>Train your audio model on <a href="https://teachablemachine.withgoogle.com/" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">Teachable Machine</a>.</li>
        <li>Click “Export Model” and select the “TensorFlow.js” tab.</li>
        <li>Copy the model URL (should end with a trailing slash `/`).</li>
        <li>Open <code>src/pages/Home.jsx</code> and replace the value of <code>const URL</code> with your model’s URL.</li>
        <li>Restart the app if needed.</li>
      </ol>
      <p className="mt-4 text-sm text-gray-600">Note: You must allow microphone access for the model to function.</p>
    </div>
  );
}
