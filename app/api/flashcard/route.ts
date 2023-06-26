import { NextResponse } from "next/server";

// Import cosmos client
const CosmosClient = require("@azure/cosmos").CosmosClient;

//  Get endpoint and key from environment variables
const endpoint = process.env.COSMOSDB_ENDPOINT;
const key = process.env.COSMOSDB_KEY;

// Create cosmos client using endpoint and key
const cosmosClient = new CosmosClient({ endpoint, key });

// Get the flashcards container
const container = cosmosClient
  .database(process.env.COSMOSDB_NAME)
  .container(process.env.COSMOSDB_CONTAINER_NAME);

// Endpoint to fetch flashcards
export async function GET() {
  const query = "SELECT * FROM c";
  const { resources } = await container.items.query(query).fetchAll();

  let cards = resources;
  return NextResponse.json({ cards });
  // let card = resources[0];
  // return NextResponse.json({ card });
}
