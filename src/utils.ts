export function pathResolve(baseUrl: string, subUrl: string) {
    return baseUrl + subUrl.replace(/^[\.|\/]\/?/, '/')
}

export function getRandNum(max: number) {
    return Math.random() * max | 0
}
