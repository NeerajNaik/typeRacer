const express = require("express")
const socketio = require("socket.io")
const mongoose = require("mongoose")
// const cors = require('cors');
const dotenv = require("dotenv")
const Game = require("./Models/Game")
const QuoatableAPI = require("./QuoatableAPI")
const app = express()
const expressServer = app.listen(process.env.BACKEND_URL)
const io = socketio(expressServer)

dotenv.config()


io.on("connect",(socket)=>{
    socket.on("userInput",async({userInput,gameId})=>{
        try{
            let game = await Game.findById(gameId)
            if(!game.isOpen && !game.isOver){
                let player = game.players.find((player)=>player.socketId === socket.id)
                let word = game.words[player.currentWordIndex]
                if(word===userInput){
                    player.currentWordIndex +=1
                    if(player.currentWordIndex !== game.words.length)
                    {
                        game = await game.save()
                        io.to(gameId).emit("update-game",game)
                    }
                    else{
                        let endTime = new Date().getTime()
                        let {startTime} = game
                        player.WPM = calculateWPM(endTime,startTime,player)
                        game = await game.save()
                        io.to(gameId).emit("update-game",game)
                        socket.emit("done")
                    }
                }
            }
        }catch(err){
            console.log(err)
        }
    })
    socket.on("timer",async({playerId,gameId})=>{
        let countdown = 5
        let game = await Game.findById(gameId)
        let player = game.players.find((player)=> player._id.toString() === playerId)
        if(player.isPartyLeader){
            let timerId = setInterval(async()=>{
                if(countdown>=0){
                    io.to(gameId).emit("timer",{countDown:countdown.toString(),msg:"Starting Game"})
                    countdown-=1
                }
                else{
                    game.isOpen=false
                    game = await game.save()
                    io.to(gameId).emit("update-game",game)
                    startGameClock(gameId);
                    clearInterval(timerId);
                }
            },1000)
        }
    })

    socket.on("join-game",async({gameId:_id,nickName})=>{
        try{
            let game = await Game.findById(_id)
            if(game.isOpen){
                const gameId = game._id.toString()
                socket.join(gameId)
                let player={
                    socketId:socket.id,
                    nickName
                }
                game.players.push(player)
                game = await game.save()
                io.to(gameId).emit("update-game",game)
            }
        }catch(err){
            console.log(err)
        }
    })

    socket.on("create-game",async (nickName)=>{
        try{
            const quotableData = await QuoatableAPI()
            let game = new Game()
            game.words = quotableData
            let player={
                socketId:socket.id,
                isPartyLeader:true,
                nickName
            }
            game.players.push(player)
            game = await game.save()
            const gameId = game._id.toString()
            socket.join(gameId)
            io.to(gameId).emit("update-game",game)
        }catch(err){
            console.log(err)
        }
    })
})

// mongoose.connect("mongodb://localhost:27017/typeracer",()=>{console.log("Successfully connected to db")})
mongoose.connect(process.env.MONGO_URL,()=>{console.log("Successfully connected to db")})

const startGameClock =async(gameId)=>{
    let game = await Game.findById(gameId)
    game.startTime = new Date().getTime()
    game = await game.save()
    let time = 120
    let timerId = setInterval(function gameIntervalFunc(){
        const formatTime = calculateTime(time)
        console.log(formatTime)
        if(time>=0){
            io.to(gameId).emit("timer",{countDown:formatTime,msg:"Time Remaining"})
            time-=1
        }
        else{
            (async()=>{
                let endTime = new Date().getTime()
                let game = await Game.findById(gameId)
                let {startTime} = game
                game.isOver = true
                game.players.forEach((player,index)=>{
                    if(player.WPM === -1){
                        game.players[index].WPM = calculateWPM(endTime,startTime,player)
                    }
                })
                game = await game.save()
                io.to(gameId).emit("update-game",game)
                clearInterval(timerId)
            })()

        }
        return gameIntervalFunc
    }(),1000)
}

const calculateTime = (time)=>{
    let minutes = Math.floor(time/60);
    let seconds = time%60;
    return `${minutes}:${seconds<10 ? "0"+seconds : seconds}`
}

const calculateWPM = (endTime,startTime,player)=>{
    let numOfWords = player.currentWordIndex
    const timeInSeconds = (endTime - startTime)/1000
    const timeinMinutes = timeInSeconds/60
    const WPM = Math.floor(numOfWords/timeinMinutes)
    return WPM

}

if(process.env.NODE_ENV === 'production') {
  // set static folder
  app.use(express.static('client/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
