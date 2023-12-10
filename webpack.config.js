module.exports = {
  // ... other configurations

  module: {
    rules: [
      // JavaScript and JSX files rule
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react']
          }
        }
      },

      // CSS files rule
      {
        test: /\.css$/, 
        use: ['style-loader', 'css-loader']
      },

      // Image files rule
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/resource'
      }
    ]
  }

  // ... other configurations
};
