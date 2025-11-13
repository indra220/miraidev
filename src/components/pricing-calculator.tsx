import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Calculator,
  Plus,
  Trash2,
  RotateCcw,
  CheckCircle,
  AlertCircle,
  Package
} from 'lucide-react';
import Translate from '@/i18n/Translate';
import { useLanguage } from '@/i18n/useLanguage';

interface PriceFeature {
  id: string;
  name: string;
  included: boolean;
}

interface PricePackage {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  features: PriceFeature[];
  active: boolean;
}

interface PricingCalculatorProps {
  initialPackages: PricePackage[];
  onUpdate: (packages: PricePackage[]) => void;
}

export default function PricingCalculator({ initialPackages, onUpdate }: PricingCalculatorProps) {
  const [packages, setPackages] = useState<PricePackage[]>(initialPackages);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [selectedPackageIndex, setSelectedPackageIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');
  
  const { t } = useLanguage();

  // Tambah paket baru
  const addPackage = () => {
    const newPackage: PricePackage = {
      id: Date.now().toString(),
      name: 'Paket Baru',
      description: 'Deskripsi paket',
      basePrice: 0,
      features: [],
      active: true
    };
    setPackages([...packages, newPackage]);
    setSelectedPackageIndex(packages.length);
  };

  // Hapus paket
  const removePackage = (id: string) => {
    if (packages.length <= 1) return; // Jangan hapus semua paket

    const newPackages = packages.filter(pkg => pkg.id !== id);
    setPackages(newPackages);

    // Perbarui indeks yang dipilih jika diperlukan
    if (selectedPackageIndex >= newPackages.length) {
      setSelectedPackageIndex(newPackages.length - 1);
    }
  };

  // Tambah fitur ke paket yang dipilih
  const addFeature = () => {
    if (!newFeatureName.trim()) return;

    const newFeature: PriceFeature = {
      id: Date.now().toString(),
      name: newFeatureName,
      included: true
    };

    const updatedPackages = [...packages];
    updatedPackages[selectedPackageIndex].features.push(newFeature);
    setPackages(updatedPackages);
    setNewFeatureName('');
  };

  // Hapus fitur dari paket yang dipilih
  const removeFeature = (featureId: string) => {
    const updatedPackages = [...packages];
    updatedPackages[selectedPackageIndex].features =
      updatedPackages[selectedPackageIndex].features.filter(f => f.id !== featureId);
    setPackages(updatedPackages);
  };

  // Toggle fitur dalam paket yang dipilih
  const toggleFeature = (featureId: string) => {
    const updatedPackages = [...packages];
    const feature = updatedPackages[selectedPackageIndex].features.find(f => f.id === featureId);
    if (feature) {
      feature.included = !feature.included;
      setPackages(updatedPackages);
    }
  };

  // Update field paket
  const updatePackageField = <K extends keyof PricePackage>(field: K, value: PricePackage[K]) => {
    const updatedPackages = [...packages];
    updatedPackages[selectedPackageIndex][field] = value;
    setPackages(updatedPackages);
  };

  // Simpan perubahan
  const handleSave = () => {
    setIsSaving(true);
    setSaveStatus('idle');

    try {
      onUpdate(packages);
      setSaveStatus('success');
      t('pricing.savedSuccess').then(savedSuccessMsg => setSaveMessage(savedSuccessMsg));
    } catch {
      setSaveStatus('error');
      t('pricing.savedError').then(savedErrorMsg => setSaveMessage(savedErrorMsg));
    } finally {
      setIsSaving(false);
    }
  };

  // Reset ke pengaturan awal
  const handleReset = () => {
    setPackages(initialPackages);
    setSaveStatus('idle');
    setSaveMessage('');
  };

  // Kalkulator harga berdasarkan fitur
  const calculatePackagePrice = (pkg: PricePackage) => {
    // Dalam implementasi sebenarnya, ini akan menghitung harga berdasarkan fitur dan parameter lain
    const includedFeaturesCount = pkg.features.filter(f => f.included).length;
    return pkg.basePrice + (includedFeaturesCount * 100000); // Contoh perhitungan
  };

  // Paket yang saat ini dipilih
  const currentPackage = packages[selectedPackageIndex] || packages[0];

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center">
              <Calculator className="h-5 w-5 mr-2" />
              <Translate i18nKey="pricing.managePackages" />
            </CardTitle>
            <CardDescription className="text-gray-400">
              <Translate i18nKey="pricing.calculator" />
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isSaving}
              className="text-gray-300 hover:text-white border-gray-600"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              <Translate i18nKey="common.reset" />
            </Button>
            <Button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSaving ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-b-2 border-white"></div>
                  <Translate i18nKey="pricing.saving" />
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  <Translate i18nKey="pricing.save" />
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Status simpan */}
        {saveStatus !== 'idle' && (
          <div className={`mb-4 p-3 rounded-lg flex items-center ${
            saveStatus === 'success'
              ? 'bg-green-900/20 text-green-400 border border-green-700'
              : 'bg-red-900/20 text-red-400 border border-red-700'
          }`}>
            {saveStatus === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {saveMessage}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Daftar Paket */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-750 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm flex items-center">
                  <Package className="h-4 w-4 mr-2" />
                  <Translate i18nKey="pricing.packageName" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {packages.map((pkg, index) => (
                    <div
                      key={pkg.id}
                      className={`p-3 rounded-lg cursor-pointer border ${
                        selectedPackageIndex === index
                          ? 'bg-blue-900/30 border-blue-700'
                          : 'bg-gray-700 border-gray-600 hover:bg-gray-700/70'
                      }`}
                      onClick={() => setSelectedPackageIndex(index)}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-white">{pkg.name}</h3>
                          <p className="text-xs text-gray-400">
                            {calculatePackagePrice(pkg).toLocaleString('id-ID', {
                              style: 'currency',
                              currency: 'IDR'
                            })}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removePackage(pkg.id);
                          }}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  <Button
                    onClick={addPackage}
                    variant="outline"
                    className="w-full mt-2 border-gray-600 text-gray-300 hover:text-white hover:bg-gray-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    <Translate i18nKey="pricing.addFeature" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Formulir Detail Paket */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-750 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white text-sm">
                  <Translate i18nKey="pricing.packageName" />: {currentPackage?.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="packageName" className="text-gray-200">
                      <Translate i18nKey="pricing.packageName" />
                    </Label>
                    <Input
                      id="packageName"
                      value={currentPackage?.name || ''}
                      onChange={(e) => updatePackageField('name', e.target.value)}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="packagePrice" className="text-gray-200">
                      <Translate i18nKey="pricing.basePrice" />
                    </Label>
                    <Input
                      id="packagePrice"
                      type="number"
                      value={currentPackage?.basePrice || 0}
                      onChange={(e) => updatePackageField('basePrice', Number(e.target.value))}
                      className="bg-gray-700 border-gray-600 text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <Label htmlFor="packageDescription" className="text-gray-200">
                    <Translate i18nKey="pricing.description" />
                  </Label>
                  <Textarea
                    id="packageDescription"
                    value={currentPackage?.description || ''}
                    onChange={(e) => updatePackageField('description', e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white min-h-[80px]"
                  />
                </div>

                {/* Fitur Paket */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-gray-200">
                      <Translate i18nKey="pricing.features" />
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        value={newFeatureName}
                        onChange={(e) => setNewFeatureName(e.target.value)}
                        placeholder="pricing.newFeature"
                        className="bg-gray-700 border-gray-600 text-white text-sm w-48"
                      />
                      <Button
                        onClick={addFeature}
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700 h-8"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        <Translate i18nKey="pricing.addFeature" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto p-2 border border-gray-600 rounded-lg bg-gray-700/50">
                    {currentPackage?.features && currentPackage.features.length > 0 ? (
                      currentPackage.features.map((feature) => (
                        <div
                          key={feature.id}
                          className="flex items-center justify-between p-2 bg-gray-700 rounded hover:bg-gray-600/50"
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={feature.included}
                              onChange={() => toggleFeature(feature.id)}
                              className="h-4 w-4 text-blue-600 rounded bg-gray-700 border-gray-600"
                            />
                            <Label className="ml-2 text-gray-200">
                              {feature.name}
                            </Label>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFeature(feature.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-400"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <Translate i18nKey="pricing.noFeatures" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Kalkulator Harga */}
                <div className="bg-gray-800 border border-gray-600 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2">
                    <Translate i18nKey="pricing.calculator" />
                  </h3>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm">
                        <Translate i18nKey="pricing.basePrice" />
                      </p>
                      <p className="text-white">
                        {currentPackage?.basePrice.toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR'
                        })}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-sm">
                        <Translate i18nKey="pricing.includedFeatures" />
                      </p>
                      <p className="text-white">
                        {currentPackage?.features.filter(f => f.included).length} fitur
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-gray-400 text-sm">
                        <Translate i18nKey="pricing.totalPrice" />
                      </p>
                      <p className="text-xl font-bold text-green-400">
                        {calculatePackagePrice(currentPackage).toLocaleString('id-ID', {
                          style: 'currency',
                          currency: 'IDR'
                        })}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}