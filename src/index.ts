import axios from 'axios';
import { waitImage } from './waitImage';

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
  debug: boolean;
}

interface DeliverProps {
  keeperUrl?: string;
  imgUrls?: string[];
  analyticsData?: object;
  requestTimeout?: number;
  repeatInterval?: number;
  repeat?: number;
  debug?: boolean;
}

const postToSource = ({
  url,
  analyticsData,
  requestTimeout,
  debug,
}: postToSourceProps) =>
  axios(url, {
    method: 'post',
    timeout: requestTimeout,
    data: analyticsData,
  })
    .then(() => {
      return url;
    })
    .catch(e => {
      if (debug) {
        console.error(`${url} timeout exceeded`, e);
      }
    });

export default async function deliver({
  analyticsData = {},
  keeperUrl = '',
  imgUrls = [],
  requestTimeout = 10000,
  repeat = 3,
  repeatInterval = 60000,
  debug = false,
}: DeliverProps) {
  let analyticsSent: any;
  let interval: NodeJS.Timeout;
  let currentStep = repeat;

  const getImageFromUrls = imgUrls.slice();

  // @ts-ignore
  const sendViaImageUrl = async () => {
    if (!getImageFromUrls.length) {
      return;
    }

    if (analyticsSent) {
      clearInterval(interval);
      if (debug) {
        console.info(`analytics request for ${analyticsSent} was successful`);
      }
      return;
    }

    if (currentStep <= 0) {
      clearInterval(interval);
      if (!analyticsSent) {
        throw new Error(`all methods failed ${repeat} times`);
      }
    }

    const url = getImageFromUrls.shift() || '';

    try {
      analyticsSent = await waitImage(img, url);
    } catch (e) {
      if (debug) {
        console.error(e);
      }
    }

    if (!analyticsSent) {
      return await sendViaImageUrl();
    }
  };

  const run = async () => {
    currentStep--;

    if (keeperUrl) {
      analyticsSent = await postToSource({
        url: keeperUrl,
        analyticsData,
        requestTimeout,
        debug,
      });
    }

    await sendViaImageUrl();
  };

  await run();
  if (!analyticsSent) {
    interval = setInterval(run, repeatInterval);
  }
}
