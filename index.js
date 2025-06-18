// index.js

const express = require("express");
const app = express();
const port = 3001;

app.get("/", (req, res) => {
  res.send("Bot ist online!");
});

app.listen(port, () => {
  console.log(`Webserver läuft auf Port ${port}`);
});

const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionsBitField,
  Collection,
  Events,
  EmbedBuilder,
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.commands = new Collection();

client.once("ready", async () => {
  console.log(`✅ Eingeloggt als ${client.user.tag}`);

  // Slash-Commands definieren
  const commands = [
    new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Zeigt Pong!"),

    
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log("📨 Registriere Slash-Commands...");
    console.time("Slash-Commands Registrierung");
    await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
    console.timeEnd("Slash-Commands Registrierung");

    console.log("✅ Slash-Commands registriert!");
  } catch (error) {
    console.error(`❌ Fehler beim Registrieren der Slash-Commands:`, error);
  }
});



client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const { commandName } = interaction;

  if (commandName === "ping") {
    await interaction.deferReply();
    await interaction.editReply("Pong!");
  }

  
});


client.login(process.env.DISCORD_TOKEN);
