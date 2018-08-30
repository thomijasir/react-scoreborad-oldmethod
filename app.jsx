var PLAYERS = [
  {
    id:1,
    name:"Thomi Jasir",
    score:30
  },
  {
    id:2,
    name:"Dodi Pirwanto",
    score:20
  },
  {
    id:3,
    name:"Subur Makmur",
    score:10
  },
  {
    id:4,
    name:"Thomi Jasir",
    score:40
  },
];
 var nextId = 5;
  
  var Stopwatch = React.createClass({
    getInitialState: function(){
      return{
        running: false,
        elapsedTime:0,
        previousTime:0,
      }
    },
  
  componentDidMount: function(){
    this.interval = setInterval(this.onTick, 100);
  },
  componentWillUnmount: function(){
    clearInterval(this.interval);
  },
  onTick: function(){
    console.log('OnTick');
    if(this.state.running){
      var now = Date.now();
        this.setState({
            previousTime: now,
            elapsedTime: this.state.elapsedTime + (now - this.state.previousTime),
        });
      }
    },
  
    onStop: function(){
        console.log("Stop!");
        this.setState({running:false});
    },
  
    onStart: function(){
        console.log("Start!");
        this.setState({running:true,previousTime: Date.now(),});
        
    },
  
    onReset: function(){
        console.log("Reset!");
        this.setState({
          elapsedTime:0,
          previousTime:Date.now(),
        });
    },
  
    render:function(){
      // Expression If Statement
      // var startStop = this.state.running ? <button>Stop</button> : <button>Start</button>;
      var seconds = Math.floor(this.state.elapsedTime / 1000);
      var startStop;
      if(this.state.running){
        startStop = <button onClick={this.onStop}>Stop</button>
      }else{
        startStop = <button onClick={this.onStart}>Start</button>
      }
      return(
        <div className="stopwatch">
          <h2>Stopwatch</h2>
          <div className="stopwatch-item">{seconds}</div>
          { startStop }
          <button onClick={this.onReset}>Reset</button>
        </div>
      );
  }
  });
  
 var AddPlayerForm = React.createClass({
  
  propTypes:{
    onAdd: React.PropTypes.func.isRequired,  
  },
  
  getInitialState: function(){
    return{
      name:"",
    };
  },
  
  onNameChange: function(e){
    console.log('Change Name', e.target.value);
    this.setState({name: e.target.value});
  },
  
  onSubmit:function(e){
    e.preventDefault();
    this.props.onAdd(this.state.name);
    this.setState({name: ""});
  },
      
    render:function(){
        return(
          <div className="add-player-form">
            <form onSubmit={this.onSubmit} onChange={this.onNameChange}>
              <input type="text" value={this.state.name}/>
              <input type="submit" value="Add Player" />
            </form>
          </div>
        );
     }
  
  });
  
 function Stats(props){
  var totalPlayers = props.players.length;
  var totalPoints = props.players.reduce(function(total, player){
    return total + player.score;
  },0);
    return(
      <table className="stats">
        <tbody>
            <tr>
              <td>Players:</td>
              <td>{totalPlayers}</td>
            </tr>
            <tr>
              <td>Total Points</td>
              <td>{totalPoints}</td>
            </tr>
        </tbody>
      </table>
    )
  }
  
function Header(props){
  return(
    <div className="header">
     <Stats players={props.players} />
        <h1>{props.title}</h1>
  <Stopwatch/>
      </div>
  );
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  players: React.PropTypes.array.isRequired,
};
  

function Counter(props){
  return(
          <div className="counter">
              <button className="counter-action decrement" onClick={function() {props.onChange(-1);}}> - </button>
               <div className="counter-score"> {props.score} </div>
              <button className="counter-action increment" onClick={function() {props.onChange(1);}}> + </button>
            </div>
        );
 
  }
  
Counter.propTypes ={
    score: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
  };
  
function Player(props){
  return(
     
        <div className="player">
          <div className="player-name">
            <a className="remove-player" onClick={props.onRemove}>X</a>
            {props.name}
          </div>
    
          <div className="player-score">
              <Counter score={props.score} onChange={props.onScoreChange}/>
          </div>
    
       </div>
  );
}

Player.propTypes ={
  name:React.PropTypes.string.isRequired,
  score:React.PropTypes.number.isRequired,
  onScoreChange:React.PropTypes.func.isRequired,
  onRemove: React.PropTypes.func.isRequired,
};

  
  Stats.propTypes ={
    players:React.PropTypes.array.isRequired,
  
  }; 
  
var Application = React.createClass({
  propTypes : {
    title: React.PropTypes.string,
    initialplayers:React.PropTypes.arrayOf(React.PropTypes.shape({
      id:React.PropTypes.number.isRequired,
      name:React.PropTypes.string.isRequired,
      score:React.PropTypes.number.isRequired,
    })).isRequired,
  },
  
  getDefaultProps: function(){
    return{
      title:"Score Board",
    };
  },
  
  getInitialState: function(){
    return{
      players:this.props.initialplayers,
    };
  },
  
  onScoreChange: function(index, delta){
    console.log('onScoreChange', index, delta);
    this.state.players[index].score += delta;
    this.setState(this.state);
  },
    
    onPlayerAdd: function(name){
      console.log('Player Add: ',name);
      this.state.players.push({
        name: name,
        score: 0,
        id: nextId,
      });
      this.setState(this.state);
      nextId += 1;
    },
      
  onRemovePlayer:function(index){
    console.log('Remove Player index',index); 
    this.state.players.splice(index, 1);
    this.setState(this.state);
  },
  
  render: function(){
    return (
    <div className="scoreboard">
      <Header title={this.props.title} players={this.state.players}/>
      
      <div className="players">
        {this.state.players.map(function(player, index){
          return (
  <Player 
        onScoreChange={function(delta) {this.onScoreChange(index,delta)}.bind(this)} 
        onRemove={function() {this.onRemovePlayer(index)}.bind(this)}
        name={player.name} 
        score={player.score} key={player.id} />
        );
        }.bind(this))}
      </div>
      <AddPlayerForm onAdd={this.onPlayerAdd} />
       <center><p>Application react by Thomi Jasir</p></center>
    </div>
  );
  }
  });

ReactDOM.render(<Application initialplayers={PLAYERS}/>, document.getElementById('container'));