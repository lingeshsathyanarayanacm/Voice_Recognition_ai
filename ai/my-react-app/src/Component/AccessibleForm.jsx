import React, { useState, useEffect } from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
import './AccessibleForm.css'; // Import CSS file
import VoiceInputConfirmation from './VoiceInputConfirmation'; // Import Confirmation component

const AccessibleForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    occupation: '',
    age: '', // New field: Age
    experience: '', // New field: Experience
    // Add other attributes as needed
  });
  const [showConfirmation, setShowConfirmation] = useState(false); // State to control confirmation component
  const [voiceInputInProgress, setVoiceInputInProgress] = useState(false); // State to track voice input status
  const { transcript, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    // Start voice input and ask the first question when the component mounts
    startVoiceInputAndAskQuestion();
  }, []); // Empty dependency array ensures this effect runs only once when component mounts

  useEffect(() => {
    if (transcript && voiceInputInProgress) {
      handleAttributeCapture(transcript);
    }
  }, [transcript, voiceInputInProgress]);

  const startVoiceInputAndAskQuestion = () => {
    setVoiceInputInProgress(true);
    SpeechRecognition.startListening();
    askNextQuestion();
  };

  const askNextQuestion = () => {
    const unansweredAttributes = Object.keys(formData).filter(attribute => !formData[attribute]);
    
    if (unansweredAttributes.length > 0) {
      const nextAttribute = unansweredAttributes[0];
      const utterance = new SpeechSynthesisUtterance(`What is your ${nextAttribute}?`);
      window.speechSynthesis.speak(utterance);
    } else {
      // All information collected, stop listening
      SpeechRecognition.stopListening();
      setVoiceInputInProgress(false);
    }
  };

  const handleAttributeCapture = (capturedText) => {
    const attribute = Object.keys(formData).find(attribute => !formData[attribute]);
    
    if (attribute) {
      // Show confirmation component
      setShowConfirmation(true);
      setVoiceInputInProgress(false); // Voice input is no longer in progress
    }
  };

  const handleConfirmation = (confirmation) => {
    setShowConfirmation(false); // Close confirmation component
    if (confirmation === 'yes') {
      const attributeValue = transcript.trim().split(' ')[0];
      const attribute = Object.keys(formData).find(attr => !formData[attr]);
      setFormData((prevData) => ({
        ...prevData,
        [attribute]: attributeValue,
      }));
      resetTranscript();
      askNextQuestion();
    } else {
      resetTranscript();
      askNextQuestion();
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data submitted:', formData);
    resetTranscript();

    // Check if all fields are filled
    const allFieldsFilled = Object.values(formData).every(value => value !== '');
    if (allFieldsFilled) {
      speakConfirmationMessage();
    }
  };

  const speakConfirmationMessage = () => {
    const utterance = new SpeechSynthesisUtterance("Thank you for your feedback, you successfully submitted.");
    window.speechSynthesis.speak(utterance);
  };

  const handleStartVoiceInput = () => {
    startVoiceInputAndAskQuestion();
  };

  return (
    <div className="accessible-form-container">
      {showConfirmation && <VoiceInputConfirmation attribute={transcript} attributeField={Object.keys(formData).find(attr => !formData[attr])} onClose={() => setShowConfirmation(false)} onConfirmation={handleConfirmation} />}
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Your name"
        />

        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Your email"
        />

        <label htmlFor="occupation">Occupation:</label>
        <input
          type="text"
          id="occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleInputChange}
          placeholder="Your occupation"
        />

        {/* New fields: Age and Experience */}
        <label htmlFor="age">Age:</label>
        <input
          type="text"
          id="age"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
          placeholder="Your age"
        />

        <label htmlFor="experience">Experience in the field:</label>
        <input
          type="text"
          id="experience"
          name="experience"
          value={formData.experience}
          onChange={handleInputChange}
          placeholder="Your experience"
        />

        <button type="button" className="start-voice-input-btn" onClick={handleStartVoiceInput}>
          Start Voice Input
        </button>

        <button type="submit" className="submit-btn" onClick={speakConfirmationMessage}>Submit</button>
      </form>
    </div>
  );
}

export default AccessibleForm;
