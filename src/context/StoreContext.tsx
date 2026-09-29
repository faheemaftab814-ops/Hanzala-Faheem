import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  collection,
  doc,
  onSnapshot,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
  runTransaction,
} from 'firebase/firestore';
import { db, auth, handleFirestoreError, OperationType } from '../lib/firebase';
import { Product, Order, StoreSettings, Review, OrderStatus, PaymentStatus } from '../types';
import { DEFAULT_STORE_SETTINGS, INITIAL_PRODUCTS } from '../lib/seedData';

interface CheckoutFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  city: string;
  shippingAddress: string;
  orderNotes?: string;
  customerId?: string;
}

interface StoreContextType {
  products: Product[];
  featuredProducts: Product[];
  settings: StoreSettings;
  loadingProducts: boolean;
  orders: Order[];
  loadingOrders: boolean;
  createOrder: (formData: CheckoutFormData, cartItems: { productId: string; color: string; quantity: number }[]) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => Promise<void>;
  updateStoreSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  saveProduct: (product: Partial<Product>, id?: string) => Promise<string>;
  deleteProduct: (productId: string) => Promise<void>;
  seedInitialCatalog: () => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductReviews: (productId: string) => Promise<Review[]>;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => Promise<void>;
  getOrderById: (orderId: string) => Promise<Order | null>;
  getOrderByNumber: (orderNumber: string, phoneOrEmail?: string) => Promise<Order | null>;
  getUserOrders: (userId: string) => Promise<Order[]>;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [settings, setSettings] = useState<StoreSettings>(DEFAULT_STORE_SETTINGS);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // 1. Sync store settings
  // 1. Sync store settings
  useEffect(() => {
    const unsubSettings = onSnapshot(
      doc(db, 'storeSettings', 'general'),
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings({ ...DEFAULT_STORE_SETTINGS, ...(docSnap.data() as StoreSettings) });
        } else {
          // Initialize general settings doc only if authorized admin
          const email = auth.currentUser?.email?.toLowerCase();
          if (email === 'faheemaftab814@gmail.com' || email === 'hanzalafaheem85@gmail.com') {
            setDoc(doc(db, 'storeSettings', 'general'), DEFAULT_STORE_SETTINGS).catch((e) => {
              console.warn('Could not auto-initialize settings:', e);
            });
          }
        }
      },
      (error) => {
        console.warn('StoreSettings listener notice:', error);
        setSettings(DEFAULT_STORE_SETTINGS);
      }
    );

    return () => unsubSettings();
  }, []);

  // 2. Sync products catalog in real-time
  useEffect(() => {
    let hasAttemptedSync = false;
    const unsubProducts = onSnapshot(
      collection(db, 'products'),
      async (snapshot) => {
        const items: Product[] = [];
        snapshot.forEach((d) => {
          items.push({ id: d.id, ...(d.data() as Omit<Product, 'id'>) });
        });

        const email = auth.currentUser?.email?.toLowerCase();
        const isPermittedAdmin = email === 'faheemaftab814@gmail.com' || email === 'hanzalafaheem85@gmail.com';

        // Save the price in Firebase Firestore without creating duplicates:
        if (snapshot.empty && isPermittedAdmin && !hasAttemptedSync) {
          hasAttemptedSync = true;
          try {
            for (const prod of INITIAL_PRODUCTS) {
              await setDoc(doc(db, 'products', prod.id), {
                ...prod,
                price: 3500,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              }, { merge: true });
            }
          } catch (e) {
            console.warn('Auto-seed notice:', e);
          }
        } else if (isPermittedAdmin && !hasAttemptedSync) {
          hasAttemptedSync = true;
          // Check if any existing product in Firestore has old default prices and update them to 3500
          for (const docSnap of snapshot.docs) {
            const data = docSnap.data();
            if (data.price !== 3500 && (data.price === 4499 || data.price === 3899 || data.price === 4999)) {
              try {
                await updateDoc(doc(db, 'products', docSnap.id), {
                  price: 3500,
                  updatedAt: new Date().toISOString(),
                });
              } catch (e) {
                console.warn('Price sync notice:', e);
              }
            }
          }
        }

        if (items.length > 0) {
          setProducts(items);
        } else {
          setProducts(INITIAL_PRODUCTS);
        }
        setLoadingProducts(false);
      },
      (error) => {
        console.warn('Products listener notice:', error);
        setProducts(INITIAL_PRODUCTS);
        setLoadingProducts(false);
      }
    );

    return () => unsubProducts();
  }, []);

  // 3. Admin orders subscription (syncs all orders for admin review)
  useEffect(() => {
    // Only subscribe to all orders if authenticated
    const email = auth.currentUser?.email?.toLowerCase();
    const isPermittedAdmin = email === 'faheemaftab814@gmail.com' || email === 'hanzalafaheem85@gmail.com';

    if (!isPermittedAdmin) {
      setLoadingOrders(false);
      return;
    }

    const unsubOrders = onSnapshot(
      collection(db, 'orders'),
      (snapshot) => {
        const orderList: Order[] = [];
        snapshot.forEach((d) => {
          orderList.push({ id: d.id, ...(d.data() as Omit<Order, 'id'>) });
        });
        // Sort newest first
        orderList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setOrders(orderList);
        setLoadingOrders(false);
      },
      (error) => {
        console.info('Orders list restricted to authorized administrator:', error);
        setLoadingOrders(false);
      }
    );

    return () => unsubOrders();
  }, []);

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  // Secure Order Creation: Validates live prices and stock in Firestore Transaction
  const createOrder = async (
    formData: CheckoutFormData,
    cartItems: { productId: string; color: string; quantity: number }[]
  ): Promise<Order> => {
    if (!cartItems.length) {
      throw new Error('Your cart is empty.');
    }

    const uniqueOrderNumber = `HYD-${Math.floor(10000 + Math.random() * 90000)}`;

    const orderResult = await runTransaction(db, async (transaction) => {
      // 1. Fetch live state for all products in cart
      const productDocs = await Promise.all(
        cartItems.map((item) => transaction.get(doc(db, 'products', item.productId)))
      );

      let calculatedSubtotal = 0;
      const orderItems = [];

      for (let i = 0; i < cartItems.length; i++) {
        const itemReq = cartItems[i];
        const pDoc = productDocs[i];

        if (!pDoc.exists()) {
          throw new Error(`Tumbler ${itemReq.productId} is no longer available.`);
        }

        const liveProduct = pDoc.data() as Product;

        if (liveProduct.stock < itemReq.quantity) {
          throw new Error(
            `Insufficient stock for "${liveProduct.name}". Only ${liveProduct.stock} units remaining.`
          );
        }

        // Validate server-side price (never trust client)
        const verifiedPrice = Number(liveProduct.price);
        calculatedSubtotal += verifiedPrice * itemReq.quantity;

        // Decrement stock safely
        transaction.update(doc(db, 'products', itemReq.productId), {
          stock: liveProduct.stock - itemReq.quantity,
          updatedAt: new Date().toISOString(),
        });

        orderItems.push({
          productId: itemReq.productId,
          productName: liveProduct.name,
          color: itemReq.color,
          quantity: itemReq.quantity,
          price: verifiedPrice,
          image: liveProduct.images?.[0] || '',
        });
      }

      // Calculate shipping based on settings
      const shippingCharges =
        calculatedSubtotal >= settings.freeShippingThreshold ? 0 : settings.shippingCharges;
      const finalTotal = calculatedSubtotal + shippingCharges;

      const newOrderRef = doc(collection(db, 'orders'));
      const newOrder: Order = {
        id: newOrderRef.id,
        orderNumber: uniqueOrderNumber,
        customerId: formData.customerId || 'guest',
        customerName: formData.fullName.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        email: formData.email.trim(),
        city: formData.city.trim(),
        shippingAddress: formData.shippingAddress.trim(),
        orderNotes: formData.orderNotes?.trim() || '',
        items: orderItems,
        subtotal: calculatedSubtotal,
        shippingCharges,
        finalTotal,
        paymentMethod: 'Cash on Delivery (COD)',
        paymentStatus: 'Unpaid',
        orderStatus: 'Pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      transaction.set(newOrderRef, {
        ...newOrder,
        serverCreatedAt: serverTimestamp(),
      });

      return newOrder;
    });

    return orderResult;
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      const payload: Record<string, any> = {
        orderStatus: status,
        updatedAt: new Date().toISOString(),
      };
      if (paymentStatus) {
        payload.paymentStatus = paymentStatus;
      }
      await updateDoc(orderRef, payload);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  };

  const updateStoreSettings = async (newSettings: Partial<StoreSettings>) => {
    try {
      const settingsRef = doc(db, 'storeSettings', 'general');
      await setDoc(settingsRef, { ...newSettings, updatedAt: new Date().toISOString() }, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, 'storeSettings/general');
    }
  };

  const saveProduct = async (productData: Partial<Product>, id?: string): Promise<string> => {
    try {
      if (id) {
        const pRef = doc(db, 'products', id);
        await updateDoc(pRef, {
          ...productData,
          updatedAt: new Date().toISOString(),
        });
        return id;
      } else {
        const newRef = doc(collection(db, 'products'));
        const newProd = {
          ...productData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          active: productData.active ?? true,
          featured: productData.featured ?? false,
        };
        await setDoc(newRef, newProd);
        return newRef.id;
      }
    } catch (err) {
      handleFirestoreError(err, id ? OperationType.UPDATE : OperationType.CREATE, 'products');
    }
  };

  const deleteProduct = async (productId: string) => {
    try {
      await deleteDoc(doc(db, 'products', productId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${productId}`);
    }
  };

  const seedInitialCatalog = async () => {
    try {
      for (const prod of INITIAL_PRODUCTS) {
        await addDoc(collection(db, 'products'), {
          ...prod,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
      await setDoc(doc(db, 'storeSettings', 'general'), DEFAULT_STORE_SETTINGS);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'products');
    }
  };

  const getProductReviews = async (productId: string): Promise<Review[]> => {
    try {
      const snap = await getDocs(collection(db, 'reviews'));
      const revs: Review[] = [];
      snap.forEach((d) => {
        const r = { id: d.id, ...(d.data() as Omit<Review, 'id'>) };
        if (r.productId === productId) revs.push(r);
      });
      return revs;
    } catch {
      return [];
    }
  };

  const addReview = async (review: Omit<Review, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'reviews'), {
        ...review,
        createdAt: new Date().toISOString(),
        serverCreatedAt: serverTimestamp(),
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, 'reviews');
    }
  };

  const getOrderById = async (orderId: string): Promise<Order | null> => {
    try {
      const docSnap = await getDoc(doc(db, 'orders', orderId));
      if (docSnap.exists()) {
        return { id: docSnap.id, ...(docSnap.data() as Omit<Order, 'id'>) };
      }
      return null;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, `orders/${orderId}`);
    }
  };

  const getOrderByNumber = async (orderNumber: string, phoneOrEmail?: string): Promise<Order | null> => {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      let found: Order | null = null;
      snap.forEach((d) => {
        const o = { id: d.id, ...(d.data() as Omit<Order, 'id'>) };
        if (o.orderNumber.toUpperCase() === orderNumber.trim().toUpperCase()) {
          if (!phoneOrEmail) {
            found = o;
          } else {
            const cleanCheck = phoneOrEmail.trim().toLowerCase();
            if (
              o.phoneNumber.includes(cleanCheck) ||
              o.email.toLowerCase().includes(cleanCheck)
            ) {
              found = o;
            }
          }
        }
      });
      return found;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'orders');
    }
  };

  const getUserOrders = async (userId: string): Promise<Order[]> => {
    try {
      const snap = await getDocs(collection(db, 'orders'));
      const list: Order[] = [];
      snap.forEach((d) => {
        const o = { id: d.id, ...(d.data() as Omit<Order, 'id'>) };
        if (o.customerId === userId) {
          list.push(o);
        }
      });
      return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, 'orders');
    }
  };

  const featuredProducts = products.filter((p) => p.featured && p.active);

  return (
    <StoreContext.Provider
      value={{
        products,
        featuredProducts,
        settings,
        loadingProducts,
        orders,
        loadingOrders,
        createOrder,
        updateOrderStatus,
        updateStoreSettings,
        saveProduct,
        deleteProduct,
        seedInitialCatalog,
        getProductById,
        getProductReviews,
        addReview,
        getOrderById,
        getOrderByNumber,
        getUserOrders,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
