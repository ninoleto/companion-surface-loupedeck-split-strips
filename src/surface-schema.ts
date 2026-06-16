import { assertNever, type SurfaceSchemaLayoutDefinition } from '@companion-surface/base'
import type { LoupedeckDevice } from '@loupedeck/node'

export function createSurfaceSchema(device: LoupedeckDevice): SurfaceSchemaLayoutDefinition {
	const surfaceLayout: SurfaceSchemaLayoutDefinition = {
		stylePresets: {
			default: {
				bitmap: {
					w: device.lcdKeySize,
					h: device.lcdKeySize,
					format: 'rgb',
				},
			},
			button: {
				colors: 'hex',
			},
			empty: {},
			strip: {
				bitmap: {
					w: 60,
					h: 90,
					format: 'rgb',
				},
			},
		},
		controls: {},
	}

	for (const control of device.controls) {
		const { row, column } = control

		switch (control.type) {
			case 'button':
				surfaceLayout.controls[control.id] = {
					row,
					column,
					stylePreset: control.feedbackType === 'rgb' ? 'button' : 'default',
				}
				break
			case 'encoder':
				surfaceLayout.controls[control.id] = { row, column, stylePreset: 'empty' }
				break
			case 'wheel':
				if (device.displayWheel) {
					surfaceLayout.stylePresets.wheel = {
						bitmap: {
							w: device.displayWheel.width,
							h: device.displayWheel.height,
							format: 'rgb',
						},
					}
					surfaceLayout.controls[control.id] = { row, column, stylePreset: 'wheel' }
				}
				break
			case 'lcd-segment':
				if (control.id === 'left' || control.id === 'right') {
					for (let i = 0; i < 3; i++) {
						surfaceLayout.controls[`strip-${control.id}-${i}`] = {
							row: i,
							column,
							stylePreset: 'strip',
						}
					}
				} else {
					// Fallback for unexpected lcd segment ids
					surfaceLayout.controls[control.id] = {
						row,
						column,
						stylePreset: 'button',
					}
				}
				break
			default:
				assertNever(control)
				break
		}
	}

	return surfaceLayout
}
