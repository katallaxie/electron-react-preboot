import path from 'path';

export const root = path.join.bind(path, path.resolve(__dirname, '..'));
