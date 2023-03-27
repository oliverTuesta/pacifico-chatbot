import { useState, useEffect } from 'react';

async function getAnswer(prompt) {
    const seguros = `
    Dados los siguientes seguros de vida: 1. Seguros de vida devolucion: Protege la tranquilidad de tu familia en caso de fallecimiento y ahorra con nosotros. Nuestro Seguro de Vida permite ahorrar devolviéndote el 100% de lo pagado y hasta 100% más al final del período.

Adquiérelo desde
s/ 39 mensuales. 2. Inversion Flex: acompaña y se adapta a cada etapa de tu vida protegiendo tu tranquilidad y la de tu familia en caso de fallecimiento o invalidez. Crea un fondo de inversión con la mayor rentabilidad. Conoce más aquí.

Adquiérelo desde
s/ 180 mensuales. 3. Fondos: Asegura un ahorro destinado para la educación de tus hijos o para que cumplas tus sueños en vida. Disfruta de una tasa garantizada y cobertura en caso de fallecimiento e invalidez.

Adquiérelo desde
US$ 44 o s/ 150 mensuales. 4. Seguro vida inversion capital: Invierte en mercados internacionales el tiempo que tu decidas y elige hasta 2 fondos con inversiones de hasta US$ 350,000.  5. Seguro vida inversion base: Empieza a crear un fondo de inversión con rentabilidad mientras proteges la tranquilidad de tu familia.

Adquiérelo desde
US$ 21 mensuales. Soy una madre de dos hijos soltera, con ingresos mensuales de 1200 soles mensuales, me preocupa el futuro de mis hijos en caso de que me pase algo, mis hijos tienen 12 y 5 años
    `;

    const messages = [
        { role: 'user', content: seguros },
        { role: 'user', content: prompt },
        { role: 'user', content: 'que seguro me conviene?' },
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: messages,
            temperature: 0.7,
            max_tokens: 1024,
            n: 1,
            stop: null,
        }),
    });

    if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    const answer = data.choices[0].message.content;
    return answer;
}

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

    function submitPrompt() {
        getAnswer(prompt).then((answer) => {
            setMessages([
                ...messages,
                {
                    sender: 'ChatBot',
                    text: answer,
                    time: new Date().toLocaleTimeString(),
                },
            ]);
        });
    }

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
                submitPrompt();
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
                setMessages([
                    ...messages,
                    {
                        sender: 'ChatBot',
                        text: 'Gracias por tus respuestas, estoy buscando la mejor póliza para ti...',
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
                                    : 'mr-2 bg-blue-200'
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
