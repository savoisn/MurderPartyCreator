CREATE TYPE "public"."user_role" AS ENUM('player', 'creator');--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"name" varchar(255),
	"avatar_url" varchar(500),
	"provider" varchar(50) NOT NULL,
	"provider_id" varchar(255) NOT NULL,
	"role" "user_role" DEFAULT 'player' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DELETE FROM "session_clues";--> statement-breakpoint
DELETE FROM "session_players";--> statement-breakpoint
DELETE FROM "sessions";--> statement-breakpoint
DELETE FROM "clues";--> statement-breakpoint
DELETE FROM "characters";--> statement-breakpoint
DELETE FROM "scenarios";--> statement-breakpoint
ALTER TABLE "scenarios" ADD COLUMN "user_id" uuid NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX "users_provider_provider_id_idx" ON "users" USING btree ("provider","provider_id");--> statement-breakpoint
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;
