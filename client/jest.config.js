module.exports = {
    moduleNameMapper: {
      '\\.(css|less)$': '<rootDir>/tests/jest/__mocks__/styleMock.js',
    },
    setupFilesAfterEnv: ["./setupTests.js"],
};