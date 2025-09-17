import AppNav from '@/components/AppNav';
import { Button } from 'antd';
import React from 'react';

const credits = {
  url: 'https://dev.to/novu/building-a-chat-app-with-socketio-and-react-2edjv',
  text: 'Building a chat app with Socket.io and React 🚀'
};

export default function ChatBrowserNotification(): React.JSX.Element {
  return (
    <AppNav name={ChatBrowserNotification.name}>
      <small>
        Tests from this website: <Button type='link' target='_blank' href={credits.url}>{credits.text}</Button>
      </small>
    </AppNav>
  );
}