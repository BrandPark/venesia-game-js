let $canvas = $("#game-canvas");
let $controlPanel = $("#control-panel");
let $input = $("#input");

class Queue {
    constructor(){
        this._arr = ["my", "name", "is", "mingon"];
    }
    add(item){
        this._arr.push(item);
    }
}

let game={
    init: function(){   //버튼에 리스너를 다는 등의 작업을 하는 초기화 함수.
        let _this = this;

        $("#game-start").on('click', function(){
            _this.gameStart();
        });

        $input.on('keyup', function(event){
            if(event.keyCode==13 || event.keyCode==32){
                console.log($input.val());
                $input.val("");
            }
        });

        timerId = setInterval(function(){_this.repaint()}, 1000);
    },
    
    repaint: function(){
        console.log("gg");
    },

    gameStart: function(){
        //
    }
};
game.init();
