//create canvas and pen
var canvas = document.getElementById("canvas");
var pen = canvas.getContext("2d");
var showAxis=document.getElementById("axisToggle");
var input=document.getElementById("input");
var scaleXButton=document.getElementById("scale");
textSize=5;

//resize window to screen size
pen.canvas.width  = window.innerWidth;
pen.canvas.height = window.innerHeight;

//varaibles
//canvas size
width=canvas.width;
height=canvas.height;
//starts, ends, and edge buffers
buffer=10;
xStart=width/buffer;
yStart=height/buffer;
xEnd=width-xStart;
yEnd=height-yStart;
//scales
numTicksY=10;
numTicksX=10;
yLen=height*((buffer-2)/buffer);
unitLenY=0;
axisLenY=height/40;
unitY=0;
scaleY=0;
xLen=width*((buffer-2)/buffer);
axisLenX=height/20;
scaleX=0;
unitX=0;
//data set
len=0;
vals=[];
//histogram
hist=[];

//creates the starting data set, and draws the histogram
randVals()
numTicksX=scaleX;
genHist();
draw();

//main draw
function draw(){
  pen.beginPath()
  pen.clearRect(0, 0, width, height);
  drawAxis();
  drawY();
  drawX();
}

//draw axis
function drawAxis(){
  pen.moveTo(xStart,yStart);
  pen.lineTo(xStart,yEnd);
  pen.moveTo(xStart,yEnd);
  pen.lineTo(xEnd,yEnd);
  pen.stroke();
}

//draw y axis units
function drawY(){
  scaleY=Math.ceil(Math.max(...hist));
  numTicksY=10;
  if(scaleY>numTicksY){
	  scaleY=Math.ceil(scaleY/10)*10  
  }else{
	  numTicksY=scaleY
  }
  unitLenY=yLen/numTicksY;
  axisLenY=height/40;
  unitY=scaleY/numTicksY;
  pen.font = textSize+"px Arial";
  pen.textAlign="center";
  axisLine=xStart;
  if(showAxis.value==="Axis"){
	  axisLine=xEnd;
  }
  for(let i=0; i<=numTicksY; i++){
    pen.moveTo(xStart-axisLenY,yEnd-i*unitLenY);
    pen.lineTo(axisLine,yEnd-i*unitLenY);
    pen.fillText(Math.floor(i*unitY), xStart-axisLenY/2-width/40, yEnd-i*unitLenY);
  }
  pen.stroke();
}

//generate random values
function randVals(){
  //choose a random length
  len=Math.floor(Math.random() * 1000);
  vals=[]
  //fill the data set with random numbers
  for(let i=0; i<len; i++){
    vals.push(Math.random() * 100);
  }
  //get the largest for the scale
  scaleX=Math.ceil(Math.max(...vals));
}

//generate histogram
function genHist(){
  scaleX=Math.ceil(Math.max(...vals));
  //resize the scale
  if(scaleX>numTicksX){
	  scaleX=Math.ceil(scaleX/10)*10  
  }else{
	  numTicksX=scaleX
  }
  //choose the units
  unitX=Math.ceil(scaleX/numTicksX)
  //make a histogram, and count the usages of each number
  hist=new Array(numTicksX).fill(0);
  for(let i=0; i<len; i++){
	  for(let j=0; j<numTicksX; j++){
	    if(vals[i]>j*unitX && vals[i]<=(j+1)*unitX){
	      hist[j]++;
		    break;
	    }
	  }
  }
}

//draw x axis units and bars
function drawX(){
  unitLenX=xLen/numTicksX;
  unitScale=Math.ceil(scaleX/10)
  
  pen.font = textSize+"px Arial";
  for(let i=0; i<numTicksX; i++){
	if(i<numTicksX){
	  pen.fillStyle = "rgb(0,0,0)";
	  if(numTicksX<=10){
	    pen.fillText((i*unitX)+"-"+((i+1)*unitX), xStart+i*unitLenX+unitLenX/2, yEnd+axisLenX);
		  pen.moveTo(xStart+i*unitLenX,yEnd-axisLenX/2);
	    pen.lineTo(xStart+i*unitLenX,yEnd+axisLenX/2);
	  }else if(i%unitScale==0){
		  pen.fillText((i*unitX)+"-"+((i+unitScale)*unitX), xStart+i*unitLenX+unitLenX*(unitScale/2), yEnd+axisLenX);
		  pen.moveTo(xStart+i*unitLenX,yEnd-axisLenX/2);
	    pen.lineTo(xStart+i*unitLenX,yEnd+axisLenX/2);  
	  }
	  r=Math.floor(200*Math.random())
	  g=Math.floor(200*Math.random())
	  b=Math.floor(255*(i/numTicksX))
	  pen.fillStyle = "rgb("+r+","+g+","+b+",200)";
    pen.fillRect(xStart+i*unitLenX, yEnd-(yLen/scaleY)*hist[i], unitLenX, (yLen/scaleY)*hist[i]);
	  pen.fillStyle = "rgb(0,0,0)";
	}
  }
  pen.moveTo(xEnd,yEnd-axisLenX/2);
  pen.lineTo(xEnd,yEnd+axisLenX/2);
  
  pen.stroke();
}

//take new input
function newInput(){
  if(input.value==""){return}
  try{
    vals=input.value.split(",");
	  scaleX=Math.ceil(Math.max(...vals));
	  numTicksX=scaleX;
	  scaleXButton.value="X Scale: Flex"
	  genHist();
    draw();
  }catch(e){ 
	  console.log("wrong format");
  }
}

//toggle the axis button
function toggle(){
  if(showAxis.value=="Axis"){
      showAxis.value="No Axis";
  }
  else if(showAxis.value=="No Axis"){
      showAxis.value="Axis";
  }
  draw();
}

//get new random values
function shuffle(){
  randVals();
  genHist();
  draw();
}

//change scale between Flex and Bucket
function scaleChange(){
  if(scaleXButton.value==="X Scale: Flex"){
	  numTicksX=10;
	  scaleXButton.value="X Scale: Bucket"
  }else{
    numTicksX=scaleX;
	  scaleXButton.value="X Scale: Flex"
  }
  genHist();
  draw();
}
