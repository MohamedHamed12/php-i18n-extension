import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as ini from 'ini';

export interface Translation {
    key: string;
    en: string;
    ar: string;
    module?: string;
    section?: string;
    filePath?: string;
}

export class TranslationService {
    private translationCache: Map<string, Translation> = new Map();
    private isLoaded: boolean = false;

    constructor() {}

    /**
     * Load all translation files from workspace
     */
    public loadTranslations(workspacePath: string): void {
        console.log('[TranslationService] Loading translations from workspace:', workspacePath);
        
        const modulesPath = path.join(workspacePath, 'modules');
        console.log('[TranslationService] Looking for modules at:', modulesPath);
        
        if (!fs.existsSync(modulesPath)) {
            console.warn('[TranslationService] ⚠️ Modules path not found:', modulesPath);
            console.warn('[TranslationService] Expected structure: <workspace>/modules/*/view/lang/lang.*.conf');
            console.warn('[TranslationService] Please open a workspace that contains this structure.');
            return;
        }

        // Get all module directories
        const modules = fs.readdirSync(modulesPath, { withFileTypes: true })
            .filter(dirent => dirent.isDirectory())
            .map(dirent => dirent.name);

        console.log(`[TranslationService] Found ${modules.length} module(s):`, modules.join(', '));

        let processedModules = 0;
        for (const module of modules) {
            const langPath = path.join(modulesPath, module, 'view', 'lang');
            
            if (!fs.existsSync(langPath)) {
                continue;
            }

            console.log(`[TranslationService] Processing module: ${module}`);
            processedModules++;

            // Parse English and Arabic .conf files
            this.parseLanguageFile(langPath, 'en', module);
            this.parseLanguageFile(langPath, 'ar', module);
        }

        this.isLoaded = true;
        console.log(`[TranslationService] ✓ Loaded ${this.translationCache.size} translation(s) from ${processedModules} module(s)`);
    }

    /**
     * Parse a single language INI file
     */
    private parseLanguageFile(langPath: string, locale: string, module: string): void {
        const filePath = path.join(langPath, `lang.${locale}.conf`);
        
        if (!fs.existsSync(filePath)) {
            console.log(`[TranslationService]   - Skipping ${locale} (file not found)`);
            return;
        }

        try {
            const content = fs.readFileSync(filePath, 'utf-8');
            const parsed = ini.parse(content);
            let keysInFile = 0;

            // Iterate through sections
            for (const section in parsed) {
                const sectionData = parsed[section];
                
                if (typeof sectionData === 'object') {
                    for (const key in sectionData) {
                        const value = sectionData[key];
                        
                        // Only process LNG_ and LKP_ keys
                        if (key.startsWith('LNG_') || key.startsWith('LKP_')) {
                            keysInFile++;
                            const existing = this.translationCache.get(key);
                            
                            if (existing) {
                                // Update existing translation with new language
                                if (locale === 'en') {
                                    existing.en = value;
                                } else if (locale === 'ar') {
                                    existing.ar = value;
                                }
                            } else {
                                // Create new translation entry
                                const translation: Translation = {
                                    key: key,
                                    en: locale === 'en' ? value : '',
                                    ar: locale === 'ar' ? value : '',
                                    module: module,
                                    section: section,
                                    filePath: filePath
                                };
                                this.translationCache.set(key, translation);
                            }
                        }
                    }
                }
            }
            console.log(`[TranslationService]   ✓ Parsed ${keysInFile} keys from ${locale} file`);
        } catch (error) {
            console.error(`[TranslationService]   ✗ Error parsing ${filePath}:`, error);
        }
    }

    /**
     * Get translation for a specific key
     */
    public getTranslation(key: string): Translation | undefined {
        return this.translationCache.get(key);
    }

    /**
     * Check if translations are loaded
     */
    public isTranslationsLoaded(): boolean {
        return this.isLoaded;
    }

    /**
     * Clear translation cache
     */
    public clearCache(): void {
        this.translationCache.clear();
        this.isLoaded = false;
    }

    /**
     * Get all translation keys (for autocomplete)
     */
    public getAllKeys(): string[] {
        return Array.from(this.translationCache.keys());
    }

    /**
     * Get translations count
     */
    public getTranslationsCount(): number {
        return this.translationCache.size;
    }
}
