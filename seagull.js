
const PADDING = 100
const SEAGULL_SIZE = 10
const FLIGHT_DURATION = 3000
const STABLE_FLIGHT = 0.5

let flockSize = 50
let drawControlPoints = false

function smooth_spline(p1, p4, duration, initialV1) {
  let v = new Vector(p1, p4).scaled(0.1)
  v.add(new Vector(rand(1.5,2.5)*v.norm(), -v.norm()/rand(8,12)))
  let v1 = initialV1 || v.clone()
  let v4 = v.clone().scaled(-1)
  let p2 = p1.movedby(v1)
  let p3 = p4.movedby(v4)
  return new Spline(p1, p2, p3, p4, duration)
}

function random_target(current) {

  let target = null
  while (true) {
    let side = Math.floor(rand(1, 4.999))
    let min_x = PADDING
    let max_x = window.innerWidth - min_x
    let min_y = min_x
    let max_y = window.innerHeight - min_y
    let x = side == 1 ? min_x : side == 3 ? max_x : rand(min_x, max_x)
    let y = side == 2 ? min_y : side == 4 ? max_y : rand(min_y, max_y)
    target = new Point(x, y)
    if (current == null || new Vector(current, target).norm() > 600) {
      return target
    }
  }

}

function randomize_point(p, amplitude) {
  amplitude = amplitude || 50
  return p.movedby(new Vector(rand(-amplitude, amplitude), rand(-amplitude, amplitude)))
}

class Seagull {

  constructor(p, destination, hue) {
    this.p = p
    this.hue = hue
    this.prevp = null
    this.size = rand(SEAGULL_SIZE*.5, SEAGULL_SIZE*1.5)
    this.update(destination)
  }

  flight_position() {
    return this.spline?.localTime()
  }

  at_destination() {
    return this.spline == null || this.spline.ended()
  }

  tick() {
    if (this.spline != null) {
      let newp = this.spline.position()
      if (this.p.is(newp) == false) {
        this.prevp = this.p
        this.p = newp
        this.v = new Vector(this.prevp, this.p)
      }

    }
  }

  update(target) {
    let v = null
    let v0 = new Vector(this.p, target)
    let duration = v0.norm()*3
    if (this.spline) {
      let v1 = new Vector(this.spline.p3, this.spline.p4)
      if (this.v) {
        v = this.v.normalized().scaled(v1.norm()*2)
       } else {
        v = v1
       }
    }
    this.spline = smooth_spline(this.p, target, rand(duration*.9, duration*1.1), v)
    this.v = this.v || new Vector(this.spline.p1, this.spline.p2)
  }

  draw(ctx, drawControlPoints) {

    if (drawControlPoints) {
      this.spline?.draw(ctx, 'white')
    }
    
    let color = `hsl(${this.hue}, 70%, 50%)`

    // set
    ctx.fillStyle = color
    ctx.save()

    // now draw line
    ctx.beginPath()
    ctx.translate(this.p.x, this.p.y)
    ctx.rotate(this.v.angle())
    ctx.moveTo(0, this.size)
    ctx.lineTo(this.size*2, 0)
    ctx.lineTo(0, -this.size)
    ctx.fill()

    // done
    ctx.restore()    
  
  }

}

function seagull() {

  let seagulls = []
  let initial = random_target()
  let target = random_target(initial)
  for (let i=0; i<flockSize; i++) {
    let s = new Seagull(randomize_point(initial), randomize_point(target), rand(0, 360))
    seagulls.push(s)
  }

  return {

    onmousemove: function(e) {

      if (seagulls[0].flight_position() > STABLE_FLIGHT) {
        target = new Point(e.clientX, e.clientY)
        for (let s of seagulls) {
          s.update(randomize_point(target))
        }
      }

    },

    controls: [
      {
        type: 'select',
        label: 'Flock size',
        options: {
          '1': 1,
          '25': 25,
          '50': 50,
          '100': 100
        },
        selected: flockSize,
        callback: (c) => {
          if (seagulls.length > c) {
            seagulls = seagulls.slice(0, c)
          } else {
            for (let i=seagulls.length; i<c; i++) {
              let p = new Point(rand(0, window.innerWidth), rand(0, window.innerHeight))
              let s = new Seagull(p, randomize_point(target), rand(0, 360))
              seagulls.push(s)
            }
          }
        }
      },
      {
        type: 'checkbox',
        label: 'Draw control points',
        value: drawControlPoints,
        callback: (v) => drawControlPoints = v
      }
    ],

    draw: function(ctx, time) {
      
      for (let s of seagulls) {
        s.draw(ctx, drawControlPoints)
        s.tick()
      }

      if (seagulls.find((s) => s.at_destination())) {
        target = random_target(target)
        for (let s of seagulls) {
          s.update(randomize_point(target))
        }
      }
    }

  }

}
