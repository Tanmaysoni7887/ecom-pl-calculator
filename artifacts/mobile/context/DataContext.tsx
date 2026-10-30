import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import type { CalculationResults } from "@/utils/calculations";
import { SAMPLE_CALCULATIONS, SAMPLE_STORES } from "@/utils/sampleData";

export interface Store {
  id: string;
  name: string;
  currency: string;
  platform: string;
  notes: string;
  createdAt: string;
}

export interface CalculationRecord {
  id: string;
  storeId: string;
  productName: string;
  sku: string;
  adPlatform: string;
  date: string;
  notes: string;
  sellingPrice: number;
  productCost: number;
  shippingCost: number;
  packagingCost: number;
  transactionFee: number;
  paymentGatewayFee: number;
  taxes: number;
  refundRate: number;
  chargebackRate: number;
  discount: number;
  adSpend: number;
  numberOfOrders: number;
  numberOfClicks: number;
  impressions: number;
  otherCosts: number;
  results: CalculationResults;
  createdAt: string;
  updatedAt: string;
}

interface DataContextType {
  stores: Store[];
  calculations: CalculationRecord[];
  isLoaded: boolean;
  addStore: (store: Omit<Store, "id" | "createdAt">) => Promise<Store>;
  updateStore: (id: string, updates: Partial<Store>) => Promise<void>;
  deleteStore: (id: string) => Promise<void>;
  addCalculation: (calc: Omit<CalculationRecord, "id" | "createdAt" | "updatedAt">) => Promise<CalculationRecord>;
  updateCalculation: (id: string, updates: Partial<CalculationRecord>) => Promise<void>;
  deleteCalculation: (id: string) => Promise<void>;
  getCalculationsByStore: (storeId: string) => CalculationRecord[];
  clearAllData: () => Promise<void>;
}

const STORES_KEY = "@ecom_pl_stores";
const CALCS_KEY = "@ecom_pl_calculations";

const DataContext = createContext<DataContextType | null>(null);

function uid() {
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [stores, setStores] = useState<Store[]>([]);
  const [calculations, setCalculations] = useState<CalculationRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Refs to always have latest values — avoids stale closures
  const storesRef = useRef<Store[]>([]);
  const calcsRef = useRef<CalculationRecord[]>([]);

  useEffect(() => { storesRef.current = stores; }, [stores]);
  useEffect(() => { calcsRef.current = calculations; }, [calculations]);

  useEffect(() => {
    const load = async () => {
      try {
        const [storedStores, storedCalcs] = await Promise.all([
          AsyncStorage.getItem(STORES_KEY),
          AsyncStorage.getItem(CALCS_KEY),
        ]);

        if (storedStores) {
          const parsed = JSON.parse(storedStores);
          setStores(parsed);
          storesRef.current = parsed;
        } else {
          setStores(SAMPLE_STORES);
          storesRef.current = SAMPLE_STORES;
          await AsyncStorage.setItem(STORES_KEY, JSON.stringify(SAMPLE_STORES));
        }

        if (storedCalcs) {
          const parsed = JSON.parse(storedCalcs);
          setCalculations(parsed);
          calcsRef.current = parsed;
        } else {
          setCalculations(SAMPLE_CALCULATIONS);
          calcsRef.current = SAMPLE_CALCULATIONS;
          await AsyncStorage.setItem(CALCS_KEY, JSON.stringify(SAMPLE_CALCULATIONS));
        }
      } catch {
        setStores(SAMPLE_STORES);
        setCalculations(SAMPLE_CALCULATIONS);
      } finally {
        setIsLoaded(true);
      }
    };
    load();
  }, []);

  const saveStores = useCallback(async (data: Store[]) => {
    await AsyncStorage.setItem(STORES_KEY, JSON.stringify(data));
  }, []);

  const saveCalcs = useCallback(async (data: CalculationRecord[]) => {
    await AsyncStorage.setItem(CALCS_KEY, JSON.stringify(data));
  }, []);

  const addStore = useCallback(
    async (store: Omit<Store, "id" | "createdAt">) => {
      const newStore: Store = { ...store, id: uid(), createdAt: new Date().toISOString() };
      const updated = [...storesRef.current, newStore];
      setStores(updated);
      storesRef.current = updated;
      await saveStores(updated);
      return newStore;
    },
    [saveStores]
  );

  const updateStore = useCallback(
    async (id: string, updates: Partial<Store>) => {
      const updated = storesRef.current.map((s) => (s.id === id ? { ...s, ...updates } : s));
      setStores(updated);
      storesRef.current = updated;
      await saveStores(updated);
    },
    [saveStores]
  );

  const deleteStore = useCallback(
    async (id: string) => {
      const updatedStores = storesRef.current.filter((s) => s.id !== id);
      const updatedCalcs = calcsRef.current.filter((c) => c.storeId !== id);
      setStores(updatedStores);
      setCalculations(updatedCalcs);
      storesRef.current = updatedStores;
      calcsRef.current = updatedCalcs;
      await Promise.all([saveStores(updatedStores), saveCalcs(updatedCalcs)]);
    },
    [saveStores, saveCalcs]
  );

  const addCalculation = useCallback(
    async (calc: Omit<CalculationRecord, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();
      const newCalc: CalculationRecord = { ...calc, id: uid(), createdAt: now, updatedAt: now };
      const updated = [newCalc, ...calcsRef.current];
      setCalculations(updated);
      calcsRef.current = updated;
      await saveCalcs(updated);
      return newCalc;
    },
    [saveCalcs]
  );

  const updateCalculation = useCallback(
    async (id: string, updates: Partial<CalculationRecord>) => {
      const updated = calcsRef.current.map((c) =>
        c.id === id ? { ...c, ...updates, updatedAt: new Date().toISOString() } : c
      );
      setCalculations(updated);
      calcsRef.current = updated;
      await saveCalcs(updated);
    },
    [saveCalcs]
  );

  const deleteCalculation = useCallback(
    async (id: string) => {
      const updated = calcsRef.current.filter((c) => c.id !== id);
      setCalculations(updated);
      calcsRef.current = updated;
      await saveCalcs(updated);
    },
    [saveCalcs]
  );

  const getCalculationsByStore = useCallback(
    (storeId: string) => calcsRef.current.filter((c) => c.storeId === storeId),
    []
  );

  const clearAllData = useCallback(async () => {
    await AsyncStorage.multiRemove([STORES_KEY, CALCS_KEY]);
    setStores([]);
    setCalculations([]);
    storesRef.current = [];
    calcsRef.current = [];
  }, []);

  return (
    <DataContext.Provider
      value={{
        stores,
        calculations,
        isLoaded,
        addStore,
        updateStore,
        deleteStore,
        addCalculation,
        updateCalculation,
        deleteCalculation,
        getCalculationsByStore,
        clearAllData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
