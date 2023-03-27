import Head from 'next/head';
import { useEffect, useState } from 'react';
import ChatBox from '../components/chatBox';

export default function Chat() {
    return (
        <div>
            <Head>
                <title>Chat App</title>
            </Head>
            <h1 className="mx-auto text-4xl font-bold mb-4">Chat</h1>
            <ChatBox />
        </div>
    );
}
