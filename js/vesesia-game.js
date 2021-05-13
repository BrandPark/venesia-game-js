let $gamePanel = $("#game-panel");
let $controlPanel = $("#control-panel");
let $input = $("#input");

let speed = 2;

class Word {
    constructor(word){
        this.x = Math.floor(Math.random() * $gamePanel.innerWidth()) + parseInt($gamePanel.css('margin-left').replace('px', ''));
        this.y = 0;
        this.word = word;   
    }
    move(){
        var _this = this;
        setInterval(function(){_this.y += speed}, 30);
    }
}

class Game {
    constructor(){
        this.words = ['my', 'name', 'is', 'mingon'];
        this.activeWords = [];
    }
    init() {   //버튼에 리스너를 다는 등의 작업을 하는 초기화 함수.
        let _this = this;

        //게임시작버튼 리스너
        $("#game-start").on('click', function(){
            _this.gameStart();
        });

        //입력창 리스너
        $input.on('keyup', function(event){
            if(event.key === 'Enter' || event.key === ' '){
                console.log($input.val());
                $input.val("");
            }
        });

        //30ms마다 다시 그려준다.
        setInterval(function(){_this.repaint()}, 30);
    }

    repaint() {
        this.update();
    }
    update(){
        $gamePanel.empty();

        for(var i=0;i<this.activeWords.length;i++){
            var w = this.activeWords[i];

            if(this.isFailed(w.y)){
                this.activeWords.splice(i,1);
            }

            //단어를 div로 감싸 생성한다.
            let wordDiv = $(`<div>${w.word}</div>`);
            wordDiv.css('position','absolute');
            wordDiv.css('left', w.x);
            wordDiv.css('top', w.y);
            wordDiv.css('font-size', '15px');

            $gamePanel.append(wordDiv);
        }
    }
    isFailed(y){
        if(y >= $gamePanel.innerHeight())
            return true;
        return false;
    }
    gameStart(){
        //word를 생성한다.
        var wordInstance = new Word("mingon");
        wordInstance.move();
        this.activeWords.push(wordInstance);

        

        //word를 움직이게 한다.     
        

    }
};
new Game().init();
