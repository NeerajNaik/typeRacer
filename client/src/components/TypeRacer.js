import React from 'react'
import { Redirect } from 'react-router'
import CountDown from './CountDown'
import StartBtn from './StartBtn'
import socket from '../socketConfig'
import DisplayWords from './DisplayWords'
import Form from './Form'
import ProgressBar from './ProgressBar'
import ScoreBoard from './ScoreBoard'
import DisplayGameCode from './DisplayGameCode'
const TypeRacer = ({gameState}) => {
    // const [state, setstate] = useState(initialState)
    const findPlayer=(players)=>{
        return players.find((player)=>player.socketId === socket.id)
    }
    const {_id,players,words,isOpen,isOver} = gameState
    const player = findPlayer(players)
    if(_id ===""){
        return <Redirect to="/"/>
    }

    return (
        <div className="text-center">
            <DisplayWords words={words} player={player}/>
            <ProgressBar players={players} player={player} wordsLength={words.length}/>
            <Form isOpen={isOpen} isOver={isOver} gameId={_id} />
            <CountDown/>
            <StartBtn player={player} gameId={_id}/>
            <DisplayGameCode gameId={_id}/>
            <ScoreBoard players={players}/>
            
        </div>
    )
}

export default TypeRacer

