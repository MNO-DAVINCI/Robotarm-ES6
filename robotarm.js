class RobotArm {
	
	constructor(speed) {
		
		this.canvas = oCanvas.create({
			canvas: "#frame",
			background: "#ccc",
			fps: 30
		});

		this.assembly_line = {
			pieces: []
		};
		
		this.arm = {
			position: 0,
			level: 0,
			actions: 0,
			holding: null,
			pieces: []
		}

		this.levels = {
			'exercise_1' 	: [ [], ['red']  ],
  			'exercise_2' 	: [ [ 'blue' ], [], [], [], [ 'blue' ], [], [], [ 'blue' ] ],
  			'exercise_3' 	: [ [ 'white', 'white', 'white', 'white' ] ],
  			'exercise_4' 	: [ [ 'blue', 'white', 'green' ] ],
  			'exercise_5' 	: [ [], [ 'red', 'red', 'red', 'red', 'red', 'red', 'red' ]],
  			'exercise_6' 	: [ [ 'red' ], [ 'blue' ], [ 'white' ], [ 'green' ], [ 'green' ], ['blue' ], [ 'red' ], [ 'white' ] ] ,
  			'exercise_7' 	: [ [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ], [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ], [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ], [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ], [], [ 'blue', 'blue', 'blue', 'blue', 'blue', 'blue' ] ],
 			'exercise_8' 	: [ [], [ 'red', 'red', 'red', 'red', 'red', 'red', 'red' ]],
 			'exercise_9' 	: [ ['blue' ], [ 'green', 'green' ], ['white', 'white', 'white' ], [ 'red', 'red', 'red', 'red' ] ],
  			'exercise_10' 	: [ [ 'green' ], [ 'blue' ], [ 'white' ], [ 'red' ], [ 'blue' ] ],
  			'exercise_12' 	: [ [ 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green', 'green'] ],
		}

		this.speed = speed || 0.5;
		this.exercise = 1;
		this.max_duration = 2000;
		this.station_width = 50;
		this.station_count = 10;
		this.block_width = 40;
		this.block_height = 40;
		this.arm_height = 10;
		this.hand_height = 10;
		this.level_count = 8;
		this.line_position = this.arm_height + this.level_count * this.block_height;

	}

	draw_arm() {

		let mid = (0.5 + this.arm.position) * this.station_width;
		let left = mid - this.block_width / 2 - 1;
		let right = mid + this.block_width / 2;
		let top = this.arm_height + this.arm.level * this.block_height;

		this.arm.pieces.push(this.canvas.display.line({
			start: { x: mid, y: 0 },
			end: { x: mid, y: top },
			stroke: "1px #000"
		}));

		this.arm.pieces.push(this.canvas.display.line({
			start: { x: left, y: top },
			end: { x: right, y: top },
			stroke: "1px #000"
		}));

		this.arm.pieces.push(this.canvas.display.line({
			start: { x: left, y: top },
			end: { x: left, y: top + this.hand_height },
			stroke: "1px #000"
		}));

		this.arm.pieces.push(this.canvas.display.line({
			start: { x: right, y: top },
			end: { x: right, y: top + this.hand_height },
			stroke: "1px #000"
		}));

		for (let i = 0; i < this.arm.pieces.length; i++) {
			this.canvas.addChild(this.arm.pieces[i]);
		}
	}

	draw_assembly_line() {
		for (let i = 0; i <= this.station_count - 1; i++) {
			this.assembly_line.pieces[i] = [];

			let left = i * this.station_width;
			let right = left + this.station_width;

			this.assembly_line.pieces[i].push(this.canvas.display.line({
				start: { x: left, y: this.line_position },
				end: { x: right, y: this.line_position },
				stroke: "1px #000"
			}));

			this.assembly_line.pieces[i].push(this.canvas.display.line({
				start: { x: left, y: this.line_position - 5 },
				end: { x: left, y: this.line_position },
				stroke: "1px #000"
			}));

			this.assembly_line.pieces[i].push(this.canvas.display.line({
				start: { x: right, y: this.line_position - 5 },
				end: { x: right, y: this.line_position },
				stroke: "1px #000"
			}));

			for (let j = 0; j < this.assembly_line.pieces[i].length; j++) {
				this.canvas.addChild(this.assembly_line.pieces[i][j]);
			}	

	    	let stack = this.assembly_line[i];

	    	if (stack != null) {
		        
		        for (let level = 0; level <= stack.length; level++) {
		        	
	        		if (stack[level] != null) {

	            		let color = 'white';

	            		if (stack[level].name == "r" || stack[level].name == "red"){
	              			color = "red";
	            		} 

	            		if(stack[level].name == "g" || stack[level].name == "green"){
	              			color = "green";
	            		} 

	            		if(stack[level].name == "b" || stack[level].name == "blue"){
	              			color = "blue";
	            		}

	            		this.assembly_line[i][level].block = this.canvas.display.rectangle({
							x: left + 5,
							y: this.line_position - this.block_height * (level + 1),
							width: this.block_width,
							height: this.block_height,
							fill: color,
							stroke: "inside 1px rgba(0, 0, 0, 0.5)"
						});
	            		this.canvas.addChild(this.assembly_line[i][level].block);
		        	} 	
		        }
	    	}
		}
	}

	increase_actions(action) {
		this.arm.actions += 1;
		document.title = "RobotArm - Actions: " + this.arm.actions;
	}

	animate_arm(property_name, start_value, end_value, duration) {

		let xory, change;

		if (property_name == "position") {
			xory = "x";
			change = (end_value > start_value) ? this.station_width : -this.station_width;
		} else {
			xory = "y";
			change = (end_value > start_value) ? end_value * this.block_height : -(start_value * this.block_height);
		}

		for (let i = 0; i < this.arm.pieces.length; i++) {
			this.arm.pieces[i].animate({
				[xory]: this.arm.pieces[i][xory] + change   
			});
			this.arm.pieces[i][xory] += change;
		}

		if (this.arm.holding != null) {
			if (this.arm.holding.length == 1) {
				this.arm.holding[0].block.animate({
					[xory] : this.arm.holding[0].block[xory] + change
				});
				this.arm.holding[0].block[xory] += change;
			}
		}
	}

	set_level(f_id) {
		if (f_id < 1 || f_id > 15 || isNaN(f_id)) {
			console.log("Error: The level has to be between 1 and 15");
		} else {
			
			let exercise = this.levels["exercise_" + f_id];

			for (let i = 0; i <= this.station_count; i++) {

				this.assembly_line[i] = [];
		
				if (exercise.length <= i) {
					continue;
				}

				for (let j = 0; j < exercise[i].length; j++) {
					this.assembly_line[i][j] = {
						name: exercise[i][j]
					}
				}
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
		let stack = this.assembly_line[this.arm.position];
		let grab_level = (this.level_count - stack.length);

		if (stack.length == 0) {
			grab_level -= 1;
		}

		if (this.arm.holding != null) {
			grab_level -= 1;
		}

		this.animate_arm('level', 0, grab_level, this.max_duration);
		
		if (this.arm.holding == null ) {
			this.arm.holding = stack.splice(stack.length - 1, 1);
		}
		this.assembly_line[this.arm.position] = stack;
		
		this.animate_arm('level', grab_level, 0, this.max_duration);
		
	  	this.increase_actions();
	}

	scan() {

		this.increase_actions();
		

		if (this.arm.holding != null) {
			return this.arm.holding[0].name;
		}
		return undefined;
	}

	drop() {
		let stack = this.assembly_line[this.arm.position];
		let drop_level = this.level_count - stack.length - 1;

		this.animate_arm('level', 0, drop_level, this.max_duration);

		stack.push(this.arm.holding[0]);

		this.assembly_line[this.arm.position] = stack;
		this.arm.holding = null;

		this.animate_arm('level', drop_level, 0, this.max_duration);
		this.increase_actions();
	}
}