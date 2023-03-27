import { useState, useEffect } from 'react';

export default function ChatBox() {
    const [messages, setMessages] = useState([]);

    const [newMessage, setNewMessage] = useState('');

    const handleNewMessage = (event) => {
        setNewMessage(event.target.value);
    };

    const handleSendMessage = (event) => {
        event.preventDefault();
        if (newMessage.trim()) {
            setMessages([
                ...messages,
                {
                    sender: 'Cliente',
                    text: newMessage,
                    time: new Date().toLocaleTimeString(),
                },
            ]);
            setNewMessage('');
        }
    };

    useEffect(() => {
        if (messages[messages.length - 1]?.sender === 'Cliente') {
            answerQuestion();
        }
    }, [messages]);

    let prompt = '';

    const [chatAnswer, setChatAnswer] = useState('...');

    const handleSubmit = async () => {
        try {
            const response = await fetch(
                `http://localhost:4000/chat/?q=${encodeURIComponent(prompt)}`
            );
            const data = await response.json();
            setChatAnswer(data.answer);
            // set an alert to show the answer
            alert(data.answer);
        } catch (error) {
            console.error(error);
        }
    };

    const answerQuestion = () => {
        let userMessages = messages.filter(
            (message) => message.sender === 'Cliente'
        ).length;
        switch (userMessages) {
            case 1:
                setMessages([
                    ...messages,
                    {
                        sender: 'ChatBot',
                        text: 'Hola, soy el ChatBot de Pacifico Seguros y estoy para ayudarte a encontrar la mejor póliza para ti',
                        time: new Date().toLocaleTimeString(),
                    },
                    {
                        sender: 'ChatBot',
                        text: 'Pero antes, necesito saber algunos datos tuyos, ten en cuenta que todos los datos que me proporciones serán tratados con la máxima confidencialidad',
                        time: new Date().toLocaleTimeString(),
                    },
                    {
                        sender: 'ChatBot',
                        text: 'Tienes hijos? Cuantos? y que edad tienen?',
                        time: new Date().toLocaleTimeString(),
                    },
                ]);
                break;
            case 2:
                setMessages([
                    ...messages,
                    {
                        sender: 'ChatBot',
                        text: 'En tu hogar, cuantos son los ingresos mensuales?',
                        time: new Date().toLocaleTimeString(),
                    },
                ]);
                break;
            case 3:
                setMessages([
                    ...messages,
                    {
                        sender: 'ChatBot',
                        text: 'Por ultimo, cuentame mas sobre ti y un poco sobre tus preocupaciones, ¿que te preocupa mas y por que? ¿como te gustaria que te ayudaramos?',
                        time: new Date().toLocaleTimeString(),
                    },
                ]);
                break;
            case 4:
                // add to prompt the second, third and fourth message of Cliente, excluding the ChatBot
                let clienteMessages = messages.filter(
                    (message) => message.sender === 'Cliente'
                );
                prompt =
                    'hijos: ' +
                    clienteMessages[1].text +
                    'ingresos mensuales del hogar: ' +
                    clienteMessages[2].text +
                    'preocupaciones y contexto: ' +
                    clienteMessages[3].text;
                alert(prompt);
                handleSubmit();
                setMessages([
                    ...messages,
                    {
                        sender: 'ChatBot',
                        text: 'Gracias por tus respuestas, estoy buscando la mejor póliza para ti...',
                        time: new Date().toLocaleTimeString(),
                    },
                    {
                        sender: 'ChatBot',
                        text: chatAnswer,
                        time: new Date().toLocaleTimeString(),
                    },
                ]);

                break;
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-4">
            <div className="bg-gray-100 p-4 rounded-lg">
                {messages.map((message, index) => (
                    <div
                        key={index}
                        className={`flex items-start mb-2 ${
                            message.sender === 'Cliente'
                                ? 'flex-row-reverse'
                                : 'flex-row'
                        }`}
                    >
                        <div
                            className={`bg-white rounded-lg p-2 ${
                                message.sender === 'Cliente'
                                    ? 'ml-2'
                                    : 'mr-2 bg-blue-100'
                            }`}
                        >
                            <div className="font-semibold">
                                {message.sender}
                            </div>
                            <div>{message.text}</div>
                            <div className="text-sm text-gray-500">
                                {message.time}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <form onSubmit={handleSendMessage}>
                <input
                    className="border border-gray-300 p-2 rounded-lg w-full mt-4"
                    type="text"
                    placeholder="Type a message"
                    value={newMessage}
                    onChange={handleNewMessage}
                />
                <button
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg mt-2"
                    type="submit"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
