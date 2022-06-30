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
var path;
var turrets;
var enemies;
var credito = 25;
var inimigos_derrotados = 0;
var tipodeturret=0;
var turretpreco=10;
var vidajogador=3;

var ENEMY_SPEED = 1/10000;

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
}

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
            this.hp = 100;
            //pega x e y do ponto t
            path.getPoint(this.follower.t, this.follower.vec);
              //coloca o x e y do inimigo no momento anterior
            this.setPosition(this.follower.vec.x, this.follower.vec.y);            
        },
        receiveDamage: function(damage) {
            this.hp -= damage;           
            
            // if hp drops below 0 we deactivate this enemy
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
        Phaser.GameObjects.Image.call(this, scene, 0, 0, 'sprites', 'enemy');

        this.follower = { t: 0, vec: new Phaser.Math.Vector2() };
        this.hp = 0;
    },

    startOnPath: function ()
    {
        //inicia o caminho
        this.follower.t = 0;
        this.hp = 100;
        //pega x e y do ponto t
        path.getPoint(this.follower.t, this.follower.vec);
          //coloca o x e y do inimigo no momento anterior
        this.setPosition(this.follower.vec.x, this.follower.vec.y);            
    },
    receiveDamage: function(damage) {
        this.hp -= damage;           
        
        // if hp drops below 0 we deactivate this enemy
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
                addBullet(this.x, this.y, angle);
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
            addBullet(this.x, this.y, angle);
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
            addBullet(this.x, this.y, angle);
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
 
function create() {
    // cria o tilemap
	const map = this.make.tilemap({ key: 'tilemap' })

	// adiciona o a imagem do tileset
	const tileset = map.addTilesetImage('towerDefense_tilesheet', 'map')

    // cria as camadas do mapa
    map.createStaticLayer('Base', tileset);
    const graphics = this.add.graphics();
    drawLines(graphics);
    path = this.add.path(96, -32);
    path.lineTo(96, 164);
    path.lineTo(480, 164);
    path.lineTo(480, 480);
    path.lineTo(96,480);
    path.lineTo(96,740);
    path.lineTo(545,740);
    path.lineTo(545,900);

    //
    //graphics.lineStyle(2, 0xffffff, 1);
    //path.draw(graphics);

    enemies = this.physics.add.group({ classType: Enemy, runChildUpdate: true });
    enemiesS = this.physics.add.group({ classType: EnemyStronger, runChildUpdate: true });
    
    turrets = this.add.group({ classType: Turret, runChildUpdate: true });
    turretsG = this.add.group({ classType: TurretGunner, runChildUpdate: true });
    turretsS = this.add.group({ classType: TurretSniper, runChildUpdate: true });
    
    bullets = this.physics.add.group({ classType: Bullet, runChildUpdate: true });

    this.physics.add.overlap(enemies, bullets, damageEnemy);
    
    this.input.on('pointerdown', placeTurret);
    
    //inicia o game
    inicio = document.querySelector("#iniciar"); 
    inicio.addEventListener("click", () =>{

        this.scene.start();
        this.nextEnemy = 0;
    
    })  
    
}

function damageEnemy(enemy, bullet) {  
    if (enemy.active === true && bullet.active === true) {
        bullet.setActive(false);
        bullet.setVisible(false);    
        
        enemy.receiveDamage(BULLET_DAMAGE);
    }
}

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

function update(time, delta) {  
    //quando o proximo inimigo aparece
    if (vidajogador===0){
        this.scene.restart();
        this.scene.stop();
        resetaGame();
    }
    if (time > this.nextEnemy)
    {
        var enemy = enemies.get();
        if (enemy)
        {
            enemy.setActive(true);
            enemy.setVisible(true);
            enemy.startOnPath();

            this.nextEnemy = time + 2000;
        }
    }
    if (inimigos_derrotados >= 20 && inimigos_derrotados < 40){
        document.getElementById("horda").innerHTML = "Horda 2";
    } else if (inimigos_derrotados >= 40 && inimigos_derrotados < 60) {
        document.getElementById("horda").innerHTML = "Horda 3";
    } else if (inimigos_derrotados >= 60 && inimigos_derrotados < 80) {
        document.getElementById("horda").innerHTML = "Horda 4";
    } else if (inimigos_derrotados >= 80 && inimigos_derrotados < 100) {
        document.getElementById("horda").innerHTML = "Horda 5";
    }

}

function canPlaceTurret(i, j) {
    return map[i][j] === 2;
}

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

function addBullet(x, y, angle) {
    var bullet = bullets.get();
    if (bullet)
    {
        bullet.fire(x, y, angle);
    }
}

//funcoes relativas ao html

botaot = document.getElementById("botaot");
botaot.addEventListener("click", () => {
    tipodeturret = 0;
    turretpreco = 10;
    document.getElementById("turretimg").src = "assets/towerDefense_tile203.png";
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

function atualizeCredito() {
    credito -= turretpreco;
    element = document.getElementById("credito");
    element.innerHTML = `${credito}`;
}

function putCredito() {
    credito += 2;
    element = document.getElementById("credito");
    element.innerHTML = `${credito}`;
}

function atualizeVida() {
    vidajogador--;
    document.getElementById("vida").innerHTML = vidajogador;
}

function resetaGame(){
    vidajogador=3;
    credito=25;
    document.getElementById("credito").innerHTML = `${credito}`;;
    document.getElementById("vida").innerHTML = vidajogador;
}
