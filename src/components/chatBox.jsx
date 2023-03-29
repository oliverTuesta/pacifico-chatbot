import { useState, useEffect } from 'react';

async function getAnswer(prompt) {
    const segurosVida = `
    Dados los siguientes seguros de vida:
    - Seguro Vida FlexiFem Emprende
Genera un ahorro para una futura inversión en tu emprendimiento, mientras protege a tu familia en caso de fallecimiento o invalidez.
Adquierelo desde US$ 45 o S/140 mensuales

        -Seguros de vida devolucion: Protege la tranquilidad de tu familia en caso de fallecimiento y ahorra con nosotros. Nuestro Seguro de Vida permite ahorrar devolviéndote el 100% de lo pagado y hasta 100% más al final del período.

        Adquiérelo desde
    s/ 39 mensuales. -Inversion Flex: acompaña y se adapta a cada etapa de tu vida protegiendo tu tranquilidad y la de tu familia en caso de fallecimiento o invalidez. Crea un fondo de inversión con la mayor rentabilidad. Conoce más aquí.

        Adquiérelo desde
    s/ 180 mensuales. -Fondos: Asegura un ahorro destinado para la educación de tus hijos o para que cumplas tus sueños en vida. Disfruta de una tasa garantizada y cobertura en caso de fallecimiento e invalidez.

        Adquiérelo desde
    US$ 44 o s/ 150 mensuales. 4. Seguro vida inversion capital: Invierte en mercados internacionales el tiempo que tu decidas y elige hasta 2 fondos con inversiones de hasta US$ 350,000.  -Seguro vida inversion base: Empieza a crear un fondo de inversión con rentabilidad mientras proteges la tranquilidad de tu familia.

        Adquiérelo desde
    US$ 21 mensuales. Soy una madre de dos hijos soltera, con ingresos mensuales de 1200 soles mensuales, me preocupa el futuro de mis hijos en caso de que me pase algo, mis hijos tienen 12 y 5 años.
        Y los siguientes seguros de Salud disponibles: 
        - MINI: 
    Más de 230 clínicas nacionales y 5000 internacionales.
        US$ 4'000,000
    Cobertura máxima anual
    Atención médica internacional
    Reembolso
    Asistencia al viajero en emergencias
    Plan Resguardo
    Desde S/ 23.72 al día.

        - Medicivida Nacional:
    Más de 230 clínicas nacionales Red BANMÉDICA (Chile y Colombia).
        S/ 9'600,000
    Cobertura máxima anual
    Reembolso
    Asistencia al viajero en emergencias
    Plan Resguardo
    Desde S/ 10.11 al día

        - Red Preferente:
    Más de 220 clínicas nacionales.
        S/ 5'000,000
    Cobertura máxima anual
    Asistencia al viajero en emergencias
    Plan Resguardo
    Desde S/ 7.09 al día

        - Salud Esencial:
    Más de 116 clínicas nacionales
    S/ 1'000,000
    Cobertura máxima anual
    Chequeo preventivo virtual anual cubierto al 100%
        Indemnización por Cáncer
    Maternidad: Pago por parto
    Desde S/ 4.75 al día
    `;

    const messages = [
        { role: 'user', content: segurosVida },
        { role: 'user', content: prompt },
        {
            role: 'user',
            content:
                '¿Por que me recomendarias el seguro de vida FlexiFem Emprende?, ¿Qué otras alternativas consideras viables? y quiero que comiences tu respuesta con: Según los datos proporcionados puedo darte las siguientes recomendaciones. Y quiero que termines tu respuesta con la siguiente oracion: Para mayor información puedes visitar nuestro sitio web www.pacifico.com.pe/',
        },
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
            temperature: 0.8,
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
                        text: '¿Cuál es tu edad y género?',
                        time: new Date().toLocaleTimeString(),
                    },
                ]);
                break;
            case 2:
                setMessages([
                    ...messages,
                    {
                        sender: 'ChatBot',
                        text: '¿En qué sector trabajas?',
                        time: new Date().toLocaleTimeString(),
                    },
                ]);
                break;
            case 3:
                setMessages([
                    ...messages,
                    {
                        sender: 'ChatBot',
                        text: '¿Podría proporcionarme información sobre su remuneración mensual?',
                        time: new Date().toLocaleTimeString(),
                    },
                ]);
                break;
            case 4:
                setMessages([
                    ...messages,
                    {
                        sender: 'ChatBot',
                        text: '¿Cuál es el propósito de adquirir el seguro? (Por ejemplo, protección de ingresos, seguridad personal, seguro de salud, etc.)',
                        time: new Date().toLocaleTimeString(),
                    },
                ]);
                break;
            case 5:
                setMessages([
                    ...messages,
                    {
                        sender: 'ChatBot',
                        text: '¿Cuál es el presupuesto que tienes para el seguro?',
                        time: new Date().toLocaleTimeString(),
                    },
                ]);
                break;
            case 6:
                setMessages([
                    ...messages,
                    {
                        sender: 'ChatBot',
                        text: '¿Tienes alguna enfermedad o padecimiento médico?',
                        time: new Date().toLocaleTimeString(),
                    },
                ]);
                break;
            case 7:
                setMessages([
                    ...messages,
                    {
                        sender: 'ChatBot',
                        text: '¿Hay alguna otra información que nos pueda ayudar a determinar el mejor seguro para ti?',
                        time: new Date().toLocaleTimeString(),
                    },
                ]);
                break;
            case 8:
                // add to prompt the second, third and fourth message of Cliente, excluding the ChatBot
                submitPrompt();
                let clienteMessages = messages.filter(
                    (message) => message.sender === 'Cliente'
                );
                prompt =
                    'Edad y genero: ' +
                    clienteMessages[1].text +
                    'Sector: ' +
                    clienteMessages[2].text +
                    'Remuneracion mensual: ' +
                    clienteMessages[3].text +
                    'Propósito de adquirir el seguro: ' +
                    clienteMessages[4].text +
                    'Presupuesto: ' +
                    clienteMessages[5].text +
                    'Enfermedad o padecimiento médico: ' +
                    clienteMessages[6].text +
                    'Otra información: ' +
                    clienteMessages[7].text;
                setMessages([
                    ...messages,
                    {
                        sender: 'ChatBot',
                        text: 'Gracias por tus respuestas, estamos buscando la mejor póliza para ti...',
                        time: new Date().toLocaleTimeString(),
                    },
                ]);

                break;
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-4 p-3">
            <div className="bg-gray-100 p-4 rounded-lg min-h-1/2">
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
                            className={`rounded-lg p-2 ${
                                message.sender === 'Cliente'
                                    ? 'ml-2 bg-blue-100'
                                    : 'mr-2 bg-white'
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
                    placeholder="Escribe un mensaje..."
                    value={newMessage}
                    onChange={handleNewMessage}
                />
                <button
                    className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg mt-2"
                    type="submit"
                >
                    Enviar
                </button>
            </form>
        </div>
    );
}
