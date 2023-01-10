
const PERF_HISTORY_SIZE = 50

let drawingDisabled = false
let activeScene = null
let perfHistory = []
let hitTest = null
let startTime = 0

function rand(min, max) {
  return (Math.random() * (max - min) + min)
}

function draw() {

  // init
  const canvas = document.getElementById('canvas')
  if (canvas.getContext == null) return
  const ctx = canvas.getContext('2d', { alpha: false })

  // disable
  ctx.disabled = drawingDisabled

  // start
  const frameStart = performance.now()

  // clear
  ctx.fillStyle = 'rgb(0,0,0)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // time
  let time = performance.now() - startTime

  // specific draw
  activeScene.draw(ctx, time)

  // calc fps
  let frameEnd = performance.now()
  let frameDuration = frameEnd - frameStart
  
  // add to history
  perfHistory.push(frameDuration)
  if (perfHistory.length > PERF_HISTORY_SIZE) {
    perfHistory.shift()
  }

  // calc average duration
  let totalDuration = perfHistory.reduce((acc, h) => acc + h, 0)
  let avgDuration = (totalDuration / perfHistory.length).toFixed(drawingDisabled ? 1 : 0)

  // write fps
  drawText(ctx, `Frame: ${avgDuration} ms`, 10, window.innerHeight - 20)

  // iterate
  requestAnimationFrame(draw)

}

function change_scene(scene) {

  // switch
  window.localStorage.scene = scene
  startTime = performance.now()
  activeScene = eval(`${scene}()`)

  // add controls
  let controls = document.getElementById('controls')
  document.querySelectorAll('#controls .scene').forEach((el) => el.remove())
  if (activeScene.controls) {
    for (let control of activeScene.controls) {

      let widget = null
      if (control.type == 'button') {
        widget = document.createElement('button')
        widget.innerHTML = control.label
        widget.onclick = control.callback
      } else if (control.type == 'checkbox') {
        widget = document.createElement('input')
        widget.type = 'checkbox'
        widget.checked = control.value
        widget.onchange = (e) => control.callback(e.target.checked)
      } else if (control.type == 'select') {
        widget = document.createElement('select')
        widget.onchange = (e) => control.callback(e.target.value)
        for (let key in control.options) {
          let opt = document.createElement('option')
          opt.value = key
          opt.innerHTML = control.options[key]
          opt.selected = (key == control.selected)
          widget.appendChild(opt)
        }
      }

      if (widget != null) {
        let div = document.createElement('div')
        div.classList.add('scene')
        let label = document.createElement('label')
        label.innerHTML = control.label
        div.appendChild(label)
        div.appendChild(widget)
        controls.appendChild(div)
      }

    }
  }

}

document.addEventListener('DOMContentLoaded', () => {

  // configure our canvas
  const canvas = document.getElementById('canvas')
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight

  // drag stuff
  canvas.onmousedown = (e) => {
    activeScene.onmousedown?.(e)
    let objects = activeScene.objects
    if (objects == null) return
    if (typeof objects == 'function') objects = objects()
    for (let object of objects) {
      if (object.hittest?.(new Point(e.clientX, e.clientY), e)) {
        hitTest = object
        break
      }
    }
  }
  canvas.onmousemove = (e) => {
    activeScene.onmousemove?.(e)
    hitTest?.set?.(new Point(e.clientX, e.clientY))
  }
  canvas.onmouseup = (e) => {
    activeScene.onmouseup?.(e)
    hitTest?.click?.(e)
    hitTest = null
  }

  // quiet
  let quiet_check = document.querySelector('[name=quiet]')
  quiet_check.checked = drawingDisabled
  quiet_check.onchange = (_) => drawingDisabled = quiet_check.checked
  
  // scene
  let scene_select = document.querySelector('[name=scene]')
  scene_select.onchange = (_) => change_scene(scene_select.value)

  // select default scene
  if (window.localStorage.scene != null) {
    //scene_select.value = window.localStorage.scene
  }
  change_scene(scene_select.value)
  
  // now draw
  draw()

})
