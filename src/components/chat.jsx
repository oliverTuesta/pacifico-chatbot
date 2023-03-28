import Head from 'next/head';
import { useEffect, useState } from 'react';
import ChatBox from '../components/chatBox';

export default function Chat() {
    return (
        <div>
            <Head>
                <title>Chat App</title>
            </Head>
            <ChatBox />
        </div>
    );
}
