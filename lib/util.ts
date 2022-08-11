import { ClockConfig } from "./useClock";

export const minmax = (value: number, min: number, max: number, fixed: number = 0) => {
    return parseFloat(Math.min(max, Math.max(min, value)).toFixed(fixed))
}

export const shallowMerge = <T extends { [k: string]: any }>(optionalValue: Partial<T>, defaultValue: Readonly<T>): T => {
    const copy = { ...defaultValue } as T
    for (let k in optionalValue) {
        copy[k] = optionalValue[k]!
    }
    return copy
}

const KeysOfValueInNumber: string[] = [
    'dialRadius', 'dialStrokeWidth',
    'hourPercent', 'hourTail', 'hourStrokeWidth',
    'minutePercent', 'minuteTail', 'minuteStrokeWidth',
    'secondPercent', 'secondTail', 'secondStrokeWidth'
]
export const fixStringToNumber = (ori: { [k: string]: any }): Partial<ClockConfig> => {
    KeysOfValueInNumber.forEach(key => {
        if(ori[key] !== undefined) ori[key] = parseFloat(ori[key] + '')
    })
    return ori as ClockConfig
}