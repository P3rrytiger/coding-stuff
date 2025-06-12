const B21Draw = {

	B21Num: function(obj, x, y){
    		
  		const drawOffset = {
    		//x: 1000 * Math.random(),
    		//y: 1000 * Math.random()
    		x: x,
    		y: y
    	};
    	
    	for(let i=obj.highestDiget; i>=0; i--){
    			let n = obj.num[i];
    			
    			this.B21Didget(drawOffset, n);
    			
    			//drawOffset.x += 100*i;
    			
    			
    			
    			
    			drawOffset.x+=60;
    		}
    	
  	},
  	
  B21Didget: function(drawOffset, didget){
  	
  	Draw.line(drawOffset.x, drawOffset.y+0, drawOffset.x+10, drawOffset.y+0, boolToColor(didget.h), 10);
		Draw.line(drawOffset.x+10, drawOffset.y+0, drawOffset.x+20, drawOffset.y, boolToColor(didget.a), 10);
		Draw.line(drawOffset.x+20, drawOffset.y+0, drawOffset.x+30, drawOffset.y+0, boolToColor(didget.b), 10);
		
		Draw.line(drawOffset.x, drawOffset.y+10, drawOffset.x+10, drawOffset.y+10, boolToColor(didget.g), 10);
		Draw.line(drawOffset.x+10, drawOffset.y+10, drawOffset.x+20, drawOffset.y+10, boolToColor(true), 10);
		Draw.line(drawOffset.x+20, drawOffset.y+10, drawOffset.x+30, drawOffset.y+10, boolToColor(didget.c), 10);
		
		Draw.line(drawOffset.x, drawOffset.y+20, drawOffset.x+10, drawOffset.y+20, boolToColor(didget.f), 10);
		Draw.line(drawOffset.x+10, drawOffset.y+20, drawOffset.x+20, drawOffset.y+20, boolToColor(didget.e), 10);
		Draw.line(drawOffset.x+20, drawOffset.y+20, drawOffset.x+30, drawOffset.y+20, boolToColor(didget.d), 10);
  	
  }
    	
}
