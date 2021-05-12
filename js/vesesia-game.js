let $canvas = $("#game-canvas");
let $controlPanel = $("#control-panel");
let $input = $("#input");

class Word {
    constructor(word){
        this.x = Math.floor(Math.random() * ($canvas.height() - 40));
        this.y = 10;
        this.word = word;
    }
}

class Game {
    init() {   //버튼에 리스너를 다는 등의 작업을 하는 초기화 함수.
        let _this = this;

        //게임시작버튼 리스너
        $("#game-start").on('click', function(){
            _this.gameStart();
        });

        //입력창 리스너
        $input.on('keyup', function(event){
            if(event.keyCode==13 || event.keyCode==32){
                console.log($input.val());
                $input.val("");
            }
        });

        //30ms마다 다시 그려준다.
        //setInterval(function(){_this.repaint()}, 30);
    }

    repaint() {
        console.log("gg");
    }

    gameStart(){
        //word를 생성한다.
        let word = new Word("mingon");
        
        //canvas에 그려준다. 
        let context = $canvas.get(0).getContext("2d");
        context.font = "20px Georia";
        context.fillText(word.word, word.x, word.y, 40);

        console.log(word.x);
        //word를 움직이게 한다.     

    }
};
new Game().init();
