import React,{useState,useEffect} from 'react'
import socket from '../socketConfig'

const CountDown = () => {
    const [timer, settimer] = useState({countDown:"",msg:""})
    console.log("out",timer)
    useEffect(() => {
        socket.on("timer",(data)=>{
            console.log("in",data)
            settimer(data)
        })
        socket.on("done",()=>{
            socket.removeListener("timer")
        })
    }, [])
    // const {countdown,msg} = timer
    return (
        <>
            <h1>{timer.countDown}</h1>
            <h3>{timer.msg}</h3> 

        </>
    )
}

export default CountDown
