
class Spline {

  constructor(p1, p2, p3, p4, duration, start) {
    this.p1 = p1
    this.p2 = p2
    this.p3 = p3
    this.p4 = p4
    this.duration = duration
    this.start = start || performance.now()

    this.v0 = new Vector(p1)
    this.v1 = new Vector(p1).scale(-3).add(new Vector(p2).scale(3))
    this.v2 = new Vector(p1).scale(3).add(new Vector(p2).scale(-6)).add(new Vector(p3).scale(3))
    this.v3 = new Vector(p1).scale(-1).add(new Vector(p2).scale(3)).add(new Vector(p3).scale(-3)).add(new Vector(p4))
  
  }

  lerp(p1, p2, t) {
    return new Point(
      (1-t) * p1.x + t * p2.x,
      (1-t) * p1.y + t * p2.y
    )
  }

  localTime() {
    let now = performance.now()
    let elapsed = now - this.start
    return Math.min(elapsed/this.duration, 1.0)
  }

  ended() {
    return this.localTime() >= 1
  }

  position() {
    return this.position_polynomial()
  }

  position_lerp() {
    let t = this.localTime()
    let p5 = this.lerp(this.p1, this.p2, t)
    let p6 = this.lerp(this.p2, this.p3, t)
    let p7 = this.lerp(this.p3, this.p4, t)
    let p8 = this.lerp(p5, p6, t)
    let p9 = this.lerp(p6, p7, t)
    return this.lerp(p8, p9, t)
  }

  position_polynomial() {
    let t = this.localTime()
    let t2 = t * t
    let t3 = t2 * t
    return this.v0.clone().add(this.v1.scaled(t)).add(this.v2.scaled(t2)).add(this.v3.scaled(t3))
  }

  draw(ctx, color) {
    drawPoint(ctx, this.p1, { color: color, radius: 3, filled: true })
    drawPoint(ctx, this.p2, { color: color, radius: 3 })
    drawPoint(ctx, this.p3, { color: color, radius: 3 })
    drawPoint(ctx, this.p4, { color: color, radius: 3, filled: true })
  }

}
