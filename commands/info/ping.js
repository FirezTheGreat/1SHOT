module.exports = {
      config: {
          name: "ping",
          category: "info",
          usage: " ",
          description: "Returns latency and API ping",
      },
      run: async (client, message, args) => {
          const msg = await message.channel.send(`🏓 Pinging....`);
          msg.edit(`🏓 Pong!\nLatency is ${Math.floor(msg.createdTimestap - message.createdTimestap)}ms\nAPI Latency is ${Math.round(client.ping)}ms`);
      }
  }
