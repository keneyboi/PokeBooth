const card = document.querySelectorAll('.card')
const modal = document.getElementById('photobooth-modal')
let activeStream = null;

function open(e){
    const theme = e.currentTarget.id;
    const attOne = document.getElementById('card-first-attack');
    const attTwo = document.getElementById('card-second-attack');
    modal.classList.remove('fire', 'water', 'grass');
    modal.classList.add(theme);
    if(theme === "fire"){
        attOne.placeholder = "Fire Spin"
        attTwo.placeholder = "Flamethrower"
    } else if (theme === "water"){
        attOne.placeholder = "Water Cannon"
        attTwo.placeholder = "Bubble Beam"
    } else {
        attOne.placeholder = "Vine Whip"
        attTwo.placeholder = "Grassy Terrain"
    }
    openCamera();
    const image = document.getElementById('card-overlay');
    image.src = 'res/' + theme + '-card.png'
    modal.showModal();
}

card.forEach(card =>{
    card.addEventListener('click', open)

});

modal.addEventListener('click', (lightBox) => {
    const dialogDimensions = modal.getBoundingClientRect();
    if (
        lightBox.clientX < dialogDimensions.left ||
        lightBox.clientX > dialogDimensions.right ||
        lightBox.clientY < dialogDimensions.top ||
        lightBox.clientY > dialogDimensions.bottom
    ) {
        modal.close();
        
    }
});

const videoElement = document.getElementById('webcam')
const shutter = document.getElementById('shutter')

async function openCamera(){
    closeCamera();

    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true, audio: false
        });
        activeStream = stream;
        videoElement.srcObject = stream;
    } catch (error){
        alert("Unable to open camera");
    }
}

async function closeCamera(){
    if(activeStream){
        activeStream.getTracks().forEach(track => track.stop());
        activeStream = null;
    }
    if (videoElement) {
        videoElement.pause();
        videoElement.srcObject = null;
    }
}



const shutterButton = document.getElementById('shutter');
const saveButton = document.getElementById('save');
const video = document.getElementById('webcam');
const cardOverlay = document.getElementById('card-overlay');
const editBox = document.querySelector('.edit-box');
const cameraBox = document.querySelector('.camera-box');

shutterButton.addEventListener('click', () => {
    if (shutter.textContent === "Retake") {
    
        openCamera();
        video.style.display = 'block'; 
        
 
        const existingSnapshot = document.getElementById('snapshot-preview');
        if (existingSnapshot) {
            existingSnapshot.remove();
        }

        saveButton.disabled = true;
        shutter.textContent = "Take a Photo";
        
    } else {
     
        const snapshotCanvas = document.createElement('canvas');
        snapshotCanvas.id = 'snapshot-preview';
        snapshotCanvas.width = 348;
        snapshotCanvas.height = 240;
        const snapshotCtx = snapshotCanvas.getContext('2d');

   
        snapshotCtx.save();
        snapshotCtx.scale(-1, 1);
        snapshotCtx.drawImage(video, -348, 0, 348, 240);
        snapshotCtx.restore();

      
        closeCamera();
        video.style.display = 'none';
        video.parentNode.insertBefore(snapshotCanvas, video);

      
        saveButton.disabled = false;
        shutter.textContent = "Retake";
    }    
});

saveButton.addEventListener('click', async () => {

    try {
        await document.fonts.load('bold 24px PokemonFont');
    } catch (e) {
        console.log("Font load wait failed, using fallback");
    }
   
    const overlayImg = new Image();
    overlayImg.crossOrigin = 'anonymous';
    overlayImg.src = cardOverlay.src;


    overlayImg.onload = () => {
       
        const canvas = document.createElement('canvas');
        canvas.width = overlayImg.naturalWidth;
        canvas.height = overlayImg.naturalHeight;
        const ctx = canvas.getContext('2d');

    



        const existingSnapshot = document.getElementById('snapshot-preview');
        ctx.drawImage(existingSnapshot, 37, 43, 348, 260);
      

        
        ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);

        const nameInput = document.getElementById('card-name-input');
        const hpInput = document.getElementById('card-hp-input');
        const attOne = document.getElementById('card-first-attack');
        const attOneDes = document.getElementById('card-first-description');
        const attTwo = document.getElementById('card-second-attack');
        const attTwoDes = document.getElementById('card-second-description');


        const cardTitle = nameInput && nameInput.value.trim() !== "" ? nameInput.value : "My Pokémon";
        const hpValue = hpInput && hpInput.value.trim() !== "" ? hpInput.value.trim() : "50";
        const attOneValue = attOne && attOne.value.trim() !== "" ? attOne.value : "First Attack";
        const attTwoValue = attTwo && attTwo.value.trim() !== "" ? attTwo.value : "Second Attack";
        const attTwoDesValue = attTwoDes && attTwoDes.value.trim() !== "" ? attTwoDes.value : "Second Description";
       
     
        ctx.font = '28px PokemonFont, sans-serif';
        ctx.fillStyle = '#222222';
        ctx.textBaseline = 'top';
        const textX = 105; 
        const textY = 27; 
        ctx.fillText(cardTitle, textX, textY);


        ctx.font = '26px PokemonFont, sans-serif';
        ctx.letterSpacing = "-2px";
        let hpX = 326;
        if(hpValue.length === 2){
            hpX = 334;
        } else if (hpValue.length === 1) {
            hpX = 346;
        } else {
            hpX = 322;
        }
         
        const hpY = 29; 
        ctx.fillText(hpValue, hpX, hpY);
    
        ctx.font = '10px PokemonFont, sans-serif';
        ctx.letterSpacing = "0px";
        ctx.fillText("HP", hpX - 13, hpY + 10);

        ctx.font = '22px PokemonFont, sans-serif';
        let attX = 130;
        let attY = 325;
        ctx.fillText(attOneValue, attX, attY);
        attY = 405;
        ctx.fillText(attTwoValue, attX, attY);

        ctx.font = '12px sans-serif';
        attX = 35;
        attY = 345;
        const lineHeight = 16;
        let lines = attOneDes.value.split('\n');
        lines.forEach((line) => {
            ctx.fillText(line, attX, attY);
            attY += lineHeight; 
        });
        attY = 425;
        lines = attTwoDes.value.split('\n');
        lines.forEach((line) => {
            ctx.fillText(line, attX, attY);
            attY += lineHeight; 
        });

        const finalImageURL = canvas.toDataURL('image/png');
        const cameraBox = document.querySelector('.camera-box');
        const editBox = document.querySelector('.edit-box');
        
        const downloadLink = document.createElement('a');
        downloadLink.href = finalImageURL;
        downloadLink.download = 'my-pokemon-card.png';

    
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

    };
});