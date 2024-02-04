require('dotenv').config();
const { Client, IntentsBitField } = require('discord.js');

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages,
  ],
});

client.on('ready', () => {
  console.log(`✅ ${client.user.tag} is online.`);
});

client.on('interactionCreate', (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'mute') {
    const targetUser = interaction.options.getUser('member');
    
    if (interaction.member.roles.cache.some(role => role.name === 'mute permissions')) {
      const targetMember = interaction.guild.members.cache.get(targetUser.id);
      const guild = client.guilds.cache.get(process.env.GUILD_ID);
      const mutedRole = guild.roles.cache.get(process.env.MUTED_ROLE);
      const reason = interaction.options.getString('reason');
      const reasonMessage = reason ? `${reason}` : 'No reason provided';


      if (!targetMember) {
        interaction.reply("Invalid member, please select a real member!");
      } else if (targetMember) {
        if (!targetMember.user.bot) {
          if (!mutedRole) {
            interaction.reply("There's no role with the specified ID, please contact administrators, or owner of the server!");
          } else {
            if (targetMember.roles.cache.has(mutedRole.id)) {
              interaction.reply(`The user <@${targetMember.id}> is already muted.`);
            } else {
              targetMember.roles.add(mutedRole);
              interaction.reply(`Muted <@${targetMember.id}> for: ${reasonMessage}`);
              targetMember.user.send(`You have been muted in ${guild.name} by ${interaction.member.user.tag} (${interaction.member.user.id}) for: ${reasonMessage}.`)
            }
          }
        } else {
          interaction.reply("You cannot mute a bot!");
        }
      } else {
        interaction.reply("Something went wrong, please contact admin / owner of the server.")
      }

    } else {
      interaction.reply('You do not have permission to use this command.');
    }
  }

  //unmute
  if (interaction.commandName === 'unmute') {
    const targetUser2 = interaction.options.getUser('member');
    const guild = client.guilds.cache.get(process.env.GUILD_ID);
    const mutedRole = guild.roles.cache.get(process.env.MUTED_ROLE);
  
    if (interaction.member.roles.cache.some(role => role.name === 'mute permissions')) { 
      const targetMember2 = guild.members.cache.get(targetUser2.id);
      if (targetMember2) {
      if (targetMember2.roles.cache.has(mutedRole.id)) {
        targetMember2.roles.remove(mutedRole)
        interaction.reply(`Unmuted <@${targetMember2.id}>`);
        targetMember2.user.send(`You have been unmuted in ${guild.name} by ${interaction.member.user.tag} (${interaction.member.user.id}).`)
      } else {
        interaction.reply(`The user <@${targetUser2.id}> is not muted.`);
        }
      } else {
        interaction.reply("Something wrong happend please contact admin/owner.")
      }
    } else {
      interaction.reply("You do not have permission to use this command.");
    }
  }
  // other slash commands here
});

client.login(process.env.TOKEN);
