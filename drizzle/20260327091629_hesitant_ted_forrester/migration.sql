CREATE TABLE `app_settings` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`estimated_cost_price` real DEFAULT 9 NOT NULL,
	`min_selling_price` real DEFAULT 10 NOT NULL,
	`max_selling_price` real DEFAULT 12.5 NOT NULL,
	`safety_buffer` real DEFAULT 1.1 NOT NULL,
	`growth_rate` real DEFAULT 1 NOT NULL,
	`maker_rate` real DEFAULT 5 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `app_settings_date_unique` ON `app_settings` (`date`);--> statement-breakpoint
CREATE INDEX `app_settings_date_idx` ON `app_settings` (`date`);--> statement-breakpoint
CREATE TABLE `datesheet` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`shift` text,
	`degree` text NOT NULL,
	`subject` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `datesheet_date_idx` ON `datesheet` (`date`);--> statement-breakpoint
CREATE TABLE `weight_type` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`sub_category` text NOT NULL,
	`factor_slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `weight_type_factor_slug_unique` ON `weight_type` (`factor_slug`);--> statement-breakpoint
CREATE INDEX `weight_types_type_idx` ON `weight_type` (`category`);--> statement-breakpoint
CREATE INDEX `weight_types_actual_key_idx` ON `weight_type` (`factor_slug`);--> statement-breakpoint
CREATE TABLE `factor_weight` (
	`id` text PRIMARY KEY NOT NULL,
	`factor_slug` text NOT NULL,
	`weight_value` real DEFAULT 1 NOT NULL,
	`learning_rate` real DEFAULT 0.3 NOT NULL,
	`min_limit` real DEFAULT 0.5 NOT NULL,
	`max_limit` real DEFAULT 5 NOT NULL,
	FOREIGN KEY (`factor_slug`) REFERENCES `weight_type`(`factor_slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `factor_weight_factor_slug_unique` ON `factor_weight` (`factor_slug`);--> statement-breakpoint
CREATE INDEX `weightage_config_type_idx` ON `factor_weight` (`factor_slug`);--> statement-breakpoint
CREATE TABLE `forecast` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`revenue` integer NOT NULL,
	`stock` text NOT NULL,
	`baseline_revnue` integer NOT NULL,
	`weights` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `forecast_date_unique` ON `forecast` (`date`);--> statement-breakpoint
CREATE INDEX `forecast_date_idx` ON `forecast` (`date`);--> statement-breakpoint
CREATE TABLE `holiday` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`type` text NOT NULL,
	`reason` text
);
--> statement-breakpoint
CREATE INDEX `holiday_date_idx` ON `holiday` (`date`);--> statement-breakpoint
CREATE TABLE `production_ledger` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`type` text,
	`quantity` integer NOT NULL,
	`rate` real NOT NULL,
	`amount` real NOT NULL
);
--> statement-breakpoint
CREATE INDEX `production_ledger_date_idx` ON `production_ledger` (`date`);--> statement-breakpoint
CREATE TABLE `sales_performance` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`day_of_week` text NOT NULL,
	`total_stock` integer NOT NULL,
	`opening_stock` integer NOT NULL,
	`fresh_produced` integer NOT NULL,
	`closing_stock` integer NOT NULL,
	`estimated_sold` integer NOT NULL,
	`forcasted_stock` integer NOT NULL,
	`actual_revenue` integer NOT NULL,
	`target_revenue` integer NOT NULL,
	`forecasted_revenue` integer NOT NULL,
	`is_outlier` integer NOT NULL,
	`z_score` real NOT NULL,
	`accuracy` real NOT NULL,
	`applied_weights` text NOT NULL,
	`additionalContext` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sales_performance_date_unique` ON `sales_performance` (`date`);--> statement-breakpoint
CREATE INDEX `sales_performance_date_idx` ON `sales_performance` (`date`);--> statement-breakpoint
CREATE INDEX `sales_performance_accuracy_idx` ON `sales_performance` (`date`);--> statement-breakpoint
CREATE TABLE `weight_audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`factor_slug` text NOT NULL,
	`date` text NOT NULL,
	`adjustment_delta` real NOT NULL,
	`old_weight` real NOT NULL,
	`new_weight` real NOT NULL,
	`related_sale_id` text,
	FOREIGN KEY (`factor_slug`) REFERENCES `weight_type`(`factor_slug`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`related_sale_id`) REFERENCES `sales_performance`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
DROP TABLE `task`;--> statement-breakpoint
ALTER TABLE `session` ADD `impersonated_by` text;--> statement-breakpoint
ALTER TABLE `user` ADD `role` text;--> statement-breakpoint
ALTER TABLE `user` ADD `banned` integer DEFAULT false;--> statement-breakpoint
ALTER TABLE `user` ADD `ban_reason` text;--> statement-breakpoint
ALTER TABLE `user` ADD `ban_expires` integer;