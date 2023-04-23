import React, { useState, useEffect } from 'react';

function WebSocketExample() {
    const [socket, setSocket] = useState(null);
    const [currentDate, setCurrentDate] = useState('');
  
    useEffect(() => {
      const newSocket = new WebSocket('ws://localhost:8080');
  
      newSocket.onopen = () => {
        console.log('Conectado al servidor WebSocket');
      };
  
      newSocket.onmessage = (event) => {
        setCurrentDate(event.data);
      };
  
      setSocket(newSocket);
  
      return () => {
        newSocket.close();
      };
    }, []);
  
    return (
      <div>
        <h4>La fecha actual es: {currentDate}</h4>
      </div>
    );
  }

  export default WebSocketExample;
  