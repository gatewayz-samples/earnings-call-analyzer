# Model Selector Feature Guide

## Overview

The Earnings Call Analyzer now includes a powerful **Model Selector** feature that allows you to choose from 100+ AI models available through the Gatewayz API. This gives you flexibility to:

- Test different models for better results
- Use faster/cheaper models for quick analysis
- Leverage more powerful models for complex transcripts
- Compare outputs across different AI architectures

## Features

### 🎯 Model Selection Modal

- **2-Column Grid Layout**: Browse models in an easy-to-scan card layout
- **Real-time Search**: Filter models by name, ID, or description
- **Model Details**: See context length, pricing, and modality for each model
- **Visual Selection**: Selected model is highlighted with a checkmark
- **Responsive Design**: Works perfectly on desktop and mobile

### 🔍 Search & Filter

The search bar supports searching by:
- Model name (e.g., "llama", "gpt", "claude")
- Model ID (e.g., "meta-llama/llama-3.1-8b-instruct:free")
- Description keywords

### 📊 Model Information

Each model card displays:
- **Model Name**: Human-readable name
- **Model ID**: Full identifier used by the API
- **Description**: What the model is good for
- **Context Length**: Maximum tokens (e.g., "128K ctx")
- **Pricing**: Cost per million tokens (e.g., "$0.05/M in")
- **Modality**: Type of model (e.g., "text", "multimodal")

## How to Use

### 1. Open the Model Selector

Click the **"Model"** button at the top of the page (shows current model name).

### 2. Browse or Search

- Scroll through the grid to see all available models
- Use the search bar to filter by keywords
- Click on any model card to select it

### 3. Select Your Model

- Click on a model card to select it
- The modal will close automatically
- Your new model is now shown in the button
- All future analyses will use the selected model

### 4. Analyze with Your Model

The selected model will be used for:
- ✅ Summary generation
- ✅ Sentiment analysis
- ✅ Q&A responses

## API Integration

### Models Endpoint

**GET** `/api/models`

Fetches available models from Gatewayz API.

**Query Parameters:**
- `limit`: Number of models to return (default: 100)
- `gateway`: Gateway to use (default: "openrouter")

**Response:**
```json
{
  "data": [
    {
      "id": "meta-llama/llama-3.1-8b-instruct:free",
      "name": "Llama 3.1 8B Instruct",
      "description": "Fast and efficient model for general tasks",
      "context_length": 128000,
      "pricing": {
        "prompt": 0.00000005,
        "completion": 0.0000001
      },
      "architecture": {
        "modality": "text"
      }
    }
  ]
}
```

### Updated Analysis Endpoints

Both `/api/analyze` and `/api/qa` now accept an optional `model` parameter:

**POST** `/api/analyze`
```json
{
  "transcript": "Your transcript...",
  "model": "meta-llama/llama-3.1-8b-instruct:free"
}
```

**POST** `/api/qa`
```json
{
  "transcript": "Your transcript...",
  "question": "Your question?",
  "model": "meta-llama/llama-3.1-8b-instruct:free"
}
```

If `model` is not provided, it defaults to `meta-llama/llama-3.1-8b-instruct:free`.

## Component Architecture

### New Components

1. **`ModelSelectorModal`** (`/src/components/model-selector-modal.tsx`)
   - Modal dialog for model selection
   - Handles model fetching and search
   - 2-column responsive grid layout
   - Props:
     - `open`: boolean
     - `onOpenChange`: (open: boolean) => void
     - `selectedModel`: string
     - `onSelectModel`: (modelId: string) => void

2. **Models API Route** (`/src/app/api/models/route.ts`)
   - Proxies requests to Gatewayz `/v1/models` endpoint
   - Adds authentication headers
   - Returns formatted model data

### Updated Components

1. **Main Page** (`/src/app/page.tsx`)
   - Added model selection state
   - Added model selector button in header
   - Passes selected model to API calls
   - Shows current model name

2. **Analyze Route** (`/src/app/api/analyze/route.ts`)
   - Accepts optional `model` parameter
   - Uses selected model for both summary and sentiment

3. **Q&A Route** (`/src/app/api/qa/route.ts`)
   - Accepts optional `model` parameter
   - Uses selected model for answers

## Model Recommendations

### For Financial Analysis

**Fast & Free:**
- `meta-llama/llama-3.1-8b-instruct:free` (default)
- Good for quick analysis, free tier

**Balanced Performance:**
- `openai/gpt-3.5-turbo`
- Fast and accurate for most use cases

**High Quality:**
- `anthropic/claude-3-sonnet`
- `openai/gpt-4`
- Best for complex transcripts and detailed analysis

**Long Transcripts:**
- Look for models with high context length (128K+)
- Required for very long earnings calls

## Pricing Considerations

Models show pricing in the format:
- **"$X.XX/M in"**: Cost per million input tokens
- **"$X.XX/M out"**: Cost per million output tokens

**Example:** For a 5,000 token transcript analyzed with summary + sentiment:
- Input: ~10,000 tokens (transcript sent twice)
- Output: ~500 tokens (summary + sentiment)
- With $0.10/M in and $0.20/M out: Cost = ~$0.001-0.002

## Troubleshooting

### Models Not Loading

**Issue:** Modal shows "Loading models..." indefinitely

**Solutions:**
1. Check your Gatewayz API key in `.env`
2. Verify internet connection
3. Check browser console for errors
4. Try refreshing the page

### Model Selection Not Working

**Issue:** Selected model doesn't work for analysis

**Solutions:**
1. Make sure the model supports chat completions
2. Check model availability in your Gatewayz plan
3. Try a different model (some may be rate-limited)
4. Check API logs for error messages

### Search Not Finding Models

**Issue:** Search doesn't show expected results

**Solutions:**
- Try searching by partial name (e.g., "llama" instead of full ID)
- Clear search and browse manually
- Refresh the modal to reload models

## Future Enhancements

Potential improvements for the model selector:

- [ ] Filter by provider (OpenAI, Anthropic, Meta, etc.)
- [ ] Sort by price, context length, or popularity
- [ ] Save favorite models
- [ ] Show model performance ratings
- [ ] Display real-time availability status
- [ ] Compare models side-by-side
- [ ] Show usage statistics per model

## Technical Details

### State Management

```typescript
const [selectedModel, setSelectedModel] = useState('meta-llama/llama-3.1-8b-instruct:free');
const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);
```

### Model Display

```typescript
const getModelDisplayName = () => {
  const parts = selectedModel.split('/');
  return parts[parts.length - 1] || selectedModel;
};
```

### API Call Example

```typescript
const response = await fetch('/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    transcript,
    model: selectedModel
  }),
});
```

## Conclusion

The Model Selector feature gives you unprecedented flexibility in choosing the right AI model for your earnings call analysis. Whether you prioritize speed, cost, or quality, you can now select the perfect model for your needs.

Happy analyzing! 🚀
