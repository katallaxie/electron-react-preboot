import * as Path from "path";

export const root = Path.join.bind(Path, Path.resolve(__dirname, ".."));

export const setupTests = global.requestAnimationFrame = (cb) => {
    setTimeout(cb, 0)
} 