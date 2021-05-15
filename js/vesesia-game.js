let $frame = $('#frame');
let $gamePanel = $("#game-panel");
let $controlPanel = $("#control-panel");
let $input = $("#input");
let $score = $('#score');
let $failed = $('#failed');

let speed = 2;
let stop = false;


// ------------------- 단어 클래스 -------------------------------
class Word {
    constructor(word){
        this.x = Math.floor(Math.random() * $gamePanel.innerWidth()) + parseInt($gamePanel.css('margin-left').replace('px', ''));
        this.y = 0;
        this.word = word;  
        this.interval = null; 

    }

    move(){
        var _this = this;
        this.interval = setInterval(function(){_this.y += speed;}, 30);
    }
    intervalStop(){
        let _this = this;
        clearInterval(_this.interval);
        console.log("stop : " + this.word);
    }
}
// ------------------- 게임 클래스 -------------------------------
class Game {
    constructor(){
        this.words = [];
        this.activeWords = [];
        
    }
    init() {   
        let _this = this;

        $("#game-start").on('click', function(){
            setInterval(function(){_this.repaint()}, 30);
            _this.gameStart();
        });

        $input.on('keyup', function(event){
            if(event.key === 'Enter' || event.key === ' '){
                _this.eraseWord($input.val());
                $input.val("");
            }
        });
    }

    gameStart(){
        let _this = this;
        
        this.words = ['my', 'name', 'is', 'mingon'];
        
        let interval = setInterval(function(){
            if(stop){
                //점수 보여주기
                clearInterval(interval);
                _this.showScore();
                return;
            } 
            _this.gameStartImpl();

        }, 500);
    }
    
    repaint() {
        this.clearGamePanel();

        for(var i=0;i<this.activeWords.length;i++){
            var wordObj = this.activeWords[i];

            if(!this.removeFailedWord(i, wordObj.y)) {
                this.addWord(wordObj.word, wordObj.x, wordObj.y);
            }
        }
    }

    clearGamePanel(){
        $gamePanel.children().remove();
    }
    removeFailedWord(index, y){
        if(y >= $gamePanel.innerHeight() - 10){
            this.activeWords.splice(index,1)[0].intervalStop();  
            var curFailed = parseInt($failed.text());
            $failed.text(curFailed + 1);
            return true;   
        }
        return false;
    }

    addWord(word, x, y){
        let wordDiv = $(`<div class='word'>${word}</div>`);
        wordDiv.css('left', x);
        wordDiv.css('top', y);
        $gamePanel.append(wordDiv);
    }

    

    showScore(){
        let _this = this;

        let $scoreBoard = $(`<div id='score-board' class='d-flex align-items-center flex-column'></div>`);
    
        let $scoreDiv = $(`<div id='end-score'>점수 : ${$score.text()}</div>`);
        $scoreBoard.append($scoreDiv);

        let $restartBtn = $(`<button id='restart-btn' class='btn btn-primary mt-sm-3'>다시 시작</button>`);
        $restartBtn.on('click', function(){
            $frame.children().remove("#score-board");
            $score.text(0);
            $failed.text(0);
            stop = false;
            _this.gameStart();
        });

        $scoreBoard.append($restartBtn);
        
        $input.blur();
        $frame.append($scoreBoard);
    }

    gameStartImpl(){
        //words가 비어있지 않다면 하나를 꺼내어 drop시킨다.
        if(this.words.length != 0){
            let word = this.words.shift();

            var wordInstance = new Word(word);
            wordInstance.move();
            this.activeWords.push(wordInstance);
        }

        //실패를 10번 이상하거나 모든 단어가 처리(실패 or 성공)되었다면 stopflag를 세운다.
        if(parseInt($failed.val()) >= 10 || this.activeWords.length == 0){
            stop = true;
            return;
        }
    }
    
    eraseWord(word){
        let index = this.activeWords.findIndex(element => element.word === word);
        let curScore = parseInt($score.text());
        //단어가 있다면 삭제하고 점수 올리고 없다면 점수 깎기.
        if(index != -1){
            this.activeWords.splice(index, 1)[0].intervalStop();
            $score.text(curScore + 1);
        }
        else if(curScore > 0) {    
            $score.text(curScore - 1);
        }

    }
};

new Game().init();
