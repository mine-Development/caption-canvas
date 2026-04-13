import { useState
} from "react";
import { Loader2, Sparkles, Copy, Check } from "lucide-react";
import ImageUploader from "@/components/ImageUploader";

// Simulated CNN+LSTM caption generation
const simulateCaptions = (): Promise<string[]> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve([
          "A group of people standing near a bus on a city street.",
          "Several pedestrians walking along a busy urban road with vehicles.",
          "A colorful scene of daily life in a vibrant city neighborhood.",
        ]),
      2500
    )
  );

const CaptionGenerator = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [captions, setCaptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState<number | null>(null);

  const handleImageSelect = (f: File, prev: string) => {
    setFile(f);
    setPreview(prev);
    setCaptions([]);
  };

  const handleClear = () => {
    setFile(null);
    setPreview(null);
    setCaptions([]);
  };

  const generate = async () => {
    if (!file) return;
    setLoading(true);
    setCaptions([]);
    const results = await simulateCaptions();
    setCaptions(results);
    setLoading(false);
  };

  const copyCaption = (text: string, i: number) => {
    navigator.clipboard.writeText(text);
    setCopied(i);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-12 max-w-3xl">
        <h1 className="font-heading text-3xl font-bold mb-2">Caption Generator</h1>
        <p className="text-muted-foreground mb-8">
          Upload an image and the CNN+LSTM model will generate descriptive captions.
        </p>

        <ImageUploader onImageSelect={handleImageSelect} preview={preview} onClear={handleClear} />

        {preview && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={generate}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-heading font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors glow-primary"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Processing through CNN → LSTM…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" /> Generate Captions
                </>
              )}
            </button>
          </div>
        )}

        {/* Pipeline indicator */}
        {loading && (
          <div className="mt-8 card-gradient border border-border/60 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              <span className="font-heading font-semibold text-sm">Processing Pipeline</span>
            </div>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse-glow" />
                Extracting features via CNN encoder (ResNet-50)…
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" style={{ animationDelay: "0.5s" }} />
                Generating word sequence via LSTM decoder…
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-muted-foreground animate-pulse-glow" style={{ animationDelay: "1s" }} />
                Beam search for optimal captions…
              </div>
            </div>
          </div>
        )}

        {/* Results */}
        {captions.length > 0 && (
          <div className="mt-8 space-y-3">
            <h3 className="font-heading font-semibold text-lg">Generated Captions</h3>
            {captions.map((cap, i) => (
              <div
                key={i}
                className="card-gradient border border-border/60 rounded-xl p-4 flex items-start justify-between gap-3 animate-slide-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div>
                  <span className="text-xs font-medium text-accent mr-2">#{i + 1}</span>
                  <span className="text-foreground">{cap}</span>
                </div>
                <button
                  onClick={() => copyCaption(cap, i)}
                  className="shrink-0 p-1.5 rounded-md hover:bg-secondary transition-colors"
                >
                  {copied === i ? <Check className="h-4 w-4 text-accent" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CaptionGenerator;
