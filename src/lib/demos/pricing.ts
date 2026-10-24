/**
 * Modelo DIDÁTICO de precificação cost-plus, com dados sintéticos.
 * Não representa regras comerciais de nenhuma empresa.
 *
 *   preço = custo ÷ (1 − margem)        (margem calculada sobre o preço)
 *   markup equivalente = margem ÷ (1 − margem)
 *   lucro unitário = preço − custo
 */
export type ScenarioId = 'pressured' | 'base' | 'efficient';

export interface Scenario {
  id: ScenarioId;
  label: string;
  costFactor: number;
  volumeFactor: number;
  note: string;
}

export const SCENARIOS: Scenario[] = [
  { id: 'pressured', label: 'Custo pressionado', costFactor: 1.08, volumeFactor: 0.95, note: 'Custo +8%, volume −5%' },
  { id: 'base', label: 'Base', costFactor: 1, volumeFactor: 1, note: 'Premissas de referência' },
  { id: 'efficient', label: 'Ganho de eficiência', costFactor: 0.96, volumeFactor: 1.03, note: 'Custo −4%, volume +3%' },
];

export interface PricingInputs {
  /** Custo-base por viagem (R$, sintético). */
  baseCost: number;
  /** Margem-alvo sobre o preço, entre 0 e 1 (exclusive). */
  targetMargin: number;
  /** Viagens por mês de referência. */
  volume: number;
}

export interface PricingResult {
  scenario: Scenario;
  cost: number;
  price: number;
  unitProfit: number;
  volume: number;
  monthlyRevenue: number;
  monthlyProfit: number;
}

const round2 = (n: number) => Math.round(n * 100) / 100;

export function priceFromCost(cost: number, margin: number): number {
  if (!(margin >= 0 && margin < 1)) throw new RangeError('A margem deve estar entre 0 e 1 (exclusive).');
  if (!(cost >= 0)) throw new RangeError('O custo não pode ser negativo.');
  return round2(cost / (1 - margin));
}

export function markupFromMargin(margin: number): number {
  if (!(margin >= 0 && margin < 1)) throw new RangeError('A margem deve estar entre 0 e 1 (exclusive).');
  return margin / (1 - margin);
}

export function simulate(inputs: PricingInputs, scenario: Scenario): PricingResult {
  const cost = round2(inputs.baseCost * scenario.costFactor);
  const price = priceFromCost(cost, inputs.targetMargin);
  const volume = Math.round(inputs.volume * scenario.volumeFactor);
  const unitProfit = round2(price - cost);
  return {
    scenario,
    cost,
    price,
    unitProfit,
    volume,
    monthlyRevenue: round2(price * volume),
    monthlyProfit: round2(unitProfit * volume),
  };
}

export function compareScenarios(inputs: PricingInputs): PricingResult[] {
  return SCENARIOS.map((s) => simulate(inputs, s));
}

/** Preço por cenário ao longo de uma faixa de margens (análise de sensibilidade). */
export function sensitivity(inputs: PricingInputs, margins: number[]) {
  return SCENARIOS.map((scenario) => ({
    scenario,
    points: margins.map((margin) => ({
      margin,
      price: priceFromCost(round2(inputs.baseCost * scenario.costFactor), margin),
    })),
  }));
}

export const MARGIN_RANGE = Array.from({ length: 11 }, (_, i) => Math.round((0.05 + i * 0.03) * 100) / 100);
export const DEFAULT_PRICING: PricingInputs = { baseCost: 4200, targetMargin: 0.18, volume: 120 };
