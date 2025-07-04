🧠 React + Teachable Machine Audio Sample Project

This is a React-based sample project that integrates a Google Teachable Machine audio classification model. It allows users to run a trained audio ML model directly in the browser.

⸻

🎤 What This Project Does

Using Google Teachable Machine, you can train an audio classification model—for example, to detect and differentiate between sounds like a cat’s meow and a dog’s bark.

This project demonstrates how to use such a model inside a modern React application.

⸻

📥 Limitations of Teachable Machine (and How to Bypass Them)

By default, Teachable Machine listens to the system microphone only. It does not support uploading or playing back audio files directly. To feed system audio (e.g. YouTube, local files) into the model, use a virtual audio driver:

🔄 Virtual Audio Driver Workaround

OS	Tool
macOS	BlackHole
Windows	VB-Audio Cable

Once installed:
	1.	Set your system output and input devices to the virtual driver.
	2.	Any audio played on your system will now be routed into the browser mic input.
	3.	The model will process the routed audio as if it were being captured by a physical microphone.

⸻

🔄 How to Replace the ML Model with Your Own
	1.	Train an audio model using Teachable Machine.
	2.	Click Export Model and select the TensorFlow.js format.
	3.	Copy the model URL (make sure it ends with a /).
	4.	Clone this repository.
	5.	Install dependencies:

npm install


	6.	Open src/pages/Home.jsx and replace the value of the URL constant with your model’s URL.
	7.	Run the development server:

npm run dev


	8.	Optionally, restart the app if changes don’t reflect immediately.

⸻

✅ Features
	•	Audio classification in the browser
	•	Easy model swapping
	•	How-to instructions included
	•	Support for mic-based or system-audio-based input

⸻
