const fs = require('fs');
const initSqlJs = require('sql.js');

async function checkInventory() {
  const SQL = await initSqlJs();
  const filebuffer = fs.readFileSync('database.sqlite');
  const db = new SQL.Database(filebuffer);

  // Get total count
  const countStmt = db.prepare('SELECT COUNT(*) as count FROM products');
  countStmt.step();
  const totalCount = countStmt.getAsObject().count;
  countStmt.free();

  console.log(`Total Products in Inventory: ${totalCount}`);

  if (totalCount > 0) {
    console.log('\nSample of 5 products:');
    const stmt = db.prepare('SELECT item_code, name, price, quantity_in_stock, category FROM products LIMIT 5');
    while (stmt.step()) {
      console.log(stmt.getAsObject());
    }
    stmt.free();
  }

  // Get active vs archived count
  const activeCountStmt = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 1');
  activeCountStmt.step();
  console.log(`\nActive Products: ${activeCountStmt.getAsObject().count}`);
  activeCountStmt.free();
  
  const archivedCountStmt = db.prepare('SELECT COUNT(*) as count FROM products WHERE is_active = 0');
  archivedCountStmt.step();
  console.log(`Archived Products: ${archivedCountStmt.getAsObject().count}`);
  archivedCountStmt.free();
}

checkInventory().catch(console.error);
