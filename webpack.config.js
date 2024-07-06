import path from 'path';
import webpack from 'webpack';
import { fileURLToPath } from "url";
const __dirname = path.dirname(fileURLToPath(
    import.meta.url));


export default {
    entry: './frontend-js/search.js',
    output: {
        filename: 'search-bundled.js',
        path: path.resolve(__dirname, './public/js')
    },
    mode: 'development',
    devtool: 'source-map',
    module: {
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }]
    }
}