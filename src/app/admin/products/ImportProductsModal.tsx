"use client";

import { useState, useRef, useCallback } from "react";
import {
  X, Upload, CheckCircle, XCircle, AlertTriangle,
  FileSpreadsheet, Loader2, Tag,
} from "lucide-react";

/* ------------------------------------------------------------------ */
interface ImportError {
  sheet: string;
  row: number;
  sku: string;
  error: string;
}
interface ImportResult {
  total: number;
  imported: number;
  skipped: number;
  failed: number;
  brands: number;
  brandSummary: Record<string, number>;
  errors: ImportError[];
}
type Step = "idle" | "uploading" | "done" | "error";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}
/* ------------------------------------------------------------------ */

export default function ImportProductsModal({ onClose, onSuccess }: Props) {
  const [step, setStep]             = useState<Step>("idle");
  const [progress, setProgress]     = useState(0);
  const [result, setResult]         = useState<ImportResult | null>(null);
  const [fatalError, setFatalError] = useState<string | null>(null);
  const [dragOver, setDragOver]     = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── progress animation ── */
  const animateProgress = useCallback(() => {
    setProgress(0);
    let current = 0;
    const interval = setInterval(() => {
      const increment = current < 40 ? 5 : current < 70 ? 2 : current < 88 ? 0.5 : 0;
      current = Math.min(current + increment, 88);
      setProgress(current);
      if (current >= 88) clearInterval(interval);
    }, 150);
    return () => clearInterval(interval);
  }, []);

  /* ── file selection ── */
  const handleFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["xlsx", "xls"].includes(ext ?? "")) {
      setFatalError("נא לבחור קובץ Excel בלבד (.xlsx, .xls)");
      return;
    }
    setSelectedFile(file);
    setResult(null);
    setFatalError(null);
    setStep("idle");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  /* ── import ── */
  const startImport = async () => {
    if (!selectedFile) return;
    setStep("uploading");
    setResult(null);
    setFatalError(null);
    const stopAnim = animateProgress();

    try {
      const fd = new FormData();
      fd.append("file", selectedFile);

      const res = await fetch("/api/admin/import-products", {
        method: "POST",
        body: fd,
      });
      stopAnim();
      setProgress(100);

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.error ?? `שגיאת שרת ${res.status}`);
      }

      const data: ImportResult = await res.json();
      setResult(data);
      setStep("done");
      if (data.imported > 0) onSuccess();
    } catch (err) {
      stopAnim();
      setProgress(0);
      setFatalError(err instanceof Error ? err.message : "שגיאה לא ידועה");
      setStep("error");
    }
  };

  /* ── reset ── */
  const reset = () => {
    setStep("idle");
    setSelectedFile(null);
    setResult(null);
    setFatalError(null);
    setProgress(0);
  };

  /* ============================== render ============================== */
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
        dir="rtl"
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="bg-[#c9a96e]/15 p-2 rounded-lg">
              <FileSpreadsheet className="h-5 w-5 text-[#c9a96e]" />
            </div>
            <div>
              <h2 className="font-black text-[#222021] text-lg">ייבוא מוצרים מ-Excel</h2>
              <p className="text-gray-400 text-xs">גיליון אחד לכל מותג — שורה ראשונה = כותרות</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

          {/* Drop zone */}
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onClick={() => fileRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
              transition-all duration-200
              ${dragOver
                ? "border-[#c9a96e] bg-[#c9a96e]/5"
                : selectedFile
                  ? "border-green-400 bg-green-50"
                  : "border-gray-200 hover:border-[#c9a96e] hover:bg-gray-50"
              }
            `}
          >
            <input
              ref={fileRef}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
            />
            {selectedFile ? (
              <div className="flex flex-col items-center gap-2">
                <CheckCircle className="h-10 w-10 text-green-500" />
                <p className="font-bold text-[#222021]">{selectedFile.name}</p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / 1024).toFixed(1)} KB — לחץ להחלפה
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Upload className="h-10 w-10 text-gray-300" />
                <p className="font-bold text-gray-600">גרור קובץ Excel לכאן או לחץ לבחירה</p>
                <p className="text-sm text-gray-400">.xlsx, .xls</p>
              </div>
            )}
          </div>

          {/* Format guide — shown only when no file selected */}
          {!selectedFile && (
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 text-sm" dir="rtl">
              <p className="font-bold text-blue-800 mb-3">מבנה הקובץ הנדרש:</p>
              <ul className="text-blue-700 space-y-1 mb-3 list-disc list-inside">
                <li>שם כל גיליון = שם המותג (למשל: <span className="font-mono">ברינג, טיסוט, קלאוד ברנרד</span>)</li>
                <li>שורה ראשונה = כותרות בעברית</li>
                <li>שורה 2 ואילך = נתוני מוצרים</li>
              </ul>
              <p className="font-bold text-blue-800 mb-2">עמודות מזוהות:</p>
              <div className="grid grid-cols-2 gap-x-6 gap-y-0.5 text-xs">
                {[
                  ["מותג",              "מותג"],
                  ["דגם",               "מק\"ט / דגם (חובה)"],
                  ["מין",               "קטגוריה אוטומטית"],
                  ["מחיר מחירון",       "מחיר מכירה (חובה)"],
                  ["מחיר קנייה",        "עלות (אופציונלי)"],
                  ["קישור לתמונה",      "תמונה"],
                  ["גוף / רצועה / לוח", "מפרט השעון"],
                  ["מנגנון / זכוכית",   "מפרט השעון"],
                ].map(([col, desc]) => (
                  <div key={col} className="flex gap-1.5 items-baseline">
                    <span className="font-mono text-blue-700 shrink-0">{col}</span>
                    <span className="text-gray-400">— {desc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Progress bar */}
          {step === "uploading" && (
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Loader2 className="h-4 w-4 animate-spin text-[#c9a96e]" />
                <span>מעבד גיליונות ומייבא מוצרים, אנא המתן...</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-l from-[#c9a96e] to-[#b8933a] rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-400 text-left">{Math.round(progress)}%</p>
            </div>
          )}

          {/* Fatal error */}
          {step === "error" && fatalError && (
            <div className="flex items-start gap-3 bg-red-50 rounded-xl p-4 border border-red-100">
              <XCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-700 text-sm">שגיאה בייבוא</p>
                <p className="text-red-600 text-sm mt-1">{fatalError}</p>
              </div>
            </div>
          )}

          {/* Results */}
          {step === "done" && result && (
            <div className="flex flex-col gap-4">

              {/* Summary cards */}
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-gray-50 rounded-xl p-3 text-center border border-gray-100">
                  <p className="text-2xl font-black text-[#222021]">{result.total}</p>
                  <p className="text-xs text-gray-500 mt-0.5">שורות סה״כ</p>
                </div>
                <div className="bg-green-50 rounded-xl p-3 text-center border border-green-100">
                  <p className="text-2xl font-black text-green-600">{result.imported}</p>
                  <p className="text-xs text-green-600 mt-0.5">יובאו</p>
                </div>
                <div className="bg-amber-50 rounded-xl p-3 text-center border border-amber-100">
                  <p className="text-2xl font-black text-amber-500">{result.skipped}</p>
                  <p className="text-xs text-amber-600 mt-0.5">דולגו</p>
                </div>
                <div className={`rounded-xl p-3 text-center border ${result.failed > 0 ? "bg-red-50 border-red-100" : "bg-gray-50 border-gray-100"}`}>
                  <p className={`text-2xl font-black ${result.failed > 0 ? "text-red-500" : "text-gray-400"}`}>
                    {result.failed}
                  </p>
                  <p className={`text-xs mt-0.5 ${result.failed > 0 ? "text-red-500" : "text-gray-400"}`}>נכשלו</p>
                </div>
              </div>

              {/* Success banner */}
              {result.imported > 0 && (
                <div className="flex items-center gap-3 bg-green-50 rounded-xl p-4 border border-green-100">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0" />
                  <p className="font-semibold text-green-700 text-sm">
                    יובאו {result.imported} מוצרים מ-{result.brands} מותגים בהצלחה!
                  </p>
                </div>
              )}

              {/* Brand breakdown */}
              {Object.keys(result.brandSummary).length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="font-bold text-sm text-[#222021] mb-3 flex items-center gap-2">
                    <Tag className="h-4 w-4 text-[#c9a96e]" />
                    פירוט לפי מותג
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(result.brandSummary).map(([brand, count]) => (
                      <div key={brand} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-gray-100">
                        <span className="text-sm font-semibold text-[#222021]">{brand}</span>
                        <span className="text-sm text-[#c9a96e] font-black">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Error list */}
              {result.errors.length > 0 && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <p className="font-bold text-sm text-[#222021]">שגיאות ({result.errors.length}):</p>
                  </div>
                  <div className="max-h-48 overflow-y-auto flex flex-col gap-1.5">
                    {result.errors.map((err, i) => (
                      <div key={i} className="flex items-start gap-2 bg-red-50 rounded-lg px-3 py-2 border border-red-100 text-xs">
                        <span className="text-gray-400 shrink-0 font-mono">{err.sheet} שורה {err.row}</span>
                        {err.sku !== "?" && <span className="font-bold text-gray-600 shrink-0">[{err.sku}]</span>}
                        <span className="text-red-600">{err.error}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-semibold text-sm rounded-lg transition-colors"
          >
            {step === "done" ? "סגור" : "ביטול"}
          </button>

          <button
            onClick={step === "done" ? reset : startImport}
            disabled={!selectedFile || step === "uploading"}
            className={`
              flex items-center gap-2 px-6 py-2.5 rounded-lg font-bold text-sm transition-all
              ${!selectedFile || step === "uploading"
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-[#c9a96e] hover:bg-[#b8933a] text-white"
              }
            `}
          >
            {step === "uploading" ? (
              <><Loader2 className="h-4 w-4 animate-spin" />מייבא...</>
            ) : step === "done" ? (
              <><Upload className="h-4 w-4" />ייבא קובץ נוסף</>
            ) : (
              <><Upload className="h-4 w-4" />התחל ייבוא</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
