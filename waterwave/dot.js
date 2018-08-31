class Dot{
  //构造函数
  constructor(x,y,baseY){
     this.x=x;
     this.y=y;
     this.baseY=baseY;//基线
     this.targetY=0;//竖直方向上的坐标点
     this.verSpeed=0;//竖直方向上的速度
     this.frictionCoeffi = 0.15;//摩擦系数,影响点最终上升的高度，减缓抖动
     this.dampCoeffi=0.95;//阻尼系数，阻止物体继续运动
  }
  //更新y坐标
  updateY(diffVal){
    this.targetY=this.baseY+diffVal;//理论上的目标值，相对于基线
    this.verSpeed+=(this.targetY-this.y);
    //this.verSpeed*=this.dampCoeffi*this.frictionCoeffi;//速度减小得很快，波动很短，波幅很小
    this.verSpeed*=this.dampCoeffi;
    this.y+=this.verSpeed*this.frictionCoeffi;
  }
}