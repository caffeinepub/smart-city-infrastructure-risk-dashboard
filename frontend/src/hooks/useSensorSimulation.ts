import { useState, useEffect, useRef, useCallback } from 'react';

interface SensorSimulationParams {
  initialConditionRating: number;
  initialTrafficLoad: number;
  age: number;
  environmentalExposureFactor: number;
}

interface SimulatedValues {
  conditionRating: number;
  trafficLoad: number;
  riskScore: number;
  healthScore: number;
  lastUpdated: Date;
}

function computeRiskScore(
  age: number,
  trafficLoad: number,
  environmentalFactor: number,
  conditionRating: number
): number {
  const ageFactor = age / 80.0;
  const inverseCondition = 1.0 - conditionRating / 5.0;
  const raw = ageFactor * 0.30 + trafficLoad * 0.25 + environmentalFactor * 0.15 + inverseCondition * 0.10;
  return Math.min(1.0, Math.max(0.0, raw));
}

export function useSensorSimulation(params: SensorSimulationParams) {
  const [isActive, setIsActive] = useState(false);
  const [simValues, setSimValues] = useState<SimulatedValues>({
    conditionRating: params.initialConditionRating,
    trafficLoad: params.initialTrafficLoad,
    riskScore: computeRiskScore(params.age, params.initialTrafficLoad, params.environmentalExposureFactor, params.initialConditionRating),
    healthScore: 100 - computeRiskScore(params.age, params.initialTrafficLoad, params.environmentalExposureFactor, params.initialConditionRating) * 100,
    lastUpdated: new Date(),
  });
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetToOriginal = useCallback(() => {
    const rs = computeRiskScore(params.age, params.initialTrafficLoad, params.environmentalExposureFactor, params.initialConditionRating);
    setSimValues({
      conditionRating: params.initialConditionRating,
      trafficLoad: params.initialTrafficLoad,
      riskScore: rs,
      healthScore: 100 - rs * 100,
      lastUpdated: new Date(),
    });
  }, [params]);

  const toggle = useCallback(() => {
    setIsActive(prev => !prev);
  }, []);

  const stop = useCallback(() => {
    setIsActive(false);
    resetToOriginal();
  }, [resetToOriginal]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setSimValues(prev => {
          const deltaCondition = (Math.random() - 0.5) * 0.4;
          const newCondition = Math.min(5.0, Math.max(1.0, prev.conditionRating + deltaCondition));
          const deltaTraffic = (Math.random() - 0.5) * 0.1;
          const newTraffic = Math.min(1.0, Math.max(0.0, prev.trafficLoad + deltaTraffic));
          const rs = computeRiskScore(params.age, newTraffic, params.environmentalExposureFactor, newCondition);
          return {
            conditionRating: newCondition,
            trafficLoad: newTraffic,
            riskScore: rs,
            healthScore: 100 - rs * 100,
            lastUpdated: new Date(),
          };
        });
      }, 3000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, params]);

  return { isActive, simValues, toggle, stop };
}
