var config = {
    type: Phaser.AUTO,
    parent: 'content',
    width: 640,
    height: 896,
    physics: {
        default: 'arcade'
    },
    scene: {
        key: 'main',
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
<<<<<<< HEAD

//################################################################################################################
//Variaveis

var start = 1; //Manter o jogo rodando e reinicia-lo
var path; //Caminho dos inimigos
var turrets;
var enemies;
var credito = 25; //Crédito para compra de torres
var horda = 0; //Parte do calculo de vida dos inimigos
var inimigos_derrotados = 0;
var tipodeturret=0; //Tipo da torre selecionada pelo player
var turretpreco=10; //Preço da torre
var vidajogador=5; //Vida do Player
=======
var path;
var turrets;
var enemies;
var credito = 25;
var inimigos_derrotados = 0;
var tipodeturret=0;
var turretpreco=10;
var vidajogador=3;
>>>>>>> 4add58c (New changes)

var ENEMY_SPEED = 1/20000; // Velocidade dos inimigos

<<<<<<< HEAD
//var BULLET_DAMAGE = 100;//Math.floor(Math.random() * 5) + 20;;


//Matrix para verificar colocação de torre no mapa
var map =  [[ 2,-1, 2, 0, 0, 0, 0, 0, 0, 0],
            [ 2,-1, 2, 2, 2, 2, 2, 2, 2, 0],
            [ 2,-1,-1,-1,-1,-1,-1,-1, 2, 0],
            [ 2, 2, 2, 2, 2, 2, 2,-1, 2, 0],
            [ 0, 0, 0, 0, 0, 0, 2,-1, 2, 0],
            [ 0, 0, 0, 0, 0, 0, 2,-1, 2, 0],
            [ 2, 2, 2, 2, 2, 2, 2,-1, 2, 0],
            [ 2,-1,-1,-1,-1,-1,-1,-1, 2, 0],
            [ 2,-1, 2, 2, 2, 2, 2, 2, 2, 0],
            [ 2,-1, 2, 0, 0, 0, 0, 0, 0, 0],
            [ 2,-1, 2, 2, 2, 2, 2, 2, 2, 2],
            [ 2,-1,-1,-1,-1,-1,-1,-1,-1, 2],
            [ 2, 2, 2, 2, 2, 2, 2, 2,-1, 2],
            [ 0, 0, 0, 0, 0, 0, 0, 2,-1, 2]];


//################################################################################################################
//Pré carregamento do jogo

function preload() {    
    //carregar assets
    this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json'); //sprites
    this.load.image('bullet', 'assets/bullet.png'); //bala das torres
    this.load.image('map', 'assets/towerDefense_tilesheet.png'); //tileset para o tilemap
    this.load.tilemapTiledJSON('tilemap', 'assets/base_tilemap2.json') //tilemap
=======
var BULLET_DAMAGE = 100;//Math.floor(Math.random() * 5) + 20;;

var map =  [[ 2,-1, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 2,-1, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 2,-1,-1,-1,-1,-1,-1,-1, 0, 0],
            [ 2, 2, 2, 2, 2, 2, 2,-1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 2,-1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 2,-1, 0, 0],
            [ 0, 0, 0, 0, 0, 0, 2,-1, 0, 0],
            [ 0,-1,-1,-1,-1,-1,-1,-1, 0, 0],
            [ 2,-1, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 2,-1, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 2,-1, 0, 0, 0, 0, 0, 0, 0, 0],
            [ 2,-1,-1,-1,-1,-1,-1,-1,-1, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 2,-1, 0],
            [ 0, 0, 0, 0, 0, 0, 0, 2,-1, 0]];

function preload() {    
    //carregar assets
    this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
    this.load.image('bullet', 'assets/bullet.png');
    this.load.image('map', 'assets/towerDefense_tilesheet.png');
    this.load.tilemapTiledJSON('tilemap', 'assets/base_tilemap2.json')
>>>>>>> 4add58c (New changes)
}

//################################################################################################################
//Classes do jogo

var Enemy = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Enemy (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');

            this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
            this.hp = 0;
        },

        startOnPath: function ()
        {
            //inicia o caminho
            this.follower.t = 0;
            this.hp = 100 + inimigos_derrotados * (horda * 1.5);
            //pega x e y do ponto t
            path.getPoint(this.follower.t, this.follower.vec);
              //coloca o x e y do inimigo no momento anterior
            this.setPosition(this.follower.vec.x, this.follower.vec.y);            
        },
        receiveDamage: function(damage) {
            this.hp -= damage;
            
            // se o hp cai para 0 desabilita inimigo
            if(this.hp <= 0) {
                this.setActive(false);
                this.setVisible(false);
                putCredito();
                inimigos_derrotados++;
            }
        },
        update: function (time, delta)
        {
            //movimenta o inimigo com base na variavel t
            this.follower.t += ENEMY_SPEED * delta;
            //novas coordenadas de x e y
            path.getPoint(this.follower.t, this.follower.vec);
            //update nas posições do inimigo
            this.setPosition(this.follower.vec.x, this.follower.vec.y);
            //se o inimigo chegar ao fim, remover inimigo
            if (this.follower.t >= 1)
            {
                this.setActive(false);
                this.setVisible(false);
                atualizeVida();
            }
        }

});

var EnemyStronger = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Enemy (scene)
    {
<<<<<<< HEAD
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy2');
=======
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');
>>>>>>> 4add58c (New changes)

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.hp = 0;
    },

    startOnPath: function ()
    {
        //inicia o caminho
        this.follower.t = 0;
<<<<<<< HEAD
        this.hp = 500 + inimigos_derrotados * (horda * 1.5)
=======
        this.hp = 100;
>>>>>>> 4add58c (New changes)
        //pega x e y do ponto t
        path.getPoint(this.follower.t, this.follower.vec);
          //coloca o x e y do inimigo no momento anterior
        this.setPosition(this.follower.vec.x, this.follower.vec.y);            
    },
    receiveDamage: function(damage) {
<<<<<<< HEAD
        this.hp -= damage;

        // se o hp cai para 0 desabilita inimigo
=======
        this.hp -= damage;           
        
        // if hp drops below 0 we deactivate this enemy
>>>>>>> 4add58c (New changes)
        if(this.hp <= 0) {
            this.setActive(false);
            this.setVisible(false);      
        }
    },
    update: function (time, delta)
    {
        //movimenta o inimigo com base na variavel t
        this.follower.t += ENEMY_SPEED * delta;
        //novas coordenadas de x e y
        path.getPoint(this.follower.t, this.follower.vec);
        //update nas posições do inimigo
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        //se o inimigo chegar ao fim, remover inimigo
        if (this.follower.t >= 1)
        {
            this.setActive(false);
            this.setVisible(false);
        }
    }

});

<<<<<<< HEAD
//função utilizada pelas torres para detectar inimigos
=======
>>>>>>> 4add58c (New changes)
function getEnemy(x, y, distance) {
    var enemyUnits = enemies.getChildren();
    for(var i = 0; i < enemyUnits.length; i++) {       
        if(enemyUnits[i].active && Phaser.Math.Distance.Between(x, y, enemyUnits[i].x, enemyUnits[i].y) < distance)
            return enemyUnits[i];
    }
    return false;
} 

var Turret = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Turret (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turret');
            this.nextTic = 0;
        },
        //posicionar de acordo com a grade
        place: function(i, j) {            
            this.y = i * 64 + 64/2;
            this.x = j * 64 + 64/2;
            map[i][j] = 1;            
        },
        fire: function() {
            var enemy = getEnemy(this.x, this.y, 200);
            if(enemy) {
                var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
                addBullet(this.x, this.y, angle, bullets);
                this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
            }
        },
        update: function (time, delta)
        {
            if(time > this.nextTic) {
                this.fire();
                this.nextTic = time + 1000;
            }
        }
});

var TurretGunner = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Turret (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turretG');
        this.nextTic = 0;
    },
    //posicionar de acordo com a grade
    place: function(i, j) {            
        this.y = i * 64 + 64/2;
        this.x = j * 64 + 64/2;
        map[i][j] = 1;            
    },
    fire: function() {
        var enemy = getEnemy(this.x, this.y, 200);
        if(enemy) {
            var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
<<<<<<< HEAD
            addBullet(this.x, this.y, angle, bulletsG);
=======
            addBullet(this.x, this.y, angle);
>>>>>>> 4add58c (New changes)
            this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        }
    },
    update: function (time, delta)
    {
        if(time > this.nextTic) {
            this.fire();
            this.nextTic = time + 500;
        }
    }
});
    
var TurretSniper = new Phaser.Class({

    Extends: Phaser.GameObjects.Image,

    initialize:

    function Turret (scene)
    {
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'turretS');
        this.nextTic = 0;
        graphics = this.scene.add.graphics();
    },
    //posicionar de acordo com a grade
    place: function(i, j) {            
        this.y = i * 64 + 64/2;
        this.x = j * 64 + 64/2;
        map[i][j] = 1;            
    },
    fire: function() {
        var enemy = getEnemy(this.x, this.y, 500);
        if(enemy) {
            var angle = Phaser.Math.Angle.Between(this.x, this.y, enemy.x, enemy.y);
<<<<<<< HEAD
            addBullet(this.x, this.y, angle, bulletsS);
=======
            addBullet(this.x, this.y, angle);
>>>>>>> 4add58c (New changes)
            this.angle = (angle + Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        }
    },
    update: function (time, delta)
    {
        if(time > this.nextTic) {
            this.fire();
            this.nextTic = time + 5000;
        }
    }   
    
});

var Bullet = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:
        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

            this.damage = Math.floor(Math.random() * 50) + 20;
            this.incX = 0;
            this.incY = 0;
            this.lifespan = 0;

            this.speed = Phaser.Math.GetSpeed(600, 1);
        },

        fire: function (x, y, angle)
        {
            this.setActive(true);
            this.setVisible(true);
            //  Bullets fire from the middle of the screen to the given x/y
            this.setPosition(x, y);
            
        //  we don't need to rotate the bullets as they are round
        //    this.setRotation(angle);

            this.dx = Math.cos(angle);
            this.dy = Math.sin(angle);

            this.lifespan = 1000;
        },

        update: function (time, delta)
        {
            this.lifespan -= delta;

            this.x += this.dx * (this.speed * delta);
            this.y += this.dy * (this.speed * delta);

            if (this.lifespan <= 0)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }

    });

    var BulletG = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

            this.damage = Math.floor(Math.random() * 50) + 20;
            this.incX = 0;
            this.incY = 0;
            this.lifespan = 0;

            this.speed = Phaser.Math.GetSpeed(600, 1);
        },

        fire: function (x, y, angle)
        {
            this.setActive(true);
            this.setVisible(true);
            //  Bullets fire from the middle of the screen to the given x/y
            this.setPosition(x, y);
            
        //  we don't need to rotate the bullets as they are round
        //    this.setRotation(angle);

            this.dx = Math.cos(angle);
            this.dy = Math.sin(angle);

            this.lifespan = 1000;
        },

        update: function (time, delta)
        {
            this.lifespan -= delta;

            this.x += this.dx * (this.speed * delta);
            this.y += this.dy * (this.speed * delta);

            if (this.lifespan <= 0)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }

    });

    var BulletS = new Phaser.Class({

        Extends: Phaser.GameObjects.Image,

        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bullet');

            this.damage = 2000;
            this.incX = 0;
            this.incY = 0;
            this.lifespan = 0;

            this.speed = Phaser.Math.GetSpeed(1000, 1);
        },

        fire: function (x, y, angle)
        {
            this.setActive(true);
            this.setVisible(true);
            //  Bullets fire from the middle of the screen to the given x/y
            this.setPosition(x, y);
            
        //  we don't need to rotate the bullets as they are round
        //    this.setRotation(angle);

            this.dx = Math.cos(angle);
            this.dy = Math.sin(angle);

            this.lifespan = 1000;
        },

        update: function (time, delta)
        {
            this.lifespan -= delta;

            this.x += this.dx * (this.speed * delta);
            this.y += this.dy * (this.speed * delta);

            if (this.lifespan <= 0)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        }

    });

//################################################################################################################
//Carregamento do jogo

function create() {
    // cria o tilemap
	const map = this.make.tilemap({ key: 'tilemap' })

	// adiciona o a imagem do tileset
	const tileset = map.addTilesetImage('towerDefense_tilesheet', 'map')

    // cria as camadas do mapa
    map.createStaticLayer('Base', tileset);
<<<<<<< HEAD

    // cria quadriculado do mapa
=======
>>>>>>> 4add58c (New changes)
    const graphics = this.add.graphics();
    drawLines(graphics);

    // criação do caminho que os inimigos irão seguir
    path = this.add.path(96, -32);
    path.lineTo(96, 164);
    path.lineTo(480, 164);
    path.lineTo(480, 480);
    path.lineTo(96,480);
    path.lineTo(96,740);
    path.lineTo(545,740);
    path.lineTo(545,900);

<<<<<<< HEAD
    //inimigos
    enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    enemiesS = this.physics.add.group({ classType: EnemyStronger, runChildUpdate: true });

    //torres
    turrets = this.add.group({ classType: Turret, runChildUpdate: true });
    turretsG = this.add.group({ classType: TurretGunner, runChildUpdate: true });
    turretsS = this.add.group({ classType: TurretSniper, runChildUpdate: true });

    //balas de cada torre
    bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });
    bulletsG = this.physics.add.group({ classType: BulletG, runChildUpdate: true });
    bulletsS = this.physics.add.group({ classType: BulletS, runChildUpdate: true });

    //fisica entre as balas e os inimigos
=======
    //
    //graphics.lineStyle(2, 0xffffff, 1);
    //path.draw(graphics);

    enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    enemiesS = this.physics.add.group({ classType: EnemyStronger, runChildUpdate: true });
    
    turrets = this.add.group({ classType: Turret, runChildUpdate: true });
    turretsG = this.add.group({ classType: TurretGunner, runChildUpdate: true });
    turretsS = this.add.group({ classType: TurretSniper, runChildUpdate: true });
    
    bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

>>>>>>> 4add58c (New changes)
    this.physics.add.overlap(enemies, bullets, damageEnemy);
    this.physics.add.overlap(enemies, bulletsG, damageEnemy);
    this.physics.add.overlap(enemies, bulletsS, damageEnemy);

    //permite a colocação da torre
    this.input.on('pointerdown', placeTurret);
<<<<<<< HEAD

    //começa o game
    inicio = document.querySelector("#iniciar");
    inicio.addEventListener("click", () =>{

        if (start!==0){
            this.nextEnemy = 0;
            resetaGame();
            start = 0;
        }

    
    }) 
    //inicia o game 
=======
    
    //inicia o game
    inicio = document.querySelector("#iniciar"); 
    inicio.addEventListener("click", () =>{

        this.scene.start();
        this.nextEnemy = 0;
    
    })  
    
>>>>>>> 4add58c (New changes)
}

//funcao responsavel por aplicar dano das balas ao inimigo
function damageEnemy(enemy, bullet) {  
    if (enemy.active === true && bullet.active === true) {
        bullet.setActive(false);
        bullet.setVisible(false);    
        
        enemy.receiveDamage(bullet.damage);
    }
}

//funcao que desenha a linhas do grafico quadriculado
function drawLines(graphics) {
    graphics.lineStyle(1, 0x0000ff, 0.8);
    for(var i = 0; i < 14; i++) {
        graphics.moveTo(0, i * 64);
        graphics.lineTo(640, i * 64);
    }
    for(var j = 0; j < 10; j++) {
        graphics.moveTo(j * 64, 0);
        graphics.lineTo(j * 64, 896);
    }
    graphics.strokePath();
}

//################################################################################################################
//Atualização contínua do game

function update(time, delta) {  
<<<<<<< HEAD

    //Verifica se o player ganhou e acaba o game
    if(inimigos_derrotados===150){
        this.scene.stop();
        ganhou();
    }
    //Verifica se o player perdeu todas as vidas e reinicia o game
    if (vidajogador===0){
        this.scene.restart();
        resetaGame();
    }

    //faz spawnar os inimigos
    if(start===0){
        //quando o proximo inimigo aparece
        if (time > this.nextEnemy)
=======
    //quando o proximo inimigo aparece
    if (vidajogador===0){
        this.scene.restart();
        this.scene.stop();
        resetaGame();
    }
    if (time > this.nextEnemy)
>>>>>>> 4add58c (New changes)
    {
        if(inimigos_derrotados< 90){
            enemy = enemies.get();
        } else {
            enemy = enemiesS.get()
        }      
        if (enemy)
        {
            enemy.setActive(true);
            enemy.setVisible(true);
            enemy.startOnPath();

            this.nextEnemy = time + 2000;
        }
    }
<<<<<<< HEAD
    }

    //mostra em qual hora o player está e passa novos parametros pro calculo do dano
    if (inimigos_derrotados >= 30 && inimigos_derrotados < 60){
        document.getElementById("horda").innerHTML = "Horda 2";
        horda = 1;
    } else if (inimigos_derrotados >= 60 && inimigos_derrotados < 90) {
        document.getElementById("horda").innerHTML = "Horda 3";
        horda = 2;
    } else if (inimigos_derrotados >= 90 && inimigos_derrotados < 120) {
        document.getElementById("horda").innerHTML = "Horda 4";
        horda = 3;
    } else if (inimigos_derrotados >= 120 && inimigos_derrotados < 150) {
        document.getElementById("horda").innerHTML = "Horda 5";
        horda = 4;
=======
    if (inimigos_derrotados >= 20 && inimigos_derrotados < 40){
        document.getElementById("horda").innerHTML = "Horda 2";
    } else if (inimigos_derrotados >= 40 && inimigos_derrotados < 60) {
        document.getElementById("horda").innerHTML = "Horda 3";
    } else if (inimigos_derrotados >= 60 && inimigos_derrotados < 80) {
        document.getElementById("horda").innerHTML = "Horda 4";
    } else if (inimigos_derrotados >= 80 && inimigos_derrotados < 100) {
        document.getElementById("horda").innerHTML = "Horda 5";
>>>>>>> 4add58c (New changes)
    }

}

//################################################################################################################
//Outras funções relativas ao funcionamento do game

//verifica se é possivel adicionar torre na posição
function canPlaceTurret(i, j) {
    return map[i][j] === 2;
}

//coloca a turret no local do mapa
function placeTurret(pointer) {
    var i = Math.floor(pointer.y/64);
    var j = Math.floor(pointer.x/64);
    if(canPlaceTurret(i, j)) {
        if (credito>=turretpreco){
        if (tipodeturret ===0) {
            turret = turrets.get();
        }
        if (tipodeturret ===1){
            turret = turretsG.get();
        }
        if (tipodeturret ===2){
            turret = turretsS.get();
        }
        if (turret){
                turret.setActive(true);
                turret.setVisible(true);
                turret.place(i, j);
                atualizeCredito();
            }
        }
    }
}

//adiciona bala a torre para ser atirada no inimigo
function addBullet(x, y, angle, tbullets) {
    var bullet = tbullets.get();
    if (bullet)
    {
        bullet.fire(x, y, angle);
    }
}

<<<<<<< HEAD
//################################################################################################################
//Funções relativas a mudanças no html

//seleciona torre "Turret"
=======
//funcoes relativas ao html

>>>>>>> 4add58c (New changes)
botaot = document.getElementById("botaot");
botaot.addEventListener("click", () => {
    tipodeturret = 0;
    turretpreco = 10;
    document.getElementById("turretimg").src = "assets/towerDefense_tile203.png";
<<<<<<< HEAD
    document.getElementById("preco").innerHTML = "Preço: 10";
    document.getElementById("dano").innerHTML = "Dano: 20-50/s"
})

//seleciona torre "Turret Gunner"
botaotg = document.getElementById("botaotg");
botaotg.addEventListener("click", () => {
    tipodeturret = 1;
    turretpreco = 20;
    document.getElementById("turretimg").src = "assets/towerDefense_tile250.png";
    document.getElementById("preco").innerHTML = "Preço: 30";
    document.getElementById("dano").innerHTML = "Dano: 40-100/s"
})

//seleciona torre "Turret Sniper"
botaots = document.getElementById("botaots");
botaots.addEventListener("click", () => {
    tipodeturret = 2;
    turretpreco = 80;
    document.getElementById("turretimg").src = "assets/towerDefense_tile249.png";
    document.getElementById("preco").innerHTML = "Preço: 80";
    document.getElementById("dano").innerHTML = "Dano: 2000/5s"
})

//atualiza o crédito do player (referente a compra de turret)
=======
})

botaotg = document.getElementById("botaotg");
botaotg.addEventListener("click", () => {
    tipodeturret = 1;
    turretpreco = 10;
    document.getElementById("turretimg").src = "assets/towerDefense_tile250.png";
})

botaots = document.getElementById("botaots");
botaots.addEventListener("click", () => {
    tipodeturret = 2;
    turretpreco = 10;
    document.getElementById("turretimg").src = "assets/towerDefense_tile249.png";
})

>>>>>>> 4add58c (New changes)
function atualizeCredito() {
    credito -= turretpreco;
    element = document.getElementById("credito");
    element.innerHTML = `${credito}`;
}

<<<<<<< HEAD
//atualiza crédito do player (referente a quando o inimigo morre)
=======
>>>>>>> 4add58c (New changes)
function putCredito() {
    credito += 2;
    element = document.getElementById("credito");
    element.innerHTML = `${credito}`;
}

<<<<<<< HEAD
//atualiza vida do jogador de acordo com o dano recebido
=======
>>>>>>> 4add58c (New changes)
function atualizeVida() {
    vidajogador--;
    document.getElementById("vida").innerHTML = vidajogador;
}

<<<<<<< HEAD
//reinicia stats e visual do html
function resetaGame(){
    start = 1;
    vidajogador=5;
    credito=25;
    inimigos_derrotados=0;
    document.getElementById("credito").innerHTML = `${credito}`;
    document.getElementById("vida").innerHTML = vidajogador;
}

//mostra que o player venceu o game
function ganhou(){
    document.getElementById("content").innerHTML = '<p style="font-size: 50px;">Parabéns você ganhou</p>';
}
=======
function resetaGame(){
    vidajogador=3;
    credito=25;
    document.getElementById("credito").innerHTML = `${credito}`;;
    document.getElementById("vida").innerHTML = vidajogador;
}
>>>>>>> 4add58c (New changes)
