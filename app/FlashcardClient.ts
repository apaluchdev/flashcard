import Flashcard from "@/types/Flashcard";
import { CosmosClient } from "@azure/cosmos";

// Configuration
const endpoint = process.env.COSMOSDB_ENDPOINT || "";
const key = process.env.COSMOSDB_KEY || "";
const databaseName = process.env.COSMOSDB_NAME || "";
const containerName = process.env.COSMOSDB_CONTAINER_NAME || "";

// Cosmos DB client
const client = new CosmosClient({ endpoint, key });

// Container reference
const container = client.database(databaseName).container(containerName);

// Helper functions
const flashcardClient = {
  async getFlashcardById(flashcardId: string) {
    const { resource: flashcard } = await container.item(flashcardId).read();
    return flashcard as Flashcard;
  },

  async getFlashcardsByUserIdAndTopicId(userId: string, topicId: string) {
    const query = `SELECT * FROM c WHERE c.userId = "${userId}" AND c.topicId = "${topicId}"`;
    const { resources: flashcards } = await container.items
      .query(query)
      .fetchAll();

    return flashcards as Flashcard[];
  },

  async createItem(flashcard: Flashcard) {
    const { resource: createdItem } = await container.items.create(flashcard);
    return createdItem as Flashcard;
  },

  async updateItem(flashcardId: string, flashcard: Flashcard) {
    const { resource: updatedItem } = await container
      .item(flashcardId)
      .replace(flashcard);
    return updatedItem as Flashcard;
  },

  async getTopicByTopicId(topicId: string) {
    try {
      const query = `SELECT * FROM c WHERE c.topicId = "${topicId}"`;
      const { resources: items } = await container.items
        .query(query)
        .fetchAll();

      return items[0].topic as string;
    } catch (error) {
      console.error("Error retrieving topic:", error);
      return "";
    }
  },

  async deleteItemById(flashcardId: string) {
    try {
      await container.item(flashcardId, flashcardId).delete();
    } catch (error) {
      console.error(error);
    }
  },

  async deleteItemByUserIdAndTopicId(userId: string, topicId: string) {
    const query = `SELECT * FROM c WHERE c.userId = "${userId}" AND c.topicId = "${topicId}"`;
    const { resources: flashcards } = await container.items
      .query(query)
      .fetchAll();

    if (flashcards && flashcards.length > 0) {
      const deletePromises = flashcards.map((item) =>
        container.item(item.id, item.id).delete()
      );
      await Promise.all(deletePromises);
    } else {
      console.log("No items found with specified user and topic ids");
    }
  },

  async deleteAllItems() {
    const query = "SELECT * FROM c";
    const { resources: items } = await container.items.query(query).fetchAll();

    for (const item of items) {
      await container.item(item.id, item.id).delete();
    }
  },
};

export default flashcardClient;
