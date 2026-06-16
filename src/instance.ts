import {
	CardGenerator,
	HostCapabilities,
	SurfaceDrawProps,
	SurfaceContext,
	SurfaceInstance,
	parseColor,
	ModuleLogger,
	createModuleLogger,
} from '@companion-surface/base'
import { LoupedeckBufferFormat, LoupedeckDevice, LoupedeckDisplayId, RGBColor } from '@loupedeck/node'

interface DisplayFaderValue {
	color: RGBColor
	value: number
}

interface StripSegmentControl {
	display: LoupedeckDisplayId
	index: number
}

const STRIP_WIDTH = 60
const STRIP_HEIGHT = 270
const STRIP_SEGMENT_HEIGHT = STRIP_HEIGHT / 3

export class LoupedeckWrapper implements SurfaceInstance {
	readonly #logger: ModuleLogger
	readonly #deck: LoupedeckDevice
	readonly #surfaceId: string
	// readonly #context: SurfaceContext
	readonly #useTouchStrips: boolean

	#invertFaderValues = false
	#displayFaderValues = {
		[LoupedeckDisplayId.Left]: { color: { red: 0, green: 0, blue: 0 }, value: 0 } satisfies DisplayFaderValue,
		[LoupedeckDisplayId.Right]: { color: { red: 0, green: 0, blue: 0 }, value: 0 } satisfies DisplayFaderValue,
	}

	public get surfaceId(): string {
		return this.#surfaceId
	}
	public get productName(): string {
		return this.#deck.modelName
	}

	#parseStripSegmentControlId(controlId: string): StripSegmentControl | undefined {
		const match = /^strip-(left|right)-([0-2])$/.exec(controlId)
		if (!match) return undefined

		return {
			display: match[1] === 'left' ? LoupedeckDisplayId.Left : LoupedeckDisplayId.Right,
			index: Number(match[2]),
		}
	}

	#getStripSegmentControlIdFromTouch(touch: any): string | undefined {
		if (!this.#useTouchStrips) return undefined

		const side =
			touch.target.screen === LoupedeckDisplayId.Left
				? 'left'
				: touch.target.screen === LoupedeckDisplayId.Right
					? 'right'
					: undefined

		if (!side) return undefined

		const y = Math.max(0, Math.min(STRIP_HEIGHT - 1, touch.y ?? 0))
		const index = Math.max(0, Math.min(2, Math.floor((y / STRIP_HEIGHT) * 3)))

		return `strip-${side}-${index}`
	}

	public constructor(surfaceId: string, deck: LoupedeckDevice, context: SurfaceContext, useTouchStrips: boolean) {
		this.#logger = createModuleLogger(`Instance/${surfaceId}`)

		this.#deck = deck
		this.#surfaceId = surfaceId
		// this.#context = context
		this.#useTouchStrips = useTouchStrips

		this.#deck.on('error', (e) => context.disconnect(e))

		this.#deck.on('down', (control) => {
			context.keyDownById(control.id)
		})
		this.#deck.on('up', (control) => {
			context.keyUpById(control.id)
		})
		this.#deck.on('rotate', (control, delta) => {
			if (delta < 0) {
				context.rotateLeftById(control.id)
			} else if (delta > 0) {
				context.rotateRightById(control.id)
			}
		})
		this.#deck.on('touchstart', (data) => {
			for (const touch of data.changedTouches) {
				const stripControlId = this.#getStripSegmentControlIdFromTouch(touch)
				if (stripControlId) {
					context.keyDownById(stripControlId)
				} else if (touch.target.control !== undefined && touch.target.screen === LoupedeckDisplayId.Center) {
					context.keyDownById(touch.target.control.id)
				} else if (touch.target.screen == LoupedeckDisplayId.Wheel) {
					const wheelControl = this.#deck.controls.find((c) => c.type === 'wheel')
					if (wheelControl) context.keyDownById(wheelControl.id)
				}
			}
		})
		this.#deck.on('touchend', (data) => {
			for (const touch of data.changedTouches) {
				const stripControlId = this.#getStripSegmentControlIdFromTouch(touch)
				if (stripControlId) {
					context.keyUpById(stripControlId)
				} else if (touch.target.control !== undefined && touch.target.screen === LoupedeckDisplayId.Center) {
					context.keyUpById(touch.target.control.id)
				} else if (touch.target.screen == LoupedeckDisplayId.Wheel) {
					const wheelControl = this.#deck.controls.find((c) => c.type === 'wheel')
					if (wheelControl) context.keyUpById(wheelControl.id)
				}
			}
		})

		// Side touch strips are handled as six split bitmap controls:
		// strip-left-0..2 and strip-right-0..2.
	}

	async init(): Promise<void> {
		// Start with blanking it
		await this.blank()
	}
	async close(): Promise<void> {
		await this.#deck.blankDevice(true, true).catch(() => null)

		await this.#deck.close()
	}

	async updateConfig(config: Record<string, any>): Promise<void> {
		this.#invertFaderValues = !!config.invertFaderValues
	}

	updateCapabilities(_capabilities: HostCapabilities): void {
		// Not used
	}

	async ready(): Promise<void> {}

	async setBrightness(percent: number): Promise<void> {
		await this.#deck.setBrightness(percent / 100)
	}
	async blank(): Promise<void> {
		await this.#deck.blankDevice(true, true)
	}
	async draw(_signal: AbortSignal, drawProps: SurfaceDrawProps): Promise<void> {
		const stripSegment = this.#parseStripSegmentControlId(drawProps.controlId)
		if (stripSegment) {
			if (drawProps.image) {
				await this.#deck.drawBuffer(
					stripSegment.display,
					drawProps.image,
					LoupedeckBufferFormat.RGB,
					STRIP_WIDTH,
					STRIP_SEGMENT_HEIGHT,
					0,
					stripSegment.index * STRIP_SEGMENT_HEIGHT,
				)
			} else {
				const color = parseColor(drawProps.color)
				await this.#deck.drawSolidColour(
					stripSegment.display,
					{ red: color.r, green: color.g, blue: color.b },
					STRIP_WIDTH,
					STRIP_SEGMENT_HEIGHT,
					0,
					stripSegment.index * STRIP_SEGMENT_HEIGHT,
				)
			}
			return
		}

		const control = this.#deck.controls.find((c) => c.id === drawProps.controlId)
		if (!control) return

		if (control.type === 'button') {
			if (control.feedbackType === 'rgb') {
				const color = parseColor(drawProps.color)

				await this.#deck.setButtonColor({
					id: drawProps.controlId,
					red: color.r,
					green: color.g,
					blue: color.b,
				})
			} else if (control.feedbackType === 'lcd') {
				if (drawProps.image) {
					await this.#deck.drawKeyBuffer(drawProps.controlId, drawProps.image, LoupedeckBufferFormat.RGB)
				} else {
					throw new Error(`Cannot draw for Loupedeck without image`)
				}
			}
		} else if (control.type === 'wheel') {
			if (!this.#deck.displayWheel) return

			const width = this.#deck.displayWheel.width
			const height = this.#deck.displayWheel.height

			if (drawProps.image) {
				await this.#deck.drawBuffer(
					LoupedeckDisplayId.Wheel,
					drawProps.image,
					LoupedeckBufferFormat.RGB,
					width,
					height,
					0,
					0,
				)
			} else {
				throw new Error(`Cannot draw for Loupedeck without image`)
			}
		} else if (control.type === 'lcd-segment') {
			const color = parseColor(drawProps.color)

			const controlId = control.id
			switch (control.id) {
				case 'left':
					this.#displayFaderValues[LoupedeckDisplayId.Left].color = { red: color.r, green: color.g, blue: color.b }
					await this.#drawFaderValue(LoupedeckDisplayId.Left, this.#displayFaderValues[LoupedeckDisplayId.Left])
					break
				case 'right':
					this.#displayFaderValues[LoupedeckDisplayId.Right].color = { red: color.r, green: color.g, blue: color.b }
					await this.#drawFaderValue(LoupedeckDisplayId.Right, this.#displayFaderValues[LoupedeckDisplayId.Right])
					break
				default:
					this.#logger.warn(`Unknown lcd-segment control id: ${controlId}`)
					return
			}
		}
	}
	async showStatus(signal: AbortSignal, cardGenerator: CardGenerator): Promise<void> {
		const width = this.#deck.displayMain.width
		const height = this.#deck.displayMain.height

		const buffer = await cardGenerator.generateBasicCard(width, height, 'rgb')

		if (signal.aborted) return

		await this.#deck.drawBuffer(LoupedeckDisplayId.Center, buffer, LoupedeckBufferFormat.RGB, width, height, 0, 0)
	}

	async #drawFaderValue(display: LoupedeckDisplayId, values: DisplayFaderValue): Promise<void> {
		if (!this.#useTouchStrips) return

		// TODO - this could be fetched from the device probably?
		const width = 60
		const height = 270
		const pad = 7

		try {
			const splitY = values.value + pad
			if (this.#invertFaderValues) {
				// Draw from bottom → up
				await this.#deck.drawSolidColour(display, { red: 0, green: 0, blue: 0 }, width, splitY, 0, 0)
				await this.#deck.drawSolidColour(display, values.color, width, height - splitY, 0, splitY)
			} else {
				// Draw from top → down
				await this.#deck.drawSolidColour(display, { red: 0, green: 0, blue: 0 }, width, height - splitY, 0, splitY)
				await this.#deck.drawSolidColour(display, values.color, width, splitY, 0, 0)
			}
		} catch (e) {
			this.#logger.error('Drawing fader value ' + values.value + ' to loupedeck failed: ' + e)
		}
	}
}
