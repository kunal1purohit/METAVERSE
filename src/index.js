import Movements from "./movement.js";
import polygon  from "./Web3.js";
import abi from "./abi/abi.json" assert { type: "json" };
//contract address - 0x513d249967E23380d5828be2F32B0b5F05009B6c

const scene = new THREE.Scene();
scene.background =new THREE.Color(0x000d11);
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const ambient_light= new THREE.AmbientLight(0x404040);
const directional_light =new THREE.DirectionalLight(0x00ff00,1);
ambient_light.add(directional_light);
scene.add(ambient_light);

const geometry_area=  new THREE.BoxGeometry(40,0.2,50);
const material_area = new THREE.MeshPhongMaterial({color:0x00ffff});
const area =new THREE.Mesh(geometry_area,material_area);
scene.add(area);

// const geometry = new THREE.BoxGeometry( 1, 1, 1 );
// const material = new THREE.MeshPhongMaterial( { color: 0x00ff00 } );
// const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

// const geometry1 = new THREE.CylinderGeometry( 5, 5, 20, 32 ); 
// const material1 = new THREE.MeshPhongMaterial( {color: 0xffff00} ); 
// const cylinder = new THREE.Mesh( geometry1, material1 ); 
// scene.add( cylinder );
// cylinder.position.x +=15;

camera.position.z = 5;
camera .position.set(10,5,40);

function animate() {
    // cube.rotation.x +=0.1;
    // cube.rotation.y +=0.1;
    // cylinder.rotation.x += 0.1;

    requestAnimationFrame( animate );

    if(Movements.isPressed(37)){//left key
        camera.position.x-=0.5;
    }
    if(Movements.isPressed(38)){//up key
        camera.position.y+=0.5;
    }
    if(Movements.isPressed(39)){//right key
        camera.position.x+=0.5;
    }
    if(Movements.isPressed(40)){//down key
        camera.position.y-=0.5;
    }
    
    camera.lookAt(area.position);
	
	renderer.render( scene, camera );

}
animate();
renderer.render(scene,camera);

const button = document.querySelector("#mint");
button.addEventListener("click", mintNFT);

async function mintNFT() {
  let nft_name = document.querySelector("#nft_name").value;
  let nft_width = document.querySelector("#nft_width").value;
  let nft_height = document.querySelector("#nft_height").value;
  let nft_depth = document.querySelector("#nft_depth").value;
  let nft_x = document.querySelector("#nft_x").value;
  let nft_y = document.querySelector("#nft_y").value;
  let nft_z = document.querySelector("#nft_z").value;

  if (typeof window.ethereum == "undefined") {
    rej("You should install Metamask");
  }

  let web3 = new Web3(window.ethereum);
  let contract = new web3.eth.Contract(
    abi,
    "0x1262b813E4471684996212ea7C49CC3Caf5A8506"
  );

  web3.eth.requestAccounts().then((accounts) => {
    contract.methods
      .mint(nft_name, nft_width, nft_height, nft_depth, nft_x, nft_y, nft_z)
      .send({
        from: accounts[0],
        value: "10",
      })
      .then((data) => {
        console.log("NFT is minted");
      });
  });
}

polygon.then((result) => {
    result.nft.forEach((object, index) => {
      if (index <= result.supply) {
        const geometry_cube = new THREE.BoxGeometry(object.w, object.h, object.d);
        const material_cube = new THREE.MeshPhongMaterial({ color: 0x1be3ef });
        const nft = new THREE.Mesh(geometry_cube, material_cube);
  
        nft.position.set(object.x, object.y, object.z);
        scene.add(nft);
      }
    });
  });