'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Loader2, Search, Check, Cpu } from 'lucide-react';

interface Model {
  id: string;
  name?: string;
  description?: string;
  context_length?: number;
  pricing?: {
    prompt?: number;
    completion?: number;
  };
  architecture?: {
    modality?: string;
    tokenizer?: string;
  };
}

interface ModelSelectorModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
}

export function ModelSelectorModal({
  open,
  onOpenChange,
  selectedModel,
  onSelectModel,
}: ModelSelectorModalProps) {
  const [models, setModels] = useState<Model[]>([]);
  const [filteredModels, setFilteredModels] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (open && models.length === 0) {
      fetchModels();
    }
  }, [open]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredModels(models);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = models.filter((model) => {
        const modelId = model.id.toLowerCase();
const modelName = model.name?.toLowerCase() || '';
        const modelDesc = model.description?.toLowerCase() || '';
        return modelId.includes(query) || modelName.includes(query) || modelDesc.includes(query);
      });
      setFilteredModels(filtered);
    }
  }, [searchQuery, models]);

  const fetchModels = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/models?limit=100&gateway=openrouter');

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch models');
      }

      const data = await response.json();

      // Handle different response structures
      let modelsList: Model[] = [];
      if (data.data && Array.isArray(data.data)) {
        modelsList = data.data;
      } else if (Array.isArray(data)) {
        modelsList = data;
      }

      setModels(modelsList);
      setFilteredModels(modelsList);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch models');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectModel = (modelId: string) => {
    onSelectModel(modelId);
    onOpenChange(false);
  };

  const formatContextLength = (length?: number) => {
    if (!length) return 'N/A';
    if (length >= 1000000) return `${(length / 1000000).toFixed(1)}M`;
    if (length >= 1000) return `${(length / 1000).toFixed(0)}K`;
    return length.toString();
  };

  const formatPrice = (price?: number) => {
    if (!price) return 'N/A';
    return `$${(price * 1000000).toFixed(2)}/M`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] border-border">
        <DialogHeader className="border-b border-border pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Cpu className="h-5 w-5 text-primary" />
            Select AI Model
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Choose from {models.length} available models powered by Gatewayz
          </DialogDescription>
        </DialogHeader>

        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search models by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-border focus:border-primary"
          />
        </div>

        {/* Error State */}
        {error && (
          <div className="text-center py-8 text-destructive">
            <p>{error}</p>
            <Button onClick={fetchModels} variant="outline" className="mt-4 border-border">
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <Loader2 className="h-8 w-8 mx-auto mb-3 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading models...</p>
          </div>
        )}

        {/* Models Grid */}
        {!isLoading && !error && (
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredModels.map((model) => {
                const isSelected = model.id === selectedModel;
                return (
                  <button
                    key={model.id}
                    onClick={() => handleSelectModel(model.id)}
                    className={`
                      text-left p-4 rounded-lg border transition-all
                      hover:border-primary hover:shadow-sm
${isSelected ? 'border-primary bg-secondary/30' : 'border-border'}
                    `}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate mb-1 text-foreground">
                          {model.name || model.id}
                        </h3>
                        <p className="text-xs text-muted-foreground truncate font-mono">
                          {model.id}
                        </p>
                      </div>
                      {isSelected && (
                        <Check className="h-5 w-5 text-primary flex-shrink-0 ml-2" />
                      )}
                    </div>

                    {model.description && (
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
                        {model.description}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {model.context_length && (
                        <Badge variant="secondary" className="text-xs">
                          {formatContextLength(model.context_length)} ctx
                        </Badge>
                      )}
                      {model.pricing?.prompt && (
                        <Badge variant="outline" className="text-xs">
                          {formatPrice(model.pricing.prompt)} in
                        </Badge>
                      )}
                      {model.architecture?.modality && (
                        <Badge variant="outline" className="text-xs">
                          {model.architecture.modality}
                        </Badge>
                      )}
                    </div>
                  </button>
                );
              })}
</div>

            {filteredModels.length === 0 && !isLoading && (
              <div className="text-center py-12 text-muted-foreground">
                <p>No models found matching "{searchQuery}"</p>
              </div>
            )}
          </ScrollArea>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <p className="text-xs text-muted-foreground">
            {filteredModels.length} of {models.length} models
          </p>
          <Button variant="outline" onClick={() => onOpenChange(false)} className="border-border">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
