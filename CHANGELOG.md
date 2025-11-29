# Change Log

All notable changes to the "php-i18n-inline" extension will be documented in this file.

## [0.1.0] - 2025-11-28

### 🎉 Initial Release

#### Features
- ✨ **Inline Translation Display**: Show translations next to `{#LNG_xxx#}` and `{#LKP_xxx#}` keys
- 🔍 **Hover Tooltips**: Rich tooltips with multi-language translations and metadata
- 🎯 **Smart Key Detection**: Automatic detection in `.tpl`, `.php`, and `.html` files
- 📁 **Multi-Module Support**: Works with modular PHP project structures
- ⚡ **Performance Optimized**: Cached parsing with file watchers
- ⚙️ **Configurable**: Settings for language preference, file patterns, and display options

#### Supported Patterns
- Smarty template syntax: `{#LNG_2964#}`, `{#LKP_5822#}`
- PHP method calls: `$this->cLang('LNG_2964')`
- INI configuration files: `lang.en.conf`, `lang.ar.conf`

#### Commands
- Refresh Translations
- Clear Cache
- Show Statistics

#### Language Support
- English (en)
- Arabic (ar)

---

## [Unreleased]

### Planned Features
- Database integration (MySQL) for dynamic translations
- Translation editing capability
- Find all references for a specific key
- Missing translation warnings
- Duplicate key detection
- Export/Import tools (JSON, CSV)
- Translation coverage reports
- Auto-completion for localization keys

---

**Note**: This extension follows [Semantic Versioning](https://semver.org/).
