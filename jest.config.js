const config = {
    preset: "ts-jest",
    testEnvironment: "node",
    verbose: true,
    roots: [
        "<rootDir>/test"
    ],
    testMatch: [
        "**/?(*.)+(test.ts)"
    ],
    transform: {
        "^.+\\.(ts)$": "ts-jest"
    },
};

module.exports = config;