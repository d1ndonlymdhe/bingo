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
    addPlayers(player){
        this.players.push(player)
    }
}

module.exports ={room:room,player:player                    
}