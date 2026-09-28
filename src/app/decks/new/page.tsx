import type { Metadata } from "next"

import { DeckForm } from "@/components/deck-form"
import { ImportForm } from "@/components/import-form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requireUser } from "@/server/session"

export const metadata: Metadata = { title: "New deck" }

export default async function NewDeckPage({ searchParams }: PageProps<"/decks/new">) {
  const { tab } = await searchParams
  await requireUser(tab === "import" ? "/decks/new?tab=import" : "/decks/new")

  return (
    <div className="container mx-auto w-full max-w-3xl px-4 pt-8">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight">New deck</h1>
      <Tabs defaultValue={tab === "import" ? "import" : "build"}>
        <TabsList className="mb-6">
          <TabsTrigger value="build">Build</TabsTrigger>
          <TabsTrigger value="import">Import JSON</TabsTrigger>
        </TabsList>
        <TabsContent value="build">
          <DeckForm mode="create" />
        </TabsContent>
        <TabsContent value="import" className="pb-12">
          <ImportForm />
        </TabsContent>
      </Tabs>
    </div>
  )
}
