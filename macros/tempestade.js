"use strict";
//SOUNDS
const RAIN_MIDDLE_SOUND =  "Chuva Media";
const RAIN_HARD_SOUND =  "Chuva Pesada";
const RAIN_PLAYLIST = "Natureza";
const THUNDERBOLT_PLAYLIST = "Efeitos Curtos";
const THUNDERBOLT_SOUND = "Relâmpago";
const THUNDERBOLT_TIME = 35000; //30s

//cloud
const CLOUD_COLOR = "777777";

function createGlobalCommons(){ 
	game.common = {audios:new Array()}; 
}

function playOneTime(playlistName,soundName){
  const playlist = game.playlists.getName(playlistName); 
  const sound = playlist.sounds.getName(soundName); 
  playlist.playSound(sound); 
}

function createRain(){
    Hooks.call("fxmaster.updateParticleEffects", [
    {
        type: "rain",
        options: {
        density: 0.5,       // quão intensa é a chuva (0 a 1)
        speed: 5,           // velocidade da queda
        scale: 1,           // tamanho das gotas
        tint: { value: "#FFFFFF", apply: false } // cor (sem cor por padrão)
        }
    }
    ]); 
}

function createCloud(color){
    Hooks.call("fxmaster.updateParticleEffects", [
  {
    type: "clouds",
    options: {
      density: 0.3,
      speed: 1,
      scale: 1,
      tint: {value: color, apply: true},
      direction: 50
    }
  }
]);
}


function playLoop(playlistName,soundName,repeatTime){
    //console.log("playLoop " , game.common);
    const common = game.common;
     common.audios.push(soundName);

    const handler = setInterval(()=>{ 
        //console.log("teste " , common.audios,handler); 
        //console.log("audio1",common.audios);
       if(!common || !common.audios || common.audios.filter(f => f == soundName).length==0)
        {
            //console.log("audio2");
            //console.log("Sthutdow " + soundName," ",handler);
            setTimeout(handler);
            common.audios =  common.audios.filter(f => f !== soundName);
            return;
        }
        
        //console.log("audio3");
        //console.log("Sound ", soundName, " on");
        playOneTime(playlistName,soundName); 

        
    },repeatTime); 
}

function main(){
    createGlobalCommons();
    createCloud(CLOUD_COLOR);
    createRain();
    playOneTime(RAIN_PLAYLIST,RAIN_HARD_SOUND);
    playOneTime(RAIN_PLAYLIST,RAIN_MIDDLE_SOUND);
    playLoop(THUNDERBOLT_PLAYLIST,THUNDERBOLT_SOUND,THUNDERBOLT_TIME);
}

main();