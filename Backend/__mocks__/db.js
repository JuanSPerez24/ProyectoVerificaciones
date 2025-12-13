// Mock manual de la base de datos para Jest
const mockFn = () => {
  const fn = (...args) => {
    if (fn.mock && fn.mock.implementation) {
      return fn.mock.implementation(...args);
    }
  };
  fn.mock = { calls: [], implementation: null };
  fn.mockImplementation = (impl) => {
    fn.mock.implementation = impl;
    return fn;
  };
  fn.mockClear = () => {
    fn.mock.calls = [];
    fn.mock.implementation = null;
  };
  return fn;
};

const db = {
  query: mockFn(),
  connect: mockFn(),
  beginTransaction: mockFn(),
  commit: mockFn(),
  rollback: mockFn()
};

export default db;
