import Papa from 'papaparse';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface Serving {
  id: string;
  pieces: number;
  price: number;
}

type Breakdown = Record<string, { upi: number; cash: number; total: number }>;

interface Report {
  produced: number;
  sold: number;
  wastage: number;
  ratioUsed: number;
  breakdown: Breakdown;
}

class RatioWastageAnalyzer {
  private sortedMenu: Serving[];
  constructor(private menu: Serving[]) {
    this.sortedMenu = [...menu].sort((a, b) => b.price - a.price);
  }

  private decomposeAmount(amount: number): Record<string, number> {
    const result: Record<string, number> = {};
    // Initialize all plate counts to 0
    this.sortedMenu.forEach(item => result[item.id] = 0);

    const remaining = amount;

    // Recursive helper to find the exact combination
    const findCombination = (rem: number, index: number): boolean => {
      if (rem === 0) return true;
      if (index >= this.sortedMenu.length) return false;

      const item = this.sortedMenu[index];
      const maxQty = Math.floor(rem / item.price);

      for (let qty = maxQty; qty >= 0; qty--) {
        if (findCombination(rem - qty * item.price, index + 1)) {
          result[item.id] = qty;
          return true;
        }
      }
      return false;
    };

    const success = findCombination(remaining, 0);

    // Fallback: If no perfect plate combination matches the price
    if (!success) {
      // Logic for "Unidentified Plate" - assume the closest main serving
      const cheapest = this.sortedMenu[this.sortedMenu.length - 1];
      result[cheapest.id] = Math.round(amount / cheapest.price);
    }

    return result;
  }

  public calculate(
    produced: number,
    totalRevenue: number,
    upiAmounts: number[],
    forceZeroWastage: boolean = false
  ): Report {
    // 1. Analyze UPI behavior dynamically for ALL menu items
    let upiPieces = 0;
    let upiRev = 0;
    const upiCounts: Record<string, number> = {};
    this.sortedMenu.forEach(m => upiCounts[m.id] = 0);

    upiAmounts.forEach(amt => {
      const plates = this.decomposeAmount(amt);
      upiRev += amt;
      this.sortedMenu.forEach(m => {
        const qty = plates[m.id] || 0;
        upiCounts[m.id] += qty;
        upiPieces += qty * m.pieces;
      });
    });

    const cashRev = totalRevenue - upiRev;
    const cashCounts: Record<string, number> = {};

    // 2. Calculate "Market Share" for each plate type from UPI
    const totalUpiPlates = Object.values(upiCounts).reduce((a, b) => a + b, 0);
    const shares: Record<string, number> = {};

    this.sortedMenu.forEach(m => {
      shares[m.id] = totalUpiPlates > 0 ? upiCounts[m.id] / totalUpiPlates : 1 / this.sortedMenu.length;
    });

    // 3. Project Cash Counts based on Share and Price
    // Formula: CashRev = Sum(Share_i * Count * Price_i)
    const weightedAveragePrice = this.sortedMenu.reduce((sum, m) => sum + (shares[m.id] * m.price), 0);
    const estimatedTotalCashPlates = cashRev / weightedAveragePrice;

    this.sortedMenu.forEach(m => {
      cashCounts[m.id] = Math.round(estimatedTotalCashPlates * shares[m.id]);
    });

    // 4. THE ZERO WASTAGE / INVENTORY FIXER
    // This loop adjusts the counts until 'sold' matches 'produced' as closely as possible
    let currentSold = upiPieces + this.sortedMenu.reduce((sum, m) => sum + (cashCounts[m.id] * m.pieces), 0);

    const maxIterations = 200; // Prevent infinite loops
    let iterations = 0;

    while (currentSold !== produced && iterations < maxIterations) {
      iterations++;
      if (currentSold > produced) {
        // If over-sold, remove one of the most popular plates
        const mostPopularId = this.sortedMenu.reduce((a, b) => cashCounts[a.id] > cashCounts[b.id] ? a : b).id;
        if (cashCounts[mostPopularId] > 0) cashCounts[mostPopularId]--;
      } else if (currentSold < produced && forceZeroWastage) {
        // If under-sold and we want zero wastage, add one of the most popular plates
        const mostPopularId = this.sortedMenu.reduce((a, b) => shares[a.id] > shares[b.id] ? a : b).id;
        cashCounts[mostPopularId]++;
      } else {
        break;
      }
      currentSold = upiPieces + this.sortedMenu.reduce((sum, m) => sum + (cashCounts[m.id] * m.pieces), 0);
    }

    // 5. Final Report Construction
    const breakdown: Breakdown = {};
    this.sortedMenu.forEach(m => {
      breakdown[m.id] = {
        upi: upiCounts[m.id],
        cash: cashCounts[m.id],
        total: upiCounts[m.id] + cashCounts[m.id]
      };
    });

    return {
      produced,
      sold: currentSold,
      wastage: Math.max(0, produced - currentSold),
      ratioUsed: parseFloat((shares['p3'] / (shares['p2'] || 1)).toFixed(3)), // Legacy ratio for p3/p2
      breakdown
    };
  }
}

const menu = [
  { id: '2pc', name: '2pc Plate', pieces: 2, price: 25 },
  { id: '3pc', name: '3pc Plate', pieces: 3, price: 30 },
  // { id: '5pc', name: '5pc Plate', pieces: 5, price: 45 },
];

// --- Implementation ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = path.join(__dirname, './data/april-7-2026.csv');

try {
  const csv = fs.readFileSync(filePath, 'utf8');
  const upiAmounts = Papa.parse(csv, { header: true, dynamicTyping: true }).data.map((r: any) => parseFloat(r.Amount)).filter((amt: number) => !isNaN(amt));


  // const upiAmounts = Papa.parse(csv, { header: true, dynamicTyping: true }).data
  //   .filter((r: any) => r.Status === 'SUCCESS').map((r: any) => r.Amount);

  const analyzer = new RatioWastageAnalyzer(menu); // Serving definitions handled in logic

  // Example: 800 produced, 8700 total revenue, with Zero Wastage flag
  const report = analyzer.calculate(1100, 12200, upiAmounts, true);

  const idk = menu.map((item) => {
    return `${item.name}: ${report.breakdown[item.id].total} (${report.breakdown[item.id].upi} UPI + ${report.breakdown[item.id].cash} Cash)`
    return {
      [`${item.id}`]: report.breakdown[item.id].total
    }
  }).join(', ')

  console.log(`Mode: ${report.wastage === 0 ? 'ZERO WASTAGE' : 'RATIO ESTIMATE'}`);
  console.log(`Total Sold: ${report.sold} | Wastage: ${report.wastage}`);
  console.log(`Breakdown: ${idk}`);

  console.table(Object.entries(report.breakdown).map(([id, stats]) => {
    const item = menu.find(m => m.id === id);
    return {
      Item: item?.name || id,
      'UPI Sold': stats.upi,
      'Cash Sold': stats.cash,
      'Total Sold': stats.total
    };
  }));
} catch (e) {
  console.error(e);
}
