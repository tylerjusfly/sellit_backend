import { execSync } from "child_process";

const args = process.argv.slice(2);
const name = args[0];

if (!name) {
  console.error("❌ Please provide a migration name, e.g., `npm run migration:create MyMigration`");
  process.exit(1);
}


const command = `typeorm migration:generate dist/migrations/${name} -d dist/database/dataSource.js --outputJs`;
// const command = `typeorm migration:generate dist/migrations/${name} -d dist/database/dataSource.js`;


console.log(`👉 Running: ${command}`);

try {
    execSync(command, { stdio: "inherit" });
} catch (error) {
    console.log(`🛑🛑 ${error.message}`)
}


// Running typeorm migration with ESM express is tricky
// when you compile your typescript code , typeorm migration:generate still generates .ts files by default

// and when you pass --outputJS
// it still doesn't compile because now the migration file is .js but uses require which is now commonJS instead of import