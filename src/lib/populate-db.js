import { configDotenv } from "dotenv";
configDotenv();
import { urlService, userService } from "../services/index.js";
import connectDB from "../db.js";
import { faker } from "@faker-js/faker";
import ShortUniqueId from "short-unique-id";

async function populateUrls(req, res) {
  try {
    const ITEMS_TO_INSERT = 30;
    const userIds = await userService.getUserIds();

    if (!userIds?.length) {
      throw new Error("no users to populate");
    }

    const dummyData = [];
    for (let i = 0; i < ITEMS_TO_INSERT; i++) {
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
        original_url: faker.internet.url(),
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

await connectDB();
await populateUrls();
process.exit(1);
