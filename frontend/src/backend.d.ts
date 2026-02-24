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
export interface BudgetEstimate {
    urgencyLevel: UrgencyLevel;
    recommendedAction: string;
    estimatedCost: number;
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
export interface PredictionResult {
    deteriorationRate: number;
    maintenanceYear: bigint;
    budgetEstimate: BudgetEstimate;
    riskLevel: RiskLevel;
    riskScore: number;
}
export interface InfrastructureInput {
    id: string;
    age: bigint;
    trafficLoadFactor: number;
    name: string;
    structuralConditionRating: number;
    photoBase64?: string;
    environmentalExposureFactor: number;
    notes: string;
    structureType: StructureType;
    materialType: MaterialType;
    location: {
        latitude: number;
        area: string;
        longitude: number;
    };
}
export interface Infrastructure {
    id: string;
    age: bigint;
    trafficLoadFactor: number;
    name: string;
    structuralConditionRating: number;
    photoBase64?: string;
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
export interface UserProfile {
    name: string;
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
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addInfrastructure(input: InfrastructureInput): Promise<void>;
    analyzeAndPredict(input: InfrastructureInput): Promise<PredictionResult>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteInfrastructure(id: string): Promise<void>;
    getAllInfrastructure(): Promise<Array<Infrastructure>>;
    getBudgetEstimate(id: string): Promise<BudgetEstimate>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCityBudgetSummary(): Promise<CityBudgetSummary>;
    getInfrastructureById(id: string): Promise<Infrastructure>;
    getPredictions(id: string): Promise<Prediction>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    initializeData(): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateInfrastructure(id: string, input: InfrastructureInput): Promise<void>;
}
