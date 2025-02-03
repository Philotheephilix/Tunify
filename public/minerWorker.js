importScripts("https://esm.run/@marco_ciaramella/cpu-web-miner"); 

let isMining = false;

self.onmessage = (event) => {
  const { type, stratum } = event.data;

  if (type === "start" && !isMining) {
    isMining = true;
    cpuWebMiner.start(
      cpuWebMiner.ghostrider,
      stratum,
      null,
      cpuWebMiner.ALL_THREADS,
      (work) => self.postMessage({ type: "work", data: work }),
      (hashrate) => self.postMessage({ type: "hashrate", data: hashrate }),
      (error) => self.postMessage({ type: "error", data: error })
    );
  } else if (type === "stop" && isMining) {
    isMining = false;
    cpuWebMiner.stop();
    self.postMessage({ type: "stopped" });
  }
};
