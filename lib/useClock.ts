import { minmax, shallowMerge } from "./util";

/**
 * @description 样式配置项
 * @see DefaultConfig
 */
export interface ClockConfig {
    /**
     * @description 表盘半径 (px)
     * @default 75
     */
    dialRadius: number
    /**
     * @description 表盘颜色 (HEX, #RRGGBB or #RRGGBBAA)
     * @default #777777
     */
    dialStroke: string
    /**
     * @description 表盘粗细 (px)
     * @default 2
     */
    dialStrokeWidth: number
    /**
     * @description 数字是否显示
     * @default true
     */
    numberShow: boolean
    /**
     * @description 数字类型
     * @default 'Arab'
     */
    numberText: 'Arab' | 'Roma'
    /**
     * @description 数字 描边 / 填充
     * @default 'stroke'
     */
    numberStyle: 'stroke' | 'fill'
    /**
     * @description 数字颜色 (HEX, #RRGGBB or #RRGGBBAA)
     * @default #333333
     */
    numberColor: string
    /**
     * @description 时针长度占半径比例 [0, 1]
     * @default 0.5
     */
    hourPercent: number
    /**
     * @description 时针反向长度 (px)
     * @deprecated 未实现
     * @default 3
     */
    hourTail: number
    /**
     * @description 时针颜色 (HEX, #RRGGBB or #RRGGBBAA)
     * @default #555555
     */
    hourStroke: string
    /**
     * @description 时针粗细 (px)
     * @default 4
     */
    hourStrokeWidth: number
    /**
     * @description 分针长度占半径比例 [0, 1]
     * @default 0.6
     */
    minutePercent: number
    /**
     * @description 分针反向长度 (px)
     * @default 4
     */
    minuteTail: number
    /**
     * @description 分针颜色 (HEX, #RRGGBB or #RRGGBBAA)
     * @default #444444
     */
    minuteStroke: string
    /**
     * @description 分针粗细 (px)
     * @default 3
     */
    minuteStrokeWidth: number
    /**
     * @description 秒针长度占半径比例 [0, 1]
     * @default 0.7
     */
    secondPercent: number
    /**
     * @description 秒针反向长度 (px)
     * @default 5
     */
    secondTail: number
    /**
     * @description 秒针颜色 (HEX, #RRGGBB or #RRGGBBAA)
     * @default #555555
     */
    secondStroke: string
    /**
     * @description 秒针粗细 (px)
     * @default 2
     */
    secondStrokeWidth: number
}

/**
 * @description 样式配置项 默认值
 */
export const DefaultConfig: ClockConfig = {
    dialRadius: 75,
    dialStroke: '#777777',
    dialStrokeWidth: 2,
    hourPercent: 0.5,
    hourTail: 3,
    hourStroke: '#555555',
    hourStrokeWidth: 4,
    minutePercent: 0.6,
    minuteTail: 4,
    minuteStroke: '#444444',
    minuteStrokeWidth: 3,
    secondPercent: 0.7,
    secondTail: 5,
    secondStroke: '#555555',
    secondStrokeWidth: 2,
    numberShow: true,
    numberText: 'Arab',
    numberStyle: 'stroke',
    numberColor: '#333333',
}

/**
 * @description 文字标签
 */
const ClockNumber = {
    Arab: [ '12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11' ],
    Roma: [ 'XII', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI' ]
}

/**
 * @description controller
 */
class UseClock {
    #dialCvs: HTMLCanvasElement
    #pointerCvs: HTMLCanvasElement
    readonly #config: ClockConfig
    #timerId: any

    private static setStroke(
        ctx: CanvasRenderingContext2D,
        stroke: string | CanvasGradient | CanvasPattern,
        strokeWidth: number): CanvasRenderingContext2D {
        ctx.lineCap = 'round'
        ctx.strokeStyle = stroke
        ctx.lineWidth = strokeWidth
        return ctx
    }

    private static setFill(
        ctx: CanvasRenderingContext2D,
        fill: string | CanvasGradient | CanvasPattern
    ) {
        ctx.fillStyle = fill
        return ctx
    }

    private static getHMS() {
        const _date = new Date()
        const h = _date.getHours() % 12
        const m = _date.getMinutes()
        const s = _date.getSeconds()
        return { h, m, s }
    }

    constructor(
        dialCanvas: HTMLCanvasElement,
        pointerCanvas: HTMLCanvasElement,
        clockConfig?: Partial<ClockConfig>) {
        this.#dialCvs = dialCanvas
        this.#pointerCvs = pointerCanvas
        this.#config = clockConfig ? shallowMerge(clockConfig, DefaultConfig) : DefaultConfig
    }

    renderDial(): UseClock {
        const ctx = this.#dialCvs.getContext('2d')!
        const { dialRadius, dialStroke, dialStrokeWidth } = this.#config ?? DefaultConfig

        // 表盘外圈
        ctx.beginPath()
        ctx.arc(dialRadius, dialRadius, dialRadius - dialStrokeWidth, 0, Math.PI * 2)
        UseClock.setStroke(ctx, dialStroke, dialStrokeWidth)
            .stroke()
        ctx.closePath()

        // 数字
        const { numberShow, numberText, numberStyle, numberColor } = this.#config
        if(numberShow) {
            const fontSize = minmax(0.16 * dialRadius, 12, 24)
            const fontRadius = dialRadius - fontSize
            ctx.beginPath()
            ctx.font = `${ fontSize }px san-serif`
            ctx.textAlign = 'center'
            if(numberStyle === 'stroke') {
                UseClock.setStroke(ctx, numberColor, 0.5)
                ClockNumber[numberText].forEach((txt, idx) => {
                    const _x = dialRadius + parseFloat((fontRadius * Math.sin(Math.PI / 6 * idx)).toFixed(2))
                    const _y = dialRadius + fontSize / 2 + parseFloat((fontRadius * -Math.cos(Math.PI / 6 * idx)).toFixed(2))
                    ctx.strokeText(txt, _x, _y, fontSize)
                })
            }
            else {
                UseClock.setFill(ctx, numberColor)
                ClockNumber[numberText].forEach((txt, idx) => {
                    const _x = dialRadius + parseFloat((fontRadius * Math.sin(Math.PI / 6 * idx)).toFixed(2))
                    const _y = dialRadius + fontSize / 2 + parseFloat((fontRadius * -Math.cos(Math.PI / 6 * idx)).toFixed(2))
                    ctx.fillText(txt, _x, _y, fontSize)
                })
            }
            ctx.closePath()
        }

        return this
    }

    private clearCanvas(ctx: CanvasRenderingContext2D) {
        const radius = this.#config.dialRadius
        ctx.clearRect(0, 0, 2 * radius, 2 * radius)
        return this
    }

    private renderHour(ctx: CanvasRenderingContext2D, inHour: number) {
        const radius = this.#config.dialRadius
        const { hourPercent, hourStroke, hourStrokeWidth } = this.#config

        const len = radius * hourPercent
        const _x = radius + parseFloat((len * Math.sin(Math.PI / 6 * inHour)).toFixed(2))
        const _y = radius + parseFloat((len * -Math.cos(Math.PI / 6 * inHour)).toFixed(2))

        ctx.beginPath()
        ctx.moveTo(radius, radius)
        ctx.lineTo(_x, _y)
        UseClock.setStroke(ctx, hourStroke, hourStrokeWidth)
            .stroke()
        ctx.closePath()

        return this
    }

    private renderMin(ctx: CanvasRenderingContext2D, inMin: number) {
        const radius = this.#config.dialRadius
        const { minutePercent, minuteStroke, minuteStrokeWidth } = this.#config

        const len = radius * minutePercent
        const _x = radius + parseFloat((len * Math.sin(Math.PI / 30 * inMin)).toFixed(2))
        const _y = radius + parseFloat((len * -Math.cos(Math.PI / 30 * inMin)).toFixed(2))

        ctx.beginPath()
        ctx.moveTo(radius, radius)
        ctx.lineTo(_x, _y)
        UseClock.setStroke(ctx, minuteStroke, minuteStrokeWidth)
            .stroke()
        ctx.closePath()

        return this
    }

    private renderSec(ctx: CanvasRenderingContext2D, inSec: number) {
        const radius = this.#config.dialRadius
        const { secondPercent, secondStroke, secondStrokeWidth } = this.#config

        const len = radius * secondPercent
        const _x = radius + parseFloat((len * Math.sin(Math.PI / 30 * inSec)).toFixed(2))
        const _y = radius + parseFloat((len * -Math.cos(Math.PI / 30 * inSec)).toFixed(2))

        ctx.beginPath()
        ctx.moveTo(radius, radius)
        ctx.lineTo(_x, _y)
        UseClock.setStroke(ctx, secondStroke, secondStrokeWidth)
            .stroke()
        ctx.closePath()

        return this
    }

    private renderHMS() {
        const ctx = this.#pointerCvs.getContext('2d')!
        const { h, m, s } = UseClock.getHMS()

        const inHour = h + m / 60 + s / 3600
        const inMin = m + s / 60

        this.clearCanvas(ctx)
            .renderHour(ctx, inHour)
            .renderMin(ctx, inMin)
            .renderSec(ctx, s)
    }

    renderPointer() {
        this.renderHMS()
        this.#timerId = setInterval(() => {
            this.renderHMS()
        }, 1000)
    }

    stopTick() {
        clearInterval(this.#timerId)
    }
}

export {
    UseClock
}