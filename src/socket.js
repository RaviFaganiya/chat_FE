import { io } from 'socket.io-client';

const socket = io('https://chat-be-v2eh.onrender.com', {
  auth: {
    token: localStorage.getItem('token'),
  },
   autoConnect: false,
});

const token = localStorage.getItem("token")
if (token) {
  socket.connect()
}

export default socket;