ALTER TABLE `weight_type` RENAME TO `factor_type`;--> statement-breakpoint
DROP INDEX `weight_type_factor_slug_unique`;--> statement-breakpoint
DROP INDEX `weight_types_type_idx`;--> statement-breakpoint
DROP INDEX `weight_types_actual_key_idx`;--> statement-breakpoint
CREATE UNIQUE INDEX `factor_type_factor_slug_unique` ON `factor_type` (`factor_slug`);--> statement-breakpoint
CREATE INDEX `factor_type_category_idx` ON `factor_type` (`category`);--> statement-breakpoint
CREATE INDEX `factor_type_factor_slug_idx` ON `factor_type` (`factor_slug`);--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_factor_weight` (
	`id` text PRIMARY KEY NOT NULL,
	`factor_slug` text NOT NULL,
	`weight_value` real DEFAULT 1 NOT NULL,
	`learning_rate` real DEFAULT 0.3 NOT NULL,
	`min_limit` real DEFAULT 0.5 NOT NULL,
	`max_limit` real DEFAULT 5 NOT NULL,
	FOREIGN KEY (`factor_slug`) REFERENCES `factor_type`(`factor_slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_factor_weight`("id", "factor_slug", "weight_value", "learning_rate", "min_limit", "max_limit") SELECT "id", "factor_slug", "weight_value", "learning_rate", "min_limit", "max_limit" FROM `factor_weight`;--> statement-breakpoint
DROP TABLE `factor_weight`;--> statement-breakpoint
ALTER TABLE `__new_factor_weight` RENAME TO `factor_weight`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `factor_weight_factor_slug_unique` ON `factor_weight` (`factor_slug`);--> statement-breakpoint
CREATE INDEX `factor_weight_factor_slug_idx` ON `factor_weight` (`factor_slug`);--> statement-breakpoint
CREATE TABLE `__new_weight_audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`factor_slug` text NOT NULL,
	`date` text NOT NULL,
	`adjustment_delta` real NOT NULL,
	`old_weight` real NOT NULL,
	`new_weight` real NOT NULL,
	`related_sale_id` text,
	FOREIGN KEY (`factor_slug`) REFERENCES `factor_type`(`factor_slug`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`related_sale_id`) REFERENCES `sales_performance`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_weight_audit_log`("id", "factor_slug", "date", "adjustment_delta", "old_weight", "new_weight", "related_sale_id") SELECT "id", "factor_slug", "date", "adjustment_delta", "old_weight", "new_weight", "related_sale_id" FROM `weight_audit_log`;--> statement-breakpoint
DROP TABLE `weight_audit_log`;--> statement-breakpoint
ALTER TABLE `__new_weight_audit_log` RENAME TO `weight_audit_log`;