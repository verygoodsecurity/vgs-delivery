import deliver from "../src";

describe('delivery', () => {
  it('works for valid url', () => {
    expect(deliver({})).resolves.not.toThrow();
  });
});
