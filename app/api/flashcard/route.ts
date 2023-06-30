import { NextResponse } from "next/server";
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

// Endpoint to fetch flashcards
export async function GET() {
  const query = "SELECT * FROM c";
  const { resources } = await container.items.query(query).fetchAll();

  let cards = resources;
  return NextResponse.json({ cards });
  // let card = resources[0];
  // return NextResponse.json({ card });
}

export async function POST(req: any) {
  const body = await req.json();

  const flashcard: Flashcard = {
    question: body.question,
    answer: body.answer,
    topic: "CompTIA Security+",
    order: 4,
  };

  const { resource } = await container.items.create(flashcard);
  console.log("Item added:", resource);
  return NextResponse.json({ resource });
}
