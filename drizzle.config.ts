import 'dotenv/config';
import { defineConfig, type Config } from 'drizzle-kit';

const getEnvVariable = (name: string) => {
	const value = process?.env?.[name];
	return value || '';
};

const devDbCredentials = (): Config => {
	return {
		dialect: 'sqlite',
		dbCredentials: {
			url: 'file:./.wrangler/state/v3/d1/miniflare-D1DatabaseObject/ba9eb7cae608d92f52b47c24108da753187c47e0814bfe4bbbc429358efdf444.sqlite'
		}
	};
};

const prodDbCredentials = (): Config => {
	return {
		dialect: 'sqlite',
		driver: 'd1-http',
		dbCredentials: {
			accountId: getEnvVariable('CLOUDFLARE_ACCOUNT_ID'),
			databaseId: getEnvVariable('CLOUDFLARE_DATABASE_ID'),
			token: getEnvVariable('CLOUDFLARE_D1_TOKEN')
		}
	};
};

const isDevEnvironment = getEnvVariable('NODE_ENV') || 'development' === 'development';

export default defineConfig({
	schema: './src/lib/server/db/schema.ts',
	...(isDevEnvironment ? devDbCredentials() : prodDbCredentials()),
	verbose: true,
	strict: true
});
