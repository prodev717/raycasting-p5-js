function intersect(x1,y1,x2,y2,x3,y3,x4,y4){
	let deno = (x1-x2)*(y3-y4)-(y1-y2)*(x3-x4);
	let t = ((x1-x3)*(y3-y4)-(y1-y3)*(x3-x4))/deno;
	let u = ((x1-x3)*(y1-y2)-(y1-y3)*(x1-x2))/deno;
	if((0<=t && t<=1)&&(0<=u && u<=1)){
		return [x1+(t*(x2-x1)),y1+(t*(y2-y1))];
	}else{
		return null;
	}
}

class ray{
	constructor(x,y,l,a){
		this.x1=x;this.y1=y;
		this.len=l;this.ang=a;
		this.construct();
		this.state;this.dis;
	}
	construct(){
		this.x2=this.x1+this.len*cos(radians(this.ang));
		this.y2=this.y1+this.len*sin(radians(this.ang));
	}
	draw(){line(this.x1,this.y1,this.x2,this.y2);}
	check(seg){
		let len = [];
		seg.forEach((i)=>{
			let res = intersect(this.x1,this.y1,this.x2,this.y2,i.x1,i.y1,i.x2,i.y2);
			if(res!==null){
				len.push({d:dist(this.x1,this.y1,res[0],res[1]),x:res[0],y:res[1]});
			}else{
				len.push({d:this.len,x:this.x2,y:this.y2});
			}
		});
		len.sort((a,b)=>{return a.d-b.d});
		if(len[0].d<this.len){this.state=true;stroke(0,255,0);}
		else{this.state=false;stroke(255);}
		this.dis=len[0].d;
		this.x2=len[0].x;
		this.y2=len[0].y;
	}
}

class segment{
	constructor(x1,y1,x2,y2){
		this.x1=x1;this.y1=y1;
		this.x2=x2;this.y2=y2;
	}
	draw(){
		stroke(255,100,100);
		line(this.x1,this.y1,this.x2,this.y2);
	}
}

function Box(x,y,w,h){
	return [new segment(x,y,x+w,y),new segment(x,y,x,y+h),new segment(x+w,y,x+w,y+h),new segment(x,y+h,x+w,y+h)];
}

let r=[];let s=[];
let rn=40;

function setup(){
	createCanvas(1200,400);
	for(let i=0;i<rn;i++)r.push(new ray(50,200,400,0));
	s.push(...Box(300,100,50,50));
	s.push(...Box(300,200,50,50));
	s.push(...Box(420,150,50,50));
	s.push(...Box(350,300,50,50));
}

function draw(){
	background(0);
	let m = (degrees(atan2(mouseY-r[0].y1,mouseX-r[0].x1))+360)%360
	s.forEach(i=>{i.draw();});
	let vision = [];
	r.forEach((i,x)=>{
		i.ang=x+m;
		i.construct();
		i.check(s);
		text(i.state,5,(10*x)+10)
		vision.push(i.dis);
		i.draw();
	});
	
	stroke(255);
	line(600,0,600,400);
	vision.forEach((i,x)=>{
		let c = 600/vision.length
		let s = map(i,0,400,255,0);
		let h = map(i,0,400,200,0);
		stroke(s);
		fill(s);
		rect(600+(c*x),200-h,c,h*2);
	});

	if(keyIsDown(RIGHT_ARROW))r.forEach(i=>{i.x1++;});
	if(keyIsDown(LEFT_ARROW))r.forEach(i=>{i.x1--;});
	if(keyIsDown(UP_ARROW))r.forEach(i=>{i.y1--;});
	if(keyIsDown(DOWN_ARROW))r.forEach(i=>{i.y1++;});

}