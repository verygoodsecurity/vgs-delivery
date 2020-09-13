export const waitImage = (img: HTMLImageElement, url: string) => new Promise((resolve, reject) => {
  const urlInstance = new URL(url);
  const cacheFree = Math.random() * 1000000000;
  urlInstance.searchParams.set('cacheFree', `${cacheFree}`);
  img.onerror = () => {
    reject(`${url} request failed`);
  };
  img.onload = () => {
    resolve(url);
  };

  img.src = urlInstance.href;
});
