class player{
    state=[]
    constructor(name,socket){
        this.name=name;
        this.socket=socket;
        for(let i=0;i<24;i++){
            this.state.push(0)
        }
    }
    changeState(val){
        for(let i=0;i<25;i++){
            if(this.table==val){
                this.state[i]=val;
                return 0;
            }
        }
    }
    isTurn=false;
    joinedRoomCode={}
    table=[]
    uid=0
    status="not ready"
}



class room{
    constructor(code){
        this.code = code;
    }
    turn = 1;
    players=[]
    occupied=[]
    finished=false;
    updatePlayerStatus(uid,status,table){
        let selectedPlayer = findPlayer(uid,this)
        this.players.forEach(p=>{
            if(p==selectedPlayer){
                p.status=status;
                p.table=table;
                return 0;
            }
        })
    }
    emitAll(objective,message) {
  
        this.players.forEach((p) => {
          p.socket.emit(objective, message);
        });
      }
}

function findPlayer(uid,room){
    let players = room.players;
    for(let i=0;i<players.length;i++){
      if(players[i].uid==uid){
        return players[i]
      }
    }
  }

  function belongsTo(e, arr) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] == e) {
        return true;
      }
    }
    return false;
  }
module.exports ={room:room,player:player}