const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: '6rhm2t',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
