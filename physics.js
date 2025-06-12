const Physics = {
	new : function(){
		clearInterval(this.execution);
		this.objs = {
				particals: [],
				conections: []
			};
	},
	
	start : function(steps){
		const thisObj = this;
		this.steps = steps;
		this.execution = setInterval(function(){
			//console.log(this);
			thisObj.tick.call(thisObj);
			
			
		}, 1);
	},
	
	addPartical : function(obj, mass, name, spawnX, spawnY){
		const temp = new Partical(obj, mass, name, spawnX, spawnY);
		this.objs.particals.push(  temp    );
		return temp;
	},
	
	addConection: function(p1, p2, length, stiffnes, strength){
		this.objs.conections.push(   new Conection(p1, p2, length, stiffnes, strength)   );
	},
	
	tick: function(){
		
		//console.log(this);
		for(let i = 1; i<=this.steps; i++){
		
			for(let n of this.objs.conections){
				n.tick(this.steps);
			}
			
			for(let n of this.objs.particals){
				n.updatePos(this.steps);
			}
		}
	}
}

class Partical {
	constructor(obj, mass, name, spawnX, spawnY){
		this.obj = obj;
		this.mass = mass;
		this.name = name;
		this.pos = new Vector2(spawnX, spawnY);
		this.vol = new Vector2(0, 0);
		this.nextPos = new Vector2(0, 0);
		this.nextVol = new Vector2(0, 0);
	}
	
	updatePos(steps){
		const temp = this;
		this.pos = temp.getNextPos(steps);
		
		//this.nextPos
	}
	
	updateVol(){
		this.vol = this.nextVol;
	}
	
	getNextPos(steps){
		this.nextPos = Vector2.add(this.pos, Vector2.mult(this.vol, (1.0)/steps));
		return(this.nextPos);
	}
}

class Vector2 {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
	
	static add(vecA, vecB){
		//this.x += vec.x;
		//this.y += vec.y;
		return(new Vector2( vecA.x+vecB.x, vecA.y+vecB.y));
	}
	
	static sub(vecA, vecB){
		//this.x -= vec.x;
		//this.y -= vec.y;
		return(new Vector2( vecA.x-vecB.x, vecA.y-vecB.y));
	}
	
	static dist(vecA, vecB){
		//console.log(vecA);
		//console.log(Math.sqrt( ((vecA.x - vecB.x)**2) + ((vecA.y - vecB.y)**2) ))
		return(Math.sqrt( ((vecA.x - vecB.x)**2) + ((vecA.y - vecB.y)**2) ));
	}
	static mult(vec, int){
		return(new Vector2( vec.x*int, vec.y*int ));
	}
	
	static toUnit(vec){
		return(Vector2.mult(vec, 1/Vector2.dist(new Vector2(0,0,0), vec)));
	}
}

class Conection {
	constructor(p1, p2, length, stiffnes, strength){
		this.p1 = p1;
		this.p2 = p2;
		this.length = length;
		this.stiffnes = stiffnes;
		this.strength = strength;
		this.dist;
		this.tention;
	}
	
	tick(steps){
		//console.log(p1);
		this.dist = Vector2.dist(this.p1.pos, this.p2.pos);
		let movment = (( (this.dist) / (this.length) )-1)/(this.strength);
		
		const p1Movment = movment * (this.p2.mass/(this.p1.mass+this.p2.mass));
		const p2Movment = movment * (this.p1.mass/(this.p1.mass+this.p2.mass));
		
		this.p1.nextVol = Vector2.add(    this.p1.vol,   Vector2.mult( Vector2.sub(this.p2.pos, this.p1.pos) , p1Movment/steps)    );
		this.p2.nextVol = Vector2.add(    this.p2.vol,   Vector2.mult( Vector2.sub(this.p1.pos, this.p2.pos) , p2Movment/steps)    );
		
		this.p1.updateVol();
		this.p2.updateVol();
		
		this.tention = this.length-this.dist;
	}
}

