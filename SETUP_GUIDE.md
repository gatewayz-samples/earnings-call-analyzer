# 🚀 Quick Setup Guide - Earnings Call Analyzer

## Prerequisites Checklist

- ✅ Node.js 18+ or Bun installed
- ✅ Gatewayz API Key (get it from [Gatewayz](https://gatewayz.ai))

## Step-by-Step Setup

### 1. Configure Your API Key

Edit the `.env` file in the root directory and replace `your_api_key_here` with your actual Gatewayz API key:

```env
GATEWAYZ_API_KEY=gw_your_actual_api_key_here
GATEWAYZ_BASE_URL=https://api.gatewayz.ai
```

### 2. Install Dependencies (if not already done)

```bash
bun install
# or
npm install
```

### 3. Start the Development Server

```bash
bun dev
# or
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## First Run - Try the Sample

1. Open the app in your browser
2. Click the **"Load Sample"** button to load a sample earnings call transcript
3. Click **"Analyze Transcript"** to generate:
   - Executive summary
   - Sentiment analysis (POSITIVE/NEGATIVE/NEUTRAL)
4. Switch to the **"Q&A Interface"** tab
5. Try asking questions like:
   - "What were the revenue figures?"
   - "What did the CEO say about next quarter?"
   - "What is the AI strategy?"

## Using Your Own Transcripts

1. Copy an earnings call transcript from:
   - Company investor relations websites
   - Financial news sites
   - SEC filings (10-K, 10-Q, 8-K)
   - Earnings call services

2. Paste it into the textarea
3. Click "Analyze Transcript"
4. Ask questions in the Q&A tab

## API Endpoints

Your app exposes two API endpoints:

### Analyze Endpoint
- **URL**: `http://localhost:3000/api/analyze`
- **Method**: POST
- **Body**: `{ "transcript": "your text here" }`
- **Returns**: Summary + Sentiment Analysis

### Q&A Endpoint
- **URL**: `http://localhost:3000/api/qa`
- **Method**: POST
- **Body**: `{ "transcript": "your text", "question": "your question" }`
- **Returns**: Answer based on transcript

## Testing the API with cURL

```bash
# Test the analyze endpoint
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Q4 revenue was $100M, up 50% YoY. We expect continued growth in 2025."}'

# Test the Q&A endpoint
curl -X POST http://localhost:3000/api/qa \
  -H "Content-Type: application/json" \
  -d '{"transcript": "Q4 revenue was $100M, up 50% YoY.", "question": "What was the revenue?"}'
```

## Troubleshooting

### Issue: "API key not configured" error
**Solution**: Make sure you've added your Gatewayz API key to the `.env` file

### Issue: Port 3000 already in use
**Solution**: Stop other processes using port 3000 or change the port:
```bash
PORT=3001 npm run dev
```

### Issue: API requests failing
**Solution**:
1. Check your internet connection
2. Verify your API key is valid
3. Check Gatewayz API status

## Production Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables:
   - `GATEWAYZ_API_KEY`: Your API key
   - `GATEWAYZ_BASE_URL`: https://api.gatewayz.ai
4. Deploy!

### Deploying with Docker

```bash
docker build -t earnings-analyzer .
docker run -p 3000:3000 \
  -e GATEWAYZ_API_KEY=your_key \
  earnings-analyzer
```

## Performance Tips

- **Transcript Size**: Works best with transcripts between 500-5000 words
- **Response Time**: Typical analysis takes 5-15 seconds
- **Q&A Speed**: Questions typically answered in 3-8 seconds
- **Concurrent Requests**: API handles multiple requests, but may be rate-limited

## Features Overview

| Feature | Description | Time |
|---------|-------------|------|
| Summary | Extracts key metrics, guidance, quotes | ~8-12s |
| Sentiment | Classifies outlook as POSITIVE/NEGATIVE/NEUTRAL | ~5-8s |
| Q&A | Answers specific questions about transcript | ~3-8s |

## Example Use Cases

### For Financial Analysts
- Quick earnings call summaries
- Compare sentiment across quarters
- Extract specific metrics via Q&A

### For Investors
- Understand company outlook without reading full transcripts
- Track sentiment trends over time
- Get quick answers to specific concerns

### For Developers
- Use API endpoints in your own applications
- Build automated analysis pipelines
- Integrate with financial data platforms

## Next Steps

- ⭐ Star the project if you find it useful
- 📝 Customize the UI to match your needs
- 🔧 Add more AI models from Gatewayz
- 📊 Build charts/visualizations for sentiment trends
- 🗄️ Add database to save analysis results
- 🔐 Add authentication for multi-user access

## Support

- **App Issues**: Open an issue on GitHub
- **API Issues**: Contact [Gatewayz Support](https://gatewayz.ai)
- **Feature Requests**: Submit via GitHub issues

---

**Ready to analyze some earnings calls? Let's go! 🚀**
