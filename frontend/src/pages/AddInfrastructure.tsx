import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { MaterialType, StructureType, InfrastructureInput } from '../backend';
import { useAnalyzeAndPredict, useAddInfrastructure } from '../hooks/useQueries';
import PhotoUpload from '../components/PhotoUpload';
import PredictionResultsPanel from '../components/PredictionResultsPanel';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Save, Zap, ArrowLeft, PlusCircle } from 'lucide-react';

function generateId(): string {
  return `infra-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

interface FormState {
  name: string;
  structureType: string;
  area: string;
  latitude: string;
  longitude: string;
  age: string;
  trafficLoadFactor: string;
  materialType: string;
  environmentalExposureFactor: string;
  structuralConditionRating: string;
  notes: string;
}

const defaultForm: FormState = {
  name: '',
  structureType: 'bridge',
  area: '',
  latitude: '40.7128',
  longitude: '-74.0060',
  age: '10',
  trafficLoadFactor: '0.5',
  materialType: 'concrete',
  environmentalExposureFactor: '0.5',
  structuralConditionRating: '3.5',
  notes: '',
};

function buildInput(form: FormState, photo: string | undefined, id: string): InfrastructureInput {
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
  return {
    id,
    name: form.name,
    structureType: structureMap[form.structureType] || StructureType.bridge,
    location: {
      area: form.area,
      latitude: parseFloat(form.latitude) || 0,
      longitude: parseFloat(form.longitude) || 0,
    },
    age: BigInt(parseInt(form.age) || 0),
    trafficLoadFactor: parseFloat(form.trafficLoadFactor) || 0,
    materialType: materialMap[form.materialType] || MaterialType.concrete,
    environmentalExposureFactor: parseFloat(form.environmentalExposureFactor) || 0,
    structuralConditionRating: parseFloat(form.structuralConditionRating) || 3.5,
    notes: form.notes,
    photoBase64: photo,
  };
}

function isFormValid(form: FormState): boolean {
  return (
    form.name.trim().length > 0 &&
    form.area.trim().length > 0 &&
    !isNaN(parseFloat(form.age)) &&
    !isNaN(parseFloat(form.trafficLoadFactor)) &&
    !isNaN(parseFloat(form.environmentalExposureFactor)) &&
    !isNaN(parseFloat(form.structuralConditionRating))
  );
}

export default function AddInfrastructure() {
  const navigate = useNavigate();
  const [form, setForm] = useState<FormState>(defaultForm);
  const [photo, setPhoto] = useState<string | undefined>(undefined);
  const [newId] = useState(() => generateId());

  const analyzeMutation = useAnalyzeAndPredict();
  const addMutation = useAddInfrastructure();

  const handleAnalyze = async () => {
    if (!isFormValid(form)) return;
    const input = buildInput(form, photo, newId);
    analyzeMutation.mutate(input);
  };

  const handleSave = async () => {
    if (!isFormValid(form)) return;
    const input = buildInput(form, photo, newId);
    await addMutation.mutateAsync(input);
    navigate({ to: '/infrastructure/$id', params: { id: newId } });
  };

  const setField = (key: keyof FormState) => (value: string) =>
    setForm(f => ({ ...f, [key]: value }));

  const valid = isFormValid(form);

  return (
    <div className="flex flex-col min-h-full">
      {/* Page Header */}
      <div className="border-b border-border px-6 py-4 bg-card sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate({ to: '/' })}
            className="gap-1.5 text-muted-foreground hover:text-foreground h-8"
          >
            <ArrowLeft size={14} />
            Back
          </Button>
          <div className="w-px h-5 bg-border" />
          <div className="flex items-center gap-2">
            <PlusCircle size={16} className="text-teal" />
            <h1 className="font-semibold text-foreground">Add Infrastructure</h1>
          </div>
          <span className="text-xs text-muted-foreground font-mono ml-2">
            Upload photo + details → AI prediction
          </span>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Form */}
            <div className="space-y-5">
              {/* Photo Upload */}
              <div className="rounded-lg border border-border bg-card p-4 card-glow">
                <div className="text-xs text-muted-foreground uppercase tracking-wider mb-3 font-mono">
                  Infrastructure Photo
                </div>
                <PhotoUpload value={photo} onChange={setPhoto} />
                {photo && (
                  <p className="text-xs text-teal mt-2 font-mono">
                    ✓ Photo loaded — will be used for AI analysis
                  </p>
                )}
              </div>

              {/* Basic Info */}
              <div className="rounded-lg border border-border bg-card p-4 card-glow space-y-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
                  Basic Information
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Name *</Label>
                    <Input
                      value={form.name}
                      onChange={e => setField('name')(e.target.value)}
                      placeholder="e.g. Central Bridge"
                      className="bg-accent border-border text-sm h-8"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Structure Type</Label>
                    <Select value={form.structureType} onValueChange={setField('structureType')}>
                      <SelectTrigger className="h-8 text-sm bg-accent border-border">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bridge">🌉 Bridge</SelectItem>
                        <SelectItem value="road">🛣️ Road</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Area *</Label>
                    <Input
                      value={form.area}
                      onChange={e => setField('area')(e.target.value)}
                      placeholder="e.g. Downtown"
                      className="bg-accent border-border text-sm h-8"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Latitude</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={form.latitude}
                      onChange={e => setField('latitude')(e.target.value)}
                      className="bg-accent border-border text-sm h-8 font-mono"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Longitude</Label>
                    <Input
                      type="number"
                      step="0.0001"
                      value={form.longitude}
                      onChange={e => setField('longitude')(e.target.value)}
                      className="bg-accent border-border text-sm h-8 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Engineering Parameters */}
              <div className="rounded-lg border border-border bg-card p-4 card-glow space-y-4">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono">
                  Engineering Parameters
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Age (years) *</Label>
                    <Input
                      type="number"
                      min="0"
                      max="200"
                      value={form.age}
                      onChange={e => setField('age')(e.target.value)}
                      className="bg-accent border-border text-sm h-8 font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Material Type</Label>
                    <Select value={form.materialType} onValueChange={setField('materialType')}>
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
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Traffic Load (0–1) *</Label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={form.trafficLoadFactor}
                      onChange={e => setField('trafficLoadFactor')(e.target.value)}
                      className="bg-accent border-border text-sm h-8 font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Env. Exposure (0–1) *</Label>
                    <Input
                      type="number"
                      min="0"
                      max="1"
                      step="0.01"
                      value={form.environmentalExposureFactor}
                      onChange={e => setField('environmentalExposureFactor')(e.target.value)}
                      className="bg-accent border-border text-sm h-8 font-mono"
                      required
                    />
                  </div>
                  <div className="space-y-1.5 sm:col-span-2">
                    <Label className="text-xs text-muted-foreground uppercase tracking-wider">Condition Rating (1–5) *</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={form.structuralConditionRating}
                      onChange={e => setField('structuralConditionRating')(e.target.value)}
                      className="bg-accent border-border text-sm h-8 font-mono"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="rounded-lg border border-border bg-card p-4 card-glow space-y-2">
                <Label className="text-xs text-muted-foreground uppercase tracking-wider font-mono">Notes</Label>
                <Textarea
                  value={form.notes}
                  onChange={e => setField('notes')(e.target.value)}
                  placeholder="Additional observations, historical context..."
                  className="bg-accent border-border text-sm resize-none"
                  rows={3}
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  onClick={handleAnalyze}
                  disabled={!valid || analyzeMutation.isPending}
                  className="flex-1 gap-2 bg-teal-500/20 border border-teal-500/40 text-teal hover:bg-teal-500/30"
                  variant="ghost"
                >
                  {analyzeMutation.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Zap size={14} />
                  )}
                  {analyzeMutation.isPending ? 'Analyzing...' : 'Analyze & Predict'}
                </Button>
                <Button
                  type="button"
                  onClick={handleSave}
                  disabled={!valid || addMutation.isPending || !analyzeMutation.data}
                  className="flex-1 gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {addMutation.isPending ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Save size={14} />
                  )}
                  {addMutation.isPending ? 'Saving...' : 'Save to Database'}
                </Button>
              </div>

              {!analyzeMutation.data && valid && (
                <p className="text-xs text-muted-foreground text-center">
                  Run <span className="text-teal font-mono">Analyze & Predict</span> first to enable saving
                </p>
              )}

              {addMutation.isError && (
                <p className="text-xs text-red-400 text-center">
                  Failed to save. Please try again.
                </p>
              )}
              {analyzeMutation.isError && (
                <p className="text-xs text-red-400 text-center">
                  Analysis failed. Please check your inputs and try again.
                </p>
              )}
            </div>

            {/* Right: Prediction Results */}
            <div className="space-y-4">
              <div className="rounded-lg border border-border bg-card p-4 card-glow">
                <div className="text-xs text-muted-foreground uppercase tracking-wider font-mono mb-3">
                  AI Analysis & Prediction
                </div>
                {!analyzeMutation.data && !analyzeMutation.isPending && (
                  <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
                    <div className="p-4 rounded-full bg-teal-500/10 border border-teal-500/20">
                      <Zap size={28} className="text-teal opacity-60" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">No prediction yet</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Fill in the form{photo ? '' : ' and optionally upload a photo'}, then click{' '}
                        <span className="text-teal font-mono">Analyze & Predict</span>
                      </p>
                    </div>
                  </div>
                )}
                <PredictionResultsPanel
                  result={analyzeMutation.data ?? null}
                  isLoading={analyzeMutation.isPending}
                />
              </div>

              {/* Info Card */}
              <div className="rounded-lg border border-border bg-card/50 p-4 text-xs text-muted-foreground space-y-2">
                <div className="font-mono text-teal uppercase tracking-wider text-[10px] mb-2">How it works</div>
                <p>
                  The AI engine analyzes your uploaded photo alongside the engineering parameters to compute a
                  deterministic risk score, deterioration forecast, and budget estimate.
                </p>
                <p>
                  Different photos produce different condition scores — the image hash is incorporated into the
                  structural analysis algorithm.
                </p>
                <ul className="space-y-1 mt-2">
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal inline-block" />
                    Upload a photo of the bridge or road
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-accent inline-block" />
                    Fill in all engineering parameters
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                    Click Analyze & Predict to get results
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary inline-block" />
                    Save to Database to persist the record
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
