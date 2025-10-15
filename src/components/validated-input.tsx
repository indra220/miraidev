import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  CheckCircle, 
  AlertCircle, 
  AlertTriangle, 
  XCircle 
} from 'lucide-react';

interface ValidationRule {
  rule: (value: string) => boolean;
  message: string;
  level: 'success' | 'warning' | 'error';
}

interface ValidatedInputProps {
  label: string;
  id: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  validations?: ValidationRule[];
  required?: boolean;
}

export function ValidatedInput({ 
  label, 
  id, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  validations = [],
  required = false
}: ValidatedInputProps) {
  const [validationResults, setValidationResults] = useState<{ rule: ValidationRule; valid: boolean }[]>([]);
  const [touched, setTouched] = useState(false);

  // Validasi input saat nilai berubah
  useEffect(() => {
    const results = validations.map(validation => ({
      rule: validation,
      valid: validation.rule(value)
    }));
    setValidationResults(results);
  }, [value, validations]);

  // Cek apakah input valid
  const isValid = validationResults.every(result => result.valid);
  const hasErrors = validationResults.some(
    result => result.rule.level === 'error' && !result.valid
  );
  const hasWarnings = validationResults.some(
    result => result.rule.level === 'warning' && !result.valid
  );

  // Dapatkan ikon status
  const getStatusIcon = () => {
    if (!touched) return null;
    if (hasErrors) return <XCircle className="h-5 w-5 text-red-500" />;
    if (hasWarnings) return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
    if (isValid) return <CheckCircle className="h-5 w-5 text-green-500" />;
    return <AlertCircle className="h-5 w-5 text-gray-400" />;
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label htmlFor={id} className="text-gray-200">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        {getStatusIcon()}
      </div>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onBlur={() => setTouched(true)}
        className={`bg-gray-750 border-gray-700 text-white ${
          hasErrors ? 'border-red-500' : 
          hasWarnings ? 'border-yellow-500' : 
          isValid && touched ? 'border-green-500' : 'border-gray-700'
        }`}
      />
      
      {/* Tampilkan hasil validasi */}
      {touched && validationResults.length > 0 && (
        <div className="space-y-1">
          {validationResults.map((result, index) => {
            const isValid = result.valid;
            const { message, level } = result.rule;
            
            if (level === 'success' && isValid) {
              return (
                <div key={index} className="flex items-center text-green-500 text-sm">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  {message}
                </div>
              );
            } else if (level === 'warning' && !isValid) {
              return (
                <div key={index} className="flex items-center text-yellow-500 text-sm">
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  {message}
                </div>
              );
            } else if (level === 'error' && !isValid) {
              return (
                <div key={index} className="flex items-center text-red-500 text-sm">
                  <XCircle className="h-4 w-4 mr-1" />
                  {message}
                </div>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
}

