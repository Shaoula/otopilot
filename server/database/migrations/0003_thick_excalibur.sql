PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_ads` (
	`id` text PRIMARY KEY NOT NULL,
	`businessId` text NOT NULL,
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
	`isActive` integer DEFAULT true,
	`isFeatured` integer DEFAULT false,
	`status` text DEFAULT 'pending',
	`userId` text NOT NULL,
	`categoryId` text,
	`visuals` text DEFAULT '[]',
	`features` text DEFAULT '[]',
	FOREIGN KEY (`businessId`) REFERENCES `business`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`userId`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`categoryId`) REFERENCES `categories`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_ads`("id", "businessId", "slug", "title", "description", "price", "make", "model", "color", "year", "mileage", "fuelType", "gearType", "bodyType", "engineCapacity", "enginePower", "doors", "seats", "transmission", "createdAt", "updatedAt", "deletedAt", "isActive", "isFeatured", "status", "userId", "categoryId", "visuals", "features") SELECT "id", "businessId", "slug", "title", "description", "price", "make", "model", "color", "year", "mileage", "fuelType", "gearType", "bodyType", "engineCapacity", "enginePower", "doors", "seats", "transmission", "createdAt", "updatedAt", "deletedAt", "isActive", "isFeatured", "status", "userId", "categoryId", "visuals", "features" FROM `ads`;--> statement-breakpoint
DROP TABLE `ads`;--> statement-breakpoint
ALTER TABLE `__new_ads` RENAME TO `ads`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `ads_id_unique` ON `ads` (`id`);--> statement-breakpoint
ALTER TABLE `categories` ADD `businessId` text NOT NULL REFERENCES business(id);--> statement-breakpoint
ALTER TABLE `user` ADD `businessId` text REFERENCES business(id);