import qs from 'query-string';

export const waitImage = (img: HTMLImageElement, url: string) =>
  new Promise((resolve, reject) => {
    const body = document.getElementsByTagName('body')[0];
    const cacheFree = Math.random() * 1000000000;
    const parsedUrl = url.split('?');
    const cacheQueryString = qs.stringify({ cacheFree });
    let urlInstance = url.slice();
    urlInstance +=
      parsedUrl && parsedUrl[1] ? `&${cacheQueryString}` : cacheQueryString;
    // urlInstance.searchParams.set('cacheFree', `${cacheFree}`);
    img.onerror = () => {
      reject(`${url} request failed`);
    };
    img.onload = () => {
      resolve(url);
    };

    img.src = urlInstance;
    body.appendChild(img);
  });
