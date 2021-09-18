const audio =document.getElementById('audio')
const playPauseBTN = document.getElementById('playPauseBTN')
const count =0

function playPause(){
    if (count===0){
        count =1
        audio.play()
        playPauseBTN.innerHTML = "Pause &#9208;";
    }else{
        count=0;
        audio.pause()
        playPauseBTN.innerHTML = "Play &#9658;";
    }
}

function ticketAlert(){
    alert("Sorry! Show Cancelled")
}