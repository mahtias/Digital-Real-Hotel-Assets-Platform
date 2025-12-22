import React from 'react';
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { useLanguage } from './LanguageContext';

export default function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="text-slate-400 hover:text-white hover:bg-slate-800 gap-2"
    >
      <Globe className="w-4 h-4" />
      <span className="font-medium">{language === 'zh' ? 'EN' : '中文'}</span>
    </Button>
  );
}