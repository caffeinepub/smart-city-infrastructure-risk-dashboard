import React, { useState, useEffect } from 'react';
import { Infrastructure, MaterialType, StructureType, InfrastructureInput } from '../backend';
import { getMaterialTypeKey, getStructureTypeKey } from '../lib/utils';
import { useUpdateInfrastructure, useAnalyzeAndPredict } from '../hooks/useQueries';
import PhotoUpload from './PhotoUpload';
import PredictionSuggestionsPanel from './PredictionSuggestionsPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save } from 'lucide-react';

interface InfrastructureEditFormProps {
  infrastructure: Infrastructure;
  onSuccess?: () => void;
}

export default function InfrastructureEditForm({ infrastructure, onSuccess }: InfrastructureEditFormProps) {
  const updateMutation = useUpdateInfrastructure();
  const analyzeMutation = useAnalyzeAndPredict();

  const [form, setForm] = useState({
    name: infrastructure.name,
    age: Number(infrastructure.age).toString(),
    trafficLoadFactor: infrastructure.trafficLoadFactor.toString(),
    materialType: getMaterialTypeKey(infrastructure.materialType),
    environmentalExposureFactor: infrastructure.environmentalExposureFactor.toString(),
    structuralConditionRating: infrastructure.structuralConditionRating.toString(),
    notes: infrastructure.notes,
  });

  const [photo, setPhoto] = useState<string | undefined>(
    infrastructure.photoBase64 ?? undefined
  );
  const [showSuggestions, setShowSuggestions] = useState(false);

  // When a new photo is uploaded, auto-trigger analysis
  const handlePhotoChange = (base64: string | undefined) => {
    setPhoto(base64);
    setShowSuggestions(false);
    analyzeMutation.reset();
    if (base64) {
      const materialMap: Record<string, MaterialType> = {
        concrete: MaterialType.concrete,
        steel: MaterialType.steel,
        asphalt: MaterialType.asphalt,
        compositeMaterial: MaterialType.compositeMaterial,
      };
      const structureMap: Record<string, StructureType> = {
        bridge: StructureType.bridge,
        road: StructureType.road,
      };
      const input: InfrastructureInput = {
        id: infrastructure.id,
        name: form.name,
        structureType: structureMap[getStructureTypeKey(infrastructure.structureType)] || StructureType.bridge,
        location: infrastructure.location,
        age: BigInt(parseInt(form.age) || 0),
        trafficLoadFactor: parseFloat(form.trafficLoadFactor) || 0,
        materialType: materialMap[form.materialType] || MaterialType.concrete,
        environmentalExposureFactor: parseFloat(form.environmentalExposureFactor) || 0,
        structuralConditionRating: parseFloat(form.structuralConditionRating) || 3.5,
        notes: form.notes,
        photoBase64: base64,
      };
      analyzeMutation.mutate(input, {
        onSuccess: () => setShowSuggestions(true),
      });
    }
  };

  const handleAcceptSuggestions = (values: { structuralConditionRating: number }) => {
    setForm(f => ({
      ...f,
      structuralConditionRating: values.structuralConditionRating.toFixed(1),
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const materialMap: Record<string, MaterialType> = {
      concrete: MaterialType.concrete,
      steel: MaterialType.steel,
      asphalt: MaterialType.asphalt,
      compositeMaterial: MaterialType.compositeMaterial,
    };
    const updated: Infrastructure = {
      ...infrastructure,
      name: form.name,
      age: BigInt(parseInt(form.age)),
      trafficLoadFactor: parseFloat(form.trafficLoadFactor),
      materialType: materialMap[form.materialType] || MaterialType.concrete,
      environmentalExposureFactor: parseFloat(form.environmentalExposureFactor),
      structuralConditionRating: parseFloat(form.structuralConditionRating),
      notes: form.notes,
      photoBase64: photo,
    };
    await updateMutation.mutateAsync({ id: infrastructure.id, input: updated });
    onSuccess?.();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Photo Upload */}
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Infrastructure Photo</Label>
        <PhotoUpload value={photo} onChange={handlePhotoChange} />
        {analyzeMutation.isPending && (
          <div className="flex items-center gap-1.5 text-xs text-teal font-mono">
            <Loader2 size={11} className="animate-spin" />
            Analyzing photo...
          </div>
        )}
      </div>

      {/* Suggestions Panel */}
      {showSuggestions && analyzeMutation.data && (
        <PredictionSuggestionsPanel
          result={analyzeMutation.data}
          onAccept={handleAcceptSuggestions}
          onDismiss={() => setShowSuggestions(false)}
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Name</Label>
          <Input
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            className="bg-accent border-border text-sm h-8"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Age (years)</Label>
          <Input
            type="number"
            min="0"
            max="200"
            value={form.age}
            onChange={e => setForm(f => ({ ...f, age: e.target.value }))}
            className="bg-accent border-border text-sm h-8 font-mono"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Traffic Load Factor (0–1)</Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={form.trafficLoadFactor}
            onChange={e => setForm(f => ({ ...f, trafficLoadFactor: e.target.value }))}
            className="bg-accent border-border text-sm h-8 font-mono"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Material Type</Label>
          <Select value={form.materialType} onValueChange={v => setForm(f => ({ ...f, materialType: v }))}>
            <SelectTrigger className="h-8 text-sm bg-accent border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concrete">Concrete</SelectItem>
              <SelectItem value="steel">Steel</SelectItem>
              <SelectItem value="asphalt">Asphalt</SelectItem>
              <SelectItem value="compositeMaterial">Composite</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Environmental Exposure (0–1)</Label>
          <Input
            type="number"
            min="0"
            max="1"
            step="0.01"
            value={form.environmentalExposureFactor}
            onChange={e => setForm(f => ({ ...f, environmentalExposureFactor: e.target.value }))}
            className="bg-accent border-border text-sm h-8 font-mono"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground uppercase tracking-wider">Condition Rating (1–5)</Label>
          <Input
            type="number"
            min="1"
            max="5"
            step="0.1"
            value={form.structuralConditionRating}
            onChange={e => setForm(f => ({ ...f, structuralConditionRating: e.target.value }))}
            className="bg-accent border-border text-sm h-8 font-mono"
            required
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label className="text-xs text-muted-foreground uppercase tracking-wider">Notes</Label>
        <Textarea
          value={form.notes}
          onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
          className="bg-accent border-border text-sm resize-none"
          rows={2}
        />
      </div>
      <Button
        type="submit"
        disabled={updateMutation.isPending}
        className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        size="sm"
      >
        {updateMutation.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
        {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
      </Button>
      {updateMutation.isError && (
        <p className="text-xs text-red-400">Failed to update. Please try again.</p>
      )}
      {updateMutation.isSuccess && (
        <p className="text-xs text-green-400">Updated successfully! Risk score recalculated.</p>
      )}
    </form>
  );
}
