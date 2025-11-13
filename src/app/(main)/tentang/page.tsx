"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Target, 
  Zap,
  Globe,
  ArrowRight,
  Code,
  Sparkles
} from "lucide-react";
import OptimizedMotion from "@/components/OptimizedMotion";
import Translate from "@/i18n/Translate";
import { useLanguage } from "@/i18n/useLanguage";
import { t } from "@/i18n/t";

export default function AboutPage() {
  const { locale } = useLanguage();

  useEffect(() => {
    const setTitle = async () => {
      const title = await t('common.about', locale, 'About Us');
      document.title = `${title} | MiraiDev`;
    };

    setTitle();
  }, [locale]);

  return (
    <div>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <OptimizedMotion 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Translate i18nKey="about.hero.title" fallback="About <span class='text-blue-400'>Us</span>" component="div" params={{locale}} />
            </OptimizedMotion>
            <OptimizedMotion 
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Translate i18nKey="about.hero.description" fallback="Bringing your business's digital future vision to life" />
            </OptimizedMotion>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <OptimizedMotion
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">
                  <Translate i18nKey="about.story.title" fallback="Our Story" />
                </h2>
                <p className="text-gray-300 mb-4">
                  <Translate i18nKey="about.story.paragraph1" fallback="MiraiDev began with the passion of an independent developer who wanted to help local businesses compete in the digital era. With an educational background in informatics engineering and a passion for web technology, we began this journey in 2023." />
                </p>
                <p className="text-gray-300 mb-4">
                  <Translate i18nKey="about.story.paragraph2" fallback='The name "Mirai" comes from the Japanese language which means "future". We chose this name because of our vision to help businesses build a sustainable digital presence and be ready to face technological developments in the future.' />
                </p>
                <p className="text-gray-300">
                  <Translate i18nKey="about.story.paragraph3" fallback="We focus on modern website development and efficient digital solutions, using the latest technologies such as React, Next.js, and various other modern frameworks to provide the best results for our clients." />
                </p>
              </OptimizedMotion>
              <OptimizedMotion 
                className="bg-gray-800 rounded-xl h-80 flex items-center justify-center"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-400">
                    <Translate i18nKey="about.future.digital" fallback="Digital Future" />
                  </p>
                </div>
              </OptimizedMotion>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <OptimizedMotion 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <Translate i18nKey="about.values.title" fallback="Our Values" />
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              <Translate i18nKey="about.values.description" fallback="Principles that guide every aspect of our work" />
            </p>
          </OptimizedMotion>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Target className="w-6 h-6" />,
                key: "about.values.excellence"
              },
              {
                icon: <Users className="w-6 h-6" />,
                key: "about.values.clientFocus"
              },
              {
                icon: <Zap className="w-6 h-6" />,
                key: "about.values.innovation"
              },
              {
                icon: <Globe className="w-6 h-6" />,
                key: "about.values.longTerm"
              }
            ].map((value, index) => (
              <OptimizedMotion
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="transition-all duration-200"
              >
                <Card className="bg-gray-800/50 border-gray-700 p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    <Translate i18nKey={`${value.key}.title`} />
                  </h3>
                  <p className="text-gray-400">
                    <Translate i18nKey={`${value.key}.description`} />
                  </p>
                </Card>
              </OptimizedMotion>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <OptimizedMotion 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <Translate i18nKey="about.team.title" fallback="Our Team" />
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              <Translate i18nKey="about.team.description" fallback="An independent developer dedicated to your project's success" />
            </p>
          </OptimizedMotion>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{
              name: "Independent Developer",
              role: "Full-Stack Developer",
              bio: "A developer passionate about modern web technology and committed to delivering the best solutions for every project.",
              icon: <Code className="w-6 h-6 text-blue-400" />
            }].map((member, index) => (
              <OptimizedMotion
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="transition-all duration-300"
              >
                <Card className="bg-gray-800/50 border-gray-700 overflow-hidden h-full">
                  <div className="h-48 bg-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">
                        <Translate i18nKey="about.team.memberName" fallback={member.name} />
                      </p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold mr-2">
                        <Translate i18nKey="about.team.memberName" fallback={member.name} />
                      </h3>
                      <div className="text-blue-400">
                        {member.icon}
                      </div>
                    </div>
                    <p className="text-blue-400 mb-3">
                      <Translate i18nKey="about.team.role" fallback={member.role} />
                    </p>
                    <p className="text-gray-400 text-sm">
                      <Translate i18nKey="about.team.bio" fallback={member.bio} />
                    </p>
                  </div>
                </Card>
              </OptimizedMotion>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <OptimizedMotion 
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-bold text-blue-400 mb-1">20+</div>
                <div className="text-gray-400">
                  <Translate i18nKey="about.stats.projectsCompleted" fallback="Projects Completed" />
                </div>
              </OptimizedMotion>
              <OptimizedMotion 
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-bold text-green-400 mb-1">15+</div>
                <div className="text-gray-400">
                  <Translate i18nKey="about.stats.happyClients" fallback="Happy Clients" />
                </div>
              </OptimizedMotion>
              <OptimizedMotion 
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-yellow-400 mb-1">2+</div>
                <div className="text-gray-400">
                  <Translate i18nKey="about.stats.yearsExperience" fallback="Years Experience" />
                </div>
              </OptimizedMotion>
              <OptimizedMotion 
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-purple-400 mb-1">1</div>
                <div className="text-gray-400">
                  <Translate i18nKey="about.stats.focusDeveloper" fallback="Focus Developer" />
                </div>
              </OptimizedMotion>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <OptimizedMotion 
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              <Translate i18nKey="about.cta.title" fallback="Ready to have a Professional Website for your Business?" />
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              <Translate i18nKey="about.cta.description" fallback="Discuss your needs with an independent developer focused on affordable and quality solutions for UMKM." />
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 transition-all duration-150 hover:scale-105">
                <Translate i18nKey="about.cta.cta1" fallback="Get Free Consultation Now" />
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-lg py-6 px-8 transition-all duration-150">
                <Translate i18nKey="about.cta.cta2" fallback="Contact Us" />
              </Button>
            </div>
          </OptimizedMotion>
        </div>
      </div>
    </div>
  );
}