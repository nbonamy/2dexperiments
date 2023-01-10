
function drawPoint(ctx, p, options) {
  if (ctx.disabled) return
  options = {
    ...{ color: 'white', width: 1, radius: 1, filled: false, },
    ...options
  }
  ctx.fillStyle = options.color
  ctx.strokeStyle = options.color
  ctx.lineWidth = options.width
  ctx.beginPath()
  ctx.arc(p.x, p.y, options.radius, 0, Math.PI*2, true)
  if (options.filled) ctx.fill()
  else ctx.stroke()
}

function joinPoints(ctx, p1, p2, options) {
  if (ctx.disabled) return
  options = {
    ...{ color: 'white', width: 1 },
    ...options
  }
  ctx.strokeStyle = options.color
  ctx.lineWidth = options.width
  ctx.beginPath()
  ctx.moveTo(p1.x, p1.y)
  ctx.lineTo(p2.x, p2.y)
  ctx.stroke()
}

function drawText(ctx, text, x, y, options) {
  options = {
    ...{ color: 'white', font: '12pt sans-serif', },
    ...options
  }
  ctx.font = options.font
  ctx.fillStyle = options.color
  ctx.fillText(text, x, y)
}

function drawRect(ctx, p, options) {
  if (ctx.disabled) return
  options = {
    ...{ color: 'white', size: 3 },
    ...options
  }
  ctx.fillStyle = options.color
  ctx.fillRect(p.x-options.size, p.y-options.size, 2*options.size+1, 2*options.size+1)

}

function objectColor(index, count) {
  let hue = Math.round(360 * index / (count))
  return `hsl(${hue}, 100%, 50%)`
}

function intermediateColor(t, index, count) {
  let hue1 = Math.round(360 * index / (count))
  let hue2 = Math.round(360 * (index+1) / (count))
  let hue = (1-t) * hue1 + t * hue2
  return `hsl(${hue}, 100%, 50%)`
}
