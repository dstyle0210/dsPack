class PositionAnimationClass{
    constructor(option){
        this.opt = $.extend({
            stageId:"#canvas",
            pointerId:"#pointer",
            drag:false,
            move:false, // 움직이고 있는중.
            fps:5, // 좌표 캡처타이밍 연산배율(작으면 작을수록 섬세하게 좌표를 잡으나, 좌표데이터가 많아짐.
            rate:30 // 움직임 시간배율 (1000/30) , 작으면 작을수록 빠르게 움직임.
        },option);
    };
    init(){
        this.$stage = $(o.stageId); // 좌표캡쳐 , 움직이는 포인터가 움직일 스테이지 엘리먼트
        this.$pointer = $(o.pointerId); // 움직이는 포인터 엘리먼트

        let o = this.opt;
        o.gapX = this.$pointer.width()/2;
        o.gapY = this.$pointer.height()/2;
        o.posArray = []; // 좌표값을 저장할 배열.
    };
    setGetPositionStage(stageId){
        let o = this.opt;
        let that = this;
        this.$stage.on("mousedown",(e)=>{
            o.posArray = []; // 좌표값 초기화
            o.move = true; // 움직이고 있는중.
            that.setPosData(e.offsetX , e.offsetY);
        }).on("mousemove",(e)=>{
            if(o.move){
                o.count++;
                if(o.fps<o.count){
                    that.setPosData(e.offsetX , e.offsetY);
                    o.count = 0;
                }
            }
        }).on("mouseup",()=>{
            o.move = false;
            var str = "<script type='text/javascript'"+">var POSXY_ARRAY=JSON.parse('"+JSON.stringify(pos)+"');<"+"/script>\n";
            str += "<script type='text/javascript' src='https:\/\/dstyle0210.github.io/getPosXYArray/dist/jquery.getPosXYArray.min.js'"+"><"+"/script>";
        });

    };
    setPosData(posX,posY){
        let o = this.opt;
        o.posArray.push({x:Math.ceil(posX - o.gapX ),y:Math.ceil(posY - o.gapY)});
    };
    getSourceCode(){
        return ("<script type='text/javascript'"+">var POSXY_ARRAY=JSON.parse('"+JSON.stringify(this.opt.posArray)+"');<"+"/script>\n" + "<script type='text/javascript' src='https:\/\/dstyle0210.github.io/getPosXYArray/dist/jquery.getPosXYArray.min.js'"+"><"+"/script>");
    };
}

/*
function posAnimationClass(){

}
var pos = [];
$(function(){
    var $canvas = $("#canvas");
    var move = false;
    var fps = 5;
    var count = 0;
    $canvas.on("mousedown",function(e){
        pos = [];
        move = true;
        pos.push({x:Math.ceil(e.offsetX - 20),y:Math.ceil(e.offsetY - 20)});
    });

    // 마우스다운(drag==true) 마우스 움직이는 상태.
    $canvas.on("mousemove",function(e){
        if(move){
            count++;
            if(fps<count){
                pos.push({x:Math.ceil(e.offsetX - 20),y:Math.ceil(e.offsetY - 20)});
                count = 0;
            }
        };
    });

    // 마우스업 => 드래그 종료.
    $canvas.on("mouseup",function(e){
        move = false;
         var str = "[";
         $.each(pos,function(num){
         str += JSON.stringify(this)+((num==pos.length-1) ? "" : ",");
         });
         str += "]";
        var str = "<script type='text/javascript'"+">var POSXY_ARRAY=JSON.parse('"+JSON.stringify(pos)+"');<"+"/script>\n";
        str += "<script type='text/javascript' src='https:\/\/dstyle0210.github.io/getPosXYArray/dist/jquery.getPosXYArray.min.js'"+"><"+"/script>";

        $("#json").text(str)
        // console.log(str);
        console.log( JSON.parse(str) );
    });
});
var mover = $("#mover");
function move(idx){
    setTimeout(function(){
        if(idx<pos.length){
            mover.css({top:pos[idx].y, left:pos[idx].x});
            move(idx+1);
        };
        // console.log(idx);
    },30);
};
*/