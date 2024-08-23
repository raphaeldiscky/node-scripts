import { TwitterSnowflake, DiscordSnowflake } from "@sapphire/snowflake";

const snowflake = async () => {
  const [discordId, twitterId, twitterId2] = await Promise.all([
    DiscordSnowflake.generate(),
    TwitterSnowflake.generate(),
    TwitterSnowflake.generate(),
  ]);

  console.log(discordId, twitterId, twitterId2);
};

snowflake();
