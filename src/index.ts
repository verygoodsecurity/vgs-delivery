import axios from 'axios';
import { v4 } from 'uuid'

const img = document.createElement('img');
img.width = 2;
img.height = 2;
img.style.display = 'none';
img.style.position = 'absolute';
img.style.opacity = '0';

interface postToSourceProps {
  url: string;
  analyticsData: object;
  requestTimeout: number;
}

interface DeliverProps {
  keeperUrl: string;
  imgUrls: string[];
  analyticsData?: object;
  requestTimeout?: number;
  repeatInterval?: number;
  repeat?: number;
}

const postToSource = ({ url, analyticsData, requestTimeout }: postToSourceProps) => axios(url, {
  method: 'post',
  timeout: requestTimeout,
  // @ts-ignore
  body: JSON.stringify(analyticsData),
})
  .then(() => {
    return url;
  })
  .catch(e => {
    console.error(`${url} timeout exceeded`, e);
  });

const waitImage = (url: string) => new Promise((resolve, reject) => {
  const urlInstance = new URL(url);
  const cacheFree = v4();
  urlInstance.searchParams.set('cacheFree', cacheFree);
  img.onerror = () => {
    reject(`${url} request failed`);
  };
  img.onload = () => {
    resolve(url);
  };

  img.src = urlInstance.href;
});

export default async function deliver({ analyticsData = {}, keeperUrl, imgUrls, requestTimeout = 10000, repeat = 3, repeatInterval = 60000 }: DeliverProps) {
  try {
    let analyticsSent;
    let interval: NodeJS.Timeout;
    let currentStep = repeat;

    const run = async () => {
      currentStep--;

      analyticsSent = await postToSource({ url: keeperUrl, analyticsData, requestTimeout });

      if (!analyticsSent) {
        for (const url of imgUrls) {
          try {
            analyticsSent = await waitImage(url);
          } catch (e) {
            console.error(e);
          }

          if (analyticsSent) {
            break;
          }
        }
      }

      if (analyticsSent) {
        clearInterval(interval);
        console.info(`analytics request for ${analyticsSent} was successful`);
      }

      if (currentStep <= 0) {
        console.error(`all methods failed ${repeat} times`);
        clearInterval(interval);
      }
    };

    await run();
    if (!analyticsSent) {
      interval = setInterval(run, repeatInterval);
    }

  } catch (e) {
    console.error(e);
  }
}

