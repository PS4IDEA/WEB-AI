import React, { useState } from 'react';
import { Volume2, Sparkles, CheckCircle2, XCircle, BookOpen, MessageSquare, Coins, Loader2, RefreshCw, Send, ArrowRight, Copy, Check, FileText } from 'lucide-react';
import { Language, UserProfile } from '../../types';
import LoadingOverlay from '../ui/LoadingOverlay';

interface Props {
  language: Language;
  user?: UserProfile | null;
  onDeductCredits?: (amount: number) => boolean;
  onOpenLogin?: () => void;
  isEmbedded?: boolean;
}

export default function BrandVoice({ language, user, onDeductCredits, onOpenLogin, isEmbedded }: Props) {
  const isAr = language === 'ar';
  
  const [brandName, setBrandName] = useState('');
  const [brandDescription, setBrandDescription] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [sampleText, setSampleText] = useState('');
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleAnalyze = async () => {
    if (!brandDescription.trim()) return;

    if (!user) {
      onOpenLogin?.();
      return;
    }

    setError(null);

    if (onDeductCredits) {
      const success = onDeductCredits(3);
      if (!success) return; // Insufficient credits
    }

    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/brand-voice-analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          brandName,
          brandDescription,
          targetAudience,
          sampleText,
          language: isAr ? 'ar' : 'en',
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze brand voice');
      }

      const data = await response.json();
      if (data.success && data.analysis) {
        setResults(data.analysis);
      } else {
        throw new Error(data.error || 'Failed to parse brand voice profile');
      }
    } catch (err: any) {
      console.error('[Brand Voice Error]', err);
      setError(
        isAr 
          ? 'عذراً، حدث خطأ أثناء الاتصال بمحرك التحليل اللغوي الذكي. يرجى التحقق من الاتصال والمحاولة لاحقاً.' 
          : 'Sorry, an error occurred with the AI linguistic analyzer. Please check your connection and try again.'
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyGuide = () => {
    if (!results) return;
    const textToCopy = JSON.stringify(results, null, 2);
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <LoadingOverlay isLoading={isAnalyzing} language={language} />
      
      <div className={`space-y-12 animate-fade-in max-w-5xl mx-auto ${isEmbedded ? '' : 'py-8 px-4'}`}>
        {/* Header Section */}
        {!isEmbedded && (
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Volume2 className="w-4 h-4 animate-pulse" />
              {isAr ? 'مساعد الهوية اللغوية المتقدم' : 'Premium Brand Voice Architect'}
            </div>
            <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white flex items-center justify-center gap-3">
              {isAr ? 'تحليل نبرة الصوت اللغوية' : 'Brand Voice Analysis'}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-sm sm:text-base">
              {isAr 
                ? 'حلل شخصية علامتك التجارية، وابتكر دليلاً لغوياً متكاملاً يتناسب مع جمهورك المستهدف ويحقق نبرة تواصل قوية ومتناسقة.' 
                : 'Analyze your brand personality, design a cohesive linguistic style guide, and speak to your target audience with maximum impact.'}
            </p>
          </div>
        )}

        {/* Input Form Section */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-10 shadow-xl space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand Name */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'اسم العلامة التجارية' : 'Brand Name'}
              </label>
              <input 
                type="text"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder={isAr ? 'مثال: نسيج، ريادة...' : 'e.g. InnovateX, Bloom Coffee...'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Target Audience */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
                {isAr ? 'الجمهور المستهدف' : 'Target Audience / Persona'}
              </label>
              <input 
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder={isAr ? 'مثال: جيل الشباب المهتم بالتقنية والإنتاجية' : 'e.g. Young professionals seeking premium convenience'}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Brand Description (Required) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
              {isAr ? 'وصف العلامة التجارية ومهمتها الأساسية' : 'Brand Description & Core Mission'}
              <span className="text-rose-500">*</span>
            </label>
            <textarea 
              value={brandDescription}
              onChange={(e) => setBrandDescription(e.target.value)}
              rows={4}
              placeholder={isAr 
                ? 'صف طبيعة عملك، وقيمك الأساسية، وما الذي يميز خدماتك عن المنافسين بالتفصيل...' 
                : 'Describe your brand purpose, core values, services, and what truly makes you unique in detail...'}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Sample Text (Optional) */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 dark:text-slate-300">
              {isAr ? 'نموذج من كتاباتك الحالية (اختياري)' : 'Optional Brand Copy Sample'}
            </label>
            <textarea 
              value={sampleText}
              onChange={(e) => setSampleText(e.target.value)}
              rows={3}
              placeholder={isAr 
                ? 'أدخل منشوراً، أو بريداً إلكترونياً، أو إعلاناً قمت بكتابته سابقاً لنقوم بتحليله وتصحيحه...' 
                : 'Paste a post, email, or ad copy you have written previously to analyze or improve...'}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Action Trigger Button */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
            <span className="text-xs text-slate-500">
              {isAr ? '* الحقول المميزة بعلامة مطلوبة.' : '* Required fields.'}
            </span>
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !brandDescription.trim()}
              className="w-full sm:w-auto px-8 py-4 bg-indigo-600 dark:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-500/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5 text-amber-300" />}
              {isAr ? 'تحليل نبرة الصوت وصياغة الدليل' : 'Analyze Voice & Create Guide'}
              <span className="flex items-center text-xs font-normal opacity-90 ml-1">
                (<Coins className="w-3.5 h-3.5 mr-0.5" /> 3)
              </span>
            </button>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="p-4 bg-rose-50 border border-rose-200 dark:bg-rose-950/20 dark:border-rose-900/50 rounded-2xl text-rose-700 dark:text-rose-400 text-sm font-medium flex items-center gap-2 animate-fade-in">
            <span>⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Brand Voice Guide Results Display */}
        {results && (
          <div className="space-y-10 animate-fade-in-up">
            {/* Summary & Archetype Header */}
            <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <Volume2 className="w-64 h-64" />
              </div>
              <div className="relative z-10 space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="px-3 py-1 bg-indigo-500/30 border border-indigo-400/30 text-indigo-300 rounded-lg text-xs font-semibold uppercase tracking-wider">
                    {isAr ? 'هوية نبرة الصوت اللغوية' : 'Brand Voice Archetype'}
                  </span>
                  <button 
                    onClick={handleCopyGuide}
                    className="ml-auto text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-medium transition-colors"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    {copied ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الدليل الكامل' : 'Copy Full Guide')}
                  </button>
                </div>

                <div className="space-y-2">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                    {results.voiceProfile?.name}
                  </h2>
                  <p className="text-slate-300 text-base sm:text-lg max-w-3xl leading-relaxed">
                    {results.voiceProfile?.summary}
                  </p>
                </div>
              </div>
            </div>

            {/* Linguistic Traits */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-500" />
                {isAr ? 'ركائز نبرة الصوت اللغوية' : 'Linguistic Tone Pillars'}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {results.traits?.map((trait: any, i: number) => (
                  <div key={i} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
                        <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                          {trait.trait}
                        </h4>
                      </div>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {trait.description}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-700 dark:text-emerald-400 block">{isAr ? 'إفعل:' : 'DO:'}</strong>
                          <span className="text-slate-500 dark:text-slate-400">{trait.do}</span>
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs">
                        <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-rose-700 dark:text-rose-400 block">{isAr ? 'تجنب:' : 'DON\'T:'}</strong>
                          <span className="text-slate-500 dark:text-slate-400">{trait.dont}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Detailed Style Guide Rules */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <h3 className="text-xl font-bold text-slate-950 dark:text-white flex items-center gap-2 pb-4 border-b border-slate-100 dark:border-slate-800">
                <FileText className="w-5 h-5 text-indigo-500" />
                {isAr ? 'قواعد الأسلوب والكتابة الرسمية' : 'Writing & Style Rules'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Formatting */}
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                      {isAr ? 'هيكل وبنية الجملة' : 'Sentence Structure'}
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {results.styleGuide?.sentenceLength}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                      {isAr ? 'قواعد الترقيم والرموز التعبيرية' : 'Punctuation & Emojis'}
                    </h4>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      {results.styleGuide?.punctuation}
                    </p>
                  </div>
                </div>

                {/* Vocabulary Lexicon */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Preferred Vocabulary */}
                  <div className="p-4 bg-emerald-50/55 dark:bg-emerald-950/15 border border-emerald-100/60 dark:border-emerald-900/40 rounded-2xl space-y-3">
                    <h4 className="text-sm font-bold text-emerald-800 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      {isAr ? 'كلمات نفضلها' : 'Words to Embrace'}
                    </h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 font-medium list-disc list-inside">
                      {results.styleGuide?.wordsToUse?.map((w: string, idx: number) => (
                        <li key={idx} className="truncate">{w}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Forbidden Vocabulary */}
                  <div className="p-4 bg-rose-50/55 dark:bg-rose-950/15 border border-rose-100/60 dark:border-rose-900/40 rounded-2xl space-y-3">
                    <h4 className="text-sm font-bold text-rose-800 dark:text-rose-400 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4 text-rose-500" />
                      {isAr ? 'كلمات نتجنبها' : 'Words to Avoid'}
                    </h4>
                    <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1.5 font-medium list-disc list-inside">
                      {results.styleGuide?.wordsToAvoid?.map((w: string, idx: number) => (
                        <li key={idx} className="truncate">{w}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Adaptations by Channel */}
            <div className="space-y-4">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-950 dark:text-white flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-indigo-500" />
                {isAr ? 'كيف نتواصل في قنواتنا المختلفة؟' : 'Adaptation by Channel'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Social Media */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500" />
                    {isAr ? 'شبكات التواصل الاجتماعي' : 'Social Media Content'}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {results.channelGuidelines?.socialMedia}
                  </p>
                </div>

                {/* Customer Support */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    {isAr ? 'خدمة ودعم العملاء' : 'Customer Support & Chat'}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {results.channelGuidelines?.customerSupport}
                  </p>
                </div>

                {/* Marketing Copy */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
                  <h4 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500" />
                    {isAr ? 'التسويق والإعلانات' : 'Marketing & Ad Copy'}
                  </h4>
                  <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                    {results.channelGuidelines?.marketing}
                  </p>
                </div>
              </div>
            </div>

            {/* Before / After Copy Makeover */}
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-950 dark:text-white">
                  {isAr ? 'تحويل وإعادة صياغة النصوص' : 'Linguistic Copy Makeover'}
                </h3>
                <p className="text-slate-500 text-xs">
                  {isAr ? 'مثال حي على كيفية تطبيق نبرة الصوت المحددة لإعادة صياغة العبارات التقليدية.' : 'A live showcase of rewriting standard, generic copy to express your specific brand voice traits.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Generic / Before */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 relative">
                  <span className="absolute top-4 right-4 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                    {isAr ? 'الصيغة التقليدية' : 'Standard / Before'}
                  </span>
                  <div className="space-y-3 pt-6">
                    <p className="text-slate-600 dark:text-slate-400 text-sm italic">
                      "{results.beforeAfter?.original}"
                    </p>
                  </div>
                </div>

                {/* Brand Voice / After */}
                <div className="bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100/70 dark:border-indigo-900/50 rounded-2xl p-6 relative">
                  <span className="absolute top-4 right-4 bg-indigo-600 dark:bg-indigo-500 text-white px-2.5 py-1 rounded-full text-[10px] font-bold uppercase">
                    {isAr ? 'بعد تطبيق نبرتك الفريدة' : 'Brand Voice / After'}
                  </span>
                  <div className="space-y-3 pt-6">
                    <p className="text-indigo-950 dark:text-indigo-200 text-sm font-semibold leading-relaxed">
                      "{results.beforeAfter?.rewritten}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Makeover Explanation */}
              <div className="p-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                <strong>{isAr ? 'لماذا تعمل هذه الصياغة بشكل أفضل؟' : 'Linguistic explanation:'}</strong> {results.beforeAfter?.explanation}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
