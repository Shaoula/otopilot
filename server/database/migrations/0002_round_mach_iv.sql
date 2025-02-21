CREATE TABLE `businessUser` (
	`id` text PRIMARY KEY NOT NULL,
	`businessId` text NOT NULL,
	`userId` text NOT NULL,
	`role` text DEFAULT 'editor' NOT NULL,
	`isActive` integer DEFAULT true NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	`deletedAt` integer,
	FOREIGN KEY (`businessId`) REFERENCES `business`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `businessUser_id_unique` ON `businessUser` (`id`);--> statement-breakpoint
CREATE TABLE `business` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text,
	`address` text,
	`logo` text,
	`timezone` text DEFAULT 'UTC' NOT NULL,
	`createdAt` integer,
	`updatedAt` integer,
	`deletedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `business_id_unique` ON `business` (`id`);--> statement-breakpoint
ALTER TABLE `user` ADD `name` text NOT NULL;--> statement-breakpoint
ALTER TABLE `user` DROP COLUMN `isAnonymous`;