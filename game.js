var Input =
{
  test2: function(x){
    alert(x);
  },
  
  keyPressList: [],
  keyPress : function(index){
  	return(this.keyPressList[index]);
  },
  mousePos: {
    x:100,
    y:100
  },
  
  mouseButton:1,
  
  setupInputDetection: function(){
    //for(i=0; i<=100; i++){
    //  keyPress[i] = false;
    //}
    
    window.addEventListener("keydown", function(event){
      let n = event.key;
      Input.keyPressList[n] = true;
    });
    window.addEventListener("keyup", function(event){
      let n = event.key;
      Input.keyPressList[n] = false;
    });
    document.onmousemove = function setMousePos(event){
      Input.mousePos.x += Number(event.movementX);
      Input.mousePos.y += Number(event.movementY);
      //console.log(Input.mousePos.x);
      //console.log(Input.mousePos.y);
    };
    document.onmousedown = function setButton(event){
      Input.mouseButton = event.button;
    };
    document.onmouseup = function(){
      Input.mouseButton=1;
      
    };
  },
  
  enablePointerLock: function(){
  	let thing = document.body;
  	thing.addEventListener("click", async() => {
  		await thing.requestPointerLock();
  	});
  }
};

var Draw =
{

  //can: document.body.getContext('2d'),
  setup: function(){
    document.body.innerHTML += "<canvas id='canvas'></canvas>";
    this.canvas = document.getElementById("canvas");
    this.canvas.height = window.innerHeight;
    this.canvas.width = window.innerWidth;
    this.canvas.style.position = "absolute";
    this.canvas.style.left = 0;
    this.canvas.style.top = 0;
    this.canvas.style.zIndex = -10;
    this.can = this.canvas.getContext('2d');
  },
  
  
  
  triangle: function(p1x,p1y,p2x,p2y,p3x,p3y,color){
  	const x1 = Math.min(p1x,p2x,p3x);
  	const x2 = Math.max(p1x,p2x,p3x);
  	const y1 = Math.min(p1y,p2y,p3y);
  	const y2 = Math.max(p1y,p2y,p3y);
  	
  	
    this.can.save();
    
    this.can.beginPath();
    
    this.can.moveTo(p1x,p1y);
    this.can.lineTo(p2x,p2y);
    this.can.lineTo(p3x,p3y);
    this.can.lineTo(p1x,p1y);
    
    this.can.clip();
    
    this.can.fillStyle = color;
    //this.can.lineWidth = window.innerWidth*2; 
    this.can.fillRect(0,0, window.innerWidth, window.innerHeight);
    //this.can.fillRect(x1,y1, x2,y2);
    //this.can.beginPath();
    
    //Draw.can.moveTo(0,0);
    //Draw.can.lineTo( window.innerWidth, window.innerHeight);
    
    
    //Draw.can.stroke();  
    
    this.can.restore();
    
  },
  
  line: function(p1x,p1y,p2x,p2y,color,width){

    
    Draw.can.strokeStyle = color;  
    Draw.can.lineWidth = width; 
    
    Draw.can.beginPath();
    
    Draw.can.moveTo(p1x,p1y);
    Draw.can.lineTo(p2x,p2y);
    Draw.can.stroke();  

  },
  
  clear: function(){
    this.can.fillStyle = "black";
    Draw.can.beginPath();
    this.can.fillRect(0,0,window.innerWidth, window.innerHeight);
    this.can.stroke();
  }
};

let depthTexture;

const GpuDraw = {
	setup: async function(){
		
		document.body.innerHTML += "<canvas id='GPUcanvas'></canvas>";
		
		this.adapter = await navigator.gpu?.requestAdapter();
    this.device = await this.adapter?.requestDevice();
    
    const device = this.device;
    
    
    
    if(!this.device){
      console.log('lol, you realy thaght you could run this');
      return;
    }
    
    //get the canvas
    this.canObj = document.getElementById("GPUcanvas");
    
    this.canObj.height = window.innerHeight;
    this.canObj.width = window.innerWidth;
    this.canObj.style.position = "absolute";
    this.canObj.style.left = 0;
    this.canObj.style.top = 0;
    this.canObj.style.zIndex = -100;
    
    this.canContext = this.canObj.getContext("webgpu");
    console.log(this.canContext);
    
    this.canFormat = navigator.gpu.getPreferredCanvasFormat();
    
    this.canContext.configure({
      device,
      format: this.canFormat
    });
    
    const module = this.device.createShaderModule({
    	lable: 'if this works, I will litaraly coninue coding',
      code: `
      	struct v3{
      		x: f32,
      		y: f32,
      		z: f32
      	};
      	
      	struct Triangle{
      		a: v3,
      		b: v3,
      		c: v3,
      		
      		
      		
      		color: vec4f
      		//distance: f32
      	};
      	
      	struct v3Out{
      		@builtin(position) pos: vec4f,
      		@location(0) color: vec4f
      	};
      	
      	@group(0) @binding(0) var<storage, read> triangles: array<Triangle>;
      	@group(0) @binding(1) var<storage, read> rotMatrix: mat3x3<f32>;
      	@group(0) @binding(2) var<storage, read> offset: vec3f;
      	
      	@vertex fn vs(
      		@builtin(vertex_index) vIndex : u32,
      		@builtin(instance_index) iIndex : u32
      	) -> v3Out {
      		let tri = triangles[iIndex];
      		
      		var point : v3;
      		
      		if(vIndex == 0){
      			point = tri.a;
      		} else if(vIndex == 1){
      			point = tri.b;
      		} else{
      			point = tri.c;
      		}
      		
      		var out: v3Out;
      		
      		var vecPoint: vec3f;
      		
      		vecPoint.x = point.x + offset.x;
      		vecPoint.y = point.y + offset.y;
      		vecPoint.z = point.z + offset.z;
      		
      		let norm = normal(tri);
      		
      		var matPoint = vecPoint * rotMatrix;
      		
      		let offset = 100/matPoint.z;
      		
      		out.pos = vec4f(
      			/*(matPoint.z/200.0) *offset,
      			(matPoint.z/-200.0) * offset,
      			(matPoint.x/20000),
      			//0,*/
      			
      			-matPoint.x/(1.5),
      			-matPoint.y,
      			f32(matPoint.z),
      			//0,
      			//1
      			0.1+(matPoint.z)
      			
      		);
      		out.color = tri.color;
      		
      		//let flashlight = (((sqrt(pow(matPoint.x,2) + pow(matPoint.y,2))*10 + (abs(matPoint.z)*0)) / ( matPoint.z ))/7.0) * ((matPoint.z + abs(matPoint.z))/(2*matPoint.z));
      		
      		let flashlight = matPoint.z/5;
      		
      		if(point.y< -50){
      		  let snow = clamp((point.y+50)/-20,0,1);
      		  out.color += vec4f(snow,snow,snow,1);
      		}
      		
      		out.color.x += abs(out.color).x*1.0;
      		out.color.x /= 2.0;
      		
      		out.color.y += abs(out.color).y*1.0;
      		out.color.y /= 2.0;
      		
      		out.color.z += abs(out.color).z*1.0;
      		out.color.z /= 2.0;
      		
      		out.color.x *= ((norm.z+norm.y+norm.x)/6) + 0.5;
      		out.color.y *= ((norm.z+norm.y+norm.x)/6) + 0.5;
      		out.color.z *= ((norm.z+norm.y+norm.x)/6) + 0.5;
      		
      		out.color *= norm.y;
      		out.color += vec4f(0.5, 0.5, 0.5, 1)*((-norm.y)+1);
      		
      		
      		
      		/*out.color.x -= flashlight;
      		out.color.y -= flashlight;
      		out.color.z -= flashlight;
      		
      		out.color.x += abs(out.color).x*1.1;
      		out.color.x /= 2.0;
      		
      		out.color.y += abs(out.color).y*1.1;
      		out.color.y /= 2.0;
      		
      		out.color.z += abs(out.color).z*1.1;
      		out.color.z /= 2.0;*/
      		
      		//out.color.w = 0;
      		
      		//out.color.w = 0.5;
      		
      		//out.color = vec4f(1,0,0,0.5);
      		
      		var test = rotMatrix*rotMatrix;
      		
      		return(out);
      	};
      	
      	@fragment fn fs(out: v3Out) -> @location(0) vec4f {
      		return(out.color+ vec4f(0.0, 0.0, 0.0, 0));
      	}
      	
      	fn normal(tri: Triangle) -> vec3f{
      		
      		let va = vec3f(
      			tri.a.x - tri.b.x,
      			tri.a.y - tri.b.y,
      			tri.a.z - tri.b.z,
      		);
      		
      		let vb = vec3f(
      			tri.c.x - tri.b.x,
      			tri.c.y - tri.b.y,
      			tri.c.z - tri.b.z,
      		);
      		
      		var norm = normalize(cross(va,vb));
      		
      		//norm /= sqrt( pow(norm.x,2) + pow(norm.y,2) + pow(norm.z,2) );
      		
      		//return( norm * rotMatrix );
      		return( norm );
      	}
      `
    });
    
    this.module = module;
    
    const pipeline = device.createRenderPipeline({
          
      lable: "if you are seeing this, fix the pipeline",
      layout: "auto",
      
      vertex: {
        entryPoint: "vs",
        module
      },
      
      fragment: {
        entryPoint: "fs",
        module,
        
        targets: [{format: this.canFormat}]
      },
      
      primitive: {
      	cullMode: 'front',
      	topology: "triangle-list"
      },
      
      depthStencil: {
      	depthWriteEnabled: true,
      	depthCompare: "less",
      	format: 'depth24plus'
      }
      
    });
    this.pipeline = pipeline;
    
    
    
    
    
    this.renderPassDescriptor = {
      lable: "i'll cut to the chase, it's a problem with the render pass",
      colorAttachments: [
        {
          //view: (i'll set this later)-
          clearValue: [0, 0, 0, 1],
          loadOp: 'clear',
          storeOp: 'store'
        }  
      ],
      
      depthStencilAttachment: {
      	depthClearValue: 1.0,
      	depthLoadOp: 'clear',
        depthStoreOp: 'store'
      }
      
    };
	},
    
  setup2: function(){
    list = triangles;
    const triSize =
    	3*4 + //point a
    	3*4 + //point b
    	3*4 + //point c
    	
    	3*4 + //padding
    	
    	4*4 //color
    	//4 + //distance
    	
    	//3*4 //padding
    ;
    
    const triAmount = list.length;
    
		this.buffer = this.device.createBuffer({
    	lable: "triangle buffer",
    	size: triAmount*triSize,
    	usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    
    this.rotBuffer = this.device.createBuffer({
    	lable: "rot buffer",
    	size: 48,
    	usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    this.offsetBuffer = this.device.createBuffer({
    	lable: "offset buffer",
    	size: 16,
    	usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    
    this.bindGroup = this.device.createBindGroup({
      label: `bind group`, 
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: {buffer: this.buffer}}  ,
        { binding: 1, resource: {buffer: this.rotBuffer}} ,
        { binding: 2, resource: {buffer: this.offsetBuffer}} 
      ]
    });
    
    
    const array = new Float32Array(triSize*triAmount / 4);
    
    for(let i=0; i<triAmount; i++){
    	const offset = triSize*i/4;
    	const tri = list[i];
    	
    	array.set([tri.a.x, tri.a.y, tri.a.z], offset);
    	array.set([tri.b.x, tri.b.y, tri.b.z], offset+3);
    	array.set([tri.c.x, tri.c.y, tri.c.z], offset+6);
    	array.set(tri.color, offset+12);
    	//array.set([tri.distance], offset+16);
    }
    
    this.device.queue.writeBuffer(this.buffer, 0, array);
	},
	
	render: async function(list){
		
		const triAmount = list.length;
		const x = Input.mousePos.y/100;
		const y = Input.mousePos.x/100;
		const z = 0;
		
		const xRotMatrix = [
		  [1, 0, 0],
		  [0, Math.cos(x), Math.sin(x)],
		  [0, -Math.sin(x), Math.cos(x)]
		];
		const yRotMatrix = [
		  [Math.cos(y), 0, -Math.sin(y)],
		  [0, 1, 0],
		  [Math.sin(y), 0, Math.cos(y)]
		];
		const zRotMatrix = [
		  [Math.cos(z), Math.sin(z), 0],
		  [-Math.sin(z), Math.cos(z), 0],
		  [0, 0, 1]
		];
		
		const fullRotMatrix = matrixMult(matrixMult(zRotMatrix, yRotMatrix), xRotMatrix);
		
		const triSize =
    	3*4 + //point a
    	3*4 + //point b
    	3*4 + //point c
    	
    	3*4 + //padding
    	
    	4*4 //color
    	//4 + //distance
    	
    	//3*4 //padding
    ;
    
    /*const triAmount = list.length;
    
		this.buffer = this.device.createBuffer({
    	lable: "triangle buffer",
    	size: triAmount*triSize,
    	usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    
    this.rotBuffer = this.device.createBuffer({
    	lable: "rot buffer",
    	size: 48,
    	usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST
    });
    
    this.bindGroup = this.device.createBindGroup({
      label: `bind group`, 
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: {buffer: this.buffer}}  ,
        { binding: 1, resource: {buffer: this.rotBuffer}} 
      ]
    });*/
    
		const canTexture = this.canContext.getCurrentTexture()
		
		this.renderPassDescriptor.colorAttachments[0].view = canTexture.createView();
		
		//depth texture stuff
		
		if(!depthTexture){
			depthTexture = this.device.createTexture({
				size: [canTexture.width, canTexture.height],
				format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT
			});
		}
		
		this.renderPassDescriptor.depthStencilAttachment.view = depthTexture.createView();
    
    const encoder = this.device.createCommandEncoder({lable: "it's me, the encoder"});
    
    const pass = encoder.beginRenderPass(this.renderPassDescriptor);
    pass.setPipeline(this.pipeline);
    
    
    
    //rotation matrix
    const rotArray = new Float32Array(12);
    
    rotArray.set([
    	fullRotMatrix[0][0],
    	fullRotMatrix[1][0],
    	fullRotMatrix[2][0]
  	], 0);
  	rotArray.set([
    	fullRotMatrix[0][1],
    	fullRotMatrix[1][1],
    	fullRotMatrix[2][1]
  	], 4);
  	rotArray.set([
    	fullRotMatrix[0][2],
    	fullRotMatrix[1][2],
    	fullRotMatrix[2][2]
  	], 8);
  	
  	this.device.queue.writeBuffer(this.rotBuffer, 0, rotArray);
  	
  	const offsetArray = new Float32Array(4);
  	
  	offsetArray.set([
  		player.x,
  		player.y,
  		player.z
  	], 0);
  	
  	this.device.queue.writeBuffer(this.offsetBuffer, 0, offsetArray);
    
    pass.setBindGroup(0, this.bindGroup);
    
    pass.draw(3,triAmount);
    //pass.draw(3,1);
    
    pass.end();
    
    const commandBuffer = encoder.finish();
          
    this.device.queue.submit([commandBuffer]);
	}
};
//export {Input,Draw};

function matrixMult(a,b){
  const out = new Matrix(a.length, b[0].length);
  
  for(let i=0; i<a.length; i++){
    for(let ii=0; ii<b[0].length; ii++){
      
      for(let iii=0; iii<a[0].length; iii++){
        out[i][ii] += a[i][iii] * b[iii][ii];
      }
    }
  }
  
  return(out);
}

function Matrix(x, y){
  const out = this;
  
  for(let i=0; i<x; i++){
    
    out[i] = [];
    
    for(let ii=0; ii<y; ii++){
      out[i][ii] = 0;
    }
  }
  
  this.length = x;
  
  
}
