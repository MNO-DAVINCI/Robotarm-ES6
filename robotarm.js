class RobotArm {
	
	constructor() {
		this.arm = {
			position: 0,
			level: 0,
			actions: 0,
			holding: null
		}

		this.robot_arm = {
			speed: 0.5,
			assembly_line: {}
		}

		this.levels = {
			'exercise_1' 	: [ [], [ 'red']  ],
  			'exercise_2' 	: [ [ 'blue' ], [], [], [], [ 'blue' ], [], [], [ 'blue' ] ],
  			'exercise_3' 	: [ [ 'white', 'white', 'white', 'white' ] ],
  			'exercise_4' 	: [ [ 'blue', 'white', 'green' ] ],
  			'exercise_5' 	: [ [], [ 'red', 'red', 'red', 'red', 'red', 'red', 'red' ]],
  			'exercise_6' 	: [ [ 'red' ], [ 'blue' ], [ 'white' ], [ 'green' ], [ 'green' ], ['blue' ], [ 'red' ], [ 'white' ] ] ,
  			'exercise_7' 	: [ [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ], [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ], [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ], [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ], [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ] ],
 			'exercise_8' 	: [ [], [ 'red', 'red', 'red', 'red', 'red', 'red', 'red' ]],
 			'exercise_9' 	: [ ['blue' ], [ 'green', 'green' ], ['white', 'white', 'white' ], [ 'red', 'red', 'red', 'red' ] ],
  			'exercise_10' 	: [ [ 'green' ], [ 'blue' ], [ 'white' ], [ 'red' ], [ 'blue' ] ]
		}

		this.exercise = 0;
		this.max_duration = 2000;
		this.station_width = 50;
		this.station_count = 10;
		this.block_width = 40;
		this.block_height = 40;
		this.arm_height = 10;
		this.hand_height = 10;
		this.level_count = 8;
		this.line_position = this.arm_height + this.level_count * this.block_height;

		this.frame = document.getElementById("frame");
		this.ctx = this.frame.getContext("2d");
		this.bursh = null;
	}

	draw_line(f_horizontal_start, f_vertical_start, f_horizontal_end, f_vertical_end) {
		this.ctx.beginPath();
		this.ctx.lineWidth=1;
		this.ctx.strokeStyle="#000000";
		this.ctx.moveTo(f_horizontal_start,f_vertical_start);
		this.ctx.lineTo(f_horizontal_end,f_vertical_end);
		this.ctx.stroke();
	}

	draw_rectangle(f_horizontal_start, f_vertical_start, f_width, f_height) {
		this.ctx.fillStyle = this.brush;
	    this.ctx.fillRect(f_horizontal_start,f_vertical_start,f_width,f_height);
	    this.ctx.strokeStyle = "#000000";
	    this.ctx.lineWidth = 2;
	    this.ctx.strokeRect(f_horizontal_start,f_vertical_start,f_width,f_height);
	}

	draw_arm() {
		let mid = (0.5 + this.arm.position) * this.station_width;
		let left = mid - this.block_width / 2 - 1;
		let right = mid + this.block_width / 2;
		let top = this.arm_height + this.arm.level * this.block_height;

		this.draw_line(mid, 0, mid, top);
		this.draw_line(left, top, right, top);
  		this.draw_line(left, top, left, top + this.hand_height);
  		this.draw_line(right, top, right, top + this.hand_height);

  		if (typeof this.arm.holding === 'string') {
  			let color = 'white';

  			if (this.arm.holding == "r" || this.arm.holding =="red") {
  				color = "red";
  			} 

  			if (this.arm.holding == "g" || this.arm.holding =="green") {
  				color = "green";
  			} 

  			if (this.arm.holding == "b" || this.arm.holding =="blue") {
  				color = "blue";
  			}

  			this.brush = color;
  			if (this.arm.holding != null) {
  				this.draw_rectangle(left + 1, top + 1, this.block_width, this.block_height);
  			}
  		}
	}

	draw_assembly_line() {
		for (let i = 0; i <= this.station_count - 1; i++) {
			let left = i * this.station_width;
			let right = left + this.station_width;

			this.draw_line(left, this.line_position, right, this.line_position);
	   		this.draw_line(left, this.line_position - 5, left, this.line_position);
	    	this.draw_line(right, this.line_position - 5, right, this.line_position);
	    	
	    	let stack = this.robot_arm.assembly_line[i];

	    	if (stack != null) {
		        
		        for (let level = 0; level <= stack.length -1; level++) {
		          
	        		if (stack[level] != null) {

	            		let color = 'white';

	            		if (stack[level] == "r" || stack[level] == "red"){
	              			color = "red";
	            		} 

	            		if(stack[level] == "g" || stack[level] == "green"){
	              			color = "green";
	            		} 

	            		if(stack[level] == "b" || stack[level] == "blue"){
	              			color = "blue";
	            		}
	            		this.brush = color;
	            		this.draw_rectangle(left + 5, this.line_position - (this.block_height * (level + 1)) - (4 * (level + 1)) , this.block_width, this.block_height);	
		        	} 	
		        }
	    	}
		}
	}

	paint() {
		this.ctx.clearRect(0, 0, this.frame.width, this.frame.height);
		this.draw_arm();
	 	this.draw_assembly_line();
	}

	refresh_arm() {
		let left = this.arm.position * this.station_width;
		let width = this.station_width;
		let top = 0;
		let height = this.arm_height + this.arm.level * this.block_height + this.hand_height;

		if (this.arm.holding != null) {
			height = height + this.block_height;
		}
		this.paint();
	}

	increase_actions() {
		this.arm.actions += 1;
		document.title = "RobotArm - Actions: " + this.arm.actions;
	}

	animate_arm(property_name, start_value, end_value, duration) {
		
		if (this.robot_arm.speed >= 1) {
	    	this.arm[property_name] = end_value
	    	return;
		}

		//refresh_arm & animate verwijderd, doen niks. Mogelijk kan paint ook weg, de functie doet dan delay en painten.
		this.paint();
	}

	set_level(f_id) {
		if (f_id < 1 || f_id > 15 || isNaN(f_id)) {
			console.log("Error: The level has to be between 1 and 15");
		} else {
			let exercise = f_id;
			for (let i = 0; i <= this.station_count - 1; i++) {
				this.robot_arm.assembly_line[i] = this.levels["exercise_" + exercise][i];	
			}
			this.draw_arm();
	 		this.draw_assembly_line();
		}
	}

	move_right(){
		if (this.arm.position >= this.station_count - 1) {
			return;
		}
		this.animate_arm('position', this.arm.position, this.arm.position += 1, this.max_duration);
		this.increase_actions();
	}

	move_left() {
		if (this.arm.position <= 0) {
			return;
		}
		this.animate_arm('position', this.arm.position, this.arm.position -= 1, this.max_duration);
		this.increase_actions();
	}

	grab() {
		let stack = this.robot_arm.assembly_line[this.arm.position];
		let grab_level = this.level_count - stack.length;

		if (stack.length == 0) {
			grab_level -= 1;
		}

		if (this.arm.holding != null) {
			grab_level -= 1;
		}

		this.animate_arm('level', 0, grab_level, this.max_duration);

		if (this.arm.holding == null ) {
			this.arm.holding = stack[stack.length - 1];
			stack.splice(stack.length - 1, 1);
		}
		this.robot_arm.assembly_line[this.arm.position] = stack;
		this.animate_arm('level', grab_level, 0, this.max_duration);
	  	this.increase_actions();
	}

	scan() {
		this.increase_actions();
		return this.arm.holding;
	}

	drop() {
		let stack = this.robot_arm.assembly_line[this.arm.position];
		let drop_level = this.level_count - stack.length - 1;

		stack.push(this.arm.holding);

		this.robot_arm.assembly_line[this.arm.position] = stack;
		this.arm.holding = null;

		this.animate_arm('level', drop_level, 0, this.max_duration);
		this.increase_actions();
	}	
}