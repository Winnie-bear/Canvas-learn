/**
 * @author winnie
 * @description matrix plugin
 */
(function(window,factory){
  if(typeof define==="function"&& define.amd){//AMD规范
    define([],factory);//define方法定义模块，依赖前置
  }else if(typeof module==="Object"&&module.exports){//CommonJs
    module.exports=factory();
  }else{//window一般环境
    window.matrix=factory();
  }
})(typeof window!=="undefined"?window:this,function(){
   var matrix=(selector,userOptions)=>{
      var W,
          H,
          canvas,
          context,
          columns,//列数
          wordsArr,
          drops=[];//决定行数
       var defaultOpts={
         cW:1368,//用户界面显示宽度
         cH:600,//用户界面显示高度
         alpha:0.1,//透明度
         wordColor:"#FFFC3A",//字体颜色
         fontSize:16,//字体大小
         words:`0123456789qwertyuiopasdfghjklzxcvbnm,./;'\[]QWERTYUIOP{}ASDFGHJHJKL:ZXCVBBNM<>?`,//字体内容         
        };
        //混合选项,userOptions的值覆盖对应的defaultOpts的值
        var mergeOptions=(userOptions,defaultOpts)=>{
          //Object.keys()返回一个由一个给定对象的自身可枚举属性组成的数组
          Object.keys(userOptions).forEach((key)=>{
            defaultOpts[key]=userOptions[key];
          })
        };
        //逐字逐行绘制文字
        var draw=()=>{
          context.save();
          context.fillStyle=defaultOpts.wordColor;//填充字体颜色
          context.font=`${defaultOpts.fontSize}px arial`;//填充字体样式
          //一行一行地填充，比如第一行遍历文字的X坐标（0，16,32,48，...),Y坐标（16,16,16，...)
          for(let i=0;i<drops.length;i++){
            let text=wordsArr[Math.floor(Math.random()*wordsArr.length)];//随机选择一个填充文字
            context.fillText(text,i*defaultOpts.fontSize,drops[i]*defaultOpts.fontSize);
            if(drops[i]*defaultOpts.fontSize>H && Math.random()>0.98){
              drops[i]=0;
            }
            drops[i]++;
          }
          context.restore();
        }
        //初始化
        var init=(selector,userOptions)=>{
          mergeOptions(userOptions,defaultOpts);
          canvas=document.querySelector(selector);
          context=canvas.getContext('2d');
          canvas.width=W=defaultOpts.cW;
          canvas.height= H=defaultOpts.cH;
          columns=W/defaultOpts.fontSize;
          wordsArr=defaultOpts.words.split("");
          //drops数组初始化为第一行，length为column
          for(let i=0;i<columns;i++)
          {
            drops[i]=1;
          }
          //循环动画
          (function drawFrame(){
            window.requestAnimationFrame(drawFrame);
            context.fillStyle=`rgba(0,0,0,${defaultOpts.alpha})`;
            context.fillRect(0,0,W,H);
            draw();
          })()
        }
       init(selector,userOptions);
   }
   return matrix;
});