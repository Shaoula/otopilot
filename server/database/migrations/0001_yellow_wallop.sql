CREATE TABLE `categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`parentId` text,
	`createdAt` integer,
	`updatedAt` integer,
	`deletedAt` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `categories_id_unique` ON `categories` (`id`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ads` (
	`id` text PRIMARY KEY NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`price` real,
	`make` text NOT NULL,
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
	`transmission` text DEFAULT 'manual',
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
INSERT INTO `__new_ads`("id", "slug", "title", "description", "price", "make", "model", "color", "year", "mileage", "fuelType", "gearType", "bodyType", "engineCapacity", "enginePower", "doors", "seats", "transmission", "createdAt", "updatedAt", "deletedAt", "isActive", "isFeatured", "status", "userId", "categoryId", "visuals", "features") SELECT "id", "slug", "title", "description", "price", "make", "model", "color", "year", "mileage", "fuelType", "gearType", "bodyType", "engineCapacity", "enginePower", "doors", "seats", "transmission", "createdAt", "updatedAt", "deletedAt", "isActive", "isFeatured", "status", "userId", "categoryId", "visuals", "features" FROM `ads`;--> statement-breakpoint
DROP TABLE `ads`;--> statement-breakpoint
ALTER TABLE `__new_ads` RENAME TO `ads`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `ads_id_unique` ON `ads` (`id`);