
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, User as UserIcon, ArrowRight, Loader2, Eye, EyeOff, Check, AlertCircle, ShieldCheck, FileText, MapPin, Home, Navigation, Users, Calendar, AlertTriangle, Hash, Landmark, ArrowLeft, MailOpen, SearchCheck } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false); // Identity check
  const [isLoadingCep, setIsLoadingCep] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [cpf, setCpf] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [motherName, setMotherName] = useState('');
  
  // Address State
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [addressNumber, setAddressNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [reference, setReference] = useState('');

  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI State
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // --- MASKS & HELPERS ---
  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .replace(/(-\d{3})\d+?$/, '$1');
  };

  const formatDate = (value: string) => {
    return value
      .replace(/\D/g, '')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{2})(\d)/, '$1/$2')
      .replace(/(\d{4})\d+?$/, '$1');
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCpf(formatCPF(e.target.value));
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBirthDate(formatDate(e.target.value));
  };

  const handleCepChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCep = formatCEP(e.target.value);
    setCep(newCep);

    if (newCep.replace(/\D/g, '').length === 8) {
      fetchAddress(newCep.replace(/\D/g, ''));
    }
  };

  const fetchAddress = async (cleanCep: string) => {
    setIsLoadingCep(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      if (!data.erro) {
        setStreet(data.logradouro);
        setNeighborhood(data.bairro);
        setCity(`${data.localidade} - ${data.uf}`);
        setErrors(prev => {
          const newErr = { ...prev };
          delete newErr.street;
          delete newErr.neighborhood;
          delete newErr.city;
          return newErr;
        });
      } else {
        setErrors(prev => ({ ...prev, cep: "CEP não encontrado." }));
      }
    } catch (error) {
      console.error("Erro ao buscar CEP", error);
      setErrors(prev => ({ ...prev, cep: "Erro ao buscar CEP." }));
    } finally {
      setIsLoadingCep(false);
    }
  };

  // --- VALIDATION ALGORITHMS ---
  
  const isValidCPF = (cpf: string) => {
    const cleanCPF = cpf.replace(/[^\d]+/g, '');
    if (cleanCPF.length !== 11) return false;
    
    // Check for known invalid CPFs (all digits equal)
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

  const isFullName = (name: string) => {
    return name.trim().split(' ').length >= 2;
  };

  const isValidDate = (dateString: string) => {
    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return false;
    const [day, month, year] = dateString.split('/').map(Number);
    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;
    if (year < 1900 || year > new Date().getFullYear()) return false;
    const date = new Date(year, month - 1, day);
    return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
  };

  const calculateAge = (dateString: string) => {
    const [day, month, year] = dateString.split('/').map(Number);
    const today = new Date();
    let age = today.getFullYear() - year;
    const m = today.getMonth() - (month - 1);
    if (m < 0 || (m === 0 && today.getDate() < day)) {
      age--;
    }
    return age;
  };

  const getPasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = getPasswordStrength(password);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    setGlobalError(null);

    if (mode === 'register') {
      if (!name.trim()) newErrors.name = "Nome completo é obrigatório.";
      else if (!isFullName(name)) newErrors.name = "Digite seu nome e sobrenome.";

      if (!cpf) newErrors.cpf = "CPF é obrigatório.";
      else if (!isValidCPF(cpf)) newErrors.cpf = "CPF inválido.";

      if (!birthDate) newErrors.birthDate = "Data de nascimento é obrigatória.";
      else if (!isValidDate(birthDate)) newErrors.birthDate = "Data inválida.";
      else if (calculateAge(birthDate) < 18) newErrors.birthDate = "Você precisa ter mais de 18 anos.";

      if (!motherName.trim()) newErrors.motherName = "Nome da mãe é obrigatório.";
      else if (!isFullName(motherName)) newErrors.motherName = "Digite o nome completo da mãe.";

      if (cep.length < 9) newErrors.cep = "CEP é obrigatório.";
      if (!street.trim()) newErrors.street = "Endereço é obrigatório.";
      if (!addressNumber.trim()) newErrors.addressNumber = "Número é obrigatório.";
      if (!neighborhood.trim()) newErrors.neighborhood = "Bairro é obrigatório.";
      if (!city.trim()) newErrors.city = "Cidade é obrigatória.";

      if (email !== confirmEmail) newErrors.confirmEmail = "Os e-mails não coincidem.";
      if (password !== confirmPassword) newErrors.confirmPassword = "As senhas não coincidem.";
      if (strengthScore < 5) newErrors.password = "Senha muito fraca.";
    }

    if (!email) newErrors.email = "E-mail é obrigatório.";
    else if (!email.includes('@')) newErrors.email = "Digite um e-mail válido.";
    
    if (!password) newErrors.password = "Senha é obrigatória.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const checkReceitaFederal = async () => {
    return new Promise<{ success: boolean; message?: string }>((resolve) => {
      // Simulate API latency
      setTimeout(() => {
        // Robustness Check 1: CPF Math Validation
        if (!isValidCPF(cpf)) {
          resolve({ success: false, message: "CPF inválido ou incorreto." });
          return;
        }

        // Robustness Check 2: Name Consistency
        if (name.trim().split(' ').length < 2) {
          resolve({ success: false, message: "Nome incompleto. Informe Nome e Sobrenome conforme documento." });
          return;
        }

        // Robustness Check 3: Mother's Name Consistency
        if (motherName.trim().split(' ').length < 2) {
          resolve({ success: false, message: "Nome da mãe incompleto. Informe conforme documento." });
          return;
        }

        // Robustness Check 4: Self-Reference Check (Simple Heuristic)
        if (name.trim().toLowerCase() === motherName.trim().toLowerCase()) {
           resolve({ success: false, message: "Nome do usuário e nome da mãe não podem ser idênticos." });
           return;
        }

        // Robustness Check 5: Age Verification
        const age = calculateAge(birthDate);
        if (age < 18) {
           resolve({ success: false, message: "Cadastro negado. Titular menor de 18 anos." });
           return;
        }

        resolve({ success: true });
      }, 3000);
    });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (mode === 'register') {
      // Step 1: Simulate Identity Verification with Receita Federal
      setIsVerifying(true);
      
      try {
        const verification = await checkReceitaFederal();

        if (verification.success) {
          // Success: Register User Immediately
          const userData: User = {
            name: name,
            email: email,
            avatar: `https://ui-avatars.com/api/?name=${name}&background=0D8ABC&color=fff&size=128`,
            role: 'user',
            cpf: cpf 
          };
          onLogin(userData);
          onClose();
          resetForm();
        } else {
          setGlobalError(`ERRO NA VERIFICAÇÃO: ${verification.message || "Dados inconsistentes com a Receita Federal."}`);
        }
      } catch (err) {
        setGlobalError("Erro de comunicação com o servidor de validação.");
      } finally {
        setIsVerifying(false);
      }
      
    } else {
      // Login Mode
      setIsLoading(true);
      
      // --- MASTER USER CREDENTIAL CHECK ---
      // Added trim() to avoid issues with accidental spaces
      if (email.trim() === 'suporte@suporte.com' && password.trim() === '102030$') {
         setTimeout(() => {
           const adminUser: User = {
             name: 'Administrador Master',
             email: 'suporte@suporte.com',
             avatar: 'https://ui-avatars.com/api/?name=Admin+Master&background=1e293b&color=fff&size=128',
             role: 'admin',
             cpf: '000.000.000-00'
           };
           onLogin(adminUser);
           setIsLoading(false);
           onClose();
           resetForm();
         }, 1000);
         return;
      }

      setTimeout(() => {
        const userData: User = {
          name: 'Cliente Maga',
          email: email,
          avatar: `https://ui-avatars.com/api/?name=Cliente+Maga&background=0D8ABC&color=fff&size=128`,
          role: 'user',
          cpf: '123.456.789-00' // Mock CPF for existing user login
        };
        onLogin(userData);
        setIsLoading(false);
        onClose();
        resetForm();
      }, 1500);
    }
  };

  const resetForm = () => {
    setName('');
    setCpf('');
    setBirthDate('');
    setMotherName('');
    setCep('');
    setStreet('');
    setAddressNumber('');
    setComplement('');
    setReference('');
    setNeighborhood('');
    setCity('');
    setEmail('');
    setConfirmEmail('');
    setPassword('');
    setConfirmPassword('');
    setErrors({});
    setShowPassword(false);
    setGlobalError(null);
  };

  useEffect(() => {
    if (!isOpen) resetForm();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative z-10 flex flex-col max-h-[90vh]"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/80 hover:text-white transition z-20 bg-black/10 hover:bg-black/20 rounded-full p-1"
        >
          <X size={20} />
        </button>

        {/* Header Graphic */}
        <div className="bg-gradient-to-br from-blue-700 to-blue-500 p-8 text-white flex-shrink-0 relative overflow-hidden rounded-t-2xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-yellow-400/20 rounded-full -ml-10 -mb-10 blur-xl"></div>
          
          <h2 className="text-3xl font-bold mb-2 relative z-10">
            {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
          </h2>
          <p className="text-blue-100 text-sm relative z-10">
            {mode === 'login' 
              ? 'Acesse seus pedidos, favoritos e ofertas exclusivas.' 
              : 'Junte-se a nós e ganhe frete grátis na primeira compra.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 flex-shrink-0">
          <button 
            onClick={() => { setMode('login'); setErrors({}); setGlobalError(null); }}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition relative ${mode === 'login' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            Entrar
            {mode === 'login' && <motion.div layoutId="auth-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
          <button 
            onClick={() => { setMode('register'); setErrors({}); setGlobalError(null); }}
            className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition relative ${mode === 'register' ? 'text-blue-600 bg-blue-50/50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'}`}
          >
            Cadastrar
            {mode === 'register' && <motion.div layoutId="auth-tab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />}
          </button>
        </div>

        {/* --- NORMAL FORM UI --- */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
          
          {globalError && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 text-red-700"
            >
                <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
                <p className="text-sm font-bold leading-tight">{globalError}</p>
            </motion.div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4">
            
            <AnimatePresence mode="popLayout">
              {mode === 'register' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Register Fields (Name, CPF, etc) - Keep same logic */}
                    {/* Name Field */}
                  <div className="relative group">
                    <UserIcon className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" size={20} />
                    <input 
                      type="text" 
                      placeholder="Nome Completo"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
                        ${errors.name ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}
                      `}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.name}</p>}
                  </div>

                  {/* CPF Field */}
                  <div className="relative group">
                    <FileText className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" size={20} />
                    <input 
                      type="text" 
                      placeholder="CPF (000.000.000-00)"
                      value={cpf}
                      maxLength={14}
                      onChange={handleCpfChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
                        ${errors.cpf ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}
                      `}
                    />
                    {errors.cpf && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.cpf}</p>}
                  </div>

                  {/* Date of Birth Field */}
                  <div className="relative group">
                    <Calendar className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" size={20} />
                    <input 
                      type="text" 
                      placeholder="Data de Nascimento (DD/MM/AAAA)"
                      value={birthDate}
                      maxLength={10}
                      onChange={handleDateChange}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
                        ${errors.birthDate ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}
                      `}
                    />
                    {errors.birthDate && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.birthDate}</p>}
                  </div>

                  {/* Mother's Name Field */}
                  <div className="relative group">
                    <Users className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" size={20} />
                    <input 
                      type="text" 
                      placeholder="Nome Completo da Mãe"
                      value={motherName}
                      onChange={(e) => setMotherName(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
                        ${errors.motherName ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}
                      `}
                    />
                    {errors.motherName && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.motherName}</p>}
                  </div>

                  {/* Address Section */}
                  <div className="pt-2">
                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1">
                      <MapPin size={14} /> Endereço de Entrega
                    </h4>
                    
                    <div className="grid grid-cols-3 gap-3">
                      {/* CEP */}
                      <div className="col-span-1 relative group">
                        <input 
                          type="text" 
                          placeholder="CEP"
                          value={cep}
                          maxLength={9}
                          onChange={handleCepChange}
                          className={`w-full px-3 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
                            ${errors.cep ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}
                          `}
                        />
                        {isLoadingCep && (
                          <div className="absolute right-2 top-3.5">
                            <Loader2 size={16} className="animate-spin text-blue-500" />
                          </div>
                        )}
                      </div>
                      
                      {/* Cidade */}
                      <div className="col-span-2 relative group">
                        <Navigation className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" size={16} />
                        <input 
                          type="text" 
                          placeholder="Cidade"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          className={`w-full pl-9 pr-3 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
                            ${errors.city ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}
                          `}
                        />
                      </div>
                    </div>
                    {(errors.cep || errors.city) && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/>Preencha o endereço.</p>}

                    {/* Street and Number Row */}
                    <div className="grid grid-cols-3 gap-3 mt-3">
                      {/* Rua */}
                      <div className="relative group col-span-2">
                        <Home className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" size={16} />
                        <input 
                          type="text" 
                          placeholder="Rua"
                          value={street}
                          onChange={(e) => setStreet(e.target.value)}
                          className={`w-full pl-9 pr-3 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
                            ${errors.street ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}
                          `}
                        />
                      </div>

                      {/* Number */}
                      <div className="relative group col-span-1">
                        <Hash className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" size={16} />
                        <input 
                          type="text" 
                          placeholder="Número"
                          value={addressNumber}
                          onChange={(e) => setAddressNumber(e.target.value)}
                          className={`w-full pl-9 pr-3 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
                            ${errors.addressNumber ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}
                          `}
                        />
                      </div>
                    </div>
                    {(errors.street || errors.addressNumber) && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/>Rua e número são obrigatórios.</p>}

                    {/* Neighborhood and Complement Row */}
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {/* Bairro */}
                      <div className="relative group col-span-1">
                        <input 
                          type="text" 
                          placeholder="Bairro"
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          className={`w-full px-3 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
                            ${errors.neighborhood ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}
                          `}
                        />
                      </div>

                      {/* Complemento */}
                      <div className="relative group col-span-1">
                        <input 
                          type="text" 
                          placeholder="Complemento"
                          value={complement}
                          onChange={(e) => setComplement(e.target.value)}
                          className="w-full px-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition text-sm"
                        />
                      </div>
                    </div>
                    {errors.neighborhood && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.neighborhood}</p>}
                    
                    {/* Reference Point Row */}
                    <div className="mt-3 relative group">
                        <Landmark className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" size={16} />
                        <input 
                          type="text" 
                          placeholder="Ponto de Referência (Opcional)"
                          value={reference}
                          onChange={(e) => setReference(e.target.value)}
                          className="w-full pl-9 pr-3 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition text-sm"
                        />
                    </div>

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Field */}
            <div className="relative group">
              <Mail className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" size={20} />
              <input 
                type="email" 
                placeholder="Seu E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
                  ${errors.email ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}
                `}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.email}</p>}
            </div>

            <AnimatePresence mode="popLayout">
              {mode === 'register' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Confirm Email */}
                  <div className="relative group pt-4">
                    <Mail className="absolute left-3 top-7.5 text-gray-400 group-focus-within:text-blue-500 transition" size={20} />
                    <input 
                      type="email" 
                      placeholder="Confirme seu E-mail"
                      value={confirmEmail}
                      onChange={(e) => setConfirmEmail(e.target.value)}
                      onPaste={(e) => e.preventDefault()}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
                        ${errors.confirmEmail ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}
                      `}
                    />
                    {errors.confirmEmail && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.confirmEmail}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Password Field */}
            <div className="relative group">
              <Lock className="absolute left-3 top-3.5 text-gray-400 group-focus-within:text-blue-500 transition" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Sua Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full pl-10 pr-10 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
                  ${errors.password ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}
                `}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Register: Password Logic (Confirm + Strength) */}
            <AnimatePresence mode="popLayout">
              {mode === 'register' && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Confirm Password */}
                  <div className="relative group pt-4">
                    <ShieldCheck className="absolute left-3 top-7.5 text-gray-400 group-focus-within:text-blue-500 transition" size={20} />
                    <input 
                      type="password" 
                      placeholder="Confirme sua Senha"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 transition text-sm
                        ${errors.confirmPassword ? 'border-red-300 focus:ring-red-200' : 'border-gray-200 focus:ring-blue-100 focus:border-blue-500'}
                      `}
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-xs mt-1 ml-1 flex items-center gap-1"><AlertCircle size={10}/>{errors.confirmPassword}</p>}
                  </div>

                  {/* Password Strength Meter */}
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <div className="flex justify-between mb-1">
                      <span className="text-xs font-bold text-gray-500 uppercase">Força da Senha</span>
                      <span className={`text-xs font-bold ${
                        strengthScore <= 2 ? 'text-red-500' : strengthScore <= 4 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {strengthScore <= 2 ? 'Fraca' : strengthScore <= 4 ? 'Média' : 'Forte'}
                      </span>
                    </div>
                    <div className="flex gap-1 h-1.5 mb-3">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div 
                          key={level} 
                          className={`flex-1 rounded-full transition-all duration-300 ${
                            strengthScore >= level 
                              ? (strengthScore <= 2 ? 'bg-red-400' : strengthScore <= 4 ? 'bg-yellow-400' : 'bg-green-400') 
                              : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>

                    <ul className="space-y-1">
                      {[
                        { regex: /.{8,}/, text: "Mínimo 8 caracteres" },
                        { regex: /[A-Z]/, text: "Letra Maiúscula" },
                        { regex: /[a-z]/, text: "Letra Minúscula" },
                        { regex: /[0-9]/, text: "Número" },
                        { regex: /[^A-Za-z0-9]/, text: "Caractere Especial (!@#$)" }
                      ].map((req, i) => (
                        <li key={i} className="text-[10px] flex items-center gap-2 transition-colors duration-300">
                          {req.regex.test(password) 
                            ? <Check size={10} className="text-green-500" /> 
                            : <div className="w-2.5 h-2.5 rounded-full border border-gray-300" />}
                          <span className={req.regex.test(password) ? "text-gray-700 font-medium" : "text-gray-400"}>
                            {req.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {errors.password && <p className="text-red-500 text-xs mt-2 flex items-center gap-1"><AlertCircle size={10}/>{errors.password}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {mode === 'login' && errors.password && (
              <p className="text-red-500 text-xs flex items-center gap-1"><AlertCircle size={10}/>{errors.password}</p>
            )}

            <button 
              disabled={isLoading || isVerifying}
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-lg shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2 mt-2 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading || isVerifying ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="animate-spin" size={20} />
                  <span>{isVerifying ? 'Consultando Receita Federal...' : 'Carregando...'}</span>
                </div>
              ) : (
                <>
                  {mode === 'login' ? 'Acessar Conta' : 'Criar Cadastro'}
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">
              Protegido por reCAPTCHA e sujeito à <a href="#" className="underline hover:text-blue-600">Política de Privacidade</a> e <a href="#" className="underline hover:text-blue-600">Termos de Uso</a>.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
