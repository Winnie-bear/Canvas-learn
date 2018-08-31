/**
 * @author winnie
 * @description nest plugin
 */
(function(window,factory){
  if(typeof define==="function"&& define.amd){
    define([],factory);
  }else if(typeof module==="object"&&module.exports){
    module.exports=factory;
  }else{
    window.nest=factory();
  }
})(typeof window!=="undefined"?window:this,function(){
  let nest=(selector,userOptions)=>{
   //默认设置 
    let defaultOpts={
      //canvas默认宽高
      cW:1367,
      cH:500,
      minDistance:6000,//最小的极限距离
      dotNum:160,
      dotRad:2,
      dotColor:"#FFFFFF",
      dotAlpha:1,
      dotMinSpeed:-1,
      dotMaxSpeed:1,
      lineColor:"#FFFFFF",
    }
  //全局变量
  var canvas=null,
      ctx=null,
      W=null;
      H=null;
      dots=[];
    //混合参数
    let mergeOptions=(userOptions,defaultOpts)=>{
      Object.keys(userOptions).forEach(key=>{
        defaultOpts[key]=userOptions[key];
      })
    }
    //在取值范围内任取一值
    let range=(min,max)=>{
      return Math.random()*(max-min)+min;//Math.random()不能掉()
    }
    //获取两点之间距离的平方
    let getDis=(x1,y1,x2,y2)=>{
      let dx=x2-x1;
      let dy=y2-y1;
      let d=dx*dx+dy*dy;
      return d;
    }
    //颜色16进制转rgb,同时可以设置透明度
    let colorToRgba=(color,alpha)=>{
      if(typeof color ==="string" && color[0]==="#"){
        var colorNum=parseInt(color.slice(1),16);//parseInt(string, radix),radix表示要解析的数字的基数
      }
      let a=(alpha==="undefined")?1:alpha;
      //解析，一位十六进制数等于4位二进制数
      let r=colorNum>>16 & 0xff,
          g=colorNum>>8 & 0xff,
          b=colorNum & 0xff;//& 0xff保证得到8bits的二进制数
      if(a===1)
      {
        return `rgb(${r},${g},${b})`;
      }else{
        return `rgba(${r},${g},${b},${a})`;
      }
    }
    //dot类
    class Dot{
      constructor(){
        this.x=range(0,W);//点的横坐标
        this.y=range(0,H);//点的纵坐标
        this.rad=defaultOpts.dotRad;
        this.color=defaultOpts.dotColor;
        this.alpha=defaultOpts.dotAlpha;
        //随机生成水平和竖直方向的速度（在最大速度和最小速度之间）
        this.vx=range(defaultOpts.dotMinSpeed,defaultOpts.dotMaxSpeed);
        this.vy=range(defaultOpts.dotMinSpeed,defaultOpts.dotMaxSpeed);
      }
      //绘制点
      draw(){
       ctx.save();
       ctx.beginPath();
       ctx.arc(this.x,this.y,this.rad,0,2*Math.PI,false);
       ctx.closePath();
       ctx.fillStyle=colorToRgba(this.color,this.alpha);
       ctx.fill();
       ctx.restore();
      }
    //边界判断，与边界碰撞后，速度反向
    update(){
      this.x+=this.vx;
      this.y+=this.vy;
      this.vx*=this.y>W||this.y<0?-1:1;
      this.vy*=this.y>H||this.y<0?-1:1;
    };
    setPos(x,y){
      this.x=x;
      this.y=y;
    }
    init(){
      this.draw();
      this.update();
    };
  };
  //线类
  class Line{
    constructor(x1,y1,x2,y2){
      this.x1=x1;
      this.y1=y1;
      this.x2=x2;
      this.y2=y2;
      this.dis=getDis(this.x1,this.y1,this.x2,this.y2);
      this.relativeValue=(defaultOpts.minDistance-this.dis)/defaultOpts.minDistance;
      this.lineWidth=this.relativeValue/2;
      this.alpha=this.relativeValue+0.2;
      this.color=defaultOpts.lineColor;
    }
    draw(){
      ctx.save();
      ctx.beginPath();
      ctx.strokeStyle=colorToRgba(this.color,this.alpha);
      ctx.lineWidth=this.lineWidth;
      ctx.moveTo(this.x1,this.y1);
      ctx.lineTo(this.x2,this.y2);
      ctx.stroke();
    }
    update(){
      this.relativeValue=(defaultOpts.minDistance-this.dis)/defaultOpts.minDistance;
      this.lineWidth=this.relativeValue/2;
      this.alpha=this.relativeValue+0.2;
    }
    init(){
      this.update();
      this.draw();
    }
  }
  //随机生成一定数目的点
  let creatDots=()=>{
    for(let i=0;i<defaultOpts.dotNum;i++)
    {
      let dot=new Dot();
      dots.push(dot);
    }
  }
  let mouseListener=()=>{
    //添加鼠标移动这个点
    canvas.onmousemove = (e) => {
      var newDot = new Dot();
      newDot.setPos(e.clientX,e.clientY);
      dots.splice(0, 1, newDot);//添加一个新元素在index=0的位置
    }
    canvas.onmouseout = (e) => {
      dots.shift();//删除数组的第一个元素
    }
  }
  let execute=()=>{
     dots.forEach((dot,index)=>{
       dot.init();//绘制点
       for(let i=index+1;i<dots.length;i++){
         let otherDot=dots[i];
         let dis=getDis(dot.x,dot.y,otherDot.x,otherDot.y);
         //小于最小基线距离要画线
         if(dis<defaultOpts.minDistance){
            //index=0的点是鼠标移动新添加的点，要产生一个鼠标吸附粒子的效果
            if(index===0)
            {
              dis>=defaultOpts.minDistance/2&&(otherDot.x-=0.03*(dot.x-otherDot.x),otherDot.y-=0.03*(dot.y-otherDot.y));
            }
            let line=new Line(dot.x,dot.y,otherDot.x,otherDot.y);
            line.init();
         }
       }
     });
   }
   let initSet=(selector,userOptions)=>{
     mergeOptions(userOptions,defaultOpts);
     canvas=document.querySelector(selector);
     ctx=canvas.getContext("2d");
     W=canvas.width=defaultOpts.cW;
     H=canvas.height=defaultOpts.cH;
     creatDots(); 
     mouseListener();
     (function drawFrame(){
       window.requestAnimationFrame(drawFrame,canvas);
       ctx.clearRect(0,0,W,H);   
       execute();  
     })();
   }
   initSet(selector,userOptions);
 }
 return nest;
});