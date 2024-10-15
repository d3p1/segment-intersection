/**
 * @description App
 * @author      C. M. de Picciotto <d3p1@d3p1.dev> (https://d3p1.dev/)
 */
export default class App {
  /**
   * @type {{x: number, y: number, label: string}[][]}
   */
  segments

  /**
   * @type {HTMLCanvasElement}
   */
  canvas

  /**
   * @type {CanvasRenderingContext2D}
   */
  context

  /**
   * @type {{x: number, y: number}}
   */
  mouse

  /**
   * @type {{x: number, y: number, label: string}[]}
   */
  #mouseSegment = [
    {
      x: 0,
      y: 0,
      label: 'MouseA',
    },
    {
      x: 10,
      y: 10,
      label: 'MouseB',
    },
  ]

  /**
   * @type {number}
   */
  #mouseSegmentRadius = 50

  /**
   * Constructor
   *
   * @param {{x: number, y: number, label: string}[][]} segments
   */
  constructor(segments) {
    this.segments = [...segments, this.#mouseSegment]

    this.#initCanvas()
    this.#initMouse()
  }

  /**
   * Run
   *
   * @params  {number} t
   * @returns {void}
   */
  run(t = 0) {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height)

    this.#updateMouseSegment(t * 0.001)
    this.#drawSegments()

    requestAnimationFrame(this.run.bind(this))
  }

  /**
   * Update mouse segment
   *
   * @param angle
   */
  #updateMouseSegment(angle) {
    const x = Math.cos(angle) * this.#mouseSegmentRadius
    const y = Math.sin(angle) * this.#mouseSegmentRadius
    this.#mouseSegment[0].x = this.mouse.x + x
    this.#mouseSegment[0].y = this.mouse.y + y
    this.#mouseSegment[1].x = this.mouse.x - x
    this.#mouseSegment[1].y = this.mouse.y - y
  }

  /**
   * Draw segments
   *
   * @returns {void}
   */
  #drawSegments() {
    this.segments.forEach((segment) => {
      this.#drawSegment(segment)
      this.#drawPoint(segment[0])
      this.#drawPoint(segment[1])
    })
  }

  /**
   * Draw segment
   *
   * @param   {{x: number, y: number, label: string}[]} segment
   * @returns {void}
   */
  #drawSegment(segment) {
    this.context.beginPath()
    this.context.strokeStyle = 'hsl(0,0%,0%)'
    this.context.moveTo(segment[0].x, segment[0].y)
    this.context.lineTo(segment[1].x, segment[1].y)
    this.context.stroke()
  }

  /**
   * Draw point
   *
   * @param   {{x: number, y: number, label: string}} point
   * @returns {void}
   */
  #drawPoint(point) {
    this.context.beginPath()

    this.context.fillStyle = 'hsl(0,0%,100%)'
    this.context.strokeStyle = 'hsl(0,0%,0%)'
    this.context.arc(point.x, point.y, 20, 0, 2 * Math.PI)
    this.context.fill()
    this.context.stroke()

    this.context.fillStyle = 'hsl(0,0%,0%)'
    this.context.textAlign = 'center'
    this.context.textBaseline = 'middle'
    this.context.font = 'Arial 14px'
    this.context.fillText(point.label, point.x, point.y)
  }

  /**
   * Init mouse
   *
   * @returns {void}
   */
  #initMouse() {
    this.mouse = {}
    this.mouse.x = 0
    this.mouse.y = 0

    this.canvas.addEventListener('mousemove', (event) => {
      this.mouse.x = event.offsetX
      this.mouse.y = event.offsetY
    })
  }

  /**
   * Init canvas
   *
   * @returns {void}
   */
  #initCanvas() {
    this.canvas = document.createElement('canvas')
    this.context = this.canvas.getContext('2d')

    this.#resizeCanvas()
    window.addEventListener('resize', this.#resizeCanvas.bind(this))
    document.body.appendChild(this.canvas)
  }

  /**
   * Resize canvas
   *
   * @returns {void}
   */
  #resizeCanvas() {
    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight
  }
}
