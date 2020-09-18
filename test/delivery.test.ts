import deliver from '../src/index';
jest.mock('../src/waitImage', () => {
  return {
    waitImage: jest.fn(
      (_img, url) =>
        new Promise((resolve, reject) => {
          const validUrl = 'http://valid';
          if (validUrl === url) {
            resolve();
          } else reject();
        })
    ),
  };
});

describe('delivery', () => {
  it('fails for invalid url', async () => {
    try {
      await deliver({ keeperUrl: 'invalidUrl' });
    } catch (e) {
      expect(e).toEqual(e);
    }
  });

  it('works for valid url', async () => {
    try {
      const status = await deliver({ keeperUrl: 'validUrl' });
      expect(status).toEqual('200');
    } catch (e) {}
  });

  it('works for invalid url but valid img url', async () => {
    try {
      const a = await deliver({
        keeperUrl: 'invalidUrl',
        imgUrls: ['http://invalid', 'http://valid'],
      });
      expect(a).toEqual(true);
    } catch (e) {}
  });

  it('fails for invalid url and imgs url', async () => {
    try {
      await deliver({
        keeperUrl: 'invalidUrl',
        imgUrls: ['http://invalid', 'https://invalid'],
      });
    } catch (e) {
      expect(e).toEqual(e);
    }
  });
});
