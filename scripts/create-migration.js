import { execSync } from "child_process";
import fs from 'fs';
import path from 'path';

const args = process.argv.slice(2);
const name = args[0];

if (!name) {
	console.error('❌ Please provide a migration name, e.g., `npm run migration:create MyMigration`');
	process.exit(1);
}

const migrationsDir = path.resolve('src', 'database', 'migrations');
const command = `typeorm migration:generate ${migrationsDir}/${name} -d dist/database/dataSource.js --outputJs`;

console.log(`👉 Running: ${command}`);

try {
	// Run migration generation command
	execSync(command, { stdio: 'inherit' });

	// Get the newest .js file in the migrations directory
	const files = fs
		.readdirSync(migrationsDir)
		.filter((file) => file.endsWith('.js'))
		.map((file) => ({
			name: file,
			time: fs.statSync(path.join(migrationsDir, file)).mtime.getTime(),
		}))
		.sort((a, b) => b.time - a.time);

	if (files.length > 0) {
		const latestFile = files[0].name;
		const oldPath = path.join(migrationsDir, latestFile);
		const newPath = path.join(migrationsDir, latestFile.replace(/\.js$/, '.cjs'));

		fs.renameSync(oldPath, newPath);
		console.log(`✅ Renamed ${latestFile} ➜ ${path.basename(newPath)}`);
	} else {
		console.warn('⚠️ No .js migration files found to rename.');
	}
} catch (error) {
	console.error(`🛑 Error: ${error.message}`);
}
