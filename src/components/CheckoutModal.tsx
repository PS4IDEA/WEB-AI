import React, { useState, useEffect } from 'react';
import { CreditCard, Lock, CheckCircle2, Loader2, ShieldCheck, Info, X } from 'lucide-react';
import { Language } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  itemName: string;
  price: number;
  language: Language;
  userEmail?: string;
  userDisplayName?: string;
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onSuccess,
  itemName,
  price,
  language,
  userEmail = '',
  userDisplayName = ''
}: CheckoutModalProps) {
  const isAr = language === 'ar';

  // Form states
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [zip, setZip] = useState('');

  // Status states
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0); // 0: auth, 1: capturing, 2: completing
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCardNumber('');
      setCardName(userDisplayName || '');
      setExpiry('');
      setCvv('');
      setZip('');
      setIsProcessing(false);
      setProcessingStep(0);
      setIsSuccess(false);
      setError('');
    }
  }, [isOpen, userDisplayName]);

  if (!isOpen) return null;

  // Formatting helpers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    
    // Add spaces every 4 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || '';
    setCardNumber(formatted);
    setError('');
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    
    if (value.length > 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`);
    } else {
      setExpiry(value);
    }
    setError('');
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.slice(0, 3);
    setCvv(value);
    setError('');
  };

  const handleZipChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.slice(0, 10);
    setZip(value);
    setError('');
  };

  const handleAutofillDemo = () => {
    setCardNumber('4111 2222 3333 4444');
    setCardName(userDisplayName || 'Alex Morgan');
    setExpiry('12/29');
    setCvv('382');
    setZip('94103');
    setError('');
  };

  // Detect card network
  const getCardType = () => {
    const rawNumber = cardNumber.replace(/\s/g, '');
    if (rawNumber.startsWith('4')) return 'visa';
    if (/^5[1-5]/.test(rawNumber)) return 'mastercard';
    if (/^3[47]/.test(rawNumber)) return 'amex';
    return 'unknown';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    const rawNumber = cardNumber.replace(/\s/g, '');
    if (rawNumber.length < 16) {
      setError(isAr ? 'الرجاء إدخال رقم بطاقة صالح يتكون من 16 رقماً.' : 'Please enter a valid 16-digit card number.');
      return;
    }
    if (!cardName.trim()) {
      setError(isAr ? 'الرجاء إدخال اسم حامل البطاقة.' : 'Please enter cardholder name.');
      return;
    }
    if (expiry.length < 5) {
      setError(isAr ? 'الرجاء إدخال تاريخ انتهاء صلاحية صالح (MM/YY).' : 'Please enter a valid expiry date (MM/YY).');
      return;
    }
    const [month, year] = expiry.split('/').map(Number);
    if (!month || month < 1 || month > 12) {
      setError(isAr ? 'شهر انتهاء الصلاحية غير صالح.' : 'Expiry month is invalid.');
      return;
    }
    if (cvv.length < 3) {
      setError(isAr ? 'الرجاء إدخال رمز الأمان (CVV) المكون من 3 أرقام.' : 'Please enter a valid 3-digit CVV.');
      return;
    }

    // Trigger simulation sequence
    setIsProcessing(true);
    setProcessingStep(0);

    // Phase 1: Contacting bank
    setTimeout(() => {
      setProcessingStep(1);
      // Phase 2: Capturing funds
      setTimeout(() => {
        setProcessingStep(2);
        // Phase 3: Finalizing order
        setTimeout(() => {
          setIsProcessing(false);
          setIsSuccess(true);
          // Fire success callback after payment is completed
          onSuccess();
        }, 800);
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl relative overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-500" />
            <h3 className="font-display font-bold text-lg text-slate-800 dark:text-white">
              {isAr ? 'الدفع الآمن والترقية' : 'Secure Checkout & Upgrade'}
            </h3>
          </div>
          <button 
            onClick={onClose} 
            disabled={isProcessing}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-grow">
          {isSuccess ? (
            /* SUCCESS STATE */
            <div className="text-center py-8 space-y-5 animate-fade-in">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 text-emerald-500 mb-2">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display font-bold text-xl text-slate-850 dark:text-white">
                  {isAr ? 'تمت عملية الدفع بنجاح!' : 'Payment Successful!'}
                </h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                  {isAr 
                    ? `لقد تم إتمام المعاملة بنجاح وتلقائيًا تم شحن الرصيد لحسابك المرتبط بالبريد الإلكتروني ${userEmail || ''}`
                    : `Your mock payment of $${price} for ${itemName} has been processed. Credits have been automatically loaded onto ${userEmail || 'your account'}.`}
                </p>
              </div>

              {/* Order summary card */}
              <div className="bg-slate-50 dark:bg-slate-850 border border-slate-100 dark:border-slate-800/60 rounded-2xl p-4 text-left space-y-2.5 max-w-sm mx-auto text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-400">{isAr ? 'المنتج:' : 'Product:'}</span>
                  <span className="font-bold text-slate-700 dark:text-white">{itemName}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2">
                  <span className="text-slate-400">{isAr ? 'القيمة المدفوعة:' : 'Amount Charged:'}</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">${price}.00</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2">
                  <span className="text-slate-400">{isAr ? 'رقم المعاملة:' : 'Transaction ID:'}</span>
                  <span className="font-mono text-[10px] text-slate-500">TXN-{Math.floor(Math.random() * 900000) + 100000}</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs px-8 py-3 rounded-xl transition cursor-pointer"
                >
                  {isAr ? 'متابعة العمل' : 'Continue to Workspace'}
                </button>
              </div>
            </div>
          ) : isProcessing ? (
            /* PROCESSING STATE */
            <div className="text-center py-12 space-y-6 animate-fade-in">
              <div className="relative inline-flex items-center justify-center">
                <Loader2 className="w-16 h-16 text-indigo-600 dark:text-indigo-400 animate-spin" />
                <ShieldCheck className="w-6 h-6 text-emerald-500 absolute" />
              </div>
              <div className="space-y-2">
                <h4 className="font-display font-semibold text-slate-800 dark:text-white text-sm">
                  {processingStep === 0 && (isAr ? 'جاري الاتصال بقنوات الدفع المشفرة...' : 'Contacting secure gateway...')}
                  {processingStep === 1 && (isAr ? 'جاري التحقق من رصيد البطاقة وتفويض المعاملة...' : 'Authorizing card details...')}
                  {processingStep === 2 && (isAr ? 'جاري توليد الفاتورة التلقائية وتحديث الرصيد...' : 'Finalizing purchase & allocating credits...')}
                </h4>
                <p className="text-[10px] text-slate-400 tracking-wider uppercase font-semibold">
                  {isAr ? 'يرجى عدم إغلاق هذه الصفحة' : 'Please do not refresh or close this modal'}
                </p>
              </div>
            </div>
          ) : (
            /* EDITING STATE / INPUT FORM */
            <div className="space-y-5 animate-fade-in">
              {/* Item cost preview header */}
              <div className="bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100/50 dark:border-indigo-900/30 rounded-2xl p-4 flex items-center justify-between text-xs">
                <div>
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-indigo-500">{isAr ? 'العنصر المختار' : 'Selected Item'}</span>
                  <span className="font-bold text-slate-750 dark:text-white">{itemName}</span>
                </div>
                <div className="text-right">
                  <span className="block text-[10px] uppercase font-bold tracking-wider text-indigo-500">{isAr ? 'الإجمالي' : 'Total Price'}</span>
                  <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">${price}.00</span>
                </div>
              </div>

              {/* Card input form fields */}
              <form onSubmit={handleSubmit} className="space-y-5 animate-fade-in">
                {/* Holographic Credit Card representation */}
                <div className="relative w-full h-44 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 p-6 text-white shadow-xl flex flex-col justify-between overflow-hidden border border-slate-700/50">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl"></div>
                  <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl"></div>
                  
                  <div className="flex justify-between items-start z-10">
                    <div className="flex flex-col">
                      <span className="text-[9px] uppercase tracking-widest text-slate-400 font-semibold">{isAr ? 'بطاقة دفع افتراضية' : 'Sandbox Checkout Card'}</span>
                      <span className="text-xs font-bold text-indigo-300">BrandForge Pay</span>
                    </div>
                    {/* Card type icon representation */}
                    <div className="h-6 w-10 flex items-center justify-end">
                      {getCardType() === 'visa' && (
                        <span className="text-sm font-bold italic text-sky-400">VISA</span>
                      )}
                      {getCardType() === 'mastercard' && (
                        <span className="text-sm font-bold italic text-amber-500">MC</span>
                      )}
                      {getCardType() === 'amex' && (
                        <span className="text-sm font-bold italic text-emerald-400">AMEX</span>
                      )}
                      {getCardType() === 'unknown' && (
                        <CreditCard className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                  </div>

                  {/* Holographic Chip */}
                  <div className="w-9 h-7 bg-amber-300/80 rounded-md border border-amber-400/40 relative overflow-hidden z-10 shadow-sm">
                    <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-amber-600/30"></div>
                    <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 border-l border-amber-600/30"></div>
                  </div>

                  {/* Card number display */}
                  <div className="text-lg font-mono tracking-widest text-slate-100 z-10 font-medium">
                    {cardNumber || '•••• •••• •••• ••••'}
                  </div>

                  <div className="flex justify-between items-end z-10 text-[10px]">
                    <div>
                      <span className="block text-[8px] uppercase text-slate-400 tracking-wider">{isAr ? 'حامل البطاقة' : 'Cardholder'}</span>
                      <span className="font-medium tracking-wide uppercase">{cardName || 'ALEX MORGAN'}</span>
                    </div>
                    <div className="text-right">
                      <span className="block text-[8px] uppercase text-slate-400 tracking-wider">{isAr ? 'تاريخ الانتهاء' : 'Expires'}</span>
                      <span className="font-mono font-medium">{expiry || 'MM/YY'}</span>
                    </div>
                  </div>
                </div>

                {/* Card input fields */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-semibold text-slate-750 dark:text-slate-350">{isAr ? 'تفاصيل بطاقة الائتمان' : 'Card Details'}</span>
                    <button
                      type="button"
                      onClick={handleAutofillDemo}
                      className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer bg-indigo-50 dark:bg-indigo-950/40 px-2 py-1 rounded-md"
                    >
                      <span>💡</span>
                      <span>{isAr ? 'تعبئة تلقائية للبطاقة التجريبية' : 'Autofill Demo Card'}</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {isAr ? 'الاسم على البطاقة' : 'Cardholder Name'}
                      </label>
                      <input
                        type="text"
                        required
                        value={cardName}
                        onChange={(e) => { setCardName(e.target.value); setError(''); }}
                        placeholder="e.g. Alex Morgan"
                        className="w-full text-xs px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        {isAr ? 'رقم البطاقة' : 'Card Number'}
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          required
                          value={cardNumber}
                          onChange={handleCardNumberChange}
                          placeholder="4111 2222 3333 4444"
                          className="w-full text-xs pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                        />
                        <CreditCard className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {isAr ? 'تاريخ الانتهاء' : 'Expiry'}
                        </label>
                        <input
                          type="text"
                          required
                          value={expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full text-xs text-center py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          CVV
                        </label>
                        <input
                          type="password"
                          required
                          value={cvv}
                          onChange={handleCvvChange}
                          placeholder="•••"
                          className="w-full text-xs text-center py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                        />
                      </div>
                      <div className="col-span-1">
                        <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          {isAr ? 'الرمز البريدي' : 'Postal Code'}
                        </label>
                        <input
                          type="text"
                          required
                          value={zip}
                          onChange={handleZipChange}
                          placeholder="94103"
                          className="w-full text-xs text-center py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error Alert if any */}
                {error && (
                  <div className="p-3 bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-400 border border-rose-100 dark:border-rose-900 rounded-xl text-[11px] font-semibold animate-fade-in">
                    ⚠️ {error}
                  </div>
                )}

                {/* Secure Info Alert */}
                <div className="flex gap-2 p-3 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-100/40 dark:border-emerald-900/20 rounded-xl text-[10px] text-emerald-700 dark:text-emerald-400 leading-relaxed">
                  <Info className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>
                    {isAr 
                      ? 'بيانات الدفع مشفرة بنسبة 100٪ بترميز SSL 256-bit ونظام الحماية الثلاثي ثلاثي الأبعاد. لا يتم حفظ رقم بطاقتك أبداً في خوادمنا.'
                      : '100% Secure SSL 256-bit connection. This is a sandbox testing interface. Feel free to use the Quick Autofill button or enter mock credit card details.'}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="pt-2 flex gap-3">
                  <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-white font-semibold py-3.5 rounded-xl text-xs transition cursor-pointer"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3.5 rounded-xl text-xs shadow-lg shadow-indigo-600/10 transition cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>
                      {isAr ? `دفع $${price}.00 الآن` : `Pay $${price}.00 Now`}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
