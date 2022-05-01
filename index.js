const Discord = require("discord.js-selfbot");
const { MessageEmbed } = require("discord.js-selfbot");
const config = require("./config.js");
const lurkr = new Discord.Client();

lurkr.on("ready", () => {
  console.log("Lurkr is ready!");
});

lurkr.on(
  "messageDelete",
  /**
   * @param {import("discord.js").Message} msg
   */
  async (msg) => {
    if (msg.author.bot) return;
    if (msg.channel.type === "dm") return;
    if (!config.susList.includes(msg.guild.id)) return;
    const whLog = await lurkr.fetchWebhook(
      config.loggingWebhook.id,
      config.loggingWebhook.token
    );
    const whClone = await lurkr.fetchWebhook(
      config.cloningWebhook.id,
      config.cloningWebhook.token
    );
    const nick = msg.member.nickname || msg.author.username;
    const avatar = msg.author.displayAvatarURL();
    const attachments = msg.attachments.map((a) => {
      return {
        name: a.name,
        attachment: a.url,
      };
    });
    const data = new MessageEmbed()
      .setColor("#1d242e")
      .setAuthor(`${msg.author.tag}`, avatar)
      .addField("Message", msg.content)
      .addField("Edits Cache", msg.edits.map((e) => e.content).join("\n"))
      .addField("Channel", msg.channel.name + " (" + msg.channel.id + ")")
      .addField("Server", msg.guild.name + " (" + msg.guild.id + ")")
      .addField("Creation Time", msg.createdAt)
      .addField(
        "Attachments",
        msg.attachments.map((a) => `${a.name} - ${a.url}`).join("\n") || "None"
      )
      .setTimestamp();

    whLog.send({
      username: "DELETED",
      embeds: [data],
    });
    whClone.send({
      username: nick,
      avatarURL: avatar,
      files: attachments,
      content: msg.content,
    });
  }
);

lurkr.on(
  "messageDeleteBulk",
  /**
   * @param {import("discord.js").Message[]} msgs
   */
  async (msgs) => {
    const whLog = await lurkr.fetchWebhook(
      config.loggingWebhook.id,
      config.loggingWebhook.token
    );
    const whClone = await lurkr.fetchWebhook(
      config.cloningWebhook.id,
      config.cloningWebhook.token
    );
    msgs.forEach((msg) => {
      if (msg.channel.type === "dm") return;
      if (!config.susList.includes(msg.guild.id)) return;
      const nick = msg.member.nickname || msg.author.username;
      const avatar = msg.author.displayAvatarURL();
      const attachments = msg.attachments.map((a) => {
        return {
          name: a.name,
          attachment: a.url,
        };
      });
      const data = new MessageEmbed()
        .setColor("#1d242e")
        .setAuthor(`${msg.author.tag}`, avatar)
        .addField("Message", msg.content)
        .addField("Edits Cache", msg.edits.map((e) => e.content).join("\n"))
        .addField("Channel", msg.channel.name + " (" + msg.channel.id + ")")
        .addField("Server", msg.guild.name + " (" + msg.guild.id + ")")
        .addField("Creation Time", msg.createdAt)
        .addField(
          "Attachments",
          msg.attachments.map((a) => `${a.name} - ${a.url}`).join("\n") ||
            "None"
        )
        .setTimestamp();
      whLog.send({
        username: "DELETED",
        embeds: [data],
      });
      whClone.send({
        username: nick,
        avatarURL: avatar,
        files: attachments,
        content: msg.content,
      });
    });
  }
);

lurkr.on(
  "messageUpdate",
  /**
   * @param {import("discord.js").Message} oldMsg
   * @param {import("discord.js").Message} newMsg
   */
  async (oldMsg, newMsg) => {
    if (oldMsg.author.bot) return;
    if (oldMsg.channel.type === "dm") return;
    if (!config.susList.includes(oldMsg.guild.id)) return;
    if (oldMsg.content === newMsg.content) return;
    const whEdits = await lurkr.fetchWebhook(
      config.editsWebhook.id,
      config.editsWebhook.token
    );
    const nick = oldMsg.member.nickname || oldMsg.author.username;
    const avatar = oldMsg.author.displayAvatarURL();
    const data = new MessageEmbed()
      .setColor("#1d242e")
      .setAuthor(`${oldMsg.author.tag}`, avatar)
      .addField("Old Message", oldMsg.content)
      .addField("New Message", newMsg.content)
      .addField("Channel", oldMsg.channel.name + " (" + oldMsg.channel.id + ")")
      .addField("Server", oldMsg.guild.name + " (" + oldMsg.guild.id + ")")
      .addField("Creation Time", oldMsg.createdAt)
      .setFooter(`Edited by ${nick}`)
      .setTimestamp();
    whEdits.send({
      username: "EDITED",
      embeds: [data],
    });
  }
);

lurkr.login(config.token);
