class player{
    constructor(name,socket){
        this.name=name;
        this.socket=socket;
    }
    joinedRoomCode={}
    table=[]
    uid=0
    status="not ready"
}



class room{
    constructor(code){
        this.code = code;
    }
    players=[]
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
}

function findPlayer(uid,room){
    let players = room.players;
    for(let i=0;i<players.length;i++){
      if(players[i].uid==uid){
        return players[i]
      }
    }
  }
  

module.exports ={room:room,player:player                    
}