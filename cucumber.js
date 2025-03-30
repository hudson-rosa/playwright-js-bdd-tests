module.exports = {
    default: {
      require: ["./steps/**/*.js"],  // Ensure the correct path to step definitions
      format: ["progress"],  
      publishQuiet: true,  
      paths: ["./features/**/*.feature"],  // Ensure correct path to feature files
      worldParameters: {}  
    }
  };