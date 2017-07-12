import * as Path from "path";

export const root = Path.join.bind(Path, Path.resolve(__dirname, ".."));
