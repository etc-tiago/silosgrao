CREATE VIRTUAL TABLE IF NOT EXISTS `catalog_products_fts` USING fts5(
	title,
	description,
	content='catalog_products',
	content_rowid='id'
);
