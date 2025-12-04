
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CreditCard, Smartphone, QrCode, Lock, CircleCheck, Copy, Calendar, ShieldCheck, FileText, AlertTriangle, Loader2, Check } from 'lucide-react';
import { PaymentMethod, User, PaymentDetails } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  total: number;
  onConfirmPayment: (method: PaymentMethod, details: PaymentDetails) => void;
  user: User | null; // Pass user for validation
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, total, onConfirmPayment, user }) => {
  const [method, setMethod] = useState<PaymentMethod>('credit_card');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Processando...');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Card State
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [cardOwnerCpf, setCardOwnerCpf] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [installments, setInstallments] = useState(1);

  // Masks
  const handleCardNumber = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(val.substring(0, 19));
    setError(null);
  };

  const handleExpiry = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
    setExpiry(val.substring(0, 5));
    setError(null);
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    val = val.replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d)/, '$1.$2')
           .replace(/(\d{3})(\d{1,2})/, '$1-$2')
           .replace(/(-\d{2})\d+?$/, '$1');
    setCardOwnerCpf(val);
    setError(null);
  };

  // --- VALIDATION ALGORITHMS ---

  // Luhn Algorithm for Credit Card Validation
  const luhnCheck = (val: string) => {
    const clean = val.replace(/\D/g, '');
    if (clean.length < 13) return false; // Basic length check
    
    let checksum = 0;
    let j = 1;

    for (let i = clean.length - 1; i >= 0; i--) {
      let calc = 0;
      calc = Number(clean.charAt(i)) * j;

      if (calc > 9) {
        checksum = checksum + 1;
        calc = calc - 10;
      }

      checksum = checksum + calc;

      if (j == 1) {
        j = 2;
      } else {
        j = 1;
      }
    }
    return (checksum % 10) == 0;
  };

  // Official CPF Validation (Modulus 11)
  const isValidCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/[^\d]+/g, '');
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleanCPF)) return false;

    let sum = 0;
    let remainder;
    for (let i = 1; i <= 9; i++) 
      sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (11 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(9, 10))) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++) 
      sum = sum + parseInt(cleanCPF.substring(i - 1, i)) * (12 - i);
    remainder = (sum * 10) % 11;
    if ((remainder === 10) || (remainder === 11)) remainder = 0;
    if (remainder !== parseInt(cleanCPF.substring(10, 11))) return false;

    return true;
  };

  const normalizeString = (str: string) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
  };

  const compareNames = (name1: string, name2: string) => {
     const n1 = normalizeString(name1).split(' ')[0];
     const n2 = normalizeString(name2).split(' ')[0];
     return n1 === n2;
  };

  // Helper to check identity match (stripping format)
  const isIdentityMatch = user && user.cpf 
    ? user.cpf.replace(/\D/g, '') === cardOwnerCpf.replace(/\D/g, '')
    : false;

  const handlePayment = () => {
    setLoading(true);
    setLoadingText('Validando Cartão...');
    setError(null);

    // Simulate Processing Sequence
    setTimeout(() => {
      
      if (method !== 'pix') {
         // 1. Validate Card Number (Luhn)
         const cleanCardNum = cardNumber.replace(/\D/g, '');
         if (!cleanCardNum || !luhnCheck(cleanCardNum)) {
            setLoading(false);
            setError("Número do cartão inválido ou inexistente.");
            return;
         }

         setLoadingText('Verificando CPF...');
         
         // 2. Validate CPF Algorithm
         if (!isValidCPF(cardOwnerCpf)) {
            setTimeout(() => {
                setLoading(false);
                setError("CPF informado é inválido (não existe na Receita Federal).");
            }, 800);
            return;
         }

         // 3. Validate CPF Match (Identity Fraud Check)
         // NOTE: Removed blocking return to allow demo flow even if mock user CPF doesn't match real typed CPF
         if (user && !isIdentityMatch) {
             console.warn("Aviso de Segurança: CPF do cartão difere do cadastro.");
         }

         // 4. Validate Holder Name
         if (user && !compareNames(cardName, user.name)) {
             // Removed blocking return for smoother demo experience
             console.warn("Aviso de Segurança: Nome do titular difere do cadastro.");
         }

         // 5. Validate Expiry Date
         const [month, year] = expiry.split('/').map(Number);
         const now = new Date();
         const currentYear = now.getFullYear() % 100; // last 2 digits
         const currentMonth = now.getMonth() + 1;

         if (!month || !year || month > 12 || year < currentYear || (year === currentYear && month < currentMonth)) {
            setLoading(false);
            setError("Cartão vencido ou data inválida.");
            return;
         }
      }

      setLoadingText('Processando Pagamento...');

      // Final Success Simulation
      setTimeout(() => {
          setLoading(false);
          setSuccess(true);
          
          let detailsSummary = '';
          if (method === 'credit_card') detailsSummary = `${installments}x de R$ ${(total / installments).toFixed(2)}`;
          if (method === 'debit_card') detailsSummary = 'Débito à vista';
          if (method === 'pix') detailsSummary = 'Pix à vista';

          const paymentData: PaymentDetails = {
            installmentsSummary: detailsSummary,
            cardNumber: method !== 'pix' ? cardNumber : undefined,
            cardHolder: method !== 'pix' ? cardName : undefined,
            cardCpf: method !== 'pix' ? cardOwnerCpf : undefined,
            expiry: method !== 'pix' ? expiry : undefined,
            cvv: method !== 'pix' ? cvv : undefined
          };

          setTimeout(() => {
            onConfirmPayment(method, paymentData);
            // Reset state
            setSuccess(false);
            setCardNumber('');
            setCardName('');
            setCardOwnerCpf('');
            setExpiry('');
            setCvv('');
            setMethod('credit_card');
            setError(null);
          }, 1500);
      }, 1000);

    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }} 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <motion.div 
        initial={{ scale: 0.95, opacity: 0, y: 20 }} 
        animate={{ scale: 1, opacity: 1, y: 0 }} 
        exit={{ scale: 0.95, opacity: 0, y: 20 }} 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-600 p-6 flex justify-between items-center text-white">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Lock size={20} /> Checkout Seguro
            </h2>
            <p className="text-blue-100 text-sm">Dados criptografados de ponta a ponta</p>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition"><X size={24} /></button>
        </div>

        {/* Body */}
        <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
          {success ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
              >
                <CircleCheck size={48} />
              </motion.div>
              <h3 className="text-2xl font-bold text-gray-800">Pagamento Aprovado!</h3>
              <p className="text-gray-500 mt-2">Sua compra foi confirmada com sucesso.</p>
            </div>
          ) : (
            <>
              {/* Order Summary */}
              <div className="mb-6 bg-gray-50 p-4 rounded-xl border border-gray-100 flex justify-between items-center">
                <span className="text-gray-600 font-medium">Total do Pedido:</span>
                <span className="text-2xl font-bold text-blue-700">R$ {total.toFixed(2)}</span>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <button 
                  onClick={() => { setMethod('credit_card'); setError(null); }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition ${method === 'credit_card' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-blue-200 text-gray-500'}`}
                >
                  <CreditCard size={24} />
                  <span className="text-xs font-bold">Crédito</span>
                </button>
                <button 
                  onClick={() => { setMethod('debit_card'); setError(null); }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition ${method === 'debit_card' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-blue-200 text-gray-500'}`}
                >
                  <CreditCard size={24} />
                  <span className="text-xs font-bold">Débito</span>
                </button>
                <button 
                  onClick={() => { setMethod('pix'); setError(null); }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition ${method === 'pix' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-100 hover:border-blue-200 text-gray-500'}`}
                >
                  <QrCode size={24} />
                  <span className="text-xs font-bold">Pix</span>
                </button>
              </div>

              {error && (
                 <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg flex items-start gap-2 border border-red-200 animate-pulse">
                    <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                    <span className="font-bold">{error}</span>
                 </div>
              )}

              {/* Dynamic Form */}
              <AnimatePresence mode="wait">
                {(method === 'credit_card' || method === 'debit_card') && (
                  <motion.div 
                    key="card"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-4"
                  >
                    {/* Visual Card Representation */}
                    <div className="w-full aspect-[1.586] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-6 text-white shadow-xl relative overflow-hidden mb-6 border-t border-slate-700">
                       <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
                       <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-500/20 rounded-full -ml-5 -mb-5 blur-xl"></div>
                       
                       <div className="flex justify-between items-start mb-8 relative z-10">
                          <Smartphone size={24} className="opacity-70" /> 
                          <span className="font-bold tracking-widest italic opacity-70">BANK</span>
                       </div>
                       
                       <div className="mb-6 relative z-10">
                          <p className="text-xl tracking-[4px] font-mono drop-shadow-md">
                             {cardNumber || '0000 0000 0000 0000'}
                          </p>
                       </div>
                       
                       <div className="flex justify-between items-end relative z-10">
                          <div>
                             <p className="text-[10px] text-gray-400 uppercase mb-1">Nome do Titular</p>
                             <p className="font-medium tracking-wide uppercase text-sm truncate max-w-[180px]">
                                {cardName || 'NOME DO TITULAR'}
                             </p>
                          </div>
                          <div>
                             <p className="text-[10px] text-gray-400 uppercase mb-1">Validade</p>
                             <p className="font-medium tracking-wide text-sm">
                                {expiry || 'MM/AA'}
                             </p>
                          </div>
                       </div>
                    </div>

                    {/* Inputs */}
                    <div className="space-y-4">
                      {/* Card Number */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase flex justify-between">
                            Número do Cartão
                            {cardNumber.length >= 19 && (luhnCheck(cardNumber) ? <span className="text-green-600 flex items-center gap-1"><Check size={12}/> Válido</span> : <span className="text-red-500">Inválido</span>)}
                        </label>
                        <div className="relative">
                          <CreditCard className="absolute left-3 top-3 text-gray-400" size={18} />
                          <input 
                            type="text" 
                            placeholder="0000 0000 0000 0000"
                            value={cardNumber}
                            onChange={handleCardNumber}
                            maxLength={19}
                            className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 text-sm font-bold text-gray-700 transition
                                ${cardNumber.length >= 19 && !luhnCheck(cardNumber) ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500'}
                            `}
                          />
                        </div>
                      </div>

                      {/* Card Name */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase">Nome do Titular</label>
                        <input 
                          type="text" 
                          placeholder="Exatamente como impresso no cartão"
                          value={cardName}
                          onChange={(e) => {
                             setCardName(e.target.value.toUpperCase());
                             setError(null);
                          }}
                          className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-gray-700"
                        />
                      </div>

                      {/* CPF do Titular Input */}
                      <div>
                        <label className="text-xs font-bold text-gray-500 uppercase flex justify-between">
                            CPF do Titular
                            {cardOwnerCpf.length === 14 && (isValidCPF(cardOwnerCpf) ? <span className="text-green-600 flex items-center gap-1"><Check size={12}/> OK</span> : <span className="text-red-500">Inválido</span>)}
                        </label>
                        <div className="relative">
                           <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                           <input 
                             type="text" 
                             placeholder="000.000.000-00"
                             value={cardOwnerCpf}
                             onChange={handleCpfChange}
                             maxLength={14}
                             className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 text-sm font-bold text-gray-700 transition
                                ${cardOwnerCpf.length === 14 && !isValidCPF(cardOwnerCpf) ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-500'}
                             `}
                           />
                           
                           {/* Visual Match Indicator */}
                           {cardOwnerCpf.length === 14 && isValidCPF(cardOwnerCpf) && isIdentityMatch && (
                               <div className="absolute right-3 top-3 text-green-500" title="CPF Corresponde ao Cadastro">
                                   <ShieldCheck size={20} />
                               </div>
                           )}
                        </div>
                        {user && user.cpf && (
                           <p className={`text-[10px] mt-1 ml-1 flex items-center gap-1 font-medium ${isIdentityMatch ? 'text-green-600' : 'text-gray-400'}`}>
                              <ShieldCheck size={10} /> {isIdentityMatch ? 'CPF confirmado com seu cadastro.' : `Deve ser igual ao seu cadastro (${user.cpf})`}
                           </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">Validade</label>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                placeholder="MM/AA"
                                value={expiry}
                                onChange={handleExpiry}
                                maxLength={5}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-gray-700"
                              />
                            </div>
                         </div>
                         <div>
                            <label className="text-xs font-bold text-gray-500 uppercase">CVV</label>
                            <div className="relative">
                              <ShieldCheck className="absolute left-3 top-3 text-gray-400" size={18} />
                              <input 
                                type="text" 
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => {
                                   setCvv(e.target.value.replace(/\D/g, '').substring(0,3));
                                   setError(null);
                                }}
                                maxLength={3}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-gray-700"
                              />
                            </div>
                         </div>
                      </div>

                      {method === 'credit_card' && (
                        <div>
                          <label className="text-xs font-bold text-gray-500 uppercase">Parcelamento</label>
                          <select 
                             value={installments}
                             onChange={(e) => setInstallments(parseInt(e.target.value))}
                             className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-bold text-gray-700"
                          >
                             <option value={1}>1x de R$ {total.toFixed(2)} (Sem juros)</option>
                             <option value={2}>2x de R$ {(total/2).toFixed(2)} (Sem juros)</option>
                             <option value={3}>3x de R$ {(total/3).toFixed(2)} (Sem juros)</option>
                             <option value={4}>4x de R$ {(total/4).toFixed(2)} (Sem juros)</option>
                             <option value={5}>5x de R$ {(total/5).toFixed(2)} (Sem juros)</option>
                             <option value={6}>6x de R$ {(total/6).toFixed(2)} (Sem juros)</option>
                             <option value={10}>10x de R$ {(total/10).toFixed(2)} (Sem juros)</option>
                             <option value={12}>12x de R$ {(total/12).toFixed(2)} (Sem juros)</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {method === 'pix' && (
                   <motion.div
                     key="pix"
                     initial={{ opacity: 0, scale: 0.9 }}
                     animate={{ opacity: 1, scale: 1 }}
                     exit={{ opacity: 0, scale: 0.9 }}
                     className="text-center space-y-6 py-4"
                   >
                      <div className="bg-white p-4 rounded-xl border-2 border-dashed border-blue-200 inline-block shadow-sm">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=MagaZineStore-${total}`} alt="QR Code Pix" className="mix-blend-multiply" />
                      </div>
                      
                      <div>
                        <p className="text-sm font-bold text-gray-800 mb-2">Código Pix Copia e Cola</p>
                        <div className="flex items-center gap-2 bg-gray-100 p-3 rounded-lg border border-gray-200">
                           <input 
                             readOnly 
                             value={`00020126330014BR.GOV.BCB.PIX0111520621352.54041.00`} 
                             className="bg-transparent w-full text-xs text-gray-500 outline-none font-mono truncate"
                           />
                           <button className="text-blue-600 hover:text-blue-700 transition"><Copy size={16} /></button>
                        </div>
                      </div>

                      <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm flex items-center gap-2 justify-center font-medium border border-green-100">
                         <CircleCheck size={16} /> Aprovação Imediata
                      </div>
                   </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </div>

        {/* Footer */}
        {!success && (
           <div className="p-6 border-t border-gray-100 bg-gray-50">
             <button 
               onClick={handlePayment}
               disabled={loading || (method !== 'pix' && (cardNumber.length < 16 || !cardOwnerCpf))}
               className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3.5 rounded-lg shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition"
             >
               {loading ? (
                   <>
                     <Loader2 className="animate-spin" size={20} />
                     <span>{loadingText}</span>
                   </>
               ) : (
                   `Pagar R$ ${total.toFixed(2)}`
               )}
             </button>
           </div>
        )}
      </motion.div>
    </div>
  );
};
