const determineTime = (seconds: number) => {
  let postedSince = new Date(Date.now() / 1000 - seconds);
  // let minutes = postedSince / 60;
  // minutes = Math.floor(minutes);

  return postedSince;
};

export default determineTime;
