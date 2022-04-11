var config = {
    type: Phaser.AUTO,
    parente: 'content',
    width: 640,
    height: 512,
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

var graphics;
var path;
var ENEMY_SPEED = 1/10000;
var BULLET_DAMAGE = 50;

var map = [[ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
           [ 0,-1, 0, 0, 0, 0, 0, 0, 0, 0],
           [ 0,-1,-1,-1,-1,-1,-1,-1, 0, 0],
           [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
           [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
           [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
           [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],
           [ 0, 0, 0, 0, 0, 0, 0,-1, 0, 0],]  

function preload(){
    //carregar assets
    this.load.atlas('sprites', 'assets/spritesheet.png', 'assets/spritesheet.json');
    this.load.image('bullet', 'assets/bullet.png');
}

var Enemy = new Phase.Class({
    Extends: Phaser.GameObjects.Image,

    initialize:
    
    function Enemy(scene){
        Phaser.GameObjects.Image.call(this, scene, 0,0, 'sprites', 'enemy');
        this.follower = {t:0, vec: new Phaser.Math.Vector2()};
    },
    
    startOnPath:function(){
        //inicio do caminho
        this.follower.t = 0;
        this.hp = 100;
        //pegar o x e y do ponto t
        path.getPoint(this.follower.t, this.follower.vec);
        //coloca o x e y do inimigo no momento anterior
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
    },
    
    receiveDamage: function(damage){
        this.hp -= damage;
        if (this.hp <= 0){
            this.setActive(false);
            this.setVisible(false);
        }
    },

    update: function(time, delta){
        //movimenta o inimigo com base na variavel t
        this.follower.t += ENEMY_SPEED*delta;
        //novas coordenadas de x e y
        path.getPoint(this.follower.t, this.follower.vec);
        //update nas posições do inimigo
        this.setPosition(this.follower.vec.x, this.follower.vec.y);
        //se o inimigo chegar ao fim, remover inimigo
        if(this.follower.t >= 1){
            this.setActive(false);
            this.setVisible(false);
        }
    }
});

function getEnemy(x,y,distance){
    var enemyUnits = enemies.getChildren();
    for(var i = 0; i< enemyUnits.length; i++){
        if(enemyUnits[i].active && Phaser.Math.Distance.Between(x,y,enemyUnits[i].x,enemyUnits[i].y) <= distance){
            return enemyUnits[i];
        }
    }
}

var Turret = new Phaser.Class({
    Extends: Phaser.GameObjects.Image,

    initialize:
    function Turret(scene){
        Phaser.GameObjects.Image.call(this,scene,0,0,'sprites','turret');
        this.nextTic = 0;
    }, 
    //posicionar de acordo com a grade
    place: function(i,j){
        this.y = i * 64 + 62/2;
        this.x = j * 64 + 62/2;
        map[i][j] = 1;
    },
    fire: function(){
        var enemy = getEnemy(this.x, this.y, 100);
        if(enemy){
            var angle = Phaser.Math.Angler.Between(this.x,this.y,enemy.x,enemy,y);
            addBullets(this.x,this.y,angle);
            this.angle = (angle+Math.PI/2) * Phaser.Math.RAD_TO_DEG;
        }
    },
    
    update: function(time, delta){
        if(time > this.nextTic) {
            this.nextTic = time * 1000;
        }
    }
});

var Bullet = new Phaser.Class({
    Extends: Phaser.GameObjects,Image,
    initialize:
    function Bullet (scene){
        Phaser.GameObjects.Image.call(this,scene,0,0, 'bullet');
        this.dx = 0;
        this.dy = 0;
        this.lifespan = 0;
        this.speed = Phaser.Math.GetSpeed(600, 1);
    },
    fire: function(x, y, angle){
        this.setActive(true);
        this.setVisible(true);
        this.setPosition(x,y);

        this.dx = Math.cos(angle);
        this.dy = Math.sin(angle);
        this.lifespan = 300;
    },
    update: function (time, delta){
        this.lifespan = delta;
        this.x += this.dx * (this.speed * delta);
        this.y += this.dy * (this.speed * delta);
        if (this.lifespan <= 0){
            this.setActive(false);
            this.setVisible(false);
        }
    }
})



function create(){
    //variação gráfica da linha
    var graphics = this.add.graphics();
    drawGrid(graphics);
    //caminho
    path = this.add.path(96,-32);
    path.lineTo(96, 164);
    path.lineTo(480, 164);
    path.lineTo(480, 544);

    //estilo da linha
    graphics.lineStyle(3, 0xffffff, 1);
    path.draw(graphics);

    //criar inimigos
    enemies = this.physics.add.group({
        classType: Enemy, runChildUpdate: true
    });
    this.nextEnemy = 0;

    turrets = this.add.group({
        classType: Turret, runChildUpdate: true
    });

    bullets = this.physics.add.group({
        classType: Bullet, runChildUpdate: true
    });
    
    this.physics.add.overlap(enemies, bullets, damageEnemy)

    this.input.on('pointerdown', placeTurret);
}

function damageEnemy(enemy, bullet){
    if(enemy.active === true && bullet.active === true){
        bullet.setActive(false);
        bullet.setVisible(false);

        enemy.receiveDamage(BULLET_DAMAGE);
    }
}

function drawGrid(graphics){
    graphics.lineStyle(1, 0x0000ff, 0.0);
    for (var i = 0; i<8; i++){
        graphics.moveTo(0, i * 64);
        graphics.lineTo(640, i * 64);
    }
    for(var j = 0; j<10; j++){
        graphics.moveTo(j * 64, 0);
        graphics.lineTo(j * 64, 512);
    }
    graphics.strokePath();
}

function update(time,delta){
    //quando o proximo inimigo aparece
    if (time> this.nextEnemy){
        var enemy = enemies.get();
        if (enemy){
            enemy.setActive(true);
            setVisible(true);

            //coloca o inimigo no inicio
            enemy.startOnPath();

            this.nextEnemy = time + 2000;
        }
    }
}

function canPlaceTUrret(i,j){
    return map[i][j] === 0;
}

function placeTurret(pointer){
    var i = Math.floor(pointer.y/64);
    var j = Math.floor(pointer.x/64);

    if(canPlaceTUrret(i,j)){
        var turret = turrets.get();
        if(turret){
            turret.setActive(true);
            turret.setVisible(true);
            turret.place(i,j);
        }
    }
}

function addBullets(x,y,angle){
    var bullet = bullet.get();
    if (bullet){
        bullet.fire(x,y,angle);
    }
}