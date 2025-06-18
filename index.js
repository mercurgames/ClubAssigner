// index.js

const express = require("express");
const app = express();
const port = 3002;

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

const guildId = "1373365525530280076";

client.once("ready", async () => {
  console.log(`✅ Eingeloggt als ${client.user.tag}`);

  // Slash-Commands definieren
  const commands = [
    new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Zeigt Pong!"),

    new SlashCommandBuilder()
      .setName("assign")
      .setDescription("Gib den Code ein, um mit deinem Club zu chatten!")
      .addStringOption(option =>
        option
          .setName("code")
          .setDescription("Der Beitrittscode hat jemand im Club versendet")
          .setRequired(true)
      ),
    
  ].map(cmd => cmd.toJSON());

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

  try {
    console.log("📨 Registriere Slash-Commands...");
    console.time("Slash-Commands Registrierung");
    await rest.put(Routes.applicationGuildCommands(client.user.id, guildId), { body: commands });
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

  if (commandName === "assign") {
    await interaction.deferReply({ ephemeral: true });
    const code = interaction.options.getString("code");
        if (code === "kjcfhbgk") {
            const roleId = "1384608471772696676"; // ID der Rolle, die vergeben werden soll
            const role = interaction.guild.roles.cache.get(roleId);
            const member = interaction.member;

            if (!role) {
                return interaction.editReply("❌ Die Rolle wurde nicht gefunden.");
            }

            // Rolle dem Nutzer hinzufügen
            await member.roles.add(role);
            await interaction.editReply(`✅ Du hast erfolgreich die Rolle **${role.name}** erhalten und bist im Club **${role.name}**!`);
        } else {
            await interaction.editReply("❌ Ungültiger Code. Bitte versuche es erneut.");
        }
    }
    //await interaction.editReply("Fertig!");
  
  
});


client.login(process.env.DISCORD_TOKEN);
