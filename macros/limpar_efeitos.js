"use strict";
if(game.common)
{
	console.log("Limpando os áudios");
    game.common.audios = new Array();   
    
} 

console.log("Limpando os filtros");
FXMASTER.filters.setFilters([]);

console.log("Limpando as partículas");
Hooks.call("fxmaster.updateParticleEffects", []);

console.log("Limpando as playlists");
game.playlists?.playing.forEach(p => { 
   /* p.sounds.forEach(s => {
            s.play({offset:0});
            s.stop();
        });*/
    p.stopAll();
    p.reset();
});

