import React, { useState } from 'react';
import './VoiceInputConfirmation.css'
const VoiceInputConfirmation = ({ attribute, onClose, onConfirmation }) => {
  const [speechRecognition, setSpeechRecognition] = useState(null);
  const [data, setData] = useState(null); // State to store confirmed data

  // Initialize SpeechRecognition
  const initializeSpeechRecognition = () => {
    const recognition = new window.webkitSpeechRecognition(); // for Chrome
    recognition.lang = 'en-US'; // Set language
    recognition.onresult = handleSpeechResult;
    setSpeechRecognition(recognition);
    recognition.start(); // Start listening immediately
  };

  // Handle speech recognition result
  const handleSpeechResult = (event) => {
    const speechResult = event.results[0][0].transcript.trim().toLowerCase();
    if (speechResult.includes('yes')) {
      handleConfirmation('yes');
    } else if (speechResult.includes('no')) {
      handleConfirmation('no');
    }
  };

  // Handle confirmation
  const handleConfirmation = (confirmation) => {
    if (confirmation === 'yes') {
      // Save data when confirmed with 'yes'
      setData(attribute);
    }
    onClose(); // Close the confirmation component
    onConfirmation(confirmation); // Handle confirmation in the parent component
  };

  // Initialize speech recognition on component mount
  React.useEffect(() => {
    initializeSpeechRecognition();
    // Clean up
    return () => {
      if (speechRecognition) {
        speechRecognition.stop();
      }
    };
  }, []); // Run only once on component mount

  return (
    <div className="voice-input-confirmation">
      <p>{`Did you say ${attribute}?`}</p>
      {data && <p>Confirmed: {data}</p>} {/* Display confirmed data */}
    </div>
  );
};

export default VoiceInputConfirmation;
