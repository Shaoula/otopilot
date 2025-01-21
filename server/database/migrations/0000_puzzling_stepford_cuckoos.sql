CREATE TABLE `ads` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`price` real,
	`brand` text NOT NULL,
	`model` text NOT NULL,
	`color` text,
	`year` integer,
	`mileage` integer,
	`fuelType` text,
	`gearType` text,
	`bodyType` text,
	`engineCapacity` real,
	`enginePower` integer,
	`doors` integer,
	`seats` integer,
	`driveType` text,
	`transmission` text,
	`vin` text,
	`createdAt` integer,
	`updatedAt` integer,
	`deletedAt` integer,
	`isActive` integer DEFAULT 1,
	`isFeatured` integer DEFAULT 0,
	`status` text DEFAULT 'pending',
	`userId` text NOT NULL,
	`categoryId` text,
	`visuals` text,
	`features` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `ads_id_unique` ON `ads` (`id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`emailVerified` integer,
	`image` text,
	`isAnonymous` integer,
	`role` text DEFAULT 'user',
	`createdAt` integer,
	`updatedAt` integer,
	`deletedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_id_unique` ON `user` (`id`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);