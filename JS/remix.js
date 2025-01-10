let currentsong= new Audio()
let defaultsong= new Audio()
let songs;
function convertDecimalSecondsToSeconds(decimalSeconds) {
  const wholeSeconds = Math.floor(decimalSeconds);
  return wholeSeconds;
}
function convertSecondsToMinutesAndSeconds(seconds) {
  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format the time
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

  return formattedTime;
}


// Fetch songs from folder
async function getsongs(){
  let a = await fetch("/songs/remix/")
  let response= await a.text()
  let div= document.createElement("div")
  div.innerHTML= response;
  let as =div.getElementsByTagName("a")
  let songs=[]
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if(element.href.endsWith(".mp3")){
        songs.push(element.href.split("/remix/")[1])
    }
    
  }
  return songs;
}
getsongs()
// Plays music
const playmusic= (track , pause=false)=>{
  // let audio= new Audio("/sidhu/"+track)

  currentsong.src= "/songs/remix/"+track
  if(!pause){
    currentsong.play()
    play.src= "/logos/pause.svg"
  }
  document.querySelector(".song").innerHTML= decodeURI(track)
  document.querySelector(".duration").innerHTML= "00:00"
}
async function main(){
   songs= await getsongs()
  playmusic(songs[0], true)
    console.log(songs)
    // Append songs into songlist 
    let songul= document.querySelector(".songlist").getElementsByTagName("ul")[0]
    for (const song of songs) {
      songul.innerHTML= songul.innerHTML + `<li>
      <div class="songimg">
      <img src="/imgs/remix.jpg" alt="">
      </div>
      <div class="songname">
      ${decodeURI(song)}
      </div>
      <img  src="/logos/playsong.svg" alt="">
      
      
     </li>`
           
    }
  //  Event listener for clck songs 
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
       e.addEventListener("click" , element=>{
        console.log(e.querySelector(".songname").innerHTML)
        playmusic(e.querySelector(".songname").innerHTML.trim())
      }) 
    });
    //  Event listener for play button 
    play.addEventListener("click" , ()=>{
      if(currentsong.paused){
        currentsong.play()
        play.src="/logos/pause.svg"
      }
      else{
        currentsong.pause()
        play.src= "/logos/playsong.svg"
        
      }
         })
          // Event listener for current time and duration 
         currentsong.addEventListener("timeupdate" , ()=>{
           document.querySelector(".duration").innerHTML= `${convertSecondsToMinutesAndSeconds(Math.floor(currentsong.currentTime))}/${convertSecondsToMinutesAndSeconds(Math.floor(currentsong.duration))}`
           document.querySelector(".circle").style.left= (currentsong.currentTime/currentsong.duration)*100 + "%"
        })
        // Add an event listener to seekbar
        document.querySelector(".seekbar").addEventListener("click", (e)=>{
          let percent= (e.offsetX/ e.target.getBoundingClientRect().width)* 100
          document.querySelector(".circle").style.left = percent + "%" 
          currentsong.currentTime = ((currentsong.duration)*percent)/100
        })
        // event listener for next song

        
       
       next.addEventListener("click",()=>{ 
        let index =songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if(index+1 < songs.length) {
          playmusic(songs[index + 1])
        } 
        
      })
       previous.addEventListener("click",()=>{ 
        let index =songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if(index -1 >= 0) {
          playmusic(songs[index - 1])
        } 
        
      })
      document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change", (e)=>{
        currentsong.volume= parseInt(e.target.value)/100
      })
      singer= "Remix"
      playlistname.innerHTML= singer
      
          
       
          
      
}
main()