var compatibleUtil={
  requestAnimationFrame:(callback,node)=>{
    if (!window.requestAnimationFrame){
      window.requestAnimationFrame = (window.oRequestAnimationFrame || //Opera
        window.webkitRequestAnimationFrame || //谷歌老版本
        window.mozRequestAnimationFrame || //火狐老版本
        window.msRequestAnimationFrame || //IE10
        function (callback) { //IE9以及以下版本   　　　　　　　　　
          window.setTimeout(callback, 1000 / 60); //这里强制让动画一秒刷新60次，之所以设置为16.7毫秒刷新一次，是因为requestAnimationFrame默认也是16.7毫秒刷新一次。        　　　　　　　　
        });
    }
    return window.requestAnimationFrame(callback,node);
  }
}
// function commonRequestAnimationFrame(callback,node){//函数名不能是requestAnimationFrame，否则会报堆栈溢出的错误，因为会递归调用
//     if (!window.requestAnimationFrame){
//       window.requestAnimationFrame = (window.oRequestAnimationFrame || //Opera
//         window.webkitRequestAnimationFrame || //谷歌老版本
//         window.mozRequestAnimationFrame || //火狐老版本
//         window.msRequestAnimationFrame || //IE10
//         function (callback) { //IE9以及以下版本   　　　　　　　　　
//           window.setTimeout(callback, 1000 / 60); //这里强制让动画一秒刷新60次，之所以设置为16.7毫秒刷新一次，是因为requestAnimationFrame默认也是16.7毫秒刷新一次。        　　　　　　　　
//         });
//     }
//     return window.requestAnimationFrame(callback,node);//也相当于调用了requestAnimationFrame（）
// }