const path = require("path");

module.exports = {
    entry: {
        index: path.resolve(__dirname, 'js/index/index.tsx'),
    },
    resolve: {
        extensions: ['.ts', '.js', '.tsx']
    },
    module: {
        rules: [
            {
                test: /(\.ts|\.tsx$)/,
                use: 'ts-loader',
                include: [path.resolve(__dirname, 'js')],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ]
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/dist',
        filename: '[name].bundle.js',
    },
    devServer: {
        static: './dist',
        hot: true,
        host: "127.0.0.1",
        port: 3000,
        proxy: {
            "**": "http://127.0.0.1:8080",
        }
    },
}