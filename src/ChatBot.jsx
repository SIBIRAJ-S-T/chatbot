import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './ChatBot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [documentText, setDocumentText] = useState('');
  const [language, setLanguage] = useState('ta-IN'); // Default language is Tamil
  const chatboxRef = useRef(null);
  const recognitionRef = useRef(null);

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  // Initialize Speech Recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language; // Set language based on state

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        handleSendMessage(transcript); // Handle message from voice input
      };

      recognitionRef.current = recognition;
    }
  }, [language]); // Reinitialize when language changes

  // Handle auto-scroll
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending messages
  const handleSendMessage = async (userInput) => {
    if (!userInput.trim()) return;

    console.log('User Input:', userInput); // Debug: Log user input

    const userMessage = { sender: 'user', text: userInput };

    // Append the new message to the existing messages
    setMessages(prevMessages => [...prevMessages, userMessage]);

    try {
      let responseText = '';

      // Convert userInput to lower case for case-insensitive comparison
      const lowerInput = userInput.toLowerCase();

      // Conditional response based on user input
      if (language === 'ta-IN') {
        if (lowerInput.includes('கடவுள் உண்டா') || lowerInput.includes('கடவுள்')) {
          responseText = 'கடவுள் நம்மளை படைச்சவரு. என்ன உருவாக்குனது சிபிராஜ் மற்றும் அபிஷேக். கடவுள் இருக்காரு.';
        } else {
          // Generate response using AI model for other inputs
          const conversationHistory = [...messages, userMessage]
            .map((msg) => `${msg.sender === 'user' ? 'User' : 'Max'}: ${msg.text}`)
            .join('\n');

          const result = await model.generateContent(conversationHistory);
          const response = await result.response;
          responseText = await response.text();
        }
      } else {
        // English response logic
        if (lowerInput.includes('god exists') || lowerInput.includes('god')) {
          responseText = 'God is the creator. SibiRaj and Abishek created me. God exists.';
        } else {
          // Generate response using AI model for other inputs
          const conversationHistory = [...messages, userMessage]
            .map((msg) => `${msg.sender === 'user' ? 'User' : 'Max'}: ${msg.text}`)
            .join('\n');

          const result = await model.generateContent(conversationHistory);
          const response = await result.response;
          responseText = await response.text();
        }
      }

      const botMessage = { sender: 'bot', text: responseText };

      // Append the bot's response to the existing messages
      setMessages(prevMessages => [...prevMessages, botMessage]);
      speak(responseText); // Speak the bot's response in the selected language
    } catch (error) {
      console.error('Error generating content:', error.message);
    }

    setInput('');
  };

  // Handle document upload and extract text
  const handleDocumentUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = async (e) => {
      const text = e.target.result;
      setDocumentText(text);

      const userMessage = { sender: 'user', text: 'Please summarize this document.' };
      setMessages(prevMessages => [...prevMessages, userMessage]);

      try {
        const conversationHistory = `${userMessage.text}\nDocument Content:\n${text}`;
        const result = await model.generateContent(conversationHistory);
        const response = await result.response;
        const botMessage = { sender: 'bot', text: await response.text() };

        setMessages(prevMessages => [...prevMessages, botMessage]);
        speak(botMessage.text); // Speak the bot's response in the selected language
      } catch (error) {
        console.error('Error summarizing document:', error.message);
      }
    };

    reader.readAsText(file);
  };

  // Speak the bot's response in the selected language
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language; // Set language based on state
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start voice recognition in the selected language
  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start();
    }
  };

  // Change language
  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <div className="chat-container">
      <div className="language-toggle">
        <button 
          onClick={() => changeLanguage('ta-IN')}
          className={language === 'ta-IN' ? 'active' : ''}
        >
          Tamil
        </button>
        <button 
          onClick={() => changeLanguage('en-US')}
          className={language === 'en-US' ? 'active' : ''}
        >
          English
        </button>
      </div>
      <div className="chatbox" ref={chatboxRef}>
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
      />
      <button onClick={() => handleSendMessage(input)}>Send</button>
      <button onClick={startListening}>Start Voice Input</button>

      <div className="document-section">
        <input type="file" onChange={handleDocumentUpload} />
      </div>
    </div>
  );
};

export default Chatbot;
