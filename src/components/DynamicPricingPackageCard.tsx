import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  CheckCircle, 
  ArrowRight
} from 'lucide-react';

interface PricingPackageCardProps {
  packageName: string;
  price: number;
  description: string;
  features: string[];
  isPopular?: boolean;
  onChoosePackage: () => void;
  buttonText?: string;
}

export const DynamicPricingPackageCard: React.FC<PricingPackageCardProps> = ({
  packageName,
  price,
  description,
  features,
  isPopular = false,
  onChoosePackage,
  buttonText = "Pilih Paket Ini"
}) => {
  return (
    <Card className={`p-6 bg-gray-800/50 border-gray-700 relative overflow-hidden ${
      isPopular ? 'border-blue-500 ring-2 ring-blue-500/20' : ''
    }`}>
      {isPopular && (
        <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs font-bold px-4 py-1 rounded-bl-lg">
          POPULER
        </div>
      )}
      
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-500/10 rounded-full mb-4">
          <Package className="w-6 h-6 text-blue-400" />
        </div>
        <h3 className="text-xl font-bold">{packageName}</h3>
        <div className="mt-2">
          <span className="text-3xl font-bold text-blue-400">
            Rp {price.toLocaleString('id-ID')}
          </span>
        </div>
        <p className="text-gray-400 mt-2">{description}</p>
      </div>
      
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 mr-2 flex-shrink-0" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      
      <Button 
        onClick={onChoosePackage}
        variant={isPopular ? "default" : "outline"}
        className={`w-full ${isPopular ? 'bg-blue-600 hover:bg-blue-700' : 'border-blue-500 text-blue-400 hover:bg-blue-500/10'}`}
      >
        {buttonText}
        <ArrowRight className="ml-2 w-4 h-4" />
      </Button>
    </Card>
  );
};