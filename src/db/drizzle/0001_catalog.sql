CREATE TABLE `catalog_categories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`label` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `catalog_categories_slug_unique` ON `catalog_categories` (`slug`);
--> statement-breakpoint
CREATE TABLE `catalog_products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`slug` text NOT NULL,
	`title` text NOT NULL,
	`price_cents` integer DEFAULT 0 NOT NULL,
	`description` text,
	`image_url` text NOT NULL,
	`category_id` integer,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_at` integer DEFAULT (unixepoch() * 1000) NOT NULL,
	`updated_by` integer,
	FOREIGN KEY (`category_id`) REFERENCES `catalog_categories`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`updated_by`) REFERENCES `editores`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `catalog_products_slug_unique` ON `catalog_products` (`slug`);
--> statement-breakpoint
CREATE INDEX `catalog_products_category_id_idx` ON `catalog_products` (`category_id`);
--> statement-breakpoint
CREATE INDEX `catalog_products_price_cents_idx` ON `catalog_products` (`price_cents`);
--> statement-breakpoint
CREATE INDEX `catalog_products_created_at_idx` ON `catalog_products` (`created_at`);
--> statement-breakpoint
CREATE TABLE `catalog_product_images` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`product_id` integer NOT NULL,
	`image_url` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `catalog_products`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `catalog_product_images_product_id_idx` ON `catalog_product_images` (`product_id`);
--> statement-breakpoint
CREATE VIRTUAL TABLE `catalog_products_fts` USING fts5(
	`title`,
	`description`,
	tokenize='unicode61 remove_diacritics 2'
);
