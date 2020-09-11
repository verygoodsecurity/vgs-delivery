## Install 

```npm i vgs-delivery```

## Usage

```
import deliver from 'vgs-delivery'

const props = {
    keeperUrl: '...url...',
    analyticsData: { key: 'value' },
    imgUrls: ['...img_url...', '...another_img_url...'],
}

const deliverAnalytics = () => deliver(props)
```

## Available props
required props:
- keeperUrl - keeper endpoint
- analyticsData - keeper data to send
- imgUrls - array of images with queryParams as data to track (e.g. https://www.images.com/img?id=1&trackerId=2 )

optional props:
- requestTimeout - the number of milliseconds before the request times out
- repeatInterval - the number of milliseconds before other set of requests started
- repeat - the number to repeat requests
