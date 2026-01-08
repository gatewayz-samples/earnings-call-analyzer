'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Loader2, TrendingUp, TrendingDown, Minus, FileText, MessageSquare, BarChart3, Cpu, Activity, Zap } from 'lucide-react';
import { ModelSelectorModal } from '@/components/model-selector-modal';

interface AnalysisResult {
  summary: string;
  sentiment: {
    classification: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
    explanation: string;
  };
}

interface QAResult {
  question: string;
  answer: string;
}

export default function Home() {
  const [transcript, setTranscript] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [qaHistory, setQaHistory] = useState<QAResult[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isAsking, setIsAsking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState('meta-llama/llama-3.1-8b-instruct:free');
  const [isModelSelectorOpen, setIsModelSelectorOpen] = useState(false);

  const handleAnalyze = async () => {
    if (!transcript.trim()) {
      setError('Please enter an earnings call transcript');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          model: selectedModel
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const data = await response.json();
      setAnalysisResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAskQuestion = async () => {
    if (!currentQuestion.trim()) {
      setError('Please enter a question');
      return;
    }

    if (!transcript.trim()) {
      setError('Please enter a transcript first');
      return;
    }

    setIsAsking(true);
    setError(null);

    try {
      const response = await fetch('/api/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          transcript,
          question: currentQuestion,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Q&A failed');
      }

      const data = await response.json();
      setQaHistory([...qaHistory, data]);
      setCurrentQuestion('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during Q&A');
    } finally {
      setIsAsking(false);
    }
  };

  const getSentimentIcon = () => {
if (!analysisResult) return null;

    switch (analysisResult.sentiment.classification) {
      case 'POSITIVE':
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case 'NEGATIVE':
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      case 'NEUTRAL':
        return <Minus className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getSentimentColor = () => {
    if (!analysisResult) return 'default';

    switch (analysisResult.sentiment.classification) {
      case 'POSITIVE':
        return 'bg-green-600 hover:bg-green-600';
      case 'NEGATIVE':
        return 'bg-red-600 hover:bg-red-600';
      case 'NEUTRAL':
        return 'bg-gray-500 hover:bg-gray-500';
      default:
        return 'bg-gray-500 hover:bg-gray-500';
    }
  };

  const loadSampleTranscript = () => {
    const sample = `Q4 2024 Earnings Call - Tech Corp Inc.

CEO Opening Remarks:
Thank you for joining us today. I'm pleased to report that Q4 2024 was an exceptional quarter for Tech Corp. We achieved revenue of $2.8 billion, representing 28% year-over-year growth. Our net income reached $450 million, up 35% from the prior year quarter.

CFO Financial Highlights:
Our strong performance was driven by robust demand across all product lines. Cloud services revenue grew 42% to $1.2 billion. Our enterprise software segment saw 22% growth to $980 million. Operating margins expanded to 23%, up 200 basis points year-over-year.

Looking ahead to Q1 2025, we expect revenue in the range of $2.9 to $3.0 billion, representing approximately 25-30% growth. We're raising our full-year 2025 revenue guidance to $12.5 to $13 billion.

CEO Strategic Initiatives:
We're making significant investments in AI and machine learning capabilities. Our new AI platform launched in Q4 has already attracted over 500 enterprise customers. We're also expanding our international presence, with plans to open offices in three new countries in2025.

The macro environment remains challenging, but our strong balance sheet with $3.5 billion in cash and robust pipeline give us confidence in our ability to navigate any headwinds.

Q&A Session:

Analyst Question: What drove the strong cloud growth?
CFO Response: The 42% cloud growth was driven by both new customer acquisitions and expansion within existing accounts. We saw particularly strong adoption of our AI-enhanced cloud services, which now represent 30% of cloud revenue.

Analyst Question: Can you provide more color on next quarter's guidance?
CEO Response: Our Q1 guidance reflects seasonal patterns and some conservatism given macro uncertainty. However, our pipeline remains strong, and we're seeing healthy demand across all segments. The midpoint of our guidance represents 27% growth, which we believe is achievable.`;

    setTranscript(sample);
    setError(null);
  };

  const getModelDisplayName = () => {
    const parts = selectedModel.split('/');
    return parts[parts.length - 1] || selectedModel;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b border-border bg-white dark:bg-card">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-foreground mb-4 tracking-tight">
              Earnings Call Analyzer
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Infrastructure-grade NLP analysis for financial reports.
              Extract insights, analyze sentiment, and query transcripts with advanced AI.
            </p>

            {/* Model Selector Button */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="outline"
                onClick={() => setIsModelSelectorOpen(true)}
                className="border-border hover:border-primary transition-colors"
              >
                <Cpu className="h-4 w-4 mr-2" />
                <span className="font-mono text-sm">{getModelDisplayName()}</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="border-b border-border bg-secondary/30">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">100+</div>
              <div className="text-sm text-muted-foreground">AI Models</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">3</div>
              <div className="text-sm text-muted-foreground">Analysis Types</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-foreground mb-1">Real-time</div>
              <div className="text-sm text-muted-foreground">Processing</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Input Section */}
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border pb-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-semibold">Transcript Input</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                Paste an earnings call transcript or financial report
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <Textarea
                placeholder="Enter earnings call transcript here..."
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                className="min-h-[400px] font-mono text-sm border-border focus:border-primary transition-colors"
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !transcript.trim()}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Analyzing
                    </>
                  ) : (
                    <>
                      <BarChart3 className="mr-2 h-4 w-4" />
                      Analyze
                    </>
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={loadSampleTranscript}
                  className="border-border hover:border-primary"
                >
                  Load Sample
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Results Section */}
          <Card className="border-border shadow-sm">
            <CardHeader className="border-b border-border pb-6">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-primary" />
                <CardTitle className="text-xl font-semibold">Analysis Results</CardTitle>
              </div>
              <CardDescription className="text-muted-foreground">
                AI-generated insights and sentiment analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <Tabs defaultValue="summary" className="w-full">
                <TabsList className="grid w-full grid-cols-2 bg-secondary">
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="qa">Q&A</TabsTrigger>
                </TabsList>

                <TabsContent value="summary" className="space-y-6 mt-6">
                  {!analysisResult && !isAnalyzing && (
                    <div className="text-center py-16 text-muted-foreground">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-40" />
                      <p>No analysis yet. Enter a transcript and click Analyze.</p>
                    </div>
                  )}

                  {isAnalyzing && (
                    <div className="text-center py-16">
                      <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                      <p className="text-muted-foreground">Analyzing transcript...</p>
                    </div>
                  )}

                  {analysisResult && (
                    <>
                      {/* Sentiment Badge */}
                      <div className="flex items-center gap-4 p-5 bg-secondary rounded-lg border border-border">
                        {getSentimentIcon()}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-medium text-sm text-foreground">Sentiment Classification</span>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getSentimentColor()}>
                              {analysisResult.sentiment.classification}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {analysisResult.sentiment.explanation}
                          </p>
                        </div>
                      </div>

                      <Separator />

                      {/* Summary */}
                      <div>
                        <h3 className="font-medium mb-3 text-foreground">
                          Executive Summary
                        </h3>
                        <ScrollArea className="h-[300px] rounded-lg border border-border bg-secondary/30 p-5">
                          <div className="prose prose-sm max-w-none">
                            <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
                              {analysisResult.summary}
                            </p>
                          </div>
                        </ScrollArea>
                      </div>
                    </>
                  )}
                </TabsContent>

                <TabsContent value="qa" className="space-y-6 mt-6">
                  {/* Question Input */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Ask a question about the transcript..."
                        value={currentQuestion}
                        onChange={(e) => setCurrentQuestion(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && !isAsking) {
                            handleAskQuestion();
                          }
                        }}
                        disabled={!transcript.trim() || isAsking}
                        className="border-border focus:border-primary"
                      />
                      <Button
                        onClick={handleAskQuestion}
                        disabled={!currentQuestion.trim() || !transcript.trim() || isAsking}
                        className="bg-primary hover:bg-primary/90"
                      >
                        {isAsking ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <MessageSquare className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Example: "What did the CEO say about next quarter?" or "What were the revenue figures?"
                    </p>
                  </div>

                  <Separator />

                  {/* Q&A History */}
                  <ScrollArea className="h-[400px]">
                    {qaHistory.length === 0 ? (
                      <div className="text-center py-16 text-muted-foreground">
                        <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-40" />
                        <p>No questions asked yet. Enter a question above.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {qaHistory.map((qa, index) => (
                          <div key={index} className="space-y-3">
                            <div className="bg-secondary/50 border border-border p-4 rounded-lg">
                              <p className="font-medium text-sm text-foreground">
                                {qa.question}
                              </p>
                            </div>
                            <div className="bg-secondary/30 border border-border p-4 rounded-lg">
                              <p className="text-sm leading-relaxed text-foreground">
                                {qa.answer}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <Card className="border-border shadow-sm">
          <CardHeader className="border-b border-border pb-6">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-primary" />
              <CardTitle className="text-xl font-semibold">How It Works</CardTitle>
            </div>
            <CardDescription className="text-muted-foreground">
              Powered by Gatewayz AI with multiple NLP models and advanced processing
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 bg-secondary/30 border border-border rounded-lg">
                <FileText className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-medium mb-2 text-foreground">Summarization</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Extracts key revenue figures, guidance, and executive quotes from transcripts
                </p>
              </div>
              <div className="p-6 bg-secondary/30 border border-border rounded-lg">
                <TrendingUp className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-medium mb-2 text-foreground">Sentiment Analysis</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Classifies overall market outlook as positive,negative, or neutral with context
                </p>
              </div>
              <div className="p-6 bg-secondary/30 border border-border rounded-lg">
                <MessageSquare className="h-8 w-8 mb-3 text-primary" />
                <h3 className="font-medium mb-2 text-foreground">Interactive Q&A</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Ask specific questions and get accurate, context-aware answers
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Model Selector Modal */}
      <ModelSelectorModal
        open={isModelSelectorOpen}
        onOpenChange={setIsModelSelectorOpen}
        selectedModel={selectedModel}
        onSelectModel={setSelectedModel}
      />
    </div>
  );
}
