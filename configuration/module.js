import MiniCssExtractPlugin from 'mini-css-extract-plugin';

export default {
  unknownContextCritical: false,
  rules: [
    {
      test: /\.(scss|css)$/,
      use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
    },
    {
      test: /\.(png|gif|jpg|jpeg|svg|xml|json)$/,
      use: ['url-loader']
    },
    {
      test: /\.(js|jsx)$/,
      exclude: /node_modules/,
      use: ['babel-loader']
    },
    {
      test: /\.(ts|tsx)$/,
      loader: 'ts-loader',
      exclude: /node_modules/
    }
  ]
};
