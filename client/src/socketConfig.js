import io from "socket.io-client"
 const socket = io("FRONTEND_URL",{transports: ['websocket']})

 export default socket;
