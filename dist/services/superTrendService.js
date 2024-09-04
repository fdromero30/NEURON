"use strict";
/**
 * Calcula el Average True Range (ATR) para un período dado.
 * @param data - Array de objetos con datos de precios.
 * @param period - Longitud del período para el cálculo del ATR.
 * @returns Array con valores del ATR.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateSupertrend = calculateSupertrend;
function calculateATR(data, period) {
    // Implementación de calculateATR aquí
    const tr = [];
    const atr = [];
    // Calcular True Range (TR)
    for (let i = 1; i < data.length; i++) {
        const current = data[i];
        const prev = data[i - 1];
        const tr1 = current.high - current.low;
        const tr2 = Math.abs(current.high - prev.close);
        const tr3 = Math.abs(current.low - prev.close);
        const trValue = Math.max(tr1, tr2, tr3);
        tr.push(trValue);
    }
    // Calcular ATR como media móvil simple (SMA) de TR
    for (let i = period - 1; i < tr.length; i++) {
        const periodTR = tr.slice(i - period + 1, i + 1);
        const averageTR = periodTR.reduce((a, b) => a + b, 0) / period;
        atr.push(averageTR);
    }
    return atr;
}
/**
 * Calcula el indicador Supertrend para un activo.
 * @param data - Array de objetos con datos de precios.
 * @param length - Longitud del período para el cálculo del ATR.
 * @param factor - Factor multiplicador para ajustar el ATR.
 * @returns Objeto con arrays de Supertrend hacia arriba y hacia abajo.
 */
function calculateSupertrend(data, length, factor) {
    // Implementación de calculateSupertrend aquí
    const atr = calculateATR(data, length);
    const supertrendUp = [];
    const supertrendDown = [];
    let previousSupertrendUp = null;
    let previousSupertrendDown = null;
    for (let i = length - 1; i < data.length; i++) {
        const current = data[i];
        const currentATR = atr[i - (length - 1)];
        if (i === length - 1) {
            supertrendUp.push(current.close + factor * currentATR);
            supertrendDown.push(current.close - factor * currentATR);
        }
        else {
            const newSupertrendUp = Math.min(supertrendUp[i - length], current.high - factor * currentATR);
            const newSupertrendDown = Math.max(supertrendDown[i - length], current.low + factor * currentATR);
            if (current.close > (previousSupertrendUp !== null && previousSupertrendUp !== void 0 ? previousSupertrendUp : 0)) {
                supertrendUp.push(newSupertrendUp);
            }
            else {
                supertrendUp.push(current.close + factor * currentATR);
            }
            if (current.close < (previousSupertrendDown !== null && previousSupertrendDown !== void 0 ? previousSupertrendDown : 0)) {
                supertrendDown.push(newSupertrendDown);
            }
            else {
                supertrendDown.push(current.close - factor * currentATR);
            }
        }
        previousSupertrendUp = supertrendUp[supertrendUp.length - 3];
        previousSupertrendDown = supertrendDown[supertrendDown.length - 3];
    }
    return {
        supertrendUp: supertrendUp[supertrendUp.length - 2],
        supertrendDown: supertrendDown[supertrendDown.length - 2],
        previousSupertrendUp,
        previousSupertrendDown,
    };
}
