import { useState, useEffect } from "react";
import { 
  collection, 
  getDocs, 
  getDoc, 
  doc, 
  setDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  orderBy, 
  onSnapshot 
} from "firebase/firestore";
import { db } from "../firebase/config";
import { staticPlans, Plan } from "../data/plans";
import { staticTeamMembers, TeamMember } from "../data/teamData";
import { staticPromoCodes, PromoCode } from "../data/promoCodes";

export type { Plan };
export type { TeamMember };
export type { PromoCode };

export async function seedDatabaseIfEmpty() {
  try {
    const prodRef = collection(db, "products");
    const prodSnap = await getDocs(prodRef);
    const existingProductIds = new Set(prodSnap.docs.map(d => d.id));

    let seededProducts = 0;
    for (const plan of staticPlans) {
      if (!existingProductIds.has(plan.id)) {
        await setDoc(doc(db, "products", plan.id), {
          ...plan,
          created_at: new Date().toISOString()
        });
        seededProducts++;
      }
    }
    if (seededProducts > 0) {
      console.warn(`Seeded ${seededProducts} missing plans to Firestore.`);
    }

    const teamRef = collection(db, "team_members");
    const teamSnap = await getDocs(teamRef);
    const existingTeamIds = new Set(teamSnap.docs.map(d => d.id));
    
    let seededTeam = 0;
    for (const member of staticTeamMembers) {
      if (!existingTeamIds.has(member.id)) {
        await setDoc(doc(db, "team_members", member.id), {
          ...member,
          created_at: new Date().toISOString()
        });
        seededTeam++;
      }
    }
    if (seededTeam > 0) {
      console.warn(`Seeded ${seededTeam} missing team members to Firestore.`);
    }
  } catch (error) {
    console.error("Error seeding Firestore database:", error);
  }
}

let _badgesMigrated = false;
let _bareMetalSeeded = false;
let _bareMetalAvailable = false;
let _staticPlansSeeded = false;

const bareMetalPlans: Plan[] = [
  { id: "icbr-1", category: "bare-metal", name: "ICBR-1", price_idr: 569000, cpu: "Intel i7-8700 (12 vCPU @ 4.6GHz)", ram: "16 GB", storage: "NVMe 256 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 1, stock_badge: "ready", specs_list: ["Intel Core", "Indonesia", "Dedicated Server"] },
  { id: "icbr-2", category: "bare-metal", name: "ICBR-2", price_idr: 633000, cpu: "Intel i7-8700 (12 vCPU @ 4.6GHz)", ram: "32 GB", storage: "NVMe 256 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 2, stock_badge: "ready", specs_list: ["Intel Core", "Indonesia", "Dedicated Server"] },
  { id: "icbr-3", category: "bare-metal", name: "ICBR-3", price_idr: 688000, cpu: "Intel i7-8700 (12 vCPU @ 4.6GHz)", ram: "32 GB", storage: "NVMe 512 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 3, stock_badge: "ready", specs_list: ["Intel Core", "Indonesia", "Dedicated Server"] },
  { id: "icbr-4", category: "bare-metal", name: "ICBR-4", price_idr: 877000, cpu: "Intel i7-8700 (12 vCPU @ 4.6GHz)", ram: "32 GB", storage: "NVMe 512 GB + HDD 6 TB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 4, stock_badge: "ready", specs_list: ["Intel Core", "Indonesia", "Dedicated Server"] },
  { id: "icbr-5", category: "bare-metal", name: "ICBR-5", price_idr: 766000, cpu: "Intel i7-8700 (12 vCPU @ 4.6GHz)", ram: "32 GB", storage: "NVMe 256 GB + HDD 2 TB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 5, stock_badge: "ready", specs_list: ["Intel Core", "Indonesia", "Dedicated Server"] },
  { id: "icbr-6", category: "bare-metal", name: "ICBR-6", price_idr: 637000, cpu: "Intel i5-11400 (12 vCPU @ 4.4GHz)", ram: "16 GB", storage: "NVMe 256 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 6, stock_badge: "ready", specs_list: ["Intel Core", "Indonesia", "Dedicated Server"] },
  { id: "icbr-7", category: "bare-metal", name: "ICBR-7", price_idr: 700000, cpu: "Intel i5-11400 (12 vCPU @ 4.4GHz)", ram: "32 GB", storage: "NVMe 256 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 7, stock_badge: "ready", specs_list: ["Intel Core", "Indonesia", "Dedicated Server"] },
  { id: "icbr-8", category: "bare-metal", name: "ICBR-8", price_idr: 744000, cpu: "Intel i5-11400 (12 vCPU @ 4.4GHz)", ram: "32 GB", storage: "NVMe 512 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 8, stock_badge: "ready", specs_list: ["Intel Core", "Indonesia", "Dedicated Server"] },
  { id: "icbr-9", category: "bare-metal", name: "ICBR-9", price_idr: 944000, cpu: "Intel i5-11400 (12 vCPU @ 4.4GHz)", ram: "32 GB", storage: "NVMe 512 GB + HDD 6 TB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 9, stock_badge: "ready", specs_list: ["Intel Core", "Indonesia", "Dedicated Server"] },
  { id: "icbr-10", category: "bare-metal", name: "ICBR-10", price_idr: 864000, cpu: "Intel i5-11400 (12 vCPU @ 4.4GHz)", ram: "32 GB", storage: "NVMe 512 GB + HDD 2 TB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 10, stock_badge: "ready", specs_list: ["Intel Core", "Indonesia", "Dedicated Server"] },
  { id: "ixbr-1", category: "bare-metal", name: "IXBR-1", price_idr: 673000, cpu: "Intel Xeon E5-2690 V4 (28 vCPU @ 3.5GHz)", ram: "32 GB", storage: "NVMe 256 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 11, stock_badge: "ready", specs_list: ["Intel Xeon", "Indonesia", "Dedicated Server"] },
  { id: "ixbr-2", category: "bare-metal", name: "IXBR-2", price_idr: 734000, cpu: "Intel Xeon E5-2690 V4 (28 vCPU @ 3.5GHz)", ram: "64 GB", storage: "NVMe 256 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 12, stock_badge: "ready", specs_list: ["Intel Xeon", "Indonesia", "Dedicated Server"] },
  { id: "ixbr-3", category: "bare-metal", name: "IXBR-3", price_idr: 800000, cpu: "Intel Xeon E5-2690 V4 (28 vCPU @ 3.5GHz)", ram: "64 GB", storage: "NVMe 512 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 13, stock_badge: "ready", specs_list: ["Intel Xeon", "Indonesia", "Dedicated Server"] },
  { id: "ixbr-4", category: "bare-metal", name: "IXBR-4", price_idr: 923000, cpu: "Intel Xeon E5-2690 V4 (28 vCPU @ 3.5GHz)", ram: "128 GB", storage: "NVMe 512 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 14, stock_badge: "ready", specs_list: ["Intel Xeon", "Indonesia", "Dedicated Server"] },
  { id: "ixbr-5", category: "bare-metal", name: "IXBR-5", price_idr: 1023000, cpu: "Intel Xeon E5-2690 V4 (28 vCPU @ 3.5GHz)", ram: "128 GB", storage: "NVMe 512 GB + HDD 6 TB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 15, stock_badge: "ready", specs_list: ["Intel Xeon", "Indonesia", "Dedicated Server"] },
  { id: "ixbr-6", category: "bare-metal", name: "IXBR-6", price_idr: 717000, cpu: "Intel Xeon E5-2695 V4 (36 vCPU @ 3.3GHz)", ram: "32 GB", storage: "NVMe 256 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 16, stock_badge: "ready", specs_list: ["Intel Xeon", "Indonesia", "Dedicated Server"] },
  { id: "ixbr-7", category: "bare-metal", name: "IXBR-7", price_idr: 778000, cpu: "Intel Xeon E5-2695 V4 (36 vCPU @ 3.3GHz)", ram: "64 GB", storage: "NVMe 256 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 17, stock_badge: "ready", specs_list: ["Intel Xeon", "Indonesia", "Dedicated Server"] },
  { id: "ixbr-8", category: "bare-metal", name: "IXBR-8", price_idr: 856000, cpu: "Intel Xeon E5-2695 V4 (36 vCPU @ 3.3GHz)", ram: "64 GB", storage: "NVMe 512 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 18, stock_badge: "ready", specs_list: ["Intel Xeon", "Indonesia", "Dedicated Server"] },
  { id: "ixbr-9", category: "bare-metal", name: "IXBR-9", price_idr: 978000, cpu: "Intel Xeon E5-2695 V4 (36 vCPU @ 3.3GHz)", ram: "128 GB", storage: "NVMe 512 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 19, stock_badge: "ready", specs_list: ["Intel Xeon", "Indonesia", "Dedicated Server"] },
  { id: "ixbr-10", category: "bare-metal", name: "IXBR-10", price_idr: 1078000, cpu: "Intel Xeon E5-2695 V4 (36 vCPU @ 3.3GHz)", ram: "128 GB", storage: "NVMe 512 GB + HDD 6 TB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 20, stock_badge: "ready", specs_list: ["Intel Xeon", "Indonesia", "Dedicated Server"] },
  { id: "ar5br-1", category: "bare-metal", name: "AR5BR-1", price_idr: 529000, cpu: "AMD Ryzen 5 3600 (12 vCPU @ 4.2GHz)", ram: "16 GB", storage: "NVMe 256 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 21, stock_badge: "ready", specs_list: ["AMD Ryzen 5", "Indonesia", "Dedicated Server"] },
  { id: "ar5br-2", category: "bare-metal", name: "AR5BR-2", price_idr: 592000, cpu: "AMD Ryzen 5 3600 (12 vCPU @ 4.2GHz)", ram: "32 GB", storage: "NVMe 256 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 22, stock_badge: "ready", specs_list: ["AMD Ryzen 5", "Indonesia", "Dedicated Server"] },
  { id: "ar5br-3", category: "bare-metal", name: "AR5BR-3", price_idr: 648000, cpu: "AMD Ryzen 5 3600 (12 vCPU @ 4.2GHz)", ram: "32 GB", storage: "NVMe 512 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 23, stock_badge: "ready", specs_list: ["AMD Ryzen 5", "Indonesia", "Dedicated Server"] },
  { id: "ar5br-4", category: "bare-metal", name: "AR5BR-4", price_idr: 837000, cpu: "AMD Ryzen 5 3600 (12 vCPU @ 4.2GHz)", ram: "32 GB", storage: "NVMe 512 GB + HDD 6 TB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 24, stock_badge: "ready", specs_list: ["AMD Ryzen 5", "Indonesia", "Dedicated Server"] },
  { id: "ar5br-5", category: "bare-metal", name: "AR5BR-5", price_idr: 726000, cpu: "AMD Ryzen 5 3600 (12 vCPU @ 4.2GHz)", ram: "32 GB", storage: "NVMe 512 GB + HDD 2 TB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 25, stock_badge: "ready", specs_list: ["AMD Ryzen 5", "Indonesia", "Dedicated Server"] },
  { id: "ar5br-6", category: "bare-metal", name: "AR5BR-6", price_idr: 585000, cpu: "AMD Ryzen 5 5600 (12 vCPU @ 4.4GHz)", ram: "16 GB", storage: "NVMe 256 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 26, stock_badge: "ready", specs_list: ["AMD Ryzen 5", "Indonesia", "Dedicated Server"] },
  { id: "ar5br-7", category: "bare-metal", name: "AR5BR-7", price_idr: 649000, cpu: "AMD Ryzen 5 5600 (12 vCPU @ 4.4GHz)", ram: "32 GB", storage: "NVMe 256 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 27, stock_badge: "ready", specs_list: ["AMD Ryzen 5", "Indonesia", "Dedicated Server"] },
  { id: "ar5br-8", category: "bare-metal", name: "AR5BR-8", price_idr: 671000, cpu: "AMD Ryzen 5 5600 (12 vCPU @ 4.4GHz)", ram: "32 GB", storage: "NVMe 512 GB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 28, stock_badge: "ready", specs_list: ["AMD Ryzen 5", "Indonesia", "Dedicated Server"] },
  { id: "ar5br-9", category: "bare-metal", name: "AR5BR-9", price_idr: 893000, cpu: "AMD Ryzen 5 5600 (12 vCPU @ 4.4GHz)", ram: "32 GB", storage: "NVMe 512 GB + HDD 6 TB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 29, stock_badge: "ready", specs_list: ["AMD Ryzen 5", "Indonesia", "Dedicated Server"] },
  { id: "ar5br-10", category: "bare-metal", name: "AR5BR-10", price_idr: 782000, cpu: "AMD Ryzen 5 5600 (12 vCPU @ 4.4GHz)", ram: "32 GB", storage: "NVMe 512 GB + HDD 2 TB", backup_slot: "Custom", allocation_slot: "Custom", stock_status: "available", redirect_url: "", order: 30, stock_badge: "ready", specs_list: ["AMD Ryzen 5", "Indonesia", "Dedicated Server"] },
];

export function useProducts() {
  const [products, setProducts] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("order", "asc"));

    getDocs(q).then((snapshot) => {
      if (snapshot.empty) {
        seedDatabaseIfEmpty();
      } else {
        if (!_badgesMigrated) {
          _badgesMigrated = true;
          const sharedCats = new Set(["minecraft-nexa", "minecraft-neon", "minecraft-nano"]);
          const badgeMap: Record<number, string> = { 4: "POPULAR", 6: "BEST SELLER", 9: "ADVANCED", 12: "ENTERPRISE" };
          snapshot.forEach((d) => {
            const data = d.data();
            if (sharedCats.has(data.category) && !data.badge && badgeMap[data.order]) {
              setDoc(doc(db, "products", d.id), { badge: badgeMap[data.order] }, { merge: true });
            }
          });
        }
        if (!_bareMetalSeeded) {
          _bareMetalSeeded = true;
          const bmIds = new Set(bareMetalPlans.map((p) => p.id));
          const existingBmIds = snapshot.docs.filter((d) => bmIds.has(d.id));
          if (existingBmIds.length === 0) {
            for (const bm of bareMetalPlans) {
              setDoc(doc(db, "products", bm.id), { ...bm, created_at: new Date().toISOString() });
            }
          }
        }
        if (!_bareMetalAvailable) {
          _bareMetalAvailable = true;
          const bmIds = new Set(bareMetalPlans.map((p) => p.id));
          snapshot.forEach((d) => {
            const data = d.data();
            if (bmIds.has(d.id) && data.stock_status === "coming_soon") {
              setDoc(doc(db, "products", d.id), { stock_status: "available" }, { merge: true });
            }
          });
        }
        if (!_staticPlansSeeded) {
          _staticPlansSeeded = true;
          const existingIds = new Set(snapshot.docs.map(d => d.id));
          for (const plan of staticPlans) {
            if (!existingIds.has(plan.id)) {
              setDoc(doc(db, "products", plan.id), { ...plan, created_at: new Date().toISOString() });
            }
          }
        }
      }
    }).catch((err) => {
      console.warn("Failed to check products collection, falling back to snapshot:", err);
    });

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Plan[] = [];
          snapshot.forEach((doc) => {
            const data = doc.data() as Plan;
            const staticPlan = staticPlans.find((p) => p.id === doc.id);
            if (staticPlan?.redirect_url) {
              data.redirect_url = staticPlan.redirect_url;
            }
            list.push({ ...data, id: doc.id });
          });
          setProducts(list);
        } else {
          setProducts(staticPlans);
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Firestore listener failed, falling back to static plans data:", err);
        setProducts(staticPlans);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const updateProductStock = async (id: string, newStatus: "available" | "limited" | "out_of_stock" | "coming_soon") => {
    try {
      await updateDoc(doc(db, "products", id), {
        stock_status: newStatus
      });
      return true;
    } catch (err) {
      console.error("Error updating product stock:", err);
      throw err;
    }
  };

  const saveProduct = async (product: Plan) => {
    try {
      const existingSnap = await getDoc(doc(db, "products", product.id));
      await setDoc(doc(db, "products", product.id), {
        ...product,
        created_at: existingSnap.exists() ? existingSnap.data().created_at : new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.error("Error saving product:", err);
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await deleteDoc(doc(db, "products", id));
      return true;
    } catch (err) {
      console.error("Error deleting product:", err);
      throw err;
    }
  };

  return { products, loading, error, updateProductStock, saveProduct, deleteProduct };
}

export function useTeamMembers() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "team_members"), orderBy("order", "asc"));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        if (!snapshot.empty) {
          const list: TeamMember[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as TeamMember);
          });
          setTeamMembers(list);
        } else {
          setTeamMembers(staticTeamMembers);
          seedDatabaseIfEmpty();
        }
        setLoading(false);
      },
      (err) => {
        console.warn("Firestore error for team members, using offline fallback:", err);
        setTeamMembers(staticTeamMembers);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveTeamMember = async (member: TeamMember) => {
    try {
      const existing = await getDocs(query(collection(db, "team_members"), orderBy("order", "asc")));
      const existingDoc = existing.docs.find(d => d.id === member.id);
      await setDoc(doc(db, "team_members", member.id), {
        ...member,
        created_at: existingDoc?.data()?.created_at || new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.error("Error saving team member:", err);
      throw err;
    }
  };

  const deleteTeamMember = async (id: string) => {
    try {
      await deleteDoc(doc(db, "team_members", id));
      return true;
    } catch (err) {
      console.error("Error deleting team member:", err);
      throw err;
    }
  };

  return { teamMembers, loading, saveTeamMember, deleteTeamMember };
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  read: boolean;
  created_at: string;
}

export function useContactSubmissions() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "contacts"), orderBy("created_at", "desc"));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const list: ContactMessage[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as ContactMessage);
        });
        setMessages(list);
        localStorage.setItem("tinnz_messages_cache", JSON.stringify(list));
        setLoading(false);
      },
      (err) => {
        console.warn("Firestore contact submissions listener failed, loading from local cache:", err);
        const cached = localStorage.getItem("tinnz_messages_cache");
        if (cached) {
          try {
            setMessages(JSON.parse(cached));
          } catch (e) {
            console.error("Failed to parse cached messages:", e);
          }
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const submitContactMessage = async (msg: Omit<ContactMessage, "created_at" | "read">) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: "local_" + Date.now(),
      read: false,
      created_at: new Date().toISOString()
    };
    try {
      await addDoc(collection(db, "contacts"), {
        name: msg.name,
        email: msg.email,
        subject: msg.subject,
        message: msg.message,
        read: false,
        created_at: newMsg.created_at
      });
      return true;
    } catch (err) {
      console.warn("Firestore message submit failed, falling back to local storage:", err);
      const cached = localStorage.getItem("tinnz_messages_cache");
      const list = cached ? JSON.parse(cached) : [];
      list.unshift(newMsg);
      localStorage.setItem("tinnz_messages_cache", JSON.stringify(list));
      setMessages(list);
      return true;
    }
  };

  const markMessageAsRead = async (id: string, readStatus = true) => {
    try {
      if (!id.startsWith("local_")) {
        await updateDoc(doc(db, "contacts", id), {
          read: readStatus
        });
      } else {
        throw new Error("Local-only message");
      }
      return true;
    } catch (err) {
      console.warn("Firestore update message failed, updating locally:", err);
      const updatedList = messages.map(msg => msg.id === id ? { ...msg, read: readStatus } : msg);
      setMessages(updatedList);
      localStorage.setItem("tinnz_messages_cache", JSON.stringify(updatedList));
      return true;
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      if (!id.startsWith("local_")) {
        await deleteDoc(doc(db, "contacts", id));
      } else {
        throw new Error("Local-only message");
      }
      return true;
    } catch (err) {
      console.warn("Firestore delete message failed, deleting locally:", err);
      const filteredList = messages.filter(msg => msg.id !== id);
      setMessages(filteredList);
      localStorage.setItem("tinnz_messages_cache", JSON.stringify(filteredList));
      return true;
    }
  };

  return { messages, loading, submitContactMessage, markMessageAsRead, deleteMessage };
}

export interface PurchaseOrder {
  id?: string;
  plan_id: string;
  plan_name: string;
  category: string;
  price_idr: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  status: "pending" | "processing" | "completed";
  created_at: string;
}

export function useOrders() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("created_at", "desc"));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const list: PurchaseOrder[] = [];
        snapshot.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as PurchaseOrder);
        });
        setOrders(list);
        localStorage.setItem("tinnz_orders_cache", JSON.stringify(list));
        setLoading(false);
      },
      (err) => {
        console.warn("Firestore orders listener failed, loading from local cache:", err);
        const cached = localStorage.getItem("tinnz_orders_cache");
        if (cached) {
          try {
            setOrders(JSON.parse(cached));
          } catch (e) {
            console.error("Failed to parse cached orders:", e);
          }
        }
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const submitOrder = async (order: Omit<PurchaseOrder, "created_at" | "status">) => {
    const newOrder: PurchaseOrder = {
      ...order,
      id: "local_" + Date.now(),
      status: "pending",
      created_at: new Date().toISOString()
    };
    try {
      await addDoc(collection(db, "orders"), {
        plan_id: order.plan_id,
        plan_name: order.plan_name,
        category: order.category,
        price_idr: order.price_idr,
        user_name: order.user_name,
        user_email: order.user_email,
        user_phone: order.user_phone,
        status: "pending",
        created_at: newOrder.created_at
      });
      return true;
    } catch (err) {
      console.warn("Firestore order submit failed, falling back to local storage:", err);
      const cached = localStorage.getItem("tinnz_orders_cache");
      const list = cached ? JSON.parse(cached) : [];
      list.unshift(newOrder);
      localStorage.setItem("tinnz_orders_cache", JSON.stringify(list));
      setOrders(list);
      return true;
    }
  };

  const updateOrderStatus = async (id: string, status: "pending" | "processing" | "completed") => {
    try {
      if (!id.startsWith("local_")) {
        await updateDoc(doc(db, "orders", id), { status });
      } else {
        throw new Error("Local-only order");
      }
      return true;
    } catch (err) {
      console.warn("Firestore update order failed, updating locally:", err);
      const updatedList = orders.map(ord => ord.id === id ? { ...ord, status } : ord);
      setOrders(updatedList);
      localStorage.setItem("tinnz_orders_cache", JSON.stringify(updatedList));
      return true;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      if (!id.startsWith("local_")) {
        await deleteDoc(doc(db, "orders", id));
      } else {
        throw new Error("Local-only order");
      }
      return true;
    } catch (err) {
      console.warn("Firestore delete order failed, deleting locally:", err);
      const filteredList = orders.filter(ord => ord.id !== id);
      setOrders(filteredList);
      localStorage.setItem("tinnz_orders_cache", JSON.stringify(filteredList));
      return true;
    }
  };

  return { orders, loading, submitOrder, updateOrderStatus, deleteOrder };
}

export interface SponsorProject {
  id?: string;
  title: string;
  image: string;
  game: string;
  status: "AKTIF" | "ALUMNI";
  desc: string;
  desc_en?: string;
  owners: string;
  order: number;
}

export interface Review {
  id?: string;
  name: string;
  role: string;
  photo: string;
  rating: number;
  text: string;
  text_en?: string;
  order: number;
}

const staticSponsors: SponsorProject[] = [
  { id: "sponsor-project-s", title: "Project S", image: "/projects.png", game: "MINECRAFT", status: "AKTIF", desc: "Serial Minecraft Roleplay bertema zombie apocalypse yang penuh ketegangan dan misteri. Cerita berkembang melalui konflik, strategi bertahan hidup, dan hubungan antar karakter. Setiap episode menghadirkan suasana mencekam yang membuat penonton terus penasaran.", owners: "Mefalz, Mownd, UrekanFaiz, Freezemay", order: 1 },
  { id: "sponsor-kitasmp", title: "KitaSmp", image: "/kitasmp.png", game: "MINECRAFT", status: "AKTIF", desc: "Series ini mengambil inspirasi dari berbagai SMP terkenal seperti BHC, BL, dan lainnya, dengan pendekatan yang lebih mendalam pada alur cerita, karakter, serta perkembangan plot yang dirancang secara terstruktur. Tujuan utama dari Kita SMP adalah menghadirkan cerita yang bisa dinikmati, diikuti, dan dirasakan oleh para penonton.", owners: "4US (Aspect30, Freezemay, Otodamsh, Wortelemes)", order: 2 },
  { id: "sponsor-cobblesouls", title: "CobbleSouls", image: "/cobblesoul.png", game: "MINECRAFT 2025-2026", status: "ALUMNI", desc: "Server Minecraft privat bertema Pokémon (Cobblemon) yang menghadirkan petualangan unik di dunia penuh eksplorasi. Pemain dapat menangkap, melatih, dan bertarung bersama berbagai Pokémon. Didukung komunitas aktif yang membuat pengalaman bermain semakin seru.", owners: "Mownd, Mefalz, Nakkikun, Freezemay", order: 3 },
  { id: "sponsor-minerverse", title: "Minerverse Movie: How Do YOSLE", image: "/mineverse.png", game: "MINECRAFT", status: "ALUMNI", desc: "Kisah emosional seorang remaja bernama Malo dalam perjalanan mencari arti hidup. Ia berjuang agar namanya tetap dikenang meski waktu terus berjalan. Cerita ini menghadirkan pesan mendalam tentang harapan dan kenangan.", owners: "Alzena", order: 4 },
];

export function useSponsors() {
  const [sponsors, setSponsors] = useState<SponsorProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "sponsors"), orderBy("order", "asc"));

    getDocs(q).then((snapshot) => {
      if (snapshot.empty) {
        seedSponsorsIfEmpty();
      }
    }).catch((err) => {
      console.warn("Failed to check sponsors collection:", err);
    });

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: SponsorProject[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as SponsorProject);
          });
          setSponsors(list);
        } else {
          setSponsors(staticSponsors);
        }
        setLoading(false);
      },
      () => {
        setSponsors(staticSponsors);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveSponsor = async (sponsor: SponsorProject) => {
    try {
      await setDoc(doc(db, "sponsors", sponsor.id!), {
        ...sponsor,
        created_at: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.error("Error saving sponsor:", err);
      throw err;
    }
  };

  const deleteSponsor = async (id: string) => {
    try {
      await deleteDoc(doc(db, "sponsors", id));
      return true;
    } catch (err) {
      console.error("Error deleting sponsor:", err);
      throw err;
    }
  };

  return { sponsors, loading, saveSponsor, deleteSponsor };
}

async function seedSponsorsIfEmpty() {
  try {
    const ref = collection(db, "sponsors");
    const snap = await getDocs(ref);
    if (!snap.empty) return;
    for (const s of staticSponsors) {
      await setDoc(doc(db, "sponsors", s.id!), { ...s, created_at: new Date().toISOString() });
    }
  } catch (err) {
    console.error("Error seeding sponsors:", err);
  }
}

async function seedReviewsIfEmpty() {
  try {
    const ref = collection(db, "reviews");
    const snap = await getDocs(ref);
    if (!snap.empty) return;
    for (const r of staticReviews) {
      await setDoc(doc(db, "reviews", r.id!), { ...r, created_at: new Date().toISOString() });
    }
  } catch (err) {
    console.error("Error seeding reviews:", err);
  }
}

const staticReviews: Review[] = [
  { id: "review-1", name: "Pryakax H.", role: "Content Creator", photo: "", rating: 5, text: "Servernya benar-benar stabil dan powerful 🔥 Walaupun player ramai tetap lancar tanpa kendala. Pelayanan nya juga mantap banget 🚀.", order: 1 },
  { id: "review-2", name: "Bagas D.", role: "Owner Server Minecraft", photo: "", rating: 5, text: "Private Hosting terbaik yang pernah saya pakai 👍 Admin fast response, pelayanan ramah, dan performa server sangat memuaskan.", order: 2 },
  { id: "review-3", name: "Ferdi F.", role: "Developer Game Server", photo: "", rating: 5, text: "Pelayanan sangat profesional dan respon super cepat 🔥 Server stabil, minim lag, dan cocok untuk kebutuhan developer maupun komunitas.", order: 3 },
];

export function useReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "reviews"), orderBy("order", "asc"));

    getDocs(q).then((snapshot) => {
      if (snapshot.empty) {
        seedReviewsIfEmpty();
      }
    }).catch((err) => {
      console.warn("Failed to check reviews collection:", err);
    });

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: Review[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as Review);
          });
          setReviews(list);
        } else {
          setReviews(staticReviews);
        }
        setLoading(false);
      },
      () => {
        setReviews(staticReviews);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveReview = async (review: Review) => {
    try {
      await setDoc(doc(db, "reviews", review.id!), {
        ...review,
        created_at: new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.error("Error saving review:", err);
      throw err;
    }
  };

  const deleteReview = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reviews", id));
      return true;
    } catch (err) {
      console.error("Error deleting review:", err);
      throw err;
    }
  };

  return { reviews, loading, saveReview, deleteReview };
}

export interface FAQItem {
  id?: string;
  question: string;
  answer: string;
  question_en?: string;
  answer_en?: string;
  order: number;
}

const staticFAQs: FAQItem[] = [
  { id: "faq-1", question: "Berapa lama proses aktivasi server saya?", answer: "Aktivasi server di TinnzStore sepenuhnya otomatis! Setelah pembayaran Anda terverifikasi oleh sistem penagihan kami, server Anda akan langsung aktif dalam hitungan detik.", order: 1 },
  { id: "faq-2", question: "Di mana lokasi pusat data (datacenter) TinnzStore?", answer: "Kami menggunakan infrastruktur pusat data tingkat premium berlokasi di Singapura, Indonesia, dan Johor Baru (Malaysia) untuk memastikan latensi terendah.", order: 2 },
  { id: "faq-3", question: "Bagaimana dengan sistem backup server?", answer: "Kami menyediakan sistem backup harian otomatis ke penyimpanan cloud terpisah secara gratis. Anda dapat memulihkan data kapan saja dari Panel Kontrol.", order: 3 },
  { id: "faq-4", question: "Apakah saya bisa melakukan upgrade paket?", answer: "Anda bisa mengupgrade spesifikasi server seperti RAM, CPU, atau Penyimpanan kapan saja tanpa kehilangan data dan tanpa downtime.", order: 4 },
  { id: "faq-5", question: "Bagaimana jika saya memerlukan bantuan teknis?", answer: "Tim dukungan pelanggan kami siap membantu Anda 24/7 melalui live chat, sistem tiket, Discord, atau WhatsApp helpdesk.", order: 5 }
];

export function useFAQ() {
  const [faqs, setFaqs] = useState<FAQItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "faqs"), orderBy("order", "asc"));

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: FAQItem[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as FAQItem);
          });
          setFaqs(list);
        } else {
          seedFAQsIfEmpty();
        }
        setLoading(false);
      },
      () => {
        setFaqs(staticFAQs);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveFAQ = async (faq: FAQItem) => {
    try {
      await setDoc(doc(db, "faqs", faq.id!), faq);
      return true;
    } catch (err) {
      console.error("Error saving FAQ:", err);
      throw err;
    }
  };

  const deleteFAQ = async (id: string) => {
    try {
      await deleteDoc(doc(db, "faqs", id));
      return true;
    } catch (err) {
      console.error("Error deleting FAQ:", err);
      throw err;
    }
  };

  return { faqs, loading, saveFAQ, deleteFAQ };
}

async function seedFAQsIfEmpty() {
  try {
    const faqsRef = collection(db, "faqs");
    const snap = await getDocs(faqsRef);
    if (!snap.empty) return;
    for (const faq of staticFAQs) {
      await setDoc(doc(db, "faqs", faq.id!), faq);
    }
  } catch (err) {
    console.error("Error seeding FAQs:", err);
  }
}

export interface TermItem {
  id?: string;
  title: string;
  content: string;
  title_en?: string;
  content_en?: string;
  tab: "syk" | "kebijakan_pengguna" | "kebijakan_privasi";
  order: number;
  lastUpdated?: string;
}

const staticTerms: TermItem[] = [
  { id: "syk-1", tab: "syk", title: "Pendahuluan", content: "Dengan mengakses, mendaftar, atau menggunakan layanan TinnzStore, Anda dianggap telah membaca, memahami, dan menyetujui seluruh Syarat dan Ketentuan yang tercantum dalam dokumen ini. Jika Anda tidak menyetujui sebagian atau seluruh ketentuan ini, harap menghentikan penggunaan layanan segera.", title_en: "Introduction", content_en: "By accessing, registering, or using TinnzStore services, you are deemed to have read, understood, and agreed to all Terms and Conditions in this document. If you do not agree, please discontinue use immediately.", order: 1 },
  { id: "syk-2", tab: "syk", title: "Deskripsi Layanan dan Ketentuan 'As-Is'", content: "TinnzStore menyediakan layanan hosting server game, bot, VPS, web hosting, dan layanan terkait lainnya. Semua layanan diberikan 'as-is' dan 'as available' sesuai spesifikasi yang dibeli.", title_en: "Service Description and 'As-Is' Terms", content_en: "TinnzStore provides game server hosting, bot, VPS, web hosting, and related services. All services are provided 'as-is' and 'as available' according to purchased specifications.", order: 2 },
  { id: "syk-3", tab: "syk", title: "Kewajiban dan Tanggung Jawab Pelanggan", content: "Pelanggan wajib: (a) menyediakan informasi yang akurat; (b) menjaga kerahasiaan kredensial akun; (c) tidak menyalahgunakan layanan untuk aktivitas ilegal; (d) mematuhi kebijakan penggunaan yang wajar.", title_en: "Customer Obligations and Responsibilities", content_en: "Customers must: (a) provide accurate information; (b) keep account credentials confidential; (c) not misuse services for illegal activities; (d) comply with fair use policy.", order: 3 },
  { id: "syk-4", tab: "syk", title: "Pembayaran, Penagihan, dan Pajak", content: "Seluruh harga tercantum dalam Rupiah (IDR) belum termasuk pajak berlaku. Pembayaran dilakukan di muka. Keterlambatan pembayaran dapat menyebabkan penghentian layanan.", title_en: "Payment, Billing, and Taxes", content_en: "All prices are in Indonesian Rupiah (IDR) excluding applicable taxes. Payment is made in advance. Late payment may result in service suspension.", order: 4 },
  { id: "syk-5", tab: "syk", title: "Komitmen Layanan (SLA) dan Kompensasi Terbatas", content: "TinnzStore menjamin uptime layanan 99,9% per bulan. Jika uptime di bawah SLA, pelanggan berhak mengajukan kompensasi berupa kredit layanan maksimal 10% dari biaya bulanan.", title_en: "Service Level Agreement (SLA) and Limited Compensation", content_en: "TinnzStore guarantees 99.9% monthly uptime. If uptime falls below SLA, customers may claim compensation of up to 10% of monthly fees.", order: 5 },
  { id: "syk-6", tab: "syk", title: "Keadaan Kahar (Force Majeure)", content: "TinnzStore tidak bertanggung jawab atas keterlambatan akibat force majeure, termasuk bencana alam, perang, kerusuhan, pemadaman listrik massal, atau tindakan pemerintah.", title_en: "Force Majeure", content_en: "TinnzStore is not liable for delays caused by force majeure, including natural disasters, war, riots, mass power outages, or government actions.", order: 6 },
  { id: "syk-7", tab: "syk", title: "Ganti Rugi (Indemnification)", content: "Pelanggan setuju mengganti kerugian TinnzStore dari segala klaim yang timbul akibat pelanggaran Syarat dan Ketentuan, penyalahgunaan layanan, atau pelanggaran hak kekayaan intelektual.", title_en: "Indemnification", content_en: "Customers agree to indemnify TinnzStore from all claims arising from violation of these Terms, misuse of services, or infringement of intellectual property rights.", order: 7 },
  { id: "syk-8", tab: "syk", title: "Penafian dan Batasan Tanggung Jawab", content: "Dalam batas maksimal yang diizinkan hukum, TinnzStore tidak bertanggung jawab atas kerugian tidak langsung, insidental, atau konsekuensial. Total tanggung jawab dibatasi pada biaya 3 bulan terakhir.", title_en: "Disclaimer and Limitation of Liability", content_en: "To the maximum extent permitted by law, TinnzStore is not liable for indirect, incidental, or consequential damages. Total liability is limited to the last 3 months of fees.", order: 8 },
  { id: "syk-9", tab: "syk", title: "Penghentian Layanan Sepihak", content: "TinnzStore berhak menangguhkan atau menghentikan layanan sepihak jika pelanggan melanggar Syarat dan Ketentuan, melakukan aktivitas ilegal, atau gagal membayar tagihan.", title_en: "Service Termination", content_en: "TinnzStore reserves the right to suspend or terminate services if customers violate Terms, engage in illegal activities, or fail to pay bills.", order: 9 },
  { id: "syk-10", tab: "syk", title: "Yurisdiksi dan Penyelesaian Sengketa", content: "Ketentuan ini diatur oleh hukum Indonesia. Sengketa akan diselesaikan melalui musyawarah, dan jika tidak tercapai, di Pengadilan Negeri Jakarta Pusat.", title_en: "Jurisdiction and Dispute Resolution", content_en: "These Terms are governed by Indonesian law. Disputes will be resolved through deliberation, and if not reached, at the Central Jakarta District Court.", order: 10 },
  { id: "kp-1", tab: "kebijakan_pengguna", title: "Akun Pengguna dan Keamanan", content: "Setiap pelanggan wajib mendaftar akun dengan data yang benar. Pelanggan bertanggung jawab penuh atas keamanan akun dan segala aktivitas yang dilakukan melalui akunnya.", title_en: "User Accounts and Security", content_en: "Each customer must register with accurate data. Customers are fully responsible for account security and all activities conducted through their account.", order: 11 },
  { id: "kp-2", tab: "kebijakan_pengguna", title: "Penggunaan Wajar (Fair Use Policy)", content: "Pelanggan diharapkan menggunakan layanan secara wajar. Penggunaan berlebihan yang membebani infrastruktur dapat mengakibatkan pembatasan atau penangguhan layanan.", title_en: "Fair Use Policy", content_en: "Customers are expected to use services fairly. Excessive use that burdens infrastructure may result in service limitation or suspension.", order: 12 },
  { id: "kp-3", tab: "kebijakan_pengguna", title: "Konten yang Dilarang", content: "Dilarang menggunakan layanan untuk konten ilegal, pornografi, ujaran kebencian, perjudian ilegal, pelanggaran hak cipta, atau aktivitas melanggar hukum Indonesia.", title_en: "Prohibited Content", content_en: "Services must not be used for illegal content, pornography, hate speech, illegal gambling, copyright infringement, or activities violating Indonesian law.", order: 13 },
  { id: "kp-4", tab: "kebijakan_pengguna", title: "Hak Kekayaan Intelektual", content: "Merek, logo, dan materi situs TinnzStore dilindungi hak kekayaan intelektual. Konten yang dibuat pelanggan di atas layanan tetap menjadi milik pelanggan.", title_en: "Intellectual Property Rights", content_en: "TinnzStore trademarks, logos, and site materials are protected by intellectual property rights. Customer-created content remains the customer's property.", order: 14 },
  { id: "kp-5", tab: "kebijakan_pengguna", title: "Privasi dan Perlindungan Data", content: "TinnzStore melindungi data pribadi pelanggan sesuai Kebijakan Privasi. Data tidak akan dijual atau dibagikan tanpa persetujuan, kecuali diwajibkan hukum.", title_en: "Privacy and Data Protection", content_en: "TinnzStore protects personal data per the Privacy Policy. Data will not be sold or shared without consent, except as required by law.", order: 15 },
  { id: "kp-6", tab: "kebijakan_pengguna", title: "Komunikasi dan Notifikasi", content: "Pelanggan setuju menerima komunikasi elektronik terkait layanan, tagihan, dan informasi penting. Pelanggan dapat memilih tidak menerima komunikasi pemasaran.", title_en: "Communication and Notifications", content_en: "Customers agree to receive electronic communications regarding services, billing, and important information. Customers may opt out of marketing communications.", order: 16 },
  { id: "kp-7", tab: "kebijakan_pengguna", title: "Pembatasan dan Penghentian Akses", content: "TinnzStore berhak membatasi, menangguhkan, atau menghentikan akses pelanggan yang melanggar kebijakan. Pelanggaran berulang dapat mengakibatkan penghentian permanen.", title_en: "Access Restriction and Termination", content_en: "TinnzStore reserves the right to limit, suspend, or terminate access for customers violating policies. Repeated violations may result in permanent termination.", order: 17 },
  { id: "kpriv-1", tab: "kebijakan_privasi", title: "Informasi yang Dikumpulkan", content: "TinnzStore mengumpulkan informasi pribadi seperti nama, email, nomor WhatsApp, alamat IP, informasi pembayaran, dan data penggunaan layanan.", title_en: "Information Collected", content_en: "TinnzStore collects personal information such as name, email, WhatsApp number, IP address, payment information, and service usage data.", order: 18 },
  { id: "kpriv-2", tab: "kebijakan_privasi", title: "Penggunaan Informasi", content: "Informasi digunakan untuk menyediakan layanan, memproses transaksi, memberikan dukungan teknis, mengirim notifikasi, meningkatkan keamanan, dan mematuhi kewajiban hukum.", title_en: "Use of Information", content_en: "Information is used to provide services, process transactions, provide technical support, send notifications, improve security, and comply with legal obligations.", order: 19 },
  { id: "kpriv-3", tab: "kebijakan_privasi", title: "Penyimpanan dan Keamanan Data", content: "Data disimpan di server aman dengan enkripsi SSL/TLS dan firewall. Data pembayaran diproses melalui gateway terenkripsi dan tidak disimpan oleh TinnzStore.", title_en: "Data Storage and Security", content_en: "Data is stored on secure servers with SSL/TLS encryption and firewalls. Payment data is processed through encrypted gateways and not stored by TinnzStore.", order: 20 },
  { id: "kpriv-4", tab: "kebijakan_privasi", title: "Pengungkapan ke Pihak Ketiga", content: "TinnzStore tidak menjual data pribadi. Informasi dapat dibagikan ke penyedia layanan terpercaya atau aparat penegak hukum jika diwajibkan peraturan.", title_en: "Disclosure to Third Parties", content_en: "TinnzStore does not sell personal data. Information may be shared with trusted service providers or law enforcement if required by regulations.", order: 21 },
  { id: "kpriv-5", tab: "kebijakan_privasi", title: "Hak Pengguna atas Data Pribadi", content: "Anda berhak mengakses, memperbaiki, menghapus data, menarik persetujuan, atau mengajukan keberatan pemrosesan data. Ajukan ke support@tinnzstore.com.", title_en: "User Rights over Personal Data", content_en: "You have the right to access, correct, delete data, withdraw consent, or object to data processing. Submit to support@tinnzstore.com.", order: 22 },
  { id: "kpriv-6", tab: "kebijakan_privasi", title: "Perubahan Kebijakan Privasi", content: "Kebijakan ini dapat diperbarui. Perubahan signifikan akan diinformasikan melalui situs resmi. Dengan terus menggunakan layanan, Anda menyetujui perubahan.", title_en: "Changes to Privacy Policy", content_en: "This policy may be updated. Significant changes will be announced on the site. Continued use constitutes acceptance of changes.", order: 23 },
];

export function useTerms() {
  const [terms, setTerms] = useState<TermItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "terms"), orderBy("order", "asc"));

    getDocs(q).then((snapshot) => {
      if (snapshot.empty) {
        seedTermsIfEmpty();
      }
    }).catch((err) => {
      console.warn("Failed to check terms collection:", err);
    });

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: TermItem[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as TermItem);
          });
          setTerms(list);
        } else {
          setTerms(staticTerms);
        }
        setLoading(false);
      },
      () => {
        setTerms(staticTerms);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveTerm = async (term: TermItem) => {
    try {
      await setDoc(doc(db, "terms", term.id!), {
        ...term,
        lastUpdated: term.lastUpdated || new Date().toLocaleDateString("id-ID", { year: "numeric", month: "long", day: "numeric" })
      });
      return true;
    } catch (err) {
      console.error("Error saving term:", err);
      throw err;
    }
  };

  const deleteTerm = async (id: string) => {
    try {
      await deleteDoc(doc(db, "terms", id));
      return true;
    } catch (err) {
      console.error("Error deleting term:", err);
      throw err;
    }
  };

  return { terms, loading, saveTerm, deleteTerm };
}

async function seedTermsIfEmpty() {
  try {
    const ref = collection(db, "terms");
    const snap = await getDocs(ref);
    if (!snap.empty) return;
    for (const term of staticTerms) {
      await setDoc(doc(db, "terms", term.id!), term);
    }
  } catch (err) {
    console.error("Error seeding terms:", err);
  }
}

export type ComparisonRow = { feature: string; values: string[] };
export type ComparisonCategory = "shared" | "private" | "vps" | "web";
export type ComparisonData = { plans: string[]; rows: ComparisonRow[]; note?: string };
export type ComparisonMap = Record<ComparisonCategory, ComparisonData>;

export const staticComparisons: ComparisonMap = {
  shared: {
    plans: ["Nexa", "Neon", "Nano"],
    rows: [
      { feature: "CPU", values: ["AMD Ryzen 5 5600\n48 Cores / 96 Threads", "AMD EPYC Genoa 9654\n32 Cores / 64 Threads", "AMD Ryzen 9 9950X\n12 Cores / 24 Threads"] },
      { feature: "RAM", values: ["128 GiB DDR4 ECC", "128 GiB DDR5 ECC", "92 GiB DDR5 ECC"] },
      { feature: "Storage", values: ["4× 512 GB NVMe Gen4", "2× 512 GB NVMe Gen4", "4× 768 GB NVMe Gen4"] },
      { feature: "DDoS", values: ["Included", "Included", "Included"] },
      { feature: "Backup", values: ["Weekly", "Daily", "Daily"] },
      { feature: "Support", values: ["Standard", "Priority", "24/7 VIP"] },
    ],
  },
  private: {
    plans: ["Atomic", "Catalyst", "Spectrum"],
    rows: [
      { feature: "CPU", values: ["EPYC 7282/7003\nUp to 3.0 GHz", "Genoa 9654/9554\nUp to 3.7 GHz", "Coming Soon"] },
      { feature: "RAM", values: ["ECC DDR4", "ECC DDR4", "—"] },
      { feature: "Storage", values: ["Gen4 NVMe SSD", "Gen4 NVMe SSD", "—"] },
      { feature: "Network", values: ["Enterprise", "Enterprise", "—"] },
      { feature: "DDoS", values: ["Included", "Included", "—"] },
      { feature: "Backup", values: ["Daily", "Daily", "—"] },
    ],
  },
  vps: {
    plans: ["VPS-1", "VPS-2", "VPS-3", "VPS-4"],
    rows: [
      { feature: "vCPU", values: ["1 Core", "2 Cores", "4 Cores", "8 Cores"] },
      { feature: "RAM", values: ["2 GB", "4 GB", "8 GB", "16 GB"] },
      { feature: "NVMe", values: ["30 GB", "60 GB", "120 GB", "240 GB"] },
      { feature: "Bandwidth", values: ["1 TB", "2 TB", "4 TB", "8 TB"] },
      { feature: "Backup", values: ["Weekly", "Daily", "Daily", "Daily + Snap"] },
      { feature: "IP", values: ["1 IPv4", "1 IPv4", "2 IPv4", "2 IPv4"] },
    ],
  },
  web: {
    plans: ["Spark", "Flare", "Fusion"],
    rows: [
      { feature: "Sites", values: ["1", "5", "Unlimited"] },
      { feature: "SSD", values: ["10 GB", "30 GB", "100 GB"] },
      { feature: "Bandwidth", values: ["100 GB", "500 GB", "1 TB"] },
      { feature: "Email", values: ["5", "25", "Unlimited"] },
      { feature: "SSL", values: ["Shared", "Auto", "Auto"] },
      { feature: "cPanel", values: ["Yes", "Yes", "Yes"] },
    ],
  },
};

let _comparisonWebMigrated = false;

export function useComparisons() {
  const [comparisons, setComparisons] = useState<ComparisonMap | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = collection(db, "comparisons");

    getDocs(ref).then((snapshot) => {
      if (snapshot.empty) {
        seedComparisonsIfEmpty();
      } else if (!_comparisonWebMigrated) {
        _comparisonWebMigrated = true;
        snapshot.forEach((d) => {
          if (d.id === "web") {
            const data = d.data() as ComparisonData;
            if (data.plans[0] === "Starter") {
              setDoc(doc(db, "comparisons", "web"), staticComparisons.web);
            }
          }
        });
      }
    }).catch((err) => {
      console.warn("Failed to check comparisons collection:", err);
    });

    const unsubscribe = onSnapshot(ref,
      (snapshot) => {
        if (!snapshot.empty) {
          const map: Partial<ComparisonMap> = {};
          snapshot.forEach((doc) => {
            map[doc.id as ComparisonCategory] = doc.data() as ComparisonData;
          });
          setComparisons(map as ComparisonMap);
        } else {
          setComparisons(staticComparisons);
        }
        setLoading(false);
      },
      () => {
        setComparisons(staticComparisons);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const saveComparison = async (category: ComparisonCategory, data: ComparisonData) => {
    try {
      await setDoc(doc(db, "comparisons", category), data);
      return true;
    } catch (err) {
      console.error("Error saving comparison:", err);
      throw err;
    }
  };

  return { comparisons, loading, saveComparison };
}

async function seedComparisonsIfEmpty() {
  try {
    const ref = collection(db, "comparisons");
    const snap = await getDocs(ref);
    if (!snap.empty) return;
    for (const [key, data] of Object.entries(staticComparisons)) {
      await setDoc(doc(db, "comparisons", key), data);
    }
  } catch (err) {
    console.error("Error seeding comparisons:", err);
  }
}

export function usePromoCodes() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, "promocodes"), orderBy("created_at", "desc"));

    getDocs(q).then((snapshot) => {
      if (snapshot.empty) {
        seedPromoCodesIfEmpty();
      }
    }).catch((err) => {
      console.warn("Failed to check promocodes collection:", err);
    });

    const unsubscribe = onSnapshot(q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: PromoCode[] = [];
          snapshot.forEach((doc) => {
            list.push({ id: doc.id, ...doc.data() } as PromoCode);
          });
          setPromoCodes(list);
        } else {
          setPromoCodes(staticPromoCodes);
        }
        setLoading(false);
      },
      () => {
        setPromoCodes(staticPromoCodes);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const savePromoCode = async (promo: PromoCode) => {
    try {
      await setDoc(doc(db, "promocodes", promo.id), {
        ...promo,
        created_at: promo.created_at || new Date().toISOString()
      });
      return true;
    } catch (err) {
      console.error("Error saving promo code:", err);
      throw err;
    }
  };

  const deletePromoCode = async (id: string) => {
    try {
      await deleteDoc(doc(db, "promocodes", id));
      return true;
    } catch (err) {
      console.error("Error deleting promo code:", err);
      throw err;
    }
  };

  const incrementPromoCodeUsage = async (promoCodeId: string) => {
    try {
      const ref = doc(db, "promocodes", promoCodeId);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const current = snap.data().used_count || 0;
        await updateDoc(ref, { used_count: current + 1 });
      }
    } catch (err) {
      console.warn("Failed to increment promo code usage:", err);
    }
  };

  return { promoCodes, loading, savePromoCode, deletePromoCode, incrementPromoCodeUsage };
}

async function seedPromoCodesIfEmpty() {
  try {
    const ref = collection(db, "promocodes");
    const snap = await getDocs(ref);
    if (!snap.empty) return;
    for (const pc of staticPromoCodes) {
      await setDoc(doc(db, "promocodes", pc.id), { ...pc, created_at: new Date().toISOString() });
    }
  } catch (err) {
    console.error("Error seeding promo codes:", err);
  }
}
