onmessage = (e) => {
  const workerData = e.data;

  switch (workerData.status) {
    case 'init':
      // eslint-disable-next-line no-console
      console.log('INIT');
      break;

    case 'stop':
      // eslint-disable-next-line no-console
      console.log('STOP');
      break;

    default:
      break;
  }
};
