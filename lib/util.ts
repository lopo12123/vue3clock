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