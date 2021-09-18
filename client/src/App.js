
import {Router,Route,Switch} from "react-router-dom";
import history from "./history"
import GameMenu from './components/GameMenu';
import { useEffect,useState } from 'react';
import socket from "./socketConfig"
import CreateGame from './components/CreateGame';
import JoinGame from "./components/JoinGame";
import TypeRacer from "./components/TypeRacer";
import "./App.css"
function App() {
  const [gameState, setgameState] = useState({_id:"",isOpen:false,players:[],words:[]})
  // const [toggle,settoggle] = useState(false)
  useEffect(() => {
    console.log("rendered App.js")
    socket.on("update-game",(game)=>{
      console.log(game)
      setgameState(game)  
    })

  }, [])
  useEffect(()=>{
    if(gameState._id !=="")
    {
      history.push(`/game/${gameState._id}`)
    }
  },[gameState._id])
  // const handleToggle = ()=>{
  //   settoggle(!toggle)
  // }
  return (
    <>
    {/* <i className="far fa-moon"></i> */}
    {/* <div className="mb-3"> 
    <i className={toggle? "far fa-moon":"fas fa-sun"} onClick={handleToggle}></i>
    </div> */}
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={GameMenu}/>
        <Route exact path="/game/create" component={CreateGame}/>
        <Route exact path="/game/join" component={JoinGame}/>
        <Route exact path="/game/:gameId" render={(props)=><TypeRacer  gameState={gameState}/>}/>
      </Switch>
    </Router>
    </>
  );
}

export default App;
