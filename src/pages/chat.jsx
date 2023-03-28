import Head from 'next/head';
import { useEffect, useState } from 'react';
import ChatBox from '../components/chatBox';

export default function Chat() {
    return (
        <div>
            <Head>
                <title>Chat App</title>
            </Head>
            <h1 className="text-center text-3xl font-extrabold m-4">
                ChatBot Pacifico Seguros
            </h1>
            <ChatBox />
        </div>
    );
}
