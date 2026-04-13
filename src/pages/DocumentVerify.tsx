import { useState } from "react";
import { Upload, ShieldCheck, ShieldAlert, Loader2, FileCheck, AlertTriangle } from "lucide-react";

type Result = { verified: boolean; confidence: number; details: string[] };

const simulateVerification = (): Promise<Result> =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          verified: Math.random() > 0.3,
          confidence: Math.round(85 + Math.random() * 14),
          details: [
            "Metadata integrity check passed",
            "Font consistency analysis completed",
            "Layout structure validated",
            "Digital signature verification attempted",
          ],
        }),
      2000
    )
  );

const DocumentVerify = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  const handleFile = (f: File) => {
    setFile(f);
    setResult(null);
  };

  const verify = async () => {
    if (!file) return;
    setLoading(true);
    setResult(null);
    const res = await simulateVerification();
    setResult(res);
    setLoading(false);
  };

  return (
    <div className="min-h-screen pt-16">
      <div className="container py-12 max-w-2xl">
        <h1 className="font-heading text-3xl font-bold mb-2">Document Verification</h1>
        <p className="text-muted-foreground mb-8">
          AI-powered document authenticity verification using deep learning analysis.
        </p>

        {/* Upload */}
        <label className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-border/60 p-10 cursor-pointer hover:border-primary/50 hover:bg-secondary/30 transition-all">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10">
            <Upload className="h-7 w-7 text-primary" />
          </div>
          <div className="text-center">
            <p className="font-heading font-semibold text-foreground">
              {file ? file.name : "Upload document for verification"}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Supports PDF, JPG, PNG</p>
          </div>
          <input
            type="file"
            accept="image/*,.pdf"
            className="hidden"
            onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
          />
        </label>

        {file && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={verify}
              disabled={loading}
              className="inline-flex items-center gap-2 rounded-lg px-6 py-3 font-heading font-semibold text-sm bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-colors glow-primary"
            >
              {loading ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
              ) : (
                <><ShieldCheck className="h-4 w-4" /> Verify Document</>
              )}
            </button>
          </div>
        )}

        {/* Result */}
        {result && (
          <div className={`mt-8 rounded-xl border p-6 animate-slide-up ${
            result.verified
              ? "border-accent/40 card-gradient"
              : "border-destructive/40 card-gradient"
          }`}>
            <div className="flex items-center gap-3 mb-4">
              {result.verified ? (
                <FileCheck className="h-8 w-8 text-accent" />
              ) : (
                <AlertTriangle className="h-8 w-8 text-destructive" />
              )}
              <div>
                <h3 className="font-heading font-bold text-lg">
                  {result.verified ? "Document Verified" : "Verification Failed"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Confidence: {result.confidence}%
                </p>
              </div>
            </div>

            {/* Confidence bar */}
            <div className="mb-5">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${
                    result.verified ? "bg-accent" : "bg-destructive"
                  }`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>

            <h4 className="font-heading font-semibold text-sm mb-3">Analysis Details</h4>
            <ul className="space-y-2">
              {result.details.map((d) => (
                <li key={d} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                  {d}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentVerify;
