# PHP i18n Inline Display

A VS Code extension that displays inline translations for PHP localization keys in Smarty templates and PHP files, similar to [i18n Ally](https://github.com/lokalise/i18n-ally) but designed specifically for custom PHP localization systems using `LNG_xxx` and `LKP_xxx` patterns.

## 🌟 Features

### ✨ Inline Translation Display
See translations directly in your code without opening language files:

```smarty
{* Before: *}
<h1>{#LNG_2964#} <small>{#LNG_2965#}</small></h1>

{* After (what you see): *}
<h1>{#LNG_2964#} City <small>{#LNG_2965#} Management</small></h1>
```

### 🔍 Rich Hover Tooltips
Hover over any localization key to see:
- ✅ English translation
- ✅ Arabic translation
- ✅ Module and controller context
- ✅ Section information
- ✅ File location

### 🎯 Smart Key Detection
Automatically detects localization keys in:
- **Smarty Templates** (`.tpl`): `{#LNG_2964#}`, `{#LKP_5822#}`
- **HTML Files** (`.html`): `{#LNG_2964#}`, `{#LKP_5822#}`
- **PHP Files** (`.php`): `$this->cLang('LNG_2964')`

### 📁 Multi-Module Support
Works with modular PHP projects:
```
mod/
  modules/
    cmn/view/lang/lang.en.conf
    hr/view/lang/lang.en.conf
    ts/view/lang/lang.en.conf
```

### ⚡ High Performance
- Cached translation parsing
- File watcher for automatic updates
- Efficient regex-based key detection

## 📦 Installation

### From VS Code Marketplace (Coming Soon)
1. Open VS Code
2. Press `Ctrl+Shift+X` to open Extensions
3. Search for "PHP i18n Inline Display"
4. Click Install

### From VSIX File
1. Download the latest `.vsix` file from [Releases](https://github.com/MohamedHamed12/php-i18n-extension/releases)
2. Open VS Code
3. Press `Ctrl+Shift+P` and run: **Extensions: Install from VSIX...**
4. Select the downloaded `.vsix` file

### From Source
```bash
git clone https://github.com/MohamedHamed12/php-i18n-extension/
cd php-i18n-viewer
npm install
npm run compile
code .
# Press F5 to run in Extension Development Host
```

## 🚀 Quick Start

### 1. Open Your PHP Project
Open your workspace containing the `modules/*/view/lang/` structure.

### 2. Configure (Optional)
Create `.vscode/settings.json` in your project:

```json
{
  "phpI18n.displayLanguage": "en",
  "phpI18n.enableInlineHints": true,
  "phpI18n.enableHoverTooltips": true,
  "phpI18n.langFilePattern": "**/modules/*/view/lang/lang.{locale}.conf",
  "phpI18n.supportedLocales": ["en", "ar"]
}
```

### 3. Open a Template File
Open any `.tpl` file containing `{#LNG_xxx#}` keys, and you'll immediately see inline translations!

## ⚙️ Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `phpI18n.displayLanguage` | `"en"` | Language to display inline (`en` or `ar`) |
| `phpI18n.enableInlineHints` | `true` | Show translations inline next to keys |
| `phpI18n.enableHoverTooltips` | `true` | Show detailed tooltips on hover |
| `phpI18n.langFilePattern` | `**/modules/*/view/lang/lang.{locale}.conf` | Glob pattern for language files |
| `phpI18n.supportedLocales` | `["en", "ar"]` | Supported language codes |

## 📚 Language File Format

This extension parses **INI configuration files** with sections:

**File:** `modules/cmn/view/lang/lang.en.conf`
```ini
[PAGE_CITY_LIST]
LNG_2964 = "City"
LNG_2965 = "Management"
LNG_2968 = "Add"

[SERVICE_ACTIVITY_LIST]
LNG_15984 = "Success"
LNG_15985 = "Error occurred"

[PARTIAL_ACCOUNT_SELECT_TPL]
LKP_5822 = "Account Selection"
LKP_5823 = "Choose Account"
```

## 🎨 Supported Key Patterns

### Smarty Template Syntax
```smarty
{config_load file=$_LanguageFile section=$_LanguageSection}
<h1>{#LNG_2964#}</h1>
<label>{#LKP_5822#}</label>
<input placeholder="{#LNG_2968#}" />
```

### PHP cLang() Method
```php
$this->cLang('LNG_2964');
$this->cLang('SUCCESS', [], 'ERROR_CODE');
$this->cLangError(404, ['url' => '/page']);
```

## 🐛 Troubleshooting

### Translations not showing?

1. ✅ Check that language files exist: `modules/*/view/lang/lang.en.conf`
2. ✅ Verify INI format with sections: `[SECTION_NAME]`
3. ✅ Reload VS Code window
4. ✅ Check Output panel (View → Output → PHP i18n Viewer)

### Wrong translations appearing?

- The extension auto-detects the current module from your file path
- Ensure your file is inside: `mod/modules/{module}/view/templates/`

### Performance issues?

- Reduce the number of open files with localization keys
- Disable inline hints and use hover-only: `"phpI18n.enableInlineHints": false`

## 📄 License

MIT © [MohamedHamed]

## 🙏 Acknowledgments

- Inspired by [i18n Ally](https://github.com/lokalise/i18n-ally) by Lokalise
- Built for custom PHP localization systems using Smarty templates

---

**Enjoy seamless inline translation previews!** 🎉
