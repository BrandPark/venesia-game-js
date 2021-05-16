let $frame = $('#frame'); 
let $gamePanel = $("#game-panel");  //단어들이 나오는 div
let $controlPanel = $("#control-panel");    //입력창과 점수 등이 있는 div
let $input = $("#input");   //입력창
let $score = $('#score');   //맞춘 단어의 개수
let $failed = $('#failed'); //바닥에 떨어진 단어의 개수. 10개가 되면 게임은 종료된다.
let $board = $('#board');   //도움말과 게임 결과를 표시해주는 div
let speed = 2;  //단어가 내려가는 속도
let delay = 1000; //다음 단어를 떨어뜨리기 까지의 딜레이
let gameoverLimit = 5; //게임오버의 기준이 되는 단어 수
let wordString = `어쩜 이렇게 하늘은 더 파란 건지?
오늘따라 왜 바람은 또 완벽한지?
그냥 모르는 척, 하나 못들은 척
지워버린 척 딴 얘길 시작할까
아무 말 못하게 입맞출까
눈물이 차올라서 고갤 들어
흐르지 못하게 또 살짝 웃어
내게 왜 이러는지? 무슨 말을 하는지?
오늘 했던 모든 말 저 하늘 위로
한번도 못했던 말
울면서 할 줄은 나 몰랐던 말
나는요 오빠가 좋은걸
어떡해?
새로 바뀐 내 머리가 별로였는지
입고 나왔던 옷이 실수였던 건지
아직 모르는 척, 기억 안 나는 척
아무 일없던 것처럼 굴어볼까
그냥 나가자고 얘기할까?
눈물이 차올라서 고갤 들어
흐르지 못하게 또 살짝 웃어
내게 왜 이러는지? 무슨 말을 하는지?
오늘 했던 모든 말 저 하늘 위로
한번도 못했던 말
울면서 할 줄은 나 몰랐던 말
나는요 오빠가 좋은걸 (휴)
어떡해?
이런 나를 보고 그런 슬픈 말은 하지 말아요 (하지 말아요)
철없는 건지, 조금 둔한 건지, 믿을 수가 없는걸요
눈물은 나오는데 활짝 웃어
네 앞을 막고서 막 크게 웃어
내가 왜 이러는지? 부끄럼도 없는지?
자존심은 곱게 접어 하늘위로
한 번도 못했던 말
어쩌면 다신 못할 바로 그 말
나는요 오빠가 좋은걸 (아이쿠, 하나, 둘)
I'm in my dream
It's too beautiful, beautiful day
Make it a good day
Just don't make me cry
이렇게 좋은 날`.split(/ |\n/gm);

// ------------------- 단어 클래스 -------------------------------
class Word {
    constructor(word){
        this.x = Math.floor(Math.random() * $gamePanel.innerWidth()) + (document.body.clientWidth - $gamePanel.innerWidth())/2;
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
        return this;
    }
}
// ------------------- 게임 클래스 -------------------------------
class Game {
    constructor(){
        this.waitWords = [];
        this.activeWordObjs = [];
    }
    init() {   
        let _this = this;

        $input.on('keydown', function(event){
            if(event.key === 'Enter' || event.key === ' '){
                _this.hitWord($input.val().trim());
                $input.val("");
            }
        });

        setInterval(function(){_this.repaint()}, 30);
        this.showHelp();
    }

    gameStart(){
        let _this = this;
        this.waitWords = wordString.slice(0);
        
        let interval = setInterval(function(){

            _this.dropWord();

            if(_this.isGameOver() || _this.isGameClear()){
                clearInterval(interval);
                _this.removeAllWords();
                _this.clearGamePanel();
                _this.showScore();
                return;
            }
        }, delay);

        $score.text(0);
        $failed.text(0);
        $board.css('visibility', 'hidden');
        $input.focus();
    }

    dropWord(){
        if(this.waitWords.length != 0){
            let word = this.waitWords.shift();
            let wordInstance = new Word(word);
            
            wordInstance.move();
            this.activeWordObjs.push(wordInstance);
        }
    }

    //activeWordObjs[] 에 있는 단어들을 다시 그려준다.
    repaint() {
        this.clearGamePanel();

        var i;
        for(i=0;i<this.activeWordObjs.length;){
            var wordObj = this.activeWordObjs[i];

            if(!this.removeFailedWord(i, wordObj.y)) {
                this.appendWord(wordObj.word, wordObj.x, wordObj.y);
                i++;
            }
        }
    }

    //게임 설명화면을 보여준다.
    showHelp(){
        this.clearBoard();

        let _this = this;
        let $helpDiv = $(`<div id='help-div'>
            <label class='col-form-label' id='help-title'>게임 설명</label>
            <div>
                1. 위에서 떨어지는 단어가 <b>바닥에 닿기 전에</b> 해당 단어를 <b>입력</b>하여 점수를 획득하세요.<br>
                2. 없는 단어 입력 시 <b>점수가 차감</b>됩니다. <br>
                3. <b>${gameoverLimit}개</b>가 바닥에 떨어지면 <b>게임은 종료</b>됩니다.<br>
                4. 단어가 모두 나와서 처리되면 <b>게임은 종료</b>됩니다. <br>
                5. 게임이 종료되면 획득한 점수가 공개됩니다.<br>
            </div>
        </div>`);
        let $startBtn = $(`<button class="btn btn-primary mt-sm-5" role="button" id="start-btn">게임 시작</button>`);
        $startBtn.on('click', function(){_this.gameStart();});

        $board.css('visibility', 'visible');
        $board.append($helpDiv);
        $board.append($startBtn);
        $frame.append($board);
        $startBtn.focus();
    }

    //게임종료 시 획득한 점수를 보여준다.
    showScore(){
        this.clearBoard();

        let _this = this;
        let $scoreDiv = $(`<div id='end-score'>점수 : ${$score.text()}</div>`);
        let $restartBtn = $(`<button id='restart-btn' class='btn btn-primary mt-sm-3'>다시 시작</button>`);
        let $helpBtn = $(`<button id='help-btn' class='btn btn-secondary mt-sm-3'>게임 설명</button>`);

        let btnArr = [$restartBtn, $helpBtn];
        let curBtnIndex = 0;

        //-------버튼 focus 처리------
        $board.on('keydown click', function(e){
            if(e.key === 'ArrowDown' || e.key === 'ArrowRight'){
                btnArr[curBtnIndex].removeClass("btn-primary").addClass("btn-secondary");
                curBtnIndex = (curBtnIndex + 1) % 2;
            }
            else if(e.key === 'ArrowUp' || e.key === 'ArrowLeft'){
                btnArr[curBtnIndex].removeClass("btn-primary").addClass("btn-secondary");
                curBtnIndex = Math.abs(curBtnIndex - 1);
            }
            btnArr[curBtnIndex].removeClass("btn-secondary").addClass("btn-primary");
            btnArr[curBtnIndex].focus();
        });
        $restartBtn.on('mouseover',function(){
            $helpBtn.removeClass("btn-primary").addClass("btn-secondary");
            $restartBtn.removeClass("btn-secondary").addClass("btn-primary");
            $restartBtn.focus();
            curBtnIndex = 0;
        });
        $helpBtn.on('mouseover',function(){
            $restartBtn.removeClass("btn-primary").addClass("btn-secondary");
            $helpBtn.removeClass("btn-secondary").addClass("btn-primary");
            $helpBtn.focus();
            curBtnIndex = 1;
        });
        //-----------------------------
        
        $restartBtn.on('click', function(){_this.gameStart();});
        $helpBtn.on('click', function(){_this.showHelp();});

        $board.css('visibility', 'visible');
        $board.append($scoreDiv);
        $board.append($restartBtn);
        $board.append($helpBtn);
        $frame.append($board);

        $restartBtn.focus();
    }

    //단어를 div로 감싸 gamePanel에 붙인다.
    appendWord(word, x, y){
        let wordDiv = $(`<div class='word'>${word}</div>`);
        wordDiv.css('left', x);
        wordDiv.css('top', y);
        $gamePanel.append(wordDiv);
    }

    //입력한 단어와 같은 단어를 찾아 제거하고 점수를 처리한다.
    hitWord(word){
        let index = this.activeWordObjs.findIndex(element => element.word === word);
        let curScore = parseInt($score.text());
        
        if(index != -1){
            this.removeWord(index);
            $score.text(curScore + 1);
        }

        else if(curScore > 0) {    
            $score.text(curScore - 1);
        }
    }

    //바닥에 떨어진 단어를 activeWordObjs[]에서 제거한다. 
    removeFailedWord(index, y){
        if(y >= $gamePanel.innerHeight() - 10){
            this.removeWord(index);  

            var curFailed = parseInt($failed.text());
            $failed.text(curFailed + 1);

            return true;   
        }
        return false;
    }

    //모든 단어를 activeWordObjs[]에서 제거한다.
    removeAllWords(){
        while(this.activeWordObjs.length > 0){
            this.activeWordObjs.pop().intervalStop();
        }
    }

    //단어를 activeWordObjs[]에서 제거하고 단어의 interver을 중지한다.
    removeWord(index){
        this.activeWordObjs.splice(index,1)[0].intervalStop();
    }

    isGameOver(){ return parseInt($failed.text()) >= gameoverLimit; }

    isGameClear(){ return this.activeWordObjs.length == 0; }

    clearBoard(){ $board.children().remove(); }

    clearGamePanel(){ $gamePanel.children().remove(); }
};

new Game().init();
