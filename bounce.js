
const GROUND_LEVEL = 100
const BOX_SIZE = 100
const BOX_BORDER = 10

class Box {

  constructor(p, size) {
    this.p = p
    this.size = size
    this.r = 0
    this.v = new Vector(0,0)
  }

  tick() {
    if (this.v.norm() < 10) {
      if (this.v.y < 0) {
        this.v.y = -this.v.y
      }
    }
    this.prevv = this.v
    this.p = this.p.movedby(this.v.scaled(0.1))
    if (this.p.y > this.max_y()) {
      this.p.y = this.max_y()
      this.v = new Vector(0,0)
    } else {
      this.v = this.v.scaled(this.v.y < 0 ? 0.9 : 1.1)
    }
  }

  draw(ctx) {
    let adjustedSize = this.size - BOX_BORDER
    drawPoint(ctx, this.p, { radius: 5, filled: true })
    drawRect(ctx, this.p.movedby(new Vector(-adjustedSize/2, -adjustedSize/2)), { size: adjustedSize, width: BOX_BORDER, filled: false })
  }

  max_y() {
    return window.innerHeight-GROUND_LEVEL-BOX_SIZE/2
  }

}

function bounce() {

  let box = new Box(new Point(window.innerWidth/2, window.innerHeight-GROUND_LEVEL-BOX_SIZE/2), BOX_SIZE)

  return {

    onmousemove: function(e) {
    },

    onmouseup: function(e) {
      box.v = new Vector(box.p, new Point(e.clientX, e.clientY))
      console.log(box.v)
    },

    controls: [

    ],

    draw: function(ctx, time) {

      ctx.lineWidth = 2
      ctx.strokeStyle = 'grey'
      ctx.beginPath()
      ctx.moveTo(0, window.innerHeight-GROUND_LEVEL)
      ctx.lineTo(window.innerWidth, window.innerHeight-GROUND_LEVEL)
      ctx.stroke()
      
      box.draw(ctx)
      box.tick()

    }

  }

}
