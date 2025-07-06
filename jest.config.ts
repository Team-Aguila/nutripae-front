export default {
  preset: "ts-jest",
  testEnvironment: "jsdom", // Cambiado de "node" a "jsdom" para pruebas de React
  transform: {
    "^.+\\.tsx?$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
  // Removido passWithNoTests: true para fomentar la creación de pruebas
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"], // Agregado para inicializar testing-library
};