import { io } from 'socket.io-client';


export const socket =  io('http://localhost:8081', {
  query: { client: 'static_user' },
}); 

export const getSocket = () => {
  if(socket.connected) {
    return socket;
  }

  return socket.connect();

}

