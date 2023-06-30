import { NextResponse, NextRequest } from "next/server";
import { CosmosClient } from "@azure/cosmos";

//  Get endpoint and key from environment variables
const endpoint = process.env.COSMOSDB_ENDPOINT || "";
const key = process.env.COSMOSDB_KEY || "";
const databaseName = process.env.COSMOSDB_NAME || "";
const containerName = process.env.COSMOSDB_CONTAINER_NAME || "";

// Initialize the Azure Cosmos DB client
const cosmosClient = new CosmosClient({ endpoint, key });

// Get the flashcards container
const container = cosmosClient.database(databaseName).container(containerName);

interface Flashcard {
  question: string;
  answer: string;
  topic: string;
  order: number;
  // Add more properties as needed
}

// Endpoint to delete flashcards
export async function DELETE(req: NextRequest) {
  try {
    const apiPath = await req.nextUrl.pathname;
    const itemId = apiPath.substring(apiPath.lastIndexOf("/") + 1);
    
    await container.item(itemId).delete();

    return NextResponse.json({ msg: "Deleted Flashcard" });

    console.log("Successfully deleted Flashcard");
  } catch (error) {
    console.error("Error deleting Flashcard:", error);
  }
}
