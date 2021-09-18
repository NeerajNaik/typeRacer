import io from "socket.io-client"
 const socket = io("process.env.FRONTEND_URL",{transports: ['websocket']})

 export default socket;
