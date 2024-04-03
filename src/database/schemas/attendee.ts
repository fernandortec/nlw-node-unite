import { events } from "@/database/schemas";
import { type InferSelectModel, relations } from "drizzle-orm";
import {
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from "drizzle-orm/sqlite-core";

export const attendees = sqliteTable(
	"attendees",
	{
		id: integer("id").notNull().primaryKey({ autoIncrement: true }),
		name: text("name").notNull(),
		email: text("email").notNull(),
		createdAt: integer("created_at", { mode: "timestamp" }),

		eventId: text("event_id")
			.notNull()
			.references(() => events.id, { onDelete: "cascade" }),
	},
	(table) => ({
		eventEmailUniqueness: uniqueIndex("attendees_email_event_id_idx").on(
			table.eventId,
			table.email,
		),
	}),
);

export const attendeesRelations = relations(attendees, ({ one }) => ({
	event: one(events, {
		fields: [attendees.eventId],
		references: [events.id],
		relationName: "attendee_event",
	}),
}));

export type Attendee = InferSelectModel<typeof attendees>;
