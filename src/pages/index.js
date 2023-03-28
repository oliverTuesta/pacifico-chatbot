import Link from 'next/link';

export default function Home() {
    return (
        <>
            <div className="flex flex-col items-center justify-center min-h-screen py-2 h-screen">
                <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center my-auto">
                    <h1 className="text-6xl font-bold">
                        Bienvenido al ChatBot de{' '}
                        <a className="text-blue-600" href="https://nextjs.org">
                            Pacifico Seguros
                        </a>
                    </h1>

                    <p className="mt-3 text-2xl">
                        Pru&eacute;balo ahora{' '}
                        <Link
                            className="hover:underline text-blue-600"
                            href="/chat"
                        >
                            aqu&iacute;
                        </Link>
                    </p>

                    <div className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
                        <Link
                            href="/chat"
                            className="p-6 mt-6 text-left border w-96 rounded-xl hover:text-blue-600 focus:text-blue-600"
                        >
                            <h3 className="text-2xl font-bold">
                                ChatBot &rarr;
                            </h3>
                            <p className="mt-4 text-xl">
                                Prueba el chatbot de Pacifico Seguros, el cual
                                est&aacute; motorizado con Inteligencia
                                Artificial
                            </p>
                        </Link>
                    </div>
                </main>
            </div>
        </>
    );
}
