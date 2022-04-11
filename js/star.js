    //Declare three.js variables
	var camera, scene, renderer, stars=[];
	 
	//assign three.js objects to each variable
	function init(){
		 
		//camera
		camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
		camera.position.z = 5;	 

		//scene
		scene = new THREE.Scene();
		 
		//renderer
		renderer = new THREE.WebGLRenderer();
		//set the size of the renderer
		renderer.setSize( window.innerWidth, window.innerHeight );
		 
		//add the renderer to the html document body
		document.querySelector('.overlay').appendChild( renderer.domElement );
	}


	function addSphere(){

				// The loop will move from z position of -1000 to z position 1000, adding a random particle at each position. 
				for ( var z= -1000; z < 1000; z+=20 ) {
                    // for (let i = 0; i < 300; i++) {
					// Make a sphere (exactly the same as before). 
					var geometry   = new THREE.SphereBufferGeometry(2, 2, 2)
                    var material = new THREE.MeshNormalMaterial();
					// var material = new THREE.MeshBasicMaterial( { color: 0xECF0F1, transparent: true, opacity: 0.3 });
					var sphere = new THREE.Mesh(geometry, material)
		
					// // This time we give the sphere random x and y positions between -500 and 500
					sphere.position.x = Math.random() * 1000 - 500;
					sphere.position.y = Math.random() * 1000 - 500;
		
					// // Then set the z position to where it is in the loop (distance of camera)
					sphere.position.z = z;
                    // sphere.position.set(
                    //     Math.random() - 0.5,
                    //     Math.random() - 0.5,
                    //     -Math.random() * 0.5
                    //   ).normalize().multiplyScalar(
                    //       ()=>{
                    //         (Math.random() * (max - min)) + min
                    //       }
                       
                    //   )
                        

                    //   this.t += 0.01;
                    // sphere.scale.x = sphere.scale.y = sphere.scale.z = Math.sin( this.t ) + 1;
                    
		
					// scale it up a bit
					sphere.scale.x = sphere.scale.y = 2;
		
					//add the sphere to the scene
					scene.add( sphere );
		
					//finally push it to the stars array 
					stars.push(sphere); 
				}
	}

    function update() {
        this.t += 0.01;
        this.scale.x = this.scale.y = this.scale.z = Math.sin( this.t ) + 1;
      }
	function animateStars() { 
				
		// loop through each star
		for(var i=0; i<stars.length; i++) {
			// for(var i=0; i<300; i++) {
			star = stars[i]; 
				
			// and move it forward dependent on the mouseY position. 
			star.position.z +=  i/10;
         
				
			// if the particle is too close move it to the back
			if(star.position.z>1000) star.position.z-=2000; 
            
            // this.t = Math.random() * 10;
            // star.position.set(
            //     Math.random() - 0.5,
            //     Math.random() - 0.5,
            //     -Math.random() * 0.5
            //   )
         
		}
	
	}

	function render() {
		//get the frame
		requestAnimationFrame( render );

		//render the scene
		renderer.render( scene, camera );
			animateStars();

	}
	
	init();
	addSphere();
	render();