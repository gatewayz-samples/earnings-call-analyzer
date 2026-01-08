# Earnings Call Analyzer

A powerful financial analysis tool powered by **Gatewayz AI** that analyzes earnings call transcripts and financial reports using advanced NLP models.

## Features

### 1. 📊 Summarization
- Automatically extracts key revenue figures and financial metrics
- Identifies future guidance and projections
- Captures notable executive quotes
- Highlights key strategic initiatives

### 2. 💹 Sentiment Analysis
- Classifies overall outlook as **POSITIVE**, **NEGATIVE**, or **NEUTRAL**
- Provides detailed explanation of sentiment classification
- Analyzes executive confidence and market indicators

### 3. 💬 Interactive Q&A
- Ask specific questions about the transcript
- Get accurate, context-aware answers
- Maintains conversation history
- Example questions:
  - "What did the CEO say about next quarter?"
  - "What were the revenue figures?"
  - "What is the company's AI strategy?"

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **UI Components**: Radix UI, Tailwind CSS, Lucide Icons
- **AI Backend**: Gatewayz AI API
  - Model: `meta-llama/llama-3.1-8b-instruct:free`
  - Multiple specialized prompts for different tasks

## Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Gatewayz API Key

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd earnings-call-analyzer
```

2. Install dependencies:
```bash
bun install
# or
npm install
```

3. Configure environment variables:

Create a `.env` file in the root directory:
```env
GATEWAYZ_API_KEY=your_api_key_here
GATEWAYZ_BASE_URL=https://api.gatewayz.ai
```

4. Run the development server:
```bash
bun dev
# or
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. **Load Sample**: Click "Load Sample" to see a sample earnings call transcript
2. **Paste Transcript**: Or paste your own earnings call transcript in the input area
3. **Analyze**: Click "Analyze Transcript" to generate summary and sentiment analysis
4. **Ask Questions**: Switch to the Q&A tab to ask specific questions about the transcript

## API Routes

### POST `/api/analyze`
Analyzes a transcript and returns summary + sentiment analysis

**Request:**
```json
{
  "transcript": "Your earnings call transcript..."
}
```

**Response:**
```json
{
  "summary": "Detailed summary...",
  "sentiment": {
    "classification": "POSITIVE",
    "explanation": "The earnings call demonstrates..."
  }
}
```

### POST `/api/qa`
Answers questions about the transcript

**Request:**
```json
{
  "transcript": "Your earnings call transcript...",
  "question": "What did the CEO say about revenue?"
}
```

**Response:**
```json
{
  "question": "What did the CEO say about revenue?",
  "answer": "According to the transcript, the CEO mentioned..."
}
```

## How It Works

The application uses Gatewayz AI API to power three distinct NLP tasks:

1. **Summarization Model**: Processes the full transcript with a specialized prompt to extract key financial information
2. **Sentiment Classification**: Analyzes the overall tone and outlook with a focused sentiment analysis prompt
3. **Q&A Retrieval**: Uses conversational AI to answer specific questions based on transcript context

All three tasks use the same underlying model (`meta-llama/llama-3.1-8b-instruct:free`) but with different prompting strategies optimized for each use case.

## Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── analyze/
│   │   │   │   └── route.ts       # Summary & sentiment API
│   │   │   └── qa/
│   │   │       └── route.ts       # Q&A API
│   │   ├── layout.tsx             # Root layout
│   │   ├── page.tsx               # Main page component
│   │   └── globals.css
│   └── components/
│       └── ui/                    # Shadcn UI components
├── .env                           # Environment variables
└── package.json
```

## Deployment

This is a standard Next.js application and can be deployed to:

- **Vercel** (recommended for Next.js)
- **Netlify**
- **Docker** (Dockerfile included)
- Any Node.js hosting platform

### Environment Variables for Production

Make sure to set these environment variables in your hosting platform:

```
GATEWAYZ_API_KEY=your_production_api_key
GATEWAYZ_BASE_URL=https://api.gatewayz.ai
```

## Use Cases

This application is ideal for:

- **Financial Analysts**: Quickly digest earnings calls and extract key metrics
- **Investors**: Get sentiment analysis and key insights without reading full transcripts
- **Researchers**: Interactive Q&A to find specific information in financial documents
- **Portfolio Managers**: Efficiently analyze multiple earnings calls
- **Financial News Writers**: Extract quotes and key points for articles

## Showcase: Gatewayz AI Capabilities

This demo showcases several powerful capabilities of the Gatewayz API:

✅ **Long Document Processing**: Handles full earnings call transcripts (typically 2000-5000 words)
✅ **Multi-Task NLP**: Combines summarization, classification, and Q&A in one application
✅ **Numerical Data Understanding**: Accurately extracts and interprets financial figures
✅ **Context-Aware Responses**: Q&A feature maintains context and provides accurate answers
✅ **Production-Ready API**: Fast, reliable, and easy to integrate

## License

MIT

## Support

For issues with the Gatewayz API, please contact [Gatewayz Support](https://gatewayz.ai)

For application issues, please open an issue in this repository.

---

**Built with ❤️ using Gatewayz AI**
# earnings-call-analyzer
