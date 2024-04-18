import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
  const [text, setText] = useState('');
  const [posTags, setPosTags] = useState([]);

  const handleInputChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/pos-tag', { text });
      setPosTags(response.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea value={text} onChange={handleInputChange} />
        <button type="submit">Tag POS</button>
      </form>
      <ul>
        {posTags.map((tag, index) => (
          <li key={index}>{tag[0]} - {tag[1]}</li>
        ))}
      </ul>
    </div>
  );
};

export default Nlp;
