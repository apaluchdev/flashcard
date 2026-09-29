CREATE TABLE "card_retirements" (
	"user_id" text NOT NULL,
	"card_id" uuid NOT NULL,
	"deck_id" uuid NOT NULL,
	"retired_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "card_retirements_user_id_card_id_pk" PRIMARY KEY("user_id","card_id")
);
--> statement-breakpoint
ALTER TABLE "card_retirements" ADD CONSTRAINT "card_retirements_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_retirements" ADD CONSTRAINT "card_retirements_card_id_cards_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."cards"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "card_retirements" ADD CONSTRAINT "card_retirements_deck_id_decks_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."decks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "card_retirements_user_deck_idx" ON "card_retirements" USING btree ("user_id","deck_id");