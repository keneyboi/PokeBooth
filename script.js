const card = document.querySelectorAll('.card')
const modal = document.getElementById('photobooth-modal')

function open(e){
    const theme = e.currentTarget.id;
    modal.classList.remove('fire', 'water', 'grass');
    modal.classList.add(theme);
    const text = document.getElementById('type').textContent = theme + " Type";
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
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: true, audio: false
        });

        videoElement.srcObject = stream;
    } catch (error){
        alert("Unable to open camera");
    }
}




const shutterButton = document.getElementById('shutter');
const editButton = document.getElementById('edit');
const video = document.getElementById('webcam');
const cardOverlay = document.getElementById('card-overlay');
const editBox = document.querySelector('.edit-box');
const cameraBox = document.querySelector('.camera-box');

shutterButton.addEventListener('click', () => {
    if(video.paused){
        video.play();
        editButton.disabled = true;
        shutter.textContent = "Take a Photo"
    } else {
        video.pause();
        editButton.disabled = false;
        shutter.textContent = "Retake"
        
    }    
});

editButton.addEventListener('click', () => {
    const overlayImg = new Image();
    overlayImg.crossOrigin = 'anonymous';
    overlayImg.src = cardOverlay.src;

    overlayImg.onload = () => {
       
        const canvas = document.createElement('canvas');
        canvas.width = overlayImg.naturalWidth;
        canvas.height = overlayImg.naturalHeight;
        const ctx = canvas.getContext('2d');

    
        const videoX = 37;      
        const videoY = 63;     
        const videoWidth = 348;  
        const videoHeight = 230;
        

 
        const videoRatio = video.videoWidth / video.videoHeight;
        const targetRatio = videoWidth / videoHeight;
        
        let sWidth = video.videoWidth;
        let sHeight = video.videoHeight;
        let sX = 0;
        let sY = 0;

        if (videoRatio > targetRatio) {
            sWidth = video.videoHeight * targetRatio;
            sX = (video.videoWidth - sWidth) / 2;
        } else {
            sHeight = video.videoWidth / targetRatio;
            sY = (video.videoHeight - sHeight) / 2;
        }

        ctx.save();
        ctx.scale(-1, 1);
        
        ctx.drawImage(
            video, 
            sX, sY, sWidth, sHeight, 
            -videoX - videoWidth, videoY, videoWidth, videoHeight
        );
        ctx.restore();

        
        ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);

        const nameInput = document.getElementById('card-name-input');
        const hpInput = document.getElementById('card-hp-input');
        const cardTitle = nameInput && nameInput.value.trim() !== "" ? nameInput.value : "My Pokémon";
        

     
        ctx.font = 'bold 24px Poppins, sans-serif';
        ctx.fillStyle = '#222222'; // Dark text color
        ctx.textBaseline = 'top';

        
        const textX = 105; 
        const textY = 22; 
        ctx.fillText(cardTitle, textX, textY);

        const hpX = 325; 
        const HpY = 23; 
        ctx.fillText(hpInput.value, hpX, HpY);

        ctx.font = 'bold 12px Poppins, sans-serif';
    
        ctx.fillText("HP", hpX - 17, HpY + 12);

        
        const finalImageURL = canvas.toDataURL('image/png');
        const cameraBox = document.querySelector('.camera-box');
        const editBox = document.querySelector('.edit-box');
        

        editBox.innerHTML = `
            <div class="result-preview" style="text-align: center;">
                <h3>Your Pokémon Card Photo!</h3>
                <img src="${finalImageURL}" alt="Captured PokéBooth Photo" style="width: 100%; border-radius: 8px;">
                <div style="margin-top: 10px;">
                    <a href="${finalImageURL}" download="pokebooth-card.png" class="download-btn" style="display:inline-block; padding:8px 16px; background:#ffcb05; color:#2a75bb; font-weight:bold; border-radius:4px; text-decoration:none;">Download Image</a>
                </div>
            </div>
        `;
    };
});