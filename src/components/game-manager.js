AFRAME.registerComponent('game-manager', {
    schema: {
    },

    init: function () {
        this.scoreEls = document.querySelectorAll('.score');
        this.lifeEls = document.querySelectorAll('.life');
        this.navmeshStage = document.querySelector('#nav-mesh-stage')
        this.lifeMax = 10
        this.life = 10
        this.score = 0
        this.duckDead = 0
        this.duckDeadForBoss = 30
        this.gameEnded = false
        this.handl_theme1 = () => this.playTheme1()
        this.handl_shoot = () => this.player_shooted()

        this.el.addEventListener('sound-loaded', (evt) => {
            if (evt.detail.id == "stage1") {
                document.body.addEventListener('mousedown', this.handl_theme1);
            }
        });
        this.el.addEventListener('enemy-reached-player', () => {
            this.lifeDown()
        });
        this.el.addEventListener('weapon-hit-player', () => {
            this.lifeDown()
        });
        this.el.addEventListener('die', () => {
            this.duckDied()
        });
        this.el.addEventListener('shoot', this.handl_shoot);

    },

    update: function () {
    },

    remove: function () {
    },

    tick: function (time, timeDelta) {
        if(this.gameEnded) this.totalTime = time
    },

    playerDead: function() {
        this.el.emit('player-dead-sound')
        // document.getElementById('end-panel').setAttribute('visible', true)
        location.reload();
    },

    player_shooted: function() {
        this.score -= 10
        this.updateScoreEl()
    },

    endGame: function() {
        window.location.href = "/index.html"
    },

    bossStageAppear: function() {
        window.location.href = "/index.html"
    },

    duckDied: function() {
        this.duckDead += 1
        this.score += 50
        if(this.duckDead == this.duckDeadForBoss)
            this.bossStageAppear()
        this.updateScoreEl()
    },

    updateScoreEl: function() {
        this.scoreEls.forEach(elem => {
            elem.setAttribute('text', {
                value: this.score
            })
        })
    },

    lifeDown: function() {
        this.life -= 1
        if(this.life <= 0) {
            this.playerDead()
        } else this.el.emit('player-hit-sound')
        this.lifeEls.forEach(elem => {
            elem.setAttribute('scale', `1 ${this.life/this.lifeMax} 1`)
        })
    },

    activateTeleporter: function() {
        let cursor = document.getElementById('cursor')
        let leftHand = document.getElementById('left-hand')
        if (this.el.sceneEl.is('vr-mode')) {
            leftHand.setAttribute('raycaster', {
                showLine: true,
                lineOpacity: 1,
                enabled: true
            })
        } else {
            cursor.setAttribute('raycaster', {
                enabled: true
            })
        }
    },

    switchNavMesh: function() {
        this.navmeshStage.removeAttribute('nav-mesh');
        this.navmeshStage.setAttribute('nav-mesh-disable', '');
    },

    playTheme1: function() {
        // I need to do this to workaround a bug in case it appears
        this.el.components.sound__stage1.pauseSound()
        this.el.components.sound__stage1.playSound()
        document.body.removeEventListener('mousedown', this.handl_theme1);
    }
});
