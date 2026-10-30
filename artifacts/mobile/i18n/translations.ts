export type Language =
  | "en"
  | "hi"
  | "es"
  | "fr"
  | "de"
  | "pt"
  | "ar"
  | "zh"
  | "ja"
  | "id";

export const LANGUAGE_LABELS: Record<Language, string> = {
  en: "English",
  hi: "हिन्दी",
  es: "Español",
  fr: "Français",
  de: "Deutsch",
  pt: "Português",
  ar: "العربية",
  zh: "中文",
  ja: "日本語",
  id: "Bahasa Indonesia",
};

type TranslationKeys = {
  // Tabs
  calculator: string;
  history: string;
  insights: string;
  stores: string;
  settings: string;

  // Calculator
  calculatorTitle: string;
  selectStore: string;
  noStore: string;
  productName: string;
  sku: string;
  sellingPrice: string;
  productCost: string;
  shippingCost: string;
  packagingCost: string;
  transactionFee: string;
  paymentGateway: string;
  taxes: string;
  refundRate: string;
  chargebackRate: string;
  discount: string;
  adSpend: string;
  numberOfOrders: string;
  numberOfClicks: string;
  impressions: string;
  otherCosts: string;
  notes: string;
  platform: string;
  calculate: string;
  calculating: string;
  clearForm: string;
  required: string;

  // Results
  netProfit: string;
  revenue: string;
  adjustedRevenue: string;
  totalCosts: string;
  roas: string;
  breakevenROAS: string;
  cpa: string;
  cpc: string;
  cpm: string;
  profitMargin: string;
  conversionRate: string;
  share: string;
  duplicate: string;
  delete: string;
  deleteConfirm: string;
  cancel: string;

  // History
  searchPlaceholder: string;
  sortBy: string;
  filterBy: string;
  allStores: string;
  allPlatforms: string;
  noCalculations: string;
  noCalculationsDesc: string;
  exportCSV: string;

  // Insights
  totalRevenue: string;
  totalProfit: string;
  avgROAS: string;
  avgMargin: string;
  revenueTrend: string;
  profitTrend: string;
  roas_trend: string;
  topProducts: string;
  adPlatforms: string;
  storePerformance: string;
  noData: string;
  noDataDesc: string;
  detailedInsights: string;
  close: string;
  breakdown: string;

  // Stores
  storesTitle: string;
  newStore: string;
  storeName: string;
  currency: string;
  noStores: string;
  noStoresDesc: string;
  createStore: string;
  editStore: string;
  deleteStore: string;
  deleteStoreConfirm: string;
  saveChanges: string;
  saving: string;
  platform2: string;

  // Settings
  settingsTitle: string;
  appearance: string;
  darkMode: string;
  darkModeDesc: string;
  language: string;
  languageDesc: string;
  data: string;
  clearAllData: string;
  clearAllDataDesc: string;
  clearConfirm: string;
  clearConfirmMsg: string;
  appInfo: string;
  version: string;
  about: string;
  rateApp: string;
  shareApp: string;
};

const en: TranslationKeys = {
  calculator: "Calculator",
  history: "History",
  insights: "Insights",
  stores: "Stores",
  settings: "Settings",
  calculatorTitle: "P&L Calculator",
  selectStore: "Select Store",
  noStore: "No Store",
  productName: "Product Name",
  sku: "SKU",
  sellingPrice: "Selling Price",
  productCost: "Product Cost",
  shippingCost: "Shipping Cost",
  packagingCost: "Packaging Cost",
  transactionFee: "Transaction Fee %",
  paymentGateway: "Payment Gateway %",
  taxes: "Taxes %",
  refundRate: "Refund Rate %",
  chargebackRate: "Chargeback Rate %",
  discount: "Discount %",
  adSpend: "Ad Spend",
  numberOfOrders: "Number of Orders",
  numberOfClicks: "Number of Clicks",
  impressions: "Impressions",
  otherCosts: "Other Costs",
  notes: "Notes",
  platform: "Ad Platform",
  calculate: "Calculate P&L",
  calculating: "Calculating...",
  clearForm: "Clear",
  required: "Required",
  netProfit: "Net Profit",
  revenue: "Revenue",
  adjustedRevenue: "Adj. Revenue",
  totalCosts: "Total Costs",
  roas: "ROAS",
  breakevenROAS: "Breakeven ROAS",
  cpa: "CPA",
  cpc: "CPC",
  cpm: "CPM",
  profitMargin: "Profit Margin",
  conversionRate: "Conv. Rate",
  share: "Share",
  duplicate: "Duplicate",
  delete: "Delete",
  deleteConfirm: "Are you sure you want to delete this calculation?",
  cancel: "Cancel",
  searchPlaceholder: "Search calculations...",
  sortBy: "Sort by",
  filterBy: "Filter",
  allStores: "All Stores",
  allPlatforms: "All Platforms",
  noCalculations: "No calculations yet",
  noCalculationsDesc: "Save a calculation from the Calculator tab to see it here",
  exportCSV: "Export CSV",
  totalRevenue: "Total Revenue",
  totalProfit: "Total Profit",
  avgROAS: "Avg ROAS",
  avgMargin: "Avg Margin",
  revenueTrend: "Revenue Trend",
  profitTrend: "Profit Trend",
  roas_trend: "ROAS Trend",
  topProducts: "Top Products",
  adPlatforms: "Ad Platforms",
  storePerformance: "Store Performance",
  noData: "No data yet",
  noDataDesc: "Save some calculations to see your analytics and trends",
  detailedInsights: "Detailed Insights",
  close: "Close",
  breakdown: "Breakdown",
  storesTitle: "Stores",
  newStore: "New Store",
  storeName: "Store Name",
  currency: "Currency",
  noStores: "No stores yet",
  noStoresDesc: "Create your first store to track P&L by brand or channel",
  createStore: "Create Store",
  editStore: "Edit Store",
  deleteStore: "Delete Store",
  deleteStoreConfirm: "Delete this store? All associated calculations will also be deleted.",
  saveChanges: "Save Changes",
  saving: "Saving...",
  platform2: "Platform",
  settingsTitle: "Settings",
  appearance: "Appearance",
  darkMode: "Dark Mode",
  darkModeDesc: "Switch between light and dark theme",
  language: "Language",
  languageDesc: "Choose your preferred language",
  data: "Data",
  clearAllData: "Clear All Data",
  clearAllDataDesc: "Delete all stores and calculations",
  clearConfirm: "Clear All Data?",
  clearConfirmMsg: "This will permanently delete all your stores and calculations. This cannot be undone.",
  appInfo: "App Info",
  version: "Version",
  about: "About",
  rateApp: "Rate the App",
  shareApp: "Share App",
};

const hi: TranslationKeys = {
  calculator: "कैलकुलेटर",
  history: "इतिहास",
  insights: "इनसाइट्स",
  stores: "स्टोर",
  settings: "सेटिंग",
  calculatorTitle: "P&L कैलकुलेटर",
  selectStore: "स्टोर चुनें",
  noStore: "कोई स्टोर नहीं",
  productName: "प्रोडक्ट का नाम",
  sku: "SKU",
  sellingPrice: "बिक्री मूल्य",
  productCost: "प्रोडक्ट लागत",
  shippingCost: "शिपिंग लागत",
  packagingCost: "पैकेजिंग लागत",
  transactionFee: "ट्रांजेक्शन शुल्क %",
  paymentGateway: "पेमेंट गेटवे %",
  taxes: "टैक्स %",
  refundRate: "रिफंड दर %",
  chargebackRate: "चार्जबैक दर %",
  discount: "छूट %",
  adSpend: "विज्ञापन खर्च",
  numberOfOrders: "ऑर्डर की संख्या",
  numberOfClicks: "क्लिक की संख्या",
  impressions: "इम्प्रेशन",
  otherCosts: "अन्य लागत",
  notes: "नोट्स",
  platform: "विज्ञापन प्लेटफॉर्म",
  calculate: "P&L कैलकुलेट करें",
  calculating: "कैलकुलेट हो रहा है...",
  clearForm: "साफ करें",
  required: "आवश्यक",
  netProfit: "शुद्ध लाभ",
  revenue: "राजस्व",
  adjustedRevenue: "समायोजित राजस्व",
  totalCosts: "कुल लागत",
  roas: "ROAS",
  breakevenROAS: "ब्रेकईवन ROAS",
  cpa: "CPA",
  cpc: "CPC",
  cpm: "CPM",
  profitMargin: "लाभ मार्जिन",
  conversionRate: "रूपांतरण दर",
  share: "शेयर",
  duplicate: "डुप्लीकेट",
  delete: "हटाएं",
  deleteConfirm: "क्या आप इस कैलकुलेशन को हटाना चाहते हैं?",
  cancel: "रद्द करें",
  searchPlaceholder: "कैलकुलेशन खोजें...",
  sortBy: "क्रमबद्ध करें",
  filterBy: "फ़िल्टर",
  allStores: "सभी स्टोर",
  allPlatforms: "सभी प्लेटफॉर्म",
  noCalculations: "अभी तक कोई कैलकुलेशन नहीं",
  noCalculationsDesc: "कैलकुलेटर टैब से एक कैलकुलेशन सेव करें",
  exportCSV: "CSV एक्सपोर्ट",
  totalRevenue: "कुल राजस्व",
  totalProfit: "कुल लाभ",
  avgROAS: "औसत ROAS",
  avgMargin: "औसत मार्जिन",
  revenueTrend: "राजस्व ट्रेंड",
  profitTrend: "लाभ ट्रेंड",
  roas_trend: "ROAS ट्रेंड",
  topProducts: "शीर्ष प्रोडक्ट",
  adPlatforms: "विज्ञापन प्लेटफॉर्म",
  storePerformance: "स्टोर प्रदर्शन",
  noData: "अभी तक कोई डेटा नहीं",
  noDataDesc: "एनालिटिक्स देखने के लिए कैलकुलेशन सेव करें",
  detailedInsights: "विस्तृत इनसाइट्स",
  close: "बंद करें",
  breakdown: "ब्रेकडाउन",
  storesTitle: "स्टोर",
  newStore: "नया स्टोर",
  storeName: "स्टोर का नाम",
  currency: "मुद्रा",
  noStores: "अभी तक कोई स्टोर नहीं",
  noStoresDesc: "P&L ट्रैक करने के लिए पहला स्टोर बनाएं",
  createStore: "स्टोर बनाएं",
  editStore: "स्टोर संपादित करें",
  deleteStore: "स्टोर हटाएं",
  deleteStoreConfirm: "यह स्टोर हटाएं? सभी संबंधित कैलकुलेशन भी हटा दिए जाएंगे।",
  saveChanges: "परिवर्तन सहेजें",
  saving: "सहेजा जा रहा है...",
  platform2: "प्लेटफॉर्म",
  settingsTitle: "सेटिंग",
  appearance: "रूप-रंग",
  darkMode: "डार्क मोड",
  darkModeDesc: "लाइट और डार्क थीम के बीच स्विच करें",
  language: "भाषा",
  languageDesc: "अपनी पसंदीदा भाषा चुनें",
  data: "डेटा",
  clearAllData: "सभी डेटा साफ करें",
  clearAllDataDesc: "सभी स्टोर और कैलकुलेशन हटाएं",
  clearConfirm: "सभी डेटा साफ करें?",
  clearConfirmMsg: "यह आपके सभी स्टोर और कैलकुलेशन स्थायी रूप से हटा देगा।",
  appInfo: "ऐप जानकारी",
  version: "संस्करण",
  about: "के बारे में",
  rateApp: "ऐप को रेट करें",
  shareApp: "ऐप शेयर करें",
};

const es: TranslationKeys = {
  calculator: "Calculadora",
  history: "Historial",
  insights: "Análisis",
  stores: "Tiendas",
  settings: "Ajustes",
  calculatorTitle: "Calculadora P&L",
  selectStore: "Seleccionar Tienda",
  noStore: "Sin Tienda",
  productName: "Nombre del Producto",
  sku: "SKU",
  sellingPrice: "Precio de Venta",
  productCost: "Costo del Producto",
  shippingCost: "Costo de Envío",
  packagingCost: "Costo de Empaque",
  transactionFee: "Tarifa de Transacción %",
  paymentGateway: "Pasarela de Pago %",
  taxes: "Impuestos %",
  refundRate: "Tasa de Reembolso %",
  chargebackRate: "Tasa de Contracargo %",
  discount: "Descuento %",
  adSpend: "Gasto en Publicidad",
  numberOfOrders: "Número de Pedidos",
  numberOfClicks: "Número de Clics",
  impressions: "Impresiones",
  otherCosts: "Otros Costos",
  notes: "Notas",
  platform: "Plataforma de Anuncios",
  calculate: "Calcular P&L",
  calculating: "Calculando...",
  clearForm: "Limpiar",
  required: "Requerido",
  netProfit: "Beneficio Neto",
  revenue: "Ingresos",
  adjustedRevenue: "Ingresos Ajustados",
  totalCosts: "Costos Totales",
  roas: "ROAS",
  breakevenROAS: "ROAS de Equilibrio",
  cpa: "CPA",
  cpc: "CPC",
  cpm: "CPM",
  profitMargin: "Margen de Beneficio",
  conversionRate: "Tasa de Conversión",
  share: "Compartir",
  duplicate: "Duplicar",
  delete: "Eliminar",
  deleteConfirm: "¿Estás seguro de que quieres eliminar este cálculo?",
  cancel: "Cancelar",
  searchPlaceholder: "Buscar cálculos...",
  sortBy: "Ordenar por",
  filterBy: "Filtrar",
  allStores: "Todas las Tiendas",
  allPlatforms: "Todas las Plataformas",
  noCalculations: "Sin cálculos aún",
  noCalculationsDesc: "Guarda un cálculo desde la pestaña Calculadora",
  exportCSV: "Exportar CSV",
  totalRevenue: "Ingresos Totales",
  totalProfit: "Beneficio Total",
  avgROAS: "ROAS Promedio",
  avgMargin: "Margen Promedio",
  revenueTrend: "Tendencia de Ingresos",
  profitTrend: "Tendencia de Beneficios",
  roas_trend: "Tendencia ROAS",
  topProducts: "Productos Principales",
  adPlatforms: "Plataformas de Anuncios",
  storePerformance: "Rendimiento de Tienda",
  noData: "Sin datos aún",
  noDataDesc: "Guarda cálculos para ver análisis y tendencias",
  detailedInsights: "Análisis Detallado",
  close: "Cerrar",
  breakdown: "Desglose",
  storesTitle: "Tiendas",
  newStore: "Nueva Tienda",
  storeName: "Nombre de la Tienda",
  currency: "Moneda",
  noStores: "Sin tiendas aún",
  noStoresDesc: "Crea tu primera tienda para rastrear P&L por marca",
  createStore: "Crear Tienda",
  editStore: "Editar Tienda",
  deleteStore: "Eliminar Tienda",
  deleteStoreConfirm: "¿Eliminar esta tienda? Todos los cálculos asociados también serán eliminados.",
  saveChanges: "Guardar Cambios",
  saving: "Guardando...",
  platform2: "Plataforma",
  settingsTitle: "Ajustes",
  appearance: "Apariencia",
  darkMode: "Modo Oscuro",
  darkModeDesc: "Cambiar entre tema claro y oscuro",
  language: "Idioma",
  languageDesc: "Elige tu idioma preferido",
  data: "Datos",
  clearAllData: "Borrar Todos los Datos",
  clearAllDataDesc: "Eliminar todas las tiendas y cálculos",
  clearConfirm: "¿Borrar Todos los Datos?",
  clearConfirmMsg: "Esto eliminará permanentemente todas tus tiendas y cálculos.",
  appInfo: "Info de la App",
  version: "Versión",
  about: "Acerca de",
  rateApp: "Calificar la App",
  shareApp: "Compartir App",
};

const fr: TranslationKeys = {
  calculator: "Calculateur",
  history: "Historique",
  insights: "Analyses",
  stores: "Boutiques",
  settings: "Paramètres",
  calculatorTitle: "Calculateur P&L",
  selectStore: "Choisir Boutique",
  noStore: "Aucune Boutique",
  productName: "Nom du Produit",
  sku: "SKU",
  sellingPrice: "Prix de Vente",
  productCost: "Coût du Produit",
  shippingCost: "Frais de Livraison",
  packagingCost: "Coût d'Emballage",
  transactionFee: "Frais de Transaction %",
  paymentGateway: "Passerelle de Paiement %",
  taxes: "Taxes %",
  refundRate: "Taux de Remboursement %",
  chargebackRate: "Taux de Rétrofacturation %",
  discount: "Remise %",
  adSpend: "Dépenses Publicitaires",
  numberOfOrders: "Nombre de Commandes",
  numberOfClicks: "Nombre de Clics",
  impressions: "Impressions",
  otherCosts: "Autres Coûts",
  notes: "Notes",
  platform: "Plateforme Publicitaire",
  calculate: "Calculer P&L",
  calculating: "Calcul en cours...",
  clearForm: "Effacer",
  required: "Requis",
  netProfit: "Bénéfice Net",
  revenue: "Chiffre d'Affaires",
  adjustedRevenue: "CA Ajusté",
  totalCosts: "Coûts Totaux",
  roas: "ROAS",
  breakevenROAS: "ROAS Seuil",
  cpa: "CPA",
  cpc: "CPC",
  cpm: "CPM",
  profitMargin: "Marge Bénéficiaire",
  conversionRate: "Taux de Conversion",
  share: "Partager",
  duplicate: "Dupliquer",
  delete: "Supprimer",
  deleteConfirm: "Êtes-vous sûr de vouloir supprimer ce calcul?",
  cancel: "Annuler",
  searchPlaceholder: "Rechercher...",
  sortBy: "Trier par",
  filterBy: "Filtrer",
  allStores: "Toutes Boutiques",
  allPlatforms: "Toutes Plateformes",
  noCalculations: "Aucun calcul",
  noCalculationsDesc: "Sauvegardez un calcul depuis l'onglet Calculateur",
  exportCSV: "Exporter CSV",
  totalRevenue: "CA Total",
  totalProfit: "Bénéfice Total",
  avgROAS: "ROAS Moy.",
  avgMargin: "Marge Moy.",
  revenueTrend: "Tendance CA",
  profitTrend: "Tendance Bénéfices",
  roas_trend: "Tendance ROAS",
  topProducts: "Meilleurs Produits",
  adPlatforms: "Plateformes Pub",
  storePerformance: "Performance Boutique",
  noData: "Aucune donnée",
  noDataDesc: "Sauvegardez des calculs pour voir vos analyses",
  detailedInsights: "Analyses Détaillées",
  close: "Fermer",
  breakdown: "Détail",
  storesTitle: "Boutiques",
  newStore: "Nouvelle Boutique",
  storeName: "Nom de la Boutique",
  currency: "Devise",
  noStores: "Aucune boutique",
  noStoresDesc: "Créez votre première boutique pour suivre P&L",
  createStore: "Créer Boutique",
  editStore: "Modifier Boutique",
  deleteStore: "Supprimer Boutique",
  deleteStoreConfirm: "Supprimer cette boutique ? Tous les calculs associés seront supprimés.",
  saveChanges: "Enregistrer",
  saving: "Enregistrement...",
  platform2: "Plateforme",
  settingsTitle: "Paramètres",
  appearance: "Apparence",
  darkMode: "Mode Sombre",
  darkModeDesc: "Basculer entre le thème clair et sombre",
  language: "Langue",
  languageDesc: "Choisissez votre langue préférée",
  data: "Données",
  clearAllData: "Effacer Toutes les Données",
  clearAllDataDesc: "Supprimer toutes les boutiques et calculs",
  clearConfirm: "Effacer Toutes les Données?",
  clearConfirmMsg: "Cela supprimera définitivement toutes vos boutiques et calculs.",
  appInfo: "Infos App",
  version: "Version",
  about: "À Propos",
  rateApp: "Noter l'App",
  shareApp: "Partager l'App",
};

const de: TranslationKeys = { ...en, calculator: "Rechner", history: "Verlauf", insights: "Analysen", stores: "Shops", settings: "Einstellungen", calculatorTitle: "G&V Rechner", selectStore: "Shop wählen", noStore: "Kein Shop", productName: "Produktname", sellingPrice: "Verkaufspreis", productCost: "Produktkosten", shippingCost: "Versandkosten", packagingCost: "Verpackungskosten", transactionFee: "Transaktionsgebühr %", paymentGateway: "Zahlungsgebühr %", taxes: "Steuern %", refundRate: "Rückgabequote %", chargebackRate: "Rückbuchungsquote %", discount: "Rabatt %", adSpend: "Werbeausgaben", numberOfOrders: "Anzahl Bestellungen", numberOfClicks: "Anzahl Klicks", notes: "Notizen", platform: "Werbeplattform", calculate: "G&V Berechnen", calculating: "Berechne...", clearForm: "Leeren", required: "Erforderlich", netProfit: "Nettogewinn", revenue: "Umsatz", adjustedRevenue: "Bereinigter Umsatz", totalCosts: "Gesamtkosten", profitMargin: "Gewinnmarge", conversionRate: "Konversionsrate", share: "Teilen", duplicate: "Duplizieren", delete: "Löschen", cancel: "Abbrechen", searchPlaceholder: "Suchen...", sortBy: "Sortieren nach", filterBy: "Filtern", allStores: "Alle Shops", allPlatforms: "Alle Plattformen", noCalculations: "Noch keine Berechnungen", noCalculationsDesc: "Speichern Sie eine Berechnung im Rechner", exportCSV: "CSV Exportieren", totalRevenue: "Gesamtumsatz", totalProfit: "Gesamtgewinn", avgROAS: "Ø ROAS", avgMargin: "Ø Marge", revenueTrend: "Umsatztrend", profitTrend: "Gewinntrend", roas_trend: "ROAS Trend", topProducts: "Top Produkte", adPlatforms: "Werbeplattformen", storePerformance: "Shop Leistung", noData: "Noch keine Daten", noDataDesc: "Speichern Sie Berechnungen für Analysen", detailedInsights: "Detaillierte Analysen", close: "Schließen", breakdown: "Aufschlüsselung", storesTitle: "Shops", newStore: "Neuer Shop", storeName: "Shopname", currency: "Währung", noStores: "Noch keine Shops", noStoresDesc: "Erstellen Sie Ihren ersten Shop", createStore: "Shop erstellen", editStore: "Shop bearbeiten", deleteStore: "Shop löschen", deleteStoreConfirm: "Diesen Shop löschen? Alle zugehörigen Berechnungen werden auch gelöscht.", saveChanges: "Speichern", saving: "Speichert...", platform2: "Plattform", settingsTitle: "Einstellungen", appearance: "Erscheinungsbild", darkMode: "Dunkelmodus", darkModeDesc: "Zwischen hellem und dunklem Design wechseln", language: "Sprache", languageDesc: "Wählen Sie Ihre bevorzugte Sprache", data: "Daten", clearAllData: "Alle Daten löschen", clearAllDataDesc: "Alle Shops und Berechnungen löschen", clearConfirm: "Alle Daten löschen?", clearConfirmMsg: "Alle Shops und Berechnungen werden dauerhaft gelöscht.", appInfo: "App-Info", version: "Version", about: "Über", rateApp: "App bewerten", shareApp: "App teilen", deleteConfirm: "Möchten Sie diese Berechnung löschen?", otherCosts: "Sonstige Kosten", impressions: "Impressionen", breakdownROAS: "Breakeven ROAS", breakevenROAS: "Breakeven ROAS", cpa: "CPA", cpc: "CPC", cpm: "CPM", roas: "ROAS" };

const pt: TranslationKeys = { ...en, calculator: "Calculadora", history: "Histórico", insights: "Análises", stores: "Lojas", settings: "Configurações", calculatorTitle: "Calculadora P&L", selectStore: "Selecionar Loja", noStore: "Sem Loja", productName: "Nome do Produto", sellingPrice: "Preço de Venda", productCost: "Custo do Produto", shippingCost: "Custo de Envio", packagingCost: "Custo de Embalagem", transactionFee: "Taxa de Transação %", paymentGateway: "Gateway de Pagamento %", taxes: "Impostos %", refundRate: "Taxa de Reembolso %", chargebackRate: "Taxa de Estorno %", discount: "Desconto %", adSpend: "Gastos com Anúncios", numberOfOrders: "Número de Pedidos", numberOfClicks: "Número de Cliques", notes: "Notas", platform: "Plataforma de Anúncios", calculate: "Calcular P&L", calculating: "Calculando...", clearForm: "Limpar", netProfit: "Lucro Líquido", totalRevenue: "Receita Total", totalProfit: "Lucro Total", avgROAS: "ROAS Médio", avgMargin: "Margem Média", storesTitle: "Lojas", newStore: "Nova Loja", storeName: "Nome da Loja", currency: "Moeda", createStore: "Criar Loja", settingsTitle: "Configurações", darkMode: "Modo Escuro", language: "Idioma", clearAllData: "Limpar Todos os Dados", deleteStore: "Excluir Loja", saveChanges: "Salvar Alterações" };

const ar: TranslationKeys = { ...en, calculator: "الحاسبة", history: "السجل", insights: "التحليلات", stores: "المتاجر", settings: "الإعدادات", calculatorTitle: "حاسبة الأرباح والخسائر", selectStore: "اختر متجراً", noStore: "بدون متجر", productName: "اسم المنتج", sellingPrice: "سعر البيع", productCost: "تكلفة المنتج", shippingCost: "تكلفة الشحن", adSpend: "الإنفاق على الإعلانات", notes: "ملاحظات", calculate: "احسب الربح والخسارة", netProfit: "صافي الربح", totalRevenue: "إجمالي الإيرادات", totalProfit: "إجمالي الربح", avgROAS: "متوسط ROAS", avgMargin: "متوسط الهامش", storesTitle: "المتاجر", newStore: "متجر جديد", storeName: "اسم المتجر", createStore: "إنشاء متجر", settingsTitle: "الإعدادات", darkMode: "الوضع الداكن", language: "اللغة", clearAllData: "مسح جميع البيانات", deleteStore: "حذف المتجر", saveChanges: "حفظ التغييرات" };

const zh: TranslationKeys = { ...en, calculator: "计算器", history: "历史", insights: "分析", stores: "商店", settings: "设置", calculatorTitle: "P&L计算器", selectStore: "选择商店", noStore: "无商店", productName: "产品名称", sellingPrice: "销售价格", productCost: "产品成本", shippingCost: "运费", adSpend: "广告费用", notes: "备注", calculate: "计算P&L", netProfit: "净利润", totalRevenue: "总收入", totalProfit: "总利润", avgROAS: "平均ROAS", avgMargin: "平均利润率", storesTitle: "商店", newStore: "新建商店", storeName: "商店名称", createStore: "创建商店", settingsTitle: "设置", darkMode: "深色模式", language: "语言", clearAllData: "清除所有数据", deleteStore: "删除商店", saveChanges: "保存更改", cancel: "取消", close: "关闭" };

const ja: TranslationKeys = { ...en, calculator: "計算機", history: "履歴", insights: "分析", stores: "ストア", settings: "設定", calculatorTitle: "P&L計算機", selectStore: "ストアを選択", noStore: "ストアなし", productName: "商品名", sellingPrice: "販売価格", productCost: "商品原価", shippingCost: "送料", adSpend: "広告費", notes: "メモ", calculate: "P&Lを計算", netProfit: "純利益", totalRevenue: "総収益", totalProfit: "総利益", avgROAS: "平均ROAS", avgMargin: "平均利益率", storesTitle: "ストア", newStore: "新規ストア", storeName: "ストア名", createStore: "ストアを作成", settingsTitle: "設定", darkMode: "ダークモード", language: "言語", clearAllData: "全データを削除", deleteStore: "ストアを削除", saveChanges: "変更を保存", cancel: "キャンセル", close: "閉じる" };

const id: TranslationKeys = { ...en, calculator: "Kalkulator", history: "Riwayat", insights: "Analitik", stores: "Toko", settings: "Pengaturan", calculatorTitle: "Kalkulator P&L", selectStore: "Pilih Toko", noStore: "Tanpa Toko", productName: "Nama Produk", sellingPrice: "Harga Jual", productCost: "Harga Produk", shippingCost: "Biaya Pengiriman", adSpend: "Biaya Iklan", notes: "Catatan", calculate: "Hitung P&L", netProfit: "Laba Bersih", totalRevenue: "Total Pendapatan", totalProfit: "Total Laba", avgROAS: "Rata-rata ROAS", avgMargin: "Rata-rata Margin", storesTitle: "Toko", newStore: "Toko Baru", storeName: "Nama Toko", createStore: "Buat Toko", settingsTitle: "Pengaturan", darkMode: "Mode Gelap", language: "Bahasa", clearAllData: "Hapus Semua Data", deleteStore: "Hapus Toko", saveChanges: "Simpan Perubahan", cancel: "Batal", close: "Tutup" };

export const translations: Record<Language, TranslationKeys> = { en, hi, es, fr, de, pt, ar, zh, ja, id };

export type { TranslationKeys };
