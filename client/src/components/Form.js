import React,{useState,useEffect,useRef} from 'react'
import socket from '../socketConfig'

const Form = ({isOpen,isOver,gameId}) => {
    const [userInput, setuserInput] = useState("")
    // const [previousInput, setpreviousInput] = useState("")
    const textInput = useRef(null)
    useEffect(()=>{
        if(!isOpen){
            textInput.current.focus()
        }
    },[isOpen])
    const resetForm = ()=>{
        setuserInput("")
    }
    const onChange = (e)=>{
        let value = e.target.value
        let lastChar = value.charAt(value.length-1)
        if(lastChar === " "){
            socket.emit("userInput",{userInput,gameId})
            resetForm()
        }
        else{
            setuserInput(e.target.value)
        }
    }
    return (
        <div className="row my-3">
            <div className="col-sm"></div>
            <div className="col-sm-4">
                <form>
                    <div className="form-group">
                    <input type="text" readOnly={isOpen || isOver} value={userInput} 
                                                       onChange={onChange} 
                                                       placeholder="Enter Text" 
                                                       className="form-control"
                                                       ref={textInput}/>
                    </div>         
                </form>

            </div>
            <div className="col-sm"></div>  
        </div>
    )
}

export default Form
