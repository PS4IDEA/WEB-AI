import React, { useState } from 'react';
import { Search, Globe, CheckCircle2, XCircle, Loader2, ArrowRight, Coins } from 'lucide-react';
import { Language, UserProfile } from '../../types';
import LoadingOverlay from '../ui/LoadingOverlay';

interface Props {
  language: Language;
  user?: UserProfile | null;
  onDeductCredits?: (amount: number) => boolean;
  onOpenLogin?: () => void;
}

export default function DomainChecker({ language, user, onDeductCredits, onOpenLogin }: Props) {
  const isAr = language === 'ar';
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{name: string, available: boolean, price?: string}[] | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    if (!user) {
      onOpenLogin?.();
      return;
    }

    if (onDeductCredits) {
      const success = onDeductCredits(3);
      if (!success) return; // Insufficient credits
    }
        
    setIsSearching(true);
    // Mock API call
    setTimeout(() => {
      const baseName = query.trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
      setResults([
        { name: `${baseName}.com`, available: false },
        { name: `${baseName}.io`, available: true, price: '$39.99/yr' },
        { name: `${baseName}.ai`, available: true, price: '$69.99/yr' },
        { name: `${baseName}.co`, available: true, price: '$24.99/yr' },
        { name: `${baseName}.net`, available: true, price: '$12.99/yr' },
      ]);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <>
      <LoadingOverlay isLoading={isSearching} language={language} />
      <div className="space-y-12 py-8 animate-fade-in max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <h1 className="text-3xl sm:text-5xl font-display font-bold text-slate-900 dark:text-white">
          {isAr ? 'فحص توفر الدومين' : 'Domain Name Checker'}
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {isAr 
            ? 'ابحث عن اسم النطاق المثالي لعلامتك التجارية وتحقق من توفره فوراً.' 
            : 'Find the perfect domain name for your brand and check its availability instantly.'}
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative max-w-2xl mx-auto flex flex-col gap-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Globe className="h-6 w-6 text-slate-400" />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="block w-full pl-12 pr-4 sm:pr-32 py-5 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-lg text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-0 shadow-lg shadow-slate-200/20 dark:shadow-none transition-all"
            placeholder={isAr ? 'أدخل اسم علامتك التجارية (مثال: brandforge)' : 'Enter your brand name (e.g. brandforge)'}
            dir="ltr"
          />
          <button
            type="submit"
            disabled={isSearching || !query.trim()}
            className="hidden sm:flex absolute inset-y-2 right-2 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl items-center gap-2 transition"
          >
            {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
            <span className="hidden sm:inline">{isAr ? 'بحث' : 'Search'}</span>
          </button>
        </div>
        
        {/* Mobile submit button with credits info */}
        <button
          type="submit"
          disabled={isSearching || !query.trim()}
          className="sm:hidden w-full py-4 px-6 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-xl flex justify-center items-center gap-2 transition"
        >
          {isSearching ? <Loader2 className="w-5 h-5 animate-spin" /> : <Search className="w-5 h-5" />}
          <span>{isAr ? 'بحث' : 'Search'}</span>
          <span className="flex items-center text-xs font-normal opacity-80 ml-1">
            (<Coins className="w-3 h-3 mr-1" /> 3)
          </span>
        </button>
        
        <p className="text-center text-sm text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1 sm:mt-2">
           <Coins className="w-4 h-4 text-amber-500" />
           {isAr ? 'هذه العملية تستهلك 3 رصيد' : 'This action consumes 3 credits'}
        </p>
      </form>

      {results && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm animate-fade-in-up">
          <ul className="divide-y divide-slate-100 dark:divide-slate-800">
            {results.map((domain, i) => (
              <li key={i} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition">
                <div className="flex items-center gap-4">
                  {domain.available ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                  ) : (
                    <XCircle className="w-6 h-6 text-slate-300 dark:text-slate-600 shrink-0" />
                  )}
                  <span className={`text-xl font-bold break-all ${!domain.available ? 'text-slate-400 dark:text-slate-500 line-through' : 'text-slate-900 dark:text-white'}`}>
                    {domain.name}
                  </span>
                </div>
                
                {domain.available ? (
                  <div className="flex items-center justify-between sm:justify-end gap-4">
                    <span className="text-slate-500 font-medium">{domain.price}</span>
                    <a
                      href={`https://www.namecheap.com/domains/registration/results/?domain=${encodeURIComponent(domain.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-indigo-600 dark:bg-indigo-500 text-white font-bold rounded-lg text-sm flex items-center gap-2 hover:bg-indigo-700 transition shrink-0"
                    >
                      {isAr ? 'احجز الآن (Namecheap)' : 'Get it (Namecheap)'} <ArrowRight className="w-4 h-4" />
                    </a>
                  </div>
                ) : (
                  <span className="text-slate-400 dark:text-slate-500 text-sm font-medium bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full self-start sm:self-auto">
                    {isAr ? 'غير متاح' : 'Taken'}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
    </>
  );
}
