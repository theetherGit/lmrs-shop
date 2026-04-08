import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface Serving {
  id: string;
  name: string; // Added name for better reporting
  pieces: number;
  price: number;
}

interface ServingStats {
  upiPlates: number;
  cashPlates: number;
  totalPlates: number;
}

interface ReportResults {
  totalProduced: number;
  totalSold: number;
  wastage: number;
  upiPieces: number;
  cashPieces: number;
  servingBreakdown: Record<string, ServingStats>;
  revenueMismatch: number; // Difference between expected and actual cash
}

class KachoriAnalyzer {
  constructor(private menu: Serving[]) {
    this.menu.sort((a, b) => b.price - a.price);
  }

  /**
   * Pass 1: Resolves exact plate counts for a single UPI amount
   */
  private solveTransaction(amount: number): { pieces: number; plates: Record<string, number> } {
    let bestResult = { pieces: 0, plates: {} as Record<string, number> };
    let matched = false;

    const find = (rem: number, idx: number, currentPieces: number, currentPlates: Record<string, number>) => {
      if (rem === 0) {
        if (currentPieces >= bestResult.pieces) {
          bestResult = { pieces: currentPieces, plates: { ...currentPlates } };
          matched = true;
        }
        return;
      }
      if (idx >= this.menu.length || rem < 0) return;

      const item = this.menu[idx];
      for (let qty = Math.floor(rem / item.price); qty >= 0; qty--) {
        currentPlates[item.id] = qty;
        find(rem - (qty * item.price), idx + 1, currentPieces + (qty * item.pieces), currentPlates);
      }
    };

    find(amount, 0, 0, {});

    if (!matched) {
      // Anomaly handling: Treat as individual pieces based on average price
      const estPieces = Math.round(amount / 10);
      return { pieces: estPieces, plates: { "anomaly": estPieces } };
    }
    return bestResult;
  }

  /**
   * Final Daily Reconciliation with Plate Breakdown
   */
  public calculateWastage(
    produced: number,
    cashRevenue: number,
    upiAmounts: number[]
  ): ReportResults {
    const breakdown: Record<string, ServingStats> = {};
    this.menu.forEach(m => {
      breakdown[m.id] = { upiPlates: 0, cashPlates: 0, totalPlates: 0 };
    });

    // 1. Process UPI
    let totalUpiPieces = 0;
    upiAmounts.forEach(amt => {
      const result = this.solveTransaction(amt);
      totalUpiPieces += result.pieces;
      Object.entries(result.plates).forEach(([id, qty]) => {
        if (breakdown[id]) breakdown[id].upiPlates += qty;
      });
    });

    // 2. Resolve Cash with Inventory Constraint
    const remainingInventory = produced - totalUpiPieces;
    let bestCashPieces = 0;
    let bestCashPlates: Record<string, number> = {};

    const solveCash = (remRev: number, idx: number, currentPieces: number, currentPlates: Record<string, number>) => {
      if (remRev === 0) {
        if (currentPieces <= remainingInventory && currentPieces >= bestCashPieces) {
          bestCashPieces = currentPieces;
          bestCashPlates = { ...currentPlates };
        }
        return;
      }
      if (idx >= this.menu.length || remRev < 0) return;

      const item = this.menu[idx];
      for (let qty = Math.floor(remRev / item.price); qty >= 0; qty--) {
        currentPlates[item.id] = qty;
        solveCash(remRev - (qty * item.price), idx + 1, currentPieces + (qty * item.pieces), currentPlates);
      }
    };

    solveCash(cashRevenue, 0, 0, {});

    // 3. Aggregate results
    Object.entries(bestCashPlates).forEach(([id, qty]) => {
      if (breakdown[id]) breakdown[id].cashPlates = qty;
    });

    Object.keys(breakdown).forEach(id => {
      breakdown[id].totalPlates = breakdown[id].upiPlates + breakdown[id].cashPlates;
    });

    const totalSold = totalUpiPieces + bestCashPieces;

    return {
      totalProduced: produced,
      totalSold: totalSold,
      wastage: produced - totalSold,
      upiPieces: totalUpiPieces,
      cashPieces: bestCashPieces,
      servingBreakdown: breakdown,
      revenueMismatch: 0 // Placeholder for cents/rounding errors
    };
  }
}

// --- Execution Logic ---

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, './data/upi-payment.csv'); // Use relative path from script location

try {
  const csvFile = fs.readFileSync(filePath, 'utf8');
  const data = Papa.parse(csvFile, { header: true, skipEmptyLines: true, dynamicTyping: true });

  const upiAmounts = data.data.map((row: any) => parseFloat(row.Amount)).filter((amt: number) => !isNaN(amt));

  console.log(`Total UPI Transactions:`, upiAmounts);

  const menu: Serving[] = [
    { id: 'plate_2pc', name: '2pc Plate', pieces: 2, price: 25 },
    { id: 'plate_3pc', name: '3pc Plate', pieces: 3, price: 30 }
  ];

  const analyzer = new KachoriAnalyzer(menu);
  const results = analyzer.calculateWastage(800, 4390, upiAmounts);

  console.log("--- HIGH PRECISION SALES REPORT ---");
  console.log(`Total Produced: ${results.totalProduced} pcs`);
  console.log(`Total Sold:     ${results.totalSold} pcs`);
  console.log(`Total Wastage:  ${results.wastage} pcs`);
  console.log("\n--- PLATE BREAKDOWN ---");

  Object.entries(results.servingBreakdown).forEach(([id, stats]) => {
    const item = menu.find(m => m.id === id);
    console.log(`${item?.name}:`);
    console.log(`  UPI Sold:  ${stats.upiPlates}`);
    console.log(`  Cash Sold: ${stats.cashPlates}`);
    console.log(`  Total:     ${stats.totalPlates} plates`);
  });

} catch (err) {
  console.error("Error reading CSV. Check if file exists at:", filePath);
}
