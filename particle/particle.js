class ImgToParticle{
  constructor({canvas,imgSrcArr,radius}){
    this.canvas=canvas;
    this.ctx=canvas.getContext("2d");
    this.imgSrcArr=imgSrcArr;//图片地址数组
    this.imgObjArr=[];//图片对象数组
    this.radius=radius;//粒子的半径
    this.index=0;
    this.initz=300;
    this.particles=[];
    this.init();
  }
  init(){
    console.log("1111");
    var W=this.canvas.width;
    var H=this.canvas.height;
    //限制小球半径
    if( W>500 || H>300 ){
       this.radius>=4?this.radius=this.radius:this.radius=4;
    }else{
      this.radius>=2?this.radius=this.radius:this.radius=2;
    }
    //原数组被“映射”成对应新数组
    let promiseArr=this.imgSrcArr.map((imgSrc)=>{
      return new Promise((resolve,reject)=>{
        var imgObj=new Image();
        //图片异步加载成功
        imgObj.onload=()=>{
          this.imgObjArr.push(imgObj);
          resolve();
        }
        imgObj.src=imgSrc;
      })
    });
    //图片全部加载完成后开始绘制
    Promise.all(promiseArr).then(()=>{
       this.imgSwiper();
    });
  }
  //图片粒子化轮播
  imgSwiper(){
    this.drawImg();//绘制当前图片
    this.toParticle();//得到像素点
    this.combineAnimate();//合成图像
    this.index===this.imgSrcArr.length-1?this.index=0:this.index++;
  }
  drawImg(){
   //清空画布
   ctx.clearRect(0,0,W,H);
   var img=this.imgObjArr[this.index];
   var imgW=img.width;
   var imgH=img.height;
   //限制图片大小
   if(imgW>imgH){
     imgScale=imgH/imgW;
     imgW=W*0.5;
     imgH=imgW*imgScale;
   }else{
    imgScale=imgW/imgH;
    imgH=H*0.7;
    imgW=imgH*imgScale;
   }
   //绘制图片到canvas
   this.ctx.drawImage(img,W/2-imgW/2,H/2-imgH/2,imgW,imgH);
  }
  toParticle(){
    let imageData=this.ctx.getImageData(W/2-imgW/2,H/2-imgH/2,imgW,imgH);
    let data=imageData;
    //获取每个像素的rgba
    let i=0;
    for(let x=W/2-imgW/2;x<imageData.width;x+=this.radius*2){
      for(let y=H/2-imgH/2;y<imageData.height;y+=this.radius*2){
        if(data[i]!==255&&data[i+1]!==255&&data[i+2]!==255&&data[i+3]!==0){
          console.log(i)
          let particle={
            x:x,//图片的横坐标
            y:y,//图片的纵坐标
            z:0,
            r:data[i],
            g:data[i+1],
            b:data[i+2],
            a:1,
            //初始化坐标和rgba
            ix:Math.random()*this.imageData.width,
            iy:Math.random()*this.imageData.height,
            iz:Math.random()*this.initz*2-this.initz,
            ir:255,
            ig:255,
            ib:255,
            ia:0,
            //目标坐标和rgba
            tx:Math.random()*this.canvas.width,
            ty:Math.random()*this.canvas.height,
            tz:Math.random()*this.initz*2-this.initz,
            tr:255,
            tg:255,
            tb:255,
            ta:0,
          };
          i+=4;
          this.particles.push(particle);
        }
      }
    }
  }
  combineAnimate(){
    let combined=false;
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.particles.map((particle)=>{
      //同一个浮点数在计算机内可以有多种二进制表示，不能直接用===判断相等
      if(Math.abs(particle.ix-particle.x)<0.1&&Math.abs(particle.iy-particle.y)<0.1&&Math.abs(particle.iz-particle.z)<0.1){
        particle.ix = particle.x;
        particle.iy = particle.y;
        particle.iz = particle.z;
        particle.ir = particle.r;
        particle.ig = particle.g;
        particle.ib = particle.b;
        particle.ia = particle.a;
        combined = true;
      }else{
        particle.ix += (particle.x-particle.ix)*0.07;
        particle.iy += (particle.y-particle.iy)*0.07;
        particle.iz += (particle.z-particle.iz)*0.07;
        particle.ir += (particle.r-particle.ir)*0.3;
        particle.ig += (particle.g-particle.ig)*0.3;
        particle.ib += (particle.b-particle.ib)*0.3;
        particle.ia += (particle.a-particle.ia)*0.1;
        combined = false;
      }
      return this.drawParticle(particle);
    });
    if(!combined){
      requestAnimationFrame(()=>{
        return this.combineAnimate();
      });
    }else{
      setTimeout(()=>{
        return this.separateAnimate();
      },1500);
    }
  }
  //分离动画
  separateAnimate(){
   let sparated=false;
   this.clearRect(0,0,this.canvas.width,this.canvas.height);
   this.particles.map((particle)=>{
    if(Math.abs(particle.ix-particle.tx)<0.1&&Math.abs(particle.iy-particle.ty)<0.1&&Math.abs(particle.iz-particle.tz)<0.1){
      particle.ix = particle.tx;
      particle.iy = particle.ty;
      particle.iz = particle.tz;
      particle.ir = particle.tr;
      particle.ig = particle.tg;
      particle.ib = particle.tb;
      particle.ia = particle.ta;
      separated = true;
    }else{
      particle.ix += (particle.tx-particle.ix)*0.07;
      particle.iy += (particle.ty-particle.iy)*0.07;
      particle.iz += (particle.tz-particle.iz)*0.07;
      particle.ir += (particle.tr-particle.ir)*0.02;
      particle.ig += (particle.tg-particle.ig)*0.02;
      particle.ib += (particle.tb-particle.ib)*0.02;
      particle.ia += (particle.ta-particle.ia)*0.03;
      separated = false;
    }
    return this.drawParticle(particle);
   });
   if(!separated){
     requestAnimationFrame(()=>{
       return this.separateAnimate();
     })
   }else{
     //分离结束以后要轮播下一张粒子化图片
     setTimeout(()=>{
       return this.imgSwiper();
     },100);  
   }
  }
  drawParticle(particle){
    let scale=this.initz/(this.initz+particle.iz);
    this.ctx.save();
    this.ctx.beginPath();
    this.fillStyle=`rgba(${Math.floor(particle.ir)},${Math.floor(particle.ig)},${Math.floor(particle.ib)},${particle.ia})`;
    this.ctx.arc(particle.ix,particle.iy,this.radius*scale,0,Math.PI*2);
    this.ctx.fill();
    this.ctx.closePath();
    this.ctx.restore();
  }
}