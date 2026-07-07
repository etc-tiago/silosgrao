ALTER TABLE `catalog_products` ADD COLUMN `show_on_homepage` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
CREATE INDEX `catalog_products_homepage_category_idx` ON `catalog_products` (`category_id`, `show_on_homepage`);
