const NS = {
	
	
	run : function(callback){
		const request = new XMLHttpRequest();
	  const file = "../AJAXNumberSystem.php";
	  
	  request.onload = function(){
	  	console.log(this.responseText);
	  	//document.getElementById("writeTo").innerHTML = this.responseText;
	  	console.log(NS.code);
	  	callback(JSON.parse(this.responseText));
	  }
	  
	  //request.open("GET", file+"?action="+ JSON.stringify(this.code), true);
	  request.open("POST", file);
	  request.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
	  request.send("action="+JSON.stringify(this.code));
	},
	
	start: function(){
		this.code = {
			instructions: [],
			vars: [],
			
		}
	},
	
	setTo: function(x, output){
		let thing = {
			action: "write",
			input: {
				inputA: x
			},
			out: output
		}
		
		this.code.instructions.push(thing);
	},
	
	setToRand: function(x, output){
		let thing = {
			action: "rand",
			input: {
				inputA: x
			},
			out: output
		}
		
		this.code.instructions.push(thing);
	},
	
	B10toB21: function(x, output){
		let thing = {
			action: "B10toB21",
			input: {
				inputA: x
			},
			out: output
		}
		
		this.code.instructions.push(thing);
		
	},
	
	addB10: function(x, y, output){
		let thing = {
			action: "add",
			input: {
				inputA: x,
				inputB: y
			},
			out: output
		}
		
		this.code.instructions.push(thing);
		
	}
};
