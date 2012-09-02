function displayUI()
{
	$("#plugbot-warning").remove();
	$('#playback').append('<div id="plugbot-warning" style="background-color:#0a0a0a;opacity:0.91;width:100%;padding:12px 0 12px 0;color:#fff;text-align:center;opacity:0;font-size:15px">'
		+ 'We all like privacy, right?  Well, there\'s something you should know<br />about Plug.bot in case you are concerned.');


displayUI();
$(function() {
	$("#plugbot-warning").animate({"opacity": "0.91"}, {duration: "medium"}).delay(12000).animate({"opacity": "0"}, {duration: "slow"});
});



function f_comandos(data) {
        API.sendChat('Comandos del chat: ');
        window.setTimeout(function(){API.sendChat('ayuda | reco | seguir | esverdad | chistes | generos | bailar | tomar | cerveza | whisky | tequila | vodka | champagne | ron');}, 500);
}
function f_skip(data) {
        API.sendChat('¡A la orden capitán!');
        new ModerationForceSkipService(Models.room.data.historyID);
}


function f_add(data) {
        API.sendChat('¡El dj ha sido agregado mi capitán!');
        new ModerationAddDJService(Models.room.getAudience());      
}

function f_bloquear(data) {
        API.sendChat('/me La cubierta ha sido bloqueada');
        rpcGW.execute('room.update_options', null, Models.room.data.id,
              {
                name: Models.room.data.name,
                description: Models.room.data.description,
                boothLocked: true,
                waitListEnabled: Models.room.data.waitListEnabled,
                maxPlays: Models.room.data.maxPlays,
                maxDJs:5
              });
}

function f_desbloquear(data) {
        API.sendChat('/me La cubierta ha sido desbloqueada');
        rpcGW.execute('room.update_options', null, Models.room.data.id,
              {
                name: Models.room.data.name,
                description: Models.room.data.description,
                boothLocked: false,
                waitListEnabled: Models.room.data.waitListEnabled,
                maxPlays: Models.room.data.maxPlays,
                maxDJs:5
              });
}


function f_reintentar(data) {
                API.sendChat('/me Selecciona otra canción e intentalo denuevo');
                window.setTimeout(function(){ rpcGW.execute('room.update_options', null, Models.room.data.id,
              {
                name: Models.room.data.name,
                description: Models.room.data.description,
                boothLocked: true,
                waitListEnabled: Models.room.data.waitListEnabled,
                maxPlays: Models.room.data.maxPlays,
                maxDJs:5
              });}, 1000);
                window.setTimeout(function(){new ModerationForceSkipService(Models.room.data.historyID);}, 3000);
                window.setTimeout(function(){rpcGW.execute('room.update_options', null, Models.room.data.id,
              {
                name: Models.room.data.name,
                description: Models.room.data.description,
                boothLocked: false,
                waitListEnabled: Models.room.data.waitListEnabled,
                maxPlays: Models.room.data.maxPlays,
                maxDJs:5
              });}, 5000);
}    



function f_autosaltar(data) {
        if(b_autoSkip == false) {
                API.sendChat('Auto saltar ACTIVADO');
                b_autoSkip = true;
        } else {
                API.sendChat('Auto saltar DESACTIVADO');
                b_autoSkip = false;
        }
       
}



API.addEventListener(API.USER_JOIN, bienvenida);
function bienvenida(user){
        API.sendChat("/em " + user.username + " Ha ingresado a la sala");

}

API.addEventListener(API.CURATE_UPDATE, function (obj) {
        var curate = obj.curate
                API.sendChat("/em A " + obj.user.username + " le gusta esta canción")
                })


function f_ayuda(data){
        API.sendChat ("Para comenzar crea una lista de reproducción y agrega canciónes, ya sea de Youtube como de Soundcloud, luego da click en el botón 'Join waitlist' o 'Click to dj' y espera tu turno. Para saber que tipo de música pasar, escribe: /géneros.");
}

function f_reco(data){
        var reco = ["{user} ¿Has visto el canal de TN? Ahí podrás encontrar buena música: http://goo.gl/82ZDJ","{user} Si no has entrado en el canal de MonsterCatMedia es hora de que lo hagas: http://goo.gl/JrGr0"];
        var g = Math.floor(Math.random()*reco.length);
        var msg = reco[g].replace("{user}",'@'+ data.from);
        var randomWait = (Math.random()*2000)+2000;
        setTimeout(function(){
                API.sendChat(msg);
        }, randomWait);
}



API.addEventListener(API.CHAT,function(data){
if(data.message.indexOf('/esverdad ') != -1){
        var verd = ["Pues {user} será verdad cuando las vacas vuelen","Que si es verdad?? pues que quieres que te diga... por ser tu {user} dire que si, pero no te acostrumbres eh"];
        var g = Math.floor(Math.random()*verd.length);
        var msg = verd[g].replace("{user}",'@'+ data.from);
        var randomWait = (Math.random()*2000)+2000;
        setTimeout(function(){
                API.sendChat(msg);
        }, randomWait);
}})

API.addEventListener(API.CHAT,function(data){
if(data.message.indexOf('/chistes') != -1){
        var greetings = ["De que color es un chino si lo agarras por los huevos?-Amarillo chillón","Entra un chico en un bar y hay una camarera africana en la barra y le dice:¡Traeme una fanta negra! Y la camarera le dice:Usted lo que quiere es una coca-cola","Va un anciano a la panaderia y pide 12 barras de pan y salta la panadera se le va a poner duro y el viejo dice: joder eso espero","camarero,camarero tiene ancas de rana si ¡pues pega un salto y ponme una cerveza!","Entra un nuevo profe al curso y se presenta:Buenos dias, mi nombre es Largo.Dice Juancito:No importa, tenemos tiempo","¿Cómo se dice alcohólico en Japones? Yositomo Whiskisito","Dijo el capitán: ¡Suban las velas! Y abajo se quedaron a oscuras","¿Cómo se dice hazme reír en Árabe?.. Hasmejaja"];
        var g = Math.floor(Math.random()*greetings.length);
        var msg = greetings[g].replace("{user}",'@'+data.username);
        var randomWait = (Math.random()*2000)+2000;
        setTimeout(function(){
                API.sendChat(msg);
        }, randomWait);
}})


API.addEventListener(API.DJ_ADVANCE, f_djAdvance);
function f_djAdvance(obj)
{
        var i_timeRem = -1;
        s_timeRem = $('#time-remaining-value').text();
        while(s_timeRem == null) 
        {
            s_timeRem = $('#time-remaining-value').text();
        }
        a_timeRem = s_timeRem.toString().split(':');
        i_timeRem = (parseInt(a_timeRem[0])*60) + parseInt(a_timeRem[1]);
       
        if(i_timeRem > 8*60) {
                var o_djs = API.getDJs();
                API.sendChat('@'+o_djs[0].username+'. perdón, tu canción supera el límite de 8min permitido en la sala.');
                f_skip(null);
        }
}


function f_seguir(data){
                        API.sendChat("/em" +  " Síguenos en FB: http://goo.gl/9WBbZ");
}


function f_generos(data){
                        API.sendChat("Cualquier género o subgénero perteneciente a la música electrónica es permitido aquí. Ejemplos: House, Industrial, Jungle, Dubstep, Drum and Bass, Minimal, Trance, Hardstyle, entre otros.");
}


function f_bailar(data){
                        API.sendChat("Para bailar debes de precionar el botón que dice WOOT. Cada vez que votes ya sea WOOT o MEH ganarás 1 punto.");
}


function f_tomar(data){
                        API.sendChat("¿Qué deseas tomar?");
                        window.setTimeout(function(){API.sendChat('cerveza | whisky | tequila | vodka | champagne | ron');}, 1000);
}

function f_cerveza(data){
                        API.sendChat(data.from + ", Se ha tomado un rica cerveza bien fría!! Salud y que siga la fiestaaa!!!");
}

function f_whisky(data){
                        API.sendChat(data.from + ", Se ha tomado un whisky para eliminar el stress");
}

function f_tequila(data){
                        API.sendChat(data.from + ", Se ha tomado una copita de tequila!! yijaa!!");
}

function f_vodka(data){
                        API.sendChat(data.from + ", Se ha tomado un shot de vodka!! hasta el fondo!!!");
}

function f_champagne(data){
                        API.sendChat(data.from + ", Se ha tomado un Champagne bien espumoso!!! ñam ñam");
}

function f_ron(data){
                        API.sendChat(data.from + ", Se ha tomado un vaso de Ron, Yoho! Yoho! que corra el ron!!!");
}

var o_chatcmds = {
        '/comandos': {
                f: f_comandos,
                needsPerm: false
        },
        '/saltar': {
                f: f_skip,
                needsPerm: true
        },
        '/agregar': {
                f: f_add,
                needsPerm: true
        },
        '/bloq': {
                f: f_bloquear,
                needsPerm: true
        },
         '/desbloq': {
                f: f_desbloquear,
                needsPerm: true
        },
        '/reintentar': {
                f: f_reintentar,
                needsPerm: true
        },
         '/ayuda': {
                f: f_ayuda,
                needsPerm: false
        },
        '/reco': {
                f: f_reco,
                needsPerm: false
        },
        '/seguir': {
                f: f_seguir,
                needsPerm: false
        },
        '/generos': {
                f: f_generos,
                needsPerm: false
        },
        '/bailar': {
                f: f_bailar,
                needsPerm: false
        },
        '/tomar': {
                f: f_tomar,
                needsPerm: false
        },
        '/cerveza': {
                f: f_cerveza,
                needsPerm: false
        },
        '/whisky': {
                f: f_whisky,
                needsPerm: false
        },
        '/tequila': {
                f: f_tequila,
                needsPerm: false
        },
        '/vodka': {
                f: f_vodka,
                needsPerm: false
        },
        '/champagne': {
                f: f_champagne,
                needsPerm: false
        },
        '/ron': {
                f: f_ron,
                needsPerm: false
        },
};

API.addEventListener(API.CHAT, f_checkChat);
function f_checkChat(data) {
        if((data.type == "message") && (data.fromID != API.getSelf().id)) {
                for(var s in o_chatcmds) {
                        if(data.message.toString().indexOf(s) != -1) { // dont parse our own messages
                                // finally, perm check
                                if(o_chatcmds[s].needsPerm)
                                {
                                        if(API.getUser(data.fromID).moderator) {
                                                o_chatcmds[s].f(data);
                                        } else {
                                                API.sendChat('@'+data.from+': No tienes los permisos suficientes para utilizar este comando');
                                        }
                                } else {
                                        o_chatcmds[s].f(data);
                                }
                                
                        }
                }
               
        }
}