var Phaser = require('phaser')
var GameScene = require('./game/game').GameScene
var TitleScene = require('./game/title').TitleScene

const userForm = document.getElementById('user_form')
const scoreinput = document.getElementById('score')
const userURL = `https://cryptic-crag-84668.herokuapp.com/users`

userForm.addEventListener('submit', createUser)

var game = new Phaser.Game({ width: '100%', height: '100%', type: Phaser.AUTO, parent: 'canvas-intro', scene: { preload: preload, create: create } });

function preload() {
  var d = 'file://' + __dirname.replace('\\', '/')
  console.log('dir', d);
  this.load.image('background1', d + '/assets/background/plx-1.png')
  this.load.image('play', d + '/assets/sprites/play.png')
}

function create() {
  this.background1 = this.add.tileSprite(0, 0, this.game.canvas.width, this.game.canvas.height, 'background1')
  this.background1.setOrigin(0,0);

  var bar = this.add.graphics();
  bar.fillStyle(0x000000, 0.2);
  bar.fillRect(0, this.cameras.main.centerY-100, this.game.canvas.width-50, 100);

  var style = { font: "bold 32px Arial", fill: "#fff", boundsAlignH: "center", boundsAlignV: "middle" };

  //  The Text is positioned at 0, 100
  var text = this.add.text(0, 0, "Click to create", style);
  text.setShadow(3, 3, 'rgba(0,0,0,0.5)', 2);

  text.on('pointerdown', function (event) {
    console.log('clicked');
    createUser(event)
  })

  //  We'll set the bounds to be from x0, y100 and be 800px wide by 100px high
  text.setOrigin(0, 0);
  text.setPosition(this.cameras.main.centerX, this.cameras.main.centerY-100);

  let play = this.add.image(400, 400, 'play')
  const scene = this
  play.setScale(4)
  play.setInteractive()
  play.on('pointerdown', ev => {
    /* this.scene.start('GameScene') */
    document.getElementById('canvas-intro').style.display = 'none'
    scene.game.destroy()
    setTimeout(() => createUser(), 300);
  })
  play.on('pointerover', () => play.setTint(0xcccccc))
  play.on('pointerout', () => play.setTint(0xffffff))

}

function fetchData() {
  fetch(userURL)
    .then(res => res.json())
    .then((data) => {
      data.sort(function(a, b) {return b.score - a.score})
      let topTen = data.slice(0, 10)
      topTen.forEach(user => {
        let userscores = `<h3>${user.username} - ${user.score}</h3>`
        document.getElementById('topusers').innerHTML += userscores
      })
    })
}


function addUser(username, score) {
  fetch(userURL, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'username': username,
      'score': score
    })
  })
    .then(res => res.json())
    .then(data => localStorage.setItem('user_id', data.id))
}

function createUser(ev) {
  //ev.preventDefault()
  document.getElementById('form').style.display = "none"
  document.getElementById('users').style.display = ""
  // let username = ev.target[0].value
  // addUser(username, 0)
  fetchData()
  let game = new Phaser.Game(config)
}

let config = {
  type: Phaser.WEBGL,
  width: '100%',
  height: '100%',
  parent: 'canvas',
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: {
        y: 1000
      },
      debug: false
    }
  },
  scene: [
    TitleScene,
    GameScene
  ]
}
