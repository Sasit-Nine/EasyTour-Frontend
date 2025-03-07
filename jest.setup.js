// jest.setup.js
import '@testing-library/jest-dom';
//globalThis.import = {
  //  meta: {
  //    env: {
  //      VITE_STRAPI_URL: 'http://localhost:1337',
        // Add other environment variables as needed
  //    },
  //  },
  //};
  
  // Alternative approach to handle import.meta directly
  //Object.defineProperty(globalThis, 'import', {
  //  value: {
  //    meta: {
  //      env: {
  //        VITE_STRAPI_URL: 'http://localhost:1337',
          // Add other environment variables as needed
  //      }
  //    }
  //  },
  //  writable: true
  //});