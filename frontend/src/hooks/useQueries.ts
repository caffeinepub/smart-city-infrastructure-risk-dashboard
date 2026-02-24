import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Infrastructure } from '../backend';

export function useAllInfrastructure() {
  const { actor, isFetching } = useActor();
  return useQuery<Infrastructure[]>({
    queryKey: ['infrastructure', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllInfrastructure();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useInfrastructureById(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery<Infrastructure>({
    queryKey: ['infrastructure', id],
    queryFn: async () => {
      if (!actor) throw new Error('No actor');
      return actor.getInfrastructureById(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function usePredictions(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['predictions', id],
    queryFn: async () => {
      if (!actor) throw new Error('No actor');
      return actor.getPredictions(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useBudgetEstimate(id: string) {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['budget', id],
    queryFn: async () => {
      if (!actor) throw new Error('No actor');
      return actor.getBudgetEstimate(id);
    },
    enabled: !!actor && !isFetching && !!id,
  });
}

export function useCityBudgetSummary() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ['cityBudget'],
    queryFn: async () => {
      if (!actor) throw new Error('No actor');
      return actor.getCityBudgetSummary();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useUpdateInfrastructure() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, input }: { id: string; input: Infrastructure }) => {
      if (!actor) throw new Error('No actor');
      return actor.updateInfrastructure(id, input);
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['infrastructure'] });
      queryClient.invalidateQueries({ queryKey: ['predictions', id] });
      queryClient.invalidateQueries({ queryKey: ['budget', id] });
      queryClient.invalidateQueries({ queryKey: ['cityBudget'] });
    },
  });
}

export function useAddInfrastructure() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: Infrastructure) => {
      if (!actor) throw new Error('No actor');
      return actor.addInfrastructure(input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infrastructure'] });
      queryClient.invalidateQueries({ queryKey: ['cityBudget'] });
    },
  });
}

export function useDeleteInfrastructure() {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('No actor');
      return actor.deleteInfrastructure(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['infrastructure'] });
      queryClient.invalidateQueries({ queryKey: ['cityBudget'] });
    },
  });
}
