
const CREATION_DELAY = 0
const CREATION_BURST = 25
const MAX_PARTICLES = 5000
const INITIAL_VELOCITY = 2
const VELOCITY_FACTOR = 0.25
const INITIAL_SIZE_MIN = 10
const INITIAL_SIZE_MAX = 30
const SIZE_FACTOR = 0.025
const INITIAL_ALPHA_MIN = 0.7
const INITIAL_ALPHA_MAX = 0.9
const INITIAL_LIGHTNESS = 90
const MINIMAL_LIGHTNESS = 20

const VELOCITY_CHANGE = INITIAL_VELOCITY*VELOCITY_FACTOR
const SIZE_CHANGE = (INITIAL_SIZE_MAX-INITIAL_SIZE_MIN)*SIZE_FACTOR

class Particle {

  constructor(birth, p, hue) {
    this.birth = birth
    this.p = p
    this.hue = hue
    this.init()
  }

  init() {
    this.lightness = INITIAL_LIGHTNESS
    this.alpha = rand(INITIAL_ALPHA_MIN, INITIAL_ALPHA_MAX)
    this.size = rand(INITIAL_SIZE_MIN, INITIAL_SIZE_MAX)
    this.v = new Vector(rand(-INITIAL_VELOCITY, INITIAL_VELOCITY), rand(-INITIAL_VELOCITY, INITIAL_VELOCITY))
  }

  tick(now) {
    this.p = this.p.movedby(this.v)
    this.alpha -= rand(0.005, 0.01)
    this.lightness = Math.max(MINIMAL_LIGHTNESS, INITIAL_LIGHTNESS-(now-this.birth)/5)
    this.size -= rand(0, SIZE_CHANGE)
    this.v.add(new Vector(rand(-VELOCITY_CHANGE, VELOCITY_CHANGE), rand(-VELOCITY_CHANGE, VELOCITY_CHANGE)))
  }

  is_dead() {
    return this.alpha < 0 || this.size < 0
  }

  draw(ctx) {
    let color = `hsla(${this.hue}, 70%, ${this.lightness}%, ${this.alpha})`
    drawPoint(ctx, this.p, {
      color: color,
      radius: this.size,
      filled: true
    })
  }

}

function particles() {

  let particles = []
  let lastCreation = 0

  return {

    onmousemove: function(e) {
      let now = performance.now()
      if (now - lastCreation > CREATION_DELAY) {
        for (let i=0; i<CREATION_BURST; i++) {
          if (particles.length >= MAX_PARTICLES) break
          particles.push(new Particle(now, new Point(e.clientX, e.clientY), rand(0, 360)))
        }
        lastCreation = now
      }
    },

    draw: function(ctx, time) {

      for (let particle of particles) {
        particle.draw(ctx)
        particle.tick(time)
      }

      let survivors = particles.filter((p) => !p.is_dead())
      particles = survivors

      // display stats
      drawText(ctx, `Points: ${survivors.length}`, 10, window.innerHeight - 40)

    }

  }

}
