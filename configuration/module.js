import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  rules: [
    {
      test: /\.(scss|css)$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
    },
    {
      test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
      use: ['url-loader']
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['babel-loader'],

    }]
}
