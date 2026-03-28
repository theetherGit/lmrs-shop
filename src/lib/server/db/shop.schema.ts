import { sqliteTable, text, integer, index, real } from 'drizzle-orm/sqlite-core';
import { v7 as ulid } from 'uuid';

export const productionLedger = sqliteTable(
	'production_ledger',
	{
		id: text('id').primaryKey().$defaultFn(ulid),
		date: text('date').notNull(),
		stock_type: text('type', { enum: ['fresh', 'closing', 'opening'] }),
		stock: integer('quantity').notNull(),
		rate: real('rate').notNull(),
		amount: real('amount').notNull()
	},
	(table) => [index('production_ledger_date_idx').on(table.date)]
);

export const salesPerformance = sqliteTable(
	'sales_performance',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => ulid()),
		// Date of sale
		date: text('date').notNull().unique(),
		// Day of the week
		dayOfWeek: text('day_of_week', {
			enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
		}).notNull(),

		// Inventory Context
		// Total = todays new stock + opening stock
		totalStock: integer('total_stock').notNull(),
		// Remaining stock from previous day is today's opening stock
		openingStock: integer('opening_stock').notNull(),
		// Fresh batch we got from preoducer
		freshProduced: integer('fresh_produced').notNull(),
		// Will be claculated on the basis of estimatedSoldStock using actual revnue and removing estimatedSoldStock from total stock
		closingStock: integer('closing_stock').notNull(),
		// Will be calculated from actual revnue, openingStock + freshProduced - closingStock
		estimatedSold: integer('estimated_sold').notNull(),
		// Predication for the day
		forcastedStock: integer('forcasted_stock').notNull(),

		// Financials
		// How much we earned at the end of the day.
		actualRevenue: integer('actual_revenue').notNull(),
		// Expected Revnue = total stock * maker rate
		targetRevenue: integer('target_revenue').notNull(),
		// Predication for the day
		forecastedRevenue: integer('forecasted_revenue').notNull(),

		// Forcast Health Metrics
		// Outlier is when we had unexpected sales number for the day
		isOutlier: integer('is_outlier', { mode: 'boolean' }).notNull(),
		// Z-Score tells you how many "Standard Deviations" a day's revenue is from your usual average.
		zScore: real('z_score').notNull(),
		// Accuracy = actualRevenue/predictedRevnue
		accuracy: real('accuracy').notNull(),
		// Actual weights happended in real, {heavy_rain: 1.2, exam_core: '1.4'}
		appliedWeights: text('applied_weights', { mode: 'json' })
			.$type<Record<string, number>>()
			.notNull(),
		// miscellaneous
		additionalContext: text('')
	},
	(table) => [
		index('sales_performance_date_idx').on(table.date),
		index('sales_performance_accuracy_idx').on(table.date)
	]
);

export const factorType = sqliteTable(
	'factor_type',
	{
		id: text('id').primaryKey().$defaultFn(ulid),
		// Type are main differenciatores like rain, exam, holiday, season
		category: text('category').notNull(),
		// Sub categories are heavy (for rain), core (exam), mid sem break (holiday), summer(season)
		subCategory: text('sub_category').notNull(),
		// Key for config(actualKey) = snakeCase(type_subType)
		factorSlug: text('factor_slug').notNull().unique()
	},
	(table) => [
		index('factor_type_category_idx').on(table.category),
		index('factor_type_factor_slug_idx').on(table.factorSlug)
	]
);

export const factorWeight = sqliteTable(
	'factor_weight',
	{
		id: text('id').primaryKey().$defaultFn(ulid),
		// Type = weightTypes.factorSlug
		factorSlug: text('factor_slug')
			.unique()
			.notNull()
			.references(() => factorType.factorSlug),
		// Current weight of the type
		weightValue: real('weight_value').notNull().default(1.0),
		// Learning rate for the type when we update it in future
		learningRate: real('learning_rate').notNull().default(0.3),
		// minimum weight for the type
		minLimit: real('min_limit').notNull().default(0.5),
		// maximum weight for the type
		maxLimit: real('max_limit').notNull().default(5)
	},
	(table) => [index('factor_weight_factor_slug_idx').on(table.factorSlug)]
);

export const weightAuditLog = sqliteTable('weight_audit_log', {
	id: text('id').primaryKey().$defaultFn(ulid),
	// Link to the factor being changed (e.g., 'weather_heavy_rain')
	// REMOVED .unique() so we can have many history rows for one type
	factorSlug: text('factor_slug')
		.notNull()
		.references(() => factorType.factorSlug),

	// The date of the sale that triggered this change
	date: text('date').notNull(),

	// The "Nudge" value: (Actual/Predicted - 1) * learningRate
	adjustmentDelta: real('adjustment_delta').notNull(),

	oldWeight: real('old_weight').notNull(),
	newWeight: real('new_weight').notNull(),

	// Reference to the specific sale ID for deep auditing
	relatedSaleId: text('related_sale_id').references(() => salesPerformance.id)
});

export const forecast = sqliteTable(
	'forecast',
	{
		id: text('id').primaryKey().$defaultFn(ulid),
		date: text('date').notNull().unique(),
		// Predicated revenue for the
		revenue: integer('revenue').notNull(),
		// Calculated from the predicated revnue of the day
		stock: text('stock').notNull(),
		// baseline revnue is the revnue before we apply weights
		baselineRevnue: integer('baseline_revnue').notNull(),
		// weights based on assumption for the day, {heavy_rain: 1.2, exam_core: '1.4'}
		weights: text('weights', { mode: 'json' }).$type<Record<string, number>>().notNull()
	},
	(table) => [index('forecast_date_idx').on(table.date)]
);

export const datesheet = sqliteTable(
	'datesheet',
	{
		id: text('id').primaryKey().$defaultFn(ulid),
		date: text('date').notNull(),
		shift: text('shift', { enum: ['evening', 'morning'] }),
		degree: text('degree').notNull(),
		subject: text('subject', { enum: ['elective', 'core'] }).notNull()
	},
	(table) => [index('datesheet_date_idx').on(table.date)]
);

export const holiday = sqliteTable(
	'holiday',
	{
		id: text('id').primaryKey().$defaultFn(ulid),
		date: text('date').notNull(),
		type: text('type', {
			enum: ['government', 'mid_sem_break', 'national_holiday', 'weekend']
		}).notNull(),
		reason: text('reason')
	},
	(table) => [index('holiday_date_idx').on(table.date)]
);

export const appSettings = sqliteTable(
	'app_settings',
	{
		id: text('id').primaryKey().$defaultFn(ulid),
		// Date we added these fields, we will make a new entry when makers price changes and use the recent price
		// Date we added these fields, we will make a new entry when makers price changes and use the recent price
		date: text('date').notNull().unique(),
		// Estimated cost of one piece includes maker rate, additional ingredients and utilities.
		estimatedCostPrice: real('estimated_cost_price').notNull().default(9.0),
		// Minimum selling price as we have two servings 25 and 30, so minimum sell price for 30rs plate with 3piece is 10rs
		minSellingPrice: real('min_selling_price').notNull().default(10.0),
		// Maximum selling price as we have two servings 25 and 30, so minim sell price for 25rs plate with 2piece is 12.5rs
		maxSellingPrice: real('max_selling_price').notNull().default(12.5),
		// Having an addition safty buffer for additional sales
		safetyBuffer: real('safety_buffer').notNull().default(1.1),
		// The rate we are growing yearly or monthly
		growthRate: real('growth_rate').notNull().default(1.0),
		// provider per piece price
		makerRate: real('maker_rate').notNull().default(5.0)
	},
	(table) => [index('app_settings_date_idx').on(table.date)]
);
