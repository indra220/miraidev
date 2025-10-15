import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface FormFieldProps {
  label: string;
  id: string;
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea' | 'select';
  options?: { value: string; label: string }[];
  placeholder?: string;
  description?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  required?: boolean;
  className?: string;
}

export function FormField({
  label,
  id,
  type = 'text',
  options = [],
  placeholder,
  description,
  value,
  onChange,
  required = false,
  className = ''
}: FormFieldProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { value: string }) => {
    if (type === 'select') {
      onChange((e as { value: string }).value);
    } else {
      onChange((e as React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>).target.value);
    }
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={id}
            value={value as string}
            onChange={handleChange as (e: React.ChangeEvent<HTMLTextAreaElement>) => void}
            placeholder={placeholder}
            className="bg-gray-750 border-gray-700 text-white"
          />
        );
      case 'select':
        return (
          <Select value={value as string} onValueChange={(value) => onChange(value)}>
            <SelectTrigger className="bg-gray-750 border-gray-700 text-white">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-700 text-white">
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      case 'number':
        return (
          <Input
            id={id}
            type="number"
            value={value as string | number}
            onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
            placeholder={placeholder}
            className="bg-gray-750 border-gray-700 text-white"
          />
        );
      default:
        return (
          <Input
            id={id}
            type={type}
            value={value as string}
            onChange={handleChange as (e: React.ChangeEvent<HTMLInputElement>) => void}
            placeholder={placeholder}
            className="bg-gray-750 border-gray-700 text-white"
            required={required}
          />
        );
    }
  };

  return (
    <div className={className}>
      <Label htmlFor={id} className="text-gray-200">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {renderInput()}
      {description && (
        <p className="mt-1 text-sm text-gray-400">{description}</p>
      )}
    </div>
  );
}

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
}

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">{title}</CardTitle>
        {description && <CardDescription className="text-gray-400">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
      </CardContent>
    </Card>
  );
}