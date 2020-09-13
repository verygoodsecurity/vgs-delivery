const VALID_URL = 'validURL';

export default (url: string) => new Promise((resolve, reject) => {
  if (VALID_URL === url) {
    resolve('200')
  } else {
    reject()
  }
})

