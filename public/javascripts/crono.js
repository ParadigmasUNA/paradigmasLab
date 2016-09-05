/*

Proyecto 1 | Paradigmas de Programación

II ciclo - 2016

Laberinto Remoto|Local

Grupo 1 - 8am

Carlos Artavia Pineda
Andrey Campos Sánchez
Fabián Hernández Chavarria
Omar Segura Villegas

2016

*/
onmessage = function(e){
  let timercount = e.data.timercount;
  let timestart = e.data.timestart;
  postMessage(showtimer(timercount,timestart));
}

function showtimer(timercount,timestart) {
	if(timercount) {
    console.log('el timercount existe');
		clearTimeout(timercount);
		clockID = 0;
	}
	if(!timestart){
    console.log('el timestart no existe');
		timestart = new Date();
	}
	var timeend = new Date();
	var timedifference = timeend.getTime() - timestart.getTime();
	timeend.setTime(timedifference);
	var minutes_passed = timeend.getMinutes();
	if(minutes_passed < 10){
		minutes_passed = "0" + minutes_passed;
	}
	var seconds_passed = timeend.getSeconds();
	if(seconds_passed < 10){
		seconds_passed = "0" + seconds_passed;
	}
  console.log(minutes_passed,':',seconds_passed);
  return minutes_passed + ":" + seconds_passed; //retornar al controller
}
