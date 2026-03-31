CREATE TABLE `account` (
	`id` text PRIMARY KEY NOT NULL,
	`account_id` text NOT NULL,
	`provider_id` text NOT NULL,
	`user_id` text NOT NULL,
	`access_token` text,
	`refresh_token` text,
	`id_token` text,
	`access_token_expires_at` integer,
	`refresh_token_expires_at` integer,
	`scope` text,
	`password` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `account_userId_idx` ON `account` (`user_id`);--> statement-breakpoint
CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`expires_at` integer NOT NULL,
	`token` text NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer NOT NULL,
	`ip_address` text,
	`user_agent` text,
	`user_id` text NOT NULL,
	`impersonated_by` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `session_token_unique` ON `session` (`token`);--> statement-breakpoint
CREATE INDEX `session_userId_idx` ON `session` (`user_id`);--> statement-breakpoint
CREATE TABLE `user` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`email_verified` integer DEFAULT false NOT NULL,
	`image` text,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`role` text,
	`banned` integer DEFAULT false,
	`ban_reason` text,
	`ban_expires` integer
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
CREATE TABLE `verification` (
	`id` text PRIMARY KEY NOT NULL,
	`identifier` text NOT NULL,
	`value` text NOT NULL,
	`expires_at` integer NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verification_identifier_idx` ON `verification` (`identifier`);--> statement-breakpoint
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
CREATE TABLE `factor_type` (
	`id` text PRIMARY KEY NOT NULL,
	`category` text NOT NULL,
	`sub_category` text NOT NULL,
	`factor_slug` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `factor_type_factor_slug_unique` ON `factor_type` (`factor_slug`);--> statement-breakpoint
CREATE INDEX `factor_type_category_idx` ON `factor_type` (`category`);--> statement-breakpoint
CREATE INDEX `factor_type_factor_slug_idx` ON `factor_type` (`factor_slug`);--> statement-breakpoint
CREATE TABLE `factor_weight` (
	`id` text PRIMARY KEY NOT NULL,
	`factor_slug` text NOT NULL,
	`weight_value` real DEFAULT 1 NOT NULL,
	`learning_rate` real DEFAULT 0.3 NOT NULL,
	`min_limit` real DEFAULT 0.5 NOT NULL,
	`max_limit` real DEFAULT 5 NOT NULL,
	FOREIGN KEY (`factor_slug`) REFERENCES `factor_type`(`factor_slug`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `factor_weight_factor_slug_unique` ON `factor_weight` (`factor_slug`);--> statement-breakpoint
CREATE INDEX `factor_weight_factor_slug_idx` ON `factor_weight` (`factor_slug`);--> statement-breakpoint
CREATE TABLE `forecast` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`revenue` integer NOT NULL,
	`stock` text NOT NULL,
	`baseline_revenue` integer NOT NULL,
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
CREATE TABLE `inventory` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`type` text,
	`quantity` integer NOT NULL,
	`rate` real DEFAULT 0 NOT NULL,
	`amount` real NOT NULL
);
--> statement-breakpoint
CREATE INDEX `inventory_date_idx` ON `inventory` (`date`);--> statement-breakpoint
CREATE INDEX `inventory_type_idx` ON `inventory` (`type`);--> statement-breakpoint
CREATE TABLE `operating_revenue` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`day_of_week` text NOT NULL,
	`season` text NOT NULL,
	`total_stock` integer NOT NULL,
	`opening_stock` integer NOT NULL,
	`fresh_produced` integer NOT NULL,
	`closing_stock` integer NOT NULL,
	`estimated_sold` integer NOT NULL,
	`actual_revenue` integer NOT NULL,
	`target_revenue` integer NOT NULL,
	`is_outlier` integer NOT NULL,
	`z_score` real NOT NULL,
	`applied_weights` text NOT NULL,
	`additional_context` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `operating_revenue_date_unique` ON `operating_revenue` (`date`);--> statement-breakpoint
CREATE INDEX `revenue_date_idx` ON `operating_revenue` (`date`);--> statement-breakpoint
CREATE INDEX `revenue_day_of_week_idx` ON `operating_revenue` (`day_of_week`);--> statement-breakpoint
CREATE TABLE `serving_option` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`pieces` integer NOT NULL,
	`price` real NOT NULL,
	`per_piece_price` real NOT NULL,
	`is_active` integer DEFAULT true NOT NULL,
	`created_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`updated_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `serving_option_name_unique` ON `serving_option` (`name`);--> statement-breakpoint
CREATE INDEX `serving_option_name_idx` ON `serving_option` (`name`);--> statement-breakpoint
CREATE TABLE `weight_audit_log` (
	`id` text PRIMARY KEY NOT NULL,
	`factor_slug` text NOT NULL,
	`date` text NOT NULL,
	`adjustment_delta` real NOT NULL,
	`old_weight` real NOT NULL,
	`new_weight` real NOT NULL,
	`related_sale_id` text,
	FOREIGN KEY (`factor_slug`) REFERENCES `factor_type`(`factor_slug`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`related_sale_id`) REFERENCES `operating_revenue`(`id`) ON UPDATE no action ON DELETE no action
);
