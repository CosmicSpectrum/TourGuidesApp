

export async function StartStream(){
    return navigator.mediaDevices.getUserMedia({video: false, audio: true})
    .then(stream =>{
        return stream;       
    }).catch(err => {
        console.error(err);
    })
}