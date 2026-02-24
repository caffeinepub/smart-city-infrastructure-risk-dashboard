import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Prediction {
    deteriorationRate: number;
    maintenanceYear: bigint;
    futureConditionRatings: {
        rating10: number;
        rating20: number;
        rating5: number;
    };
}
export interface Infrastructure {
    id: string;
    age: bigint;
    trafficLoadFactor: number;
    name: string;
    structuralConditionRating: number;
    environmentalExposureFactor: number;
    notes: string;
    structureType: StructureType;
    riskLevel: RiskLevel;
    materialType: MaterialType;
    location: {
        latitude: number;
        area: string;
        longitude: number;
    };
    riskScore: number;
}
export interface CityBudgetSummary {
    breakdownByRiskLevel: {
        low: number;
        high: number;
        moderate: number;
    };
    topPriorityStructures: Array<Infrastructure>;
    totalEstimatedBudget: number;
}
export interface BudgetEstimate {
    urgencyLevel: UrgencyLevel;
    recommendedAction: string;
    estimatedCost: number;
}
export enum MaterialType {
    compositeMaterial = "compositeMaterial",
    concrete = "concrete",
    asphalt = "asphalt",
    steel = "steel"
}
export enum RiskLevel {
    low = "low",
    high = "high",
    moderate = "moderate"
}
export enum StructureType {
    bridge = "bridge",
    road = "road"
}
export enum UrgencyLevel {
    immediateRepair = "immediateRepair",
    monitorOnly = "monitorOnly",
    scheduledMaintenance = "scheduledMaintenance"
}
export interface backendInterface {
    addInfrastructure(input: Infrastructure): Promise<void>;
    deleteInfrastructure(id: string): Promise<void>;
    getAllInfrastructure(): Promise<Array<Infrastructure>>;
    getBudgetEstimate(id: string): Promise<BudgetEstimate>;
    getCityBudgetSummary(): Promise<CityBudgetSummary>;
    getInfrastructureById(id: string): Promise<Infrastructure>;
    getPredictions(id: string): Promise<Prediction>;
    updateInfrastructure(id: string, input: Infrastructure): Promise<void>;
}
