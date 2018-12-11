const path = require('path');

module.exports = {
    entry: './Framework/src/EshineFramework.ts',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'framework.js'
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            }
        ]
    }
}