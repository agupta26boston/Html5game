

class NumberedBox extends createjs.Container{
constructor(game, number=0){
 super();
  
 this.game=game;
 this.number=number;
var movie= new lib.NumberedBox();
movie.numberText.text=number;

movie.numberText.font = "30px Ubuntu";

new createjs.ButtonHelper(movie, 0, 1, 2, false, new lib.RestartButton(), 3);

this.addChild(movie);
this.setBounds(0,0,50,50);

this.on('click',this.handleClick.bind(this));
}
handleClick(){

    this.game.handleClick(this);
    createjs.Sound.play("Jump");
}
}
//this class controls the game

class GameData{
    constructor(){
   
       this.amountOfBox=20;
       this.resetData();
    }
   resetData(){
       this.currentNumber=1;
   }
   nextNumber(){
       this.currentNumber+=1;
   }
   isRightNumber(number)
   {
       return(number=== this.currentNumber);
   }
   isGameWin(){
       return(this.currentNumber> this.amountOfBox);

       }
   
}
class Game{

constructor(){

    console.log("Welcome to the game");

    this.loadSound();
    this.canvas= document.getElementById("game-canvas");

this.stage=new createjs.Stage(this.canvas);
this.stage.width=this.canvas.width;
this.stage.height=this.canvas.height;

this.stage.enableMouseOver();

createjs.Touch.enable(this.stage);
this.retinalize();
createjs.Ticker.setFPS(60);

//game related initialization
this.GameData= new GameData();

createjs.Ticker.on("tick",this.stage);
this.restartGame();

}
//to add sounds
loadSound(){
   // createjs.Sound.registerPlugins([createjs.WebAudioPlugin, createjs.FlashAudioPlugin]);
createjs.Sound.registerSound("soundfx/jump.aiff","Jump");
createjs.Sound.registerSound("soundfx/Game-over.aiff","end");
createjs.Sound.alternateExtensions= ["ogg"],["wav"];
}

restartGame(){
    this.GameData.resetData();
    this.stage.removeAllChildren();
    this.stage.addChild(new lib.Background()); 
this.generateMultipleBoxes(this.GameData.amountOfBox);

}




generateMultipleBoxes(amount=10){

    for (var i=amount;i>0;i--)
    {
        var movie=new NumberedBox(this, i);
        this.stage.addChild(movie);

        
movie.x=Math.random() * (this.stage.width- movie.getBounds().width);
movie.y=Math.random() * (this.stage.height- movie.getBounds().height);
    }


}
handleClick(NumberedBox){
    if(this.GameData.isRightNumber(NumberedBox.number))
    {
    this.stage.removeChild(NumberedBox);
    this.GameData.nextNumber();

    if(this.GameData.isGameWin()){
        createjs.Sound.play("end");
        var gameOverView= new lib.GameOverView();
        this.stage.addChild(gameOverView);

        gameOverView.restartButton.on('click',(function(){
            createjs.Sound.play("Jump");

            this.restartGame();
        }).bind(this));
    }

    }
}

//for making the visual clear for large devices

retinalize(){

    this.stage.width=this.canvas.width;
    this.stage.height=this.canvas.height;

    let ratio=window.devicePixelRatio;
    if(ratio==undefined){

        return;
    }

    this.canvas.setAttribute('width', Math.round(this.stage.width * ratio) );
    this.canvas.setAttribute('height', Math.round(this.stage.height * ratio));

    this.stage.scaleX =this.stage.scaleY =ratio;

    //Set the CSS style
    this.canvas.style.width=this.stage.width +"px";
    this.canvas.style.height=this.stage.height + "px";
}

}
var game=new Game();
