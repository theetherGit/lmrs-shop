PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_sales_performance` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`day_of_week` text NOT NULL,
	`total_stock` integer NOT NULL,
	`opening_stock` integer NOT NULL,
	`fresh_produced` integer NOT NULL,
	`closing_stock` integer NOT NULL,
	`estimated_sold` integer NOT NULL,
	`forecasted_stock` integer DEFAULT 0,
	`actual_revenue` integer NOT NULL,
	`target_revenue` integer NOT NULL,
	`forecasted_revenue` integer DEFAULT 0,
	`is_outlier` integer NOT NULL,
	`z_score` real NOT NULL,
	`accuracy` real DEFAULT -1,
	`applied_weights` text NOT NULL,
	`additionalContext` text
);
--> statement-breakpoint
INSERT INTO `__new_sales_performance`("id", "date", "day_of_week", "total_stock", "opening_stock", "fresh_produced", "closing_stock", "estimated_sold", "forecasted_stock", "actual_revenue", "target_revenue", "forecasted_revenue", "is_outlier", "z_score", "accuracy", "applied_weights", "additionalContext") SELECT "id", "date", "day_of_week", "total_stock", "opening_stock", "fresh_produced", "closing_stock", "estimated_sold", "forecasted_stock", "actual_revenue", "target_revenue", "forecasted_revenue", "is_outlier", "z_score", "accuracy", "applied_weights", "additionalContext" FROM `sales_performance`;--> statement-breakpoint
DROP TABLE `sales_performance`;--> statement-breakpoint
ALTER TABLE `__new_sales_performance` RENAME TO `sales_performance`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `sales_performance_date_unique` ON `sales_performance` (`date`);--> statement-breakpoint
CREATE INDEX `sales_performance_date_idx` ON `sales_performance` (`date`);--> statement-breakpoint
CREATE INDEX `sales_performance_accuracy_idx` ON `sales_performance` (`date`);