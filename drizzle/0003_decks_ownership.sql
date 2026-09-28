CREATE TYPE "public"."visibility" AS ENUM('private', 'public');--> statement-breakpoint
ALTER TABLE "cards" ALTER COLUMN "position" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "decks" ADD COLUMN "owner_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "decks" ADD COLUMN "visibility" "visibility" DEFAULT 'private' NOT NULL;--> statement-breakpoint
ALTER TABLE "decks" ADD COLUMN "card_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "decks" ADD CONSTRAINT "decks_owner_id_user_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "cards_deck_position_idx" ON "cards" USING btree ("deck_id","position");--> statement-breakpoint
CREATE INDEX "decks_owner_updated_idx" ON "decks" USING btree ("owner_id","updated_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "decks_visibility_updated_idx" ON "decks" USING btree ("visibility","updated_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "decks_title_trgm_idx" ON "decks" USING gin ("title" gin_trgm_ops);--> statement-breakpoint
CREATE INDEX "decks_description_trgm_idx" ON "decks" USING gin ("description" gin_trgm_ops);