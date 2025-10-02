import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContactMessagesPage = ({ initialMessages = [] }) => {
  const [messages, setMessages] = useState(initialMessages);
  const [loading, setLoading] = useState(!initialMessages.length);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useEffect(() => {
    // Ne faire l'appel API que si on n'a pas de données initiales
    if (!initialMessages.length) {
      const fetchMessages = async () => {
        try {
          const response = await axios.get('${import.meta.env.VITE_BASE_URL}/api/contact');
          setMessages(response.data);
        } catch (err) {
          setError('Failed to fetch messages.');
          console.error('Error fetching contact messages:', err);
        } finally {
          setLoading(false);
        }
      };

      fetchMessages();
    }
  }, [initialMessages.length]);

  const handleReply = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/contact/${id}/reply`, { reply: replyText });
      setMessages(messages.map(msg => 
        msg._id === id ? { ...msg, isReplied: true, reply: replyText, repliedAt: new Date() } : msg
      ));
      setReplyText('');
    } catch (err) {
      console.error('Error replying to message:', err);
      alert('Failed to send reply.');
    }
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('${import.meta.env.VITE_BASE_URL}/api/contact', formData);
      console.log('Message sent successfully:', response.data);
      alert('Message sent successfully!');
      setFormData({ name: '', email: '', message: '' }); // Clear form
      // Optionnel: recharger les messages pour voir le nouveau message
      const messagesResponse = await axios.get('${import.meta.env.VITE_BASE_URL}/api/contact');
      setMessages(messagesResponse.data);
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again later.');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      try {
        await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/contact/${id}`);
        setMessages(messages.filter(msg => msg._id !== id));
        alert('Message supprimé avec succès !');
      } catch (error) {
        console.error('Error deleting message:', error);
        alert('Erreur lors de la suppression du message.');
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading messages...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">Gestion des Messages de Contact</h1>
      
      {/* Formulaire d'envoi de message */}
      <div className="mb-12 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Envoyer un Message</h2>
        <form onSubmit={handleFormSubmit} className="max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nom:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleFormChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
              />
            </div>
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message:</label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleFormChange}
              rows="5"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            ></textarea>
          </div>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded focus:outline-none focus:shadow-outline"
          >
            Envoyer le Message
          </button>
        </form>
      </div>

      {/* Liste des messages reçus */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Messages Reçus</h2>
        {messages.length === 0 ? (
          <p className="text-center text-gray-600">Aucun message reçu pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {messages.map((msg) => (
              <div key={msg._id} className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">De: {msg.name}</h3>
                <p className="text-gray-700 mb-2">Email: {msg.email}</p>
                <p className="text-gray-800">{msg.message}</p>
                <p className="text-sm text-gray-500 mt-4">Reçu le: {new Date(msg.createdAt).toLocaleString()}</p>
                {msg.isReplied ? (
                  <div className="mt-4">
                    <h4 className="font-semibold">Votre Réponse:</h4>
                    <p>{msg.reply}</p>
                    <p className="text-sm text-gray-500">Répondu le: {new Date(msg.repliedAt).toLocaleString()}</p>
                  </div>
                ) : (
                  <div className="mt-4">
                    <textarea
                      className="w-full p-2 border rounded"
                      rows="3"
                      placeholder="Tapez votre réponse..."
                      onChange={(e) => setReplyText(e.target.value)}
                    ></textarea>
                    <button
                      className="mt-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                      onClick={() => handleReply(msg._id)}
                    >
                      Envoyer la Réponse
                    </button>
                  </div>
                )}
                
                {/* Bouton de suppression */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"
                    onClick={() => handleDeleteMessage(msg._id)}
                  >
                    Supprimer le Message
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactMessagesPage;