var canvas=document.querySelector("#canvas"),
    wrapper=document.getElementById("wrapper");//wrapper不需要加#
    ctx=canvas.getContext('2d'),
    W=canvas.width=wrapper.offsetWidth,
    H=canvas.height=wrapper.offsetHeight,
    color1="#6ca0f6",
    color2="#367aec";

var dots=[],//点的集合
    diffVals=[],//差分值
    dotsNum=250,//点数
    diff=1000,//初始差分值
    vibratePos=125,//默认震荡点
    maxSpaceNum=15;//缓冲距离
    //生成一定个数在同一基线上的的点
    for(let i=0;i<dotsNum;i++)
    {
      dots[i]=new Dot(W/(dotsNum-1)*i,H/2,H/2);
      diffVals[i]=0;
    }

    //鼠标点击
    canvas.addEventListener('mousedown',(e)=>{
      var clickPos={x:null,y:null};
      if(e.pageX||e.pageY)
      {//IE8以下不支持pageX,event.pageX=event.clientX+横向滚动距离
        clickPos.x=e.pageX;
        clickPos.y=e.pageY;
      }else{
        //页面具有 DTD，或者说指定了 DOCTYPE 时，使用 document.documentElement
        //页面不具有 DTD，或者说没有指定了 DOCTYPE，时，使用 document.body
        clickPos.x=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;
        clickPos.y=e.clientY+document.body.scrollTop+document.documentElement.scrollTop;
      }
      //重设差分值
      if(clickPos.y>(H/2-50)&&clickPos.y<(H/2+50))
      {
        diff=1000;
        vibratePos=Math.floor(clickPos.x*(dotsNum-1)/W)+1;
        //diffVals[vibratePos]=diff;
      }     
    },false);

    //resize
    var resize=()=>{
      W=canvas.width=wrapper.offsetWidth;
      H=canvas.height=wrapper.offsetHeight;
    };
    window.addEventListener("resize",resize);

    //绘制长方形
    var drawRect=(color,width,height,distance)=>{
      ctx.save();
      ctx.fillStyle=color;
      ctx.beginPath();//开始一条路径
      ctx.moveTo(0,height);//把路径移动到画布中的指定点，不创建线条
      ctx.lineTo(dots[0].x,dots[0].y+distance);//添加一个新点，然后创建从该点到画布中最后指定点的线条(并没有绘制出路径)
      for(let i=1;i<dots.length;i++)
      {
        ctx.lineTo(dots[i].x,dots[i].y+distance);
      }
      ctx.lineTo(width,height);
      ctx.lineTo(0,height);
      ctx.fill();//填充当前的图像（路径）
      ctx.restore();
    };

    var draw=()=>{
      //绘制外方形
      drawRect(color1,W,H,0);
      //绘制内方形
      drawRect(color2,W,H,5);
    }

    //顶点更新
    var update=()=>{
       diff-=diff*0.9;
       diffVals[vibratePos]=diff;
       //左侧
       for(let i=vibratePos-1;i>0;i--)
       {
         var spaceNum=vibratePos-i;//间隔数
         if(spaceNum>maxSpaceNum)
         {
           spaceNum=maxSpaceNum;
         }
         diffVals[i]-=(diffVals[i]-diffVals[i+1])*(1-0.01*spaceNum);
       }
       //右侧
       for(let i=vibratePos+1;i<dotsNum;i++)
       {
         var spaceNum=i-vibratePos;
         if(spaceNum>maxSpaceNum)
         {
           spaceNum=maxSpaceNum;
         }
         diffVals[i]-=(diffVals[i]-diffVals[i-1])*(1-0.01*spaceNum);
       }
       //更新所有的y坐标
       for(let i=0;i<dots.length;i++)
       {
          dots[i].updateY(diffVals[i]);
       }
      }

    //循环动画
    (function drawFrame(){
      window.requestAnimationFrame(drawFrame,canvas);
      ctx.clearRect(0, 0, W, H);
      update();
      draw();
    })();

    var blue = ()=>{
      color1 = "#6ca0f6";
      color2 = "#367aec";
    }
    var green = ()=>{
      color1 = "#52D681";
      color2 = "#00AD7C";
    }
    
    var red = ()=>{
      color1 = "#FF847C";
      color2 = "#E84A5F";
    }

