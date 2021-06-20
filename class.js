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
    assignRows(){
        let arr=[];
        let arr2=[];
        for(let i=0;i<5;i++){
            for(let j=0;j<5;j++){
                arr.push(this.state[j]);
            }
            arr2.push(arr);
            arr=[]
        }
        this.rows=arr2;
    }
    
    assignCols(){
        let arr=[];
        let arr2=[];
        for(let i=0;i<5;i++){
            for(let j=i;j<i+19;j+=5){
                arr.push(this.state[j])
            }
            arr2.push(arr);
            arr=[]
        }
        this.cols=arr2;
    }
    assignDiags(){
        for(let i=0;i<25;i+=6){
            arr.push(this.state[i])
        }
        arr2.push(arr)
        arr=[]
        for(let i=4;i<21;i+=4){
            arr.push(this.state[i])
        }
        arr2.push(arr)
        arr=[]
        this.diag=arr2
    }
    progress=0;
    check(){
         for(let i=0;i<5;i++){
             if(!belongsTo(0,this.arr[i])){
                progress++;
             }
         }
         for(let i=0;i<5;i++){
            if(!belongsTo(0,this.cols[i])){
               progress++;
            }
        }
        for(let i=0;i<2;i++){
            if(!belongsTo(0,this.diag[i])){
                progress++;
            }
        }
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
    turn = 1;
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