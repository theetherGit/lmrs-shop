/**
 * LMRS Settlement Engine V23 - Value Recovery Edition
 * Handles Standard Sales, Crushed Recovery (4.5%), and 0.5% True Loss.
 */
function solveLMRS(production, revenue, menu, isPerfectClosure = false) {
    // 1. Business Constants
    const RECOVERY_RATE = 0.045; // 4.5% converted to Crushed sales
    const TRUE_LOSS_RATE = 0.005; // 0.5% actual waste

    // Calculate pieces assigned to each category
    const trueLossPieces = Math.round(production * TRUE_LOSS_RATE);
    const recoveryPieces = Math.round(production * RECOVERY_RATE);
    const standardPieces = production - trueLossPieces - recoveryPieces;

    let solutions = [];

    // 2. Recursive Solver: Target the REVENUE
    function findRevenueCombinations(idx, remRev, counts) {
        if (remRev === 0) {
            solutions.push({ ...counts });
            return;
        }
        if (idx >= menu.length || remRev < 0) return;

        const item = menu[idx];
        const maxQty = Math.floor(remRev / item.price);
        for (let q = 0; q <= maxQty; q++) {
            counts[item.id] = q;
            findRevenueCombinations(idx + 1, remRev - (q * item.price), counts);
        }
    }
    findRevenueCombinations(0, revenue, {});

    if (solutions.length === 0) return { error: "No integer combination matches this revenue." };

    // 3. Map and Evaluate against "Physical Reality"
    let mapped = solutions.map(s => {
        let piecesUsed = 0;
        menu.forEach(m => piecesUsed += (s[m.id] * m.pieces));

        // We compare pieces used against the 'Saleable Pool' (Standard + Recovery)
        const totalSaleable = standardPieces + recoveryPieces;
        const wastage = totalSaleable - piecesUsed;

        return {
            plates: s,
            piecesUsed,
            standardPool: standardPieces,
            recoveredPool: recoveryPieces,
            trueLoss: trueLossPieces,
            wastage,
            absWastage: Math.abs(wastage)
        };
    });

    // 4. Dual-Mode Filtering
    let feasible;
    if (isPerfectClosure) {
        // Nearest neighbor to the total saleable count
        const minAbsWastage = Math.min(...mapped.map(s => s.absWastage));
        feasible = mapped.filter(s => s.absWastage === minAbsWastage);
    } else {
        // Normal mode: Standard wastage logic
        feasible = mapped.filter(s => s.wastage >= 0);
    }

    if (feasible.length === 0) return { error: "Inconsistent Data: Revenue exceeds physical stock." };

    // 5. Centroid Ranking
    const centroid = {};
    menu.forEach(m => {
        const sum = feasible.reduce((acc, s) => acc + s.plates[m.id], 0);
        centroid[m.id] = sum / feasible.length;
    });

    return feasible.map(s => {
        let distSq = 0;
        menu.forEach(m => distSq += Math.pow(s.plates[m.id] - centroid[m.id], 2));

        return {
            ...s,
            score: Math.sqrt(distSq).toFixed(2),
            status: s.wastage === 0 ? "EXACT_RECONCILIATION" : `WASTAGE_${s.wastage}`
        };
    }).sort((a, b) => a.score - b.score);
}

const menu = [
    { id: "m1", name: "2pc", price: 25, pieces: 2 },
    { id: "m2", name: "3pc", price: 30, pieces: 3 },
    { id: "m3", name: "5pc", price: 45, pieces: 5 }
];

// Case 1: Standard Day (isPerfectClosure = false)
const data = {
    production: 900,
    revenue: 7800,
}
const resultsNormal = solveLMRS(data.production,  data.revenue, menu,false);
console.table(data)
console.log("--- NORMAL DAY (Suggestions) ---");
console.table(resultsNormal.slice(0, 3));

// Case 2: Sold Out (isPerfectClosure = true)
const data2 = {
    production: 800,
    revenue: 8000,
}
const resultsPerfect = solveLMRS(data2.production,  data2.revenue, menu, true);
console.table(data)
console.log("--- PERFECT CLOSURE (Nearest Neighbor) ---");
console.table(resultsPerfect.slice(0, 1));