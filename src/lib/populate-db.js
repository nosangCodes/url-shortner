import { configDotenv } from "dotenv";
configDotenv();
import { urlService, userService } from "../services/index.js";
import connectDB from "../db.js";
import { faker } from "@faker-js/faker";
import ShortUniqueId from "short-unique-id";
import { browserNames, devices, osNames, websites } from "./urls.js";

function getRandom(list = [], required) {
  if (!list?.length) {
    throw new Error("Empty list");
  }
  if (!required && Math.random() < 0.5) {
    return "";
  }
  return list[Math.floor(Math.random() * list.length)];
}

async function populateUrls() {
  try {
    const userIds = await userService.getUserIds();

    if (!userIds?.length) {
      throw new Error("no users to populate");
    }

    const dummyData = [];
    for (let i = 0; i < websites.length; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const newTopic = faker.company.buzzNoun();
      console.log("🚀  ~ newTopic:", newTopic);

      let topic = await urlService.getTopicByName(newTopic);
      console.log("🚀 ~ existing ~ topic:", topic);

      if (!topic) {
        topic = await urlService.createTopic(newTopic);
        console.log("🚀 ~ created ~ topic:", topic);
      }

      let item = {
        user_id: userId,
        original_url: websites[i],
        alias: new ShortUniqueId({ length: 10 }).randomUUID(),
        topic: topic["_id"],
      };

      dummyData.push(item);
    }

    if (!dummyData.length) {
      throw new Error("no items to populate");
    }

    const result = await urlService.insertUrls(dummyData);
    console.log("URLS POPULATED", result);

    // await session.commitTransaction();
  } catch (error) {
    console.error("Error populating urls", error);
    // await session.abortTransaction(); // Abort the transaction if an error occurs
  } finally {
    // session.endSession(); // End the session
  }
}

async function populateClicks() {
  try {
    const ITEMS_TO_INSERT = 50;
    console.log("populating clicks...");
    const shortUrlIds = await urlService.getShortUrlIds();

    const clicks = [];

    for (let i = 0; i < ITEMS_TO_INSERT; i++) {
      const item = {
        ip_address: faker.internet.ip(),
        short_url_id: getRandom(shortUrlIds, true),
        os: getRandom(osNames),
        device_type: getRandom(devices),
        browser: getRandom(browserNames),
        country: faker.location.country(),
        region: faker.location.county(),
        time_zone: faker.location.timeZone(),
        city: faker.location.city(),
        lat: faker.location.latitude(),
        lon: faker.location.longitude(),
      };
      console.log(item);
      clicks.push(item);
    }

    const result = await urlService.dumpAnalytics(clicks);
    console.log("analytics populated", result);
  } catch (error) {
    console.error("error populating clicks", error);
  }
}

await connectDB();
// await populateUrls();
await populateClicks();
process.exit(1);
