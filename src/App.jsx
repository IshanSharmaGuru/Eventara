import { useState, useCallback } from "react";

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_USERS = [
  { id: "u1", name: "Arjun Mehta",  email: "admin@event.com", password: "admin123", role: "admin", avatar: "AM" },
  { id: "u2", name: "Priya Sharma", email: "priya@guest.com",  password: "guest123", role: "guest", avatar: "PS" },
  { id: "u3", name: "Rahul Verma",  email: "rahul@guest.com",  password: "guest123", role: "guest", avatar: "RV" },
  { id: "u4", name: "Sneha Patel",  email: "sneha@guest.com",  password: "guest123", role: "guest", avatar: "SP" },
];

const MOCK_EVENTS = [
  {
    id: "e1",
    title: "Zenith Product Launch 2025",
    date: "2025-08-15",
    time: "18:00",
    description: "The grand unveiling of our flagship product. Join us for an evening of innovation, inspiration, and celebration.",
    location: "Grand Hyatt, Mumbai",
    lat: 19.0760,
    lng: 72.8777,
    inviteCode: "ZENITH25",
    adminId: "u1",
    guests: ["u2", "u3", "u4"],
    coverColor: "#FF6B35",
  },
];

const MOCK_UPDATES = [
  { id: "n1", eventId: "e1", authorId: "u1", text: "Welcome everyone! Doors open at 5:30 PM. Please carry your invite QR code.", time: "2025-08-15T17:00:00", read: [] },
  { id: "n2", eventId: "e1", authorId: "u1", text: "Keynote starts in 15 minutes. Please take your seats at the main hall.", time: "2025-08-15T17:45:00", read: [] },
  { id: "n3", eventId: "e1", authorId: "u1", text: "🎉 Refreshments are now available at the east wing. Enjoy!", time: "2025-08-15T19:00:00", read: [] },
];

const MOCK_MEDIA = [
  { id: "m1", eventId: "e1", authorId: "u2", type: "photo", url: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400", caption: "Opening ceremony",      time: "2025-08-15T18:10:00" },
  { id: "m2", eventId: "e1", authorId: "u1", type: "photo", url: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400", caption: "The crowd is amazing!", time: "2025-08-15T18:20:00" },
  { id: "m3", eventId: "e1", authorId: "u3", type: "photo", url: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400", caption: "Stage setup 🔥",        time: "2025-08-15T18:05:00" },
  { id: "m4", eventId: "e1", authorId: "u4", type: "photo", url: "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400", caption: "Product reveal moment", time: "2025-08-15T19:10:00" },
  { id: "m5", eventId: "e1", authorId: "u2", type: "photo", url: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400", caption: "Networking session",    time: "2025-08-15T19:30:00" },
  { id: "m6", eventId: "e1", authorId: "u1", type: "photo", url: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=400", caption: "What a night! 🌟",      time: "2025-08-15T20:00:00" },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 20, color = "currentColor" }) => {
  const icons = {
    home:         <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>,
    calendar:     <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
    bell:         <><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></>,
    image:        <><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></>,
    map:          <><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"/><line x1="8" y1="2" x2="8" y2="18"/><line x1="16" y1="6" x2="16" y2="22"/></>,
    users:        <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
    plus:         <><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></>,
    send:         <><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></>,
    logout:       <><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></>,
    x:            <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>,
    check:        <polyline points="20 6 9 17 4 12"/>,
    location:     <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></>,
    trash:        <><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></>,
    edit:         <><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></>,
    copy:         <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
    upload:       <><polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/></>,
    eye:          <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>,
    navigation:   <polygon points="3 11 22 2 13 21 11 13 3 11"/>,
    star:         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>,
    shield:       <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>,
    chevronRight: <polyline points="9 18 15 12 9 6"/>,
    chevronLeft:  <polyline points="15 18 9 12 15 6"/>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {icons[name]}
    </svg>
  );
};

// ─── TOAST ────────────────────────────────────────────────────────────────────
const Toast = ({ toasts, remove }) => (
  <div style={{ position: "fixed", top: 20, right: 20, zIndex: 9999, display: "flex", flexDirection: "column", gap: 8, width: 340, pointerEvents: "none" }}>
    {toasts.map(t => (
      <div key={t.id} style={{
        background: t.type === "error" ? "#FF4757" : t.type === "warning" ? "#FF8C00" : "#1A1A2E",
        color: "#fff", padding: "13px 16px", borderRadius: 12, fontSize: 13, fontWeight: 500,
        display: "flex", alignItems: "center", gap: 8,
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)", animation: "slideDown 0.3s ease",
        pointerEvents: "all", border: "1px solid rgba(255,255,255,0.08)"
      }}>
        <span style={{ flex: 1 }}>{t.msg}</span>
        <button onClick={() => remove(t.id)} style={{ background: "none", border: "none", color: "rgba(255,255,255,0.5)", cursor: "pointer", padding: 0, display: "flex" }}>
          <Icon name="x" size={14} />
        </button>
      </div>
    ))}
  </div>
);

// ─── MODAL ────────────────────────────────────────────────────────────────────
const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div onClick={e => e.stopPropagation()} style={{ background: "#0F0F1A", borderRadius: 20, width: "100%", maxWidth: 440, maxHeight: "85vh", overflow: "auto", border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 24px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: "#fff", fontFamily: "inherit" }}>{title}</h3>
          <button onClick={onClose} style={{ background: "rgba(255,255,255,0.08)", border: "none", color: "#fff", borderRadius: 8, width: 32, height: 32, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="x" size={16} />
          </button>
        </div>
        <div style={{ padding: "20px 24px 24px" }}>{children}</div>
      </div>
    </div>
  );
};

// ─── FORM COMPONENTS ─────────────────────────────────────────────────────────
const labelStyle = { display: "block", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.45)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" };
const fieldBase = { width: "100%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit", boxSizing: "border-box" };

const Input = ({ label, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={labelStyle}>{label}</label>}
    <input {...props} style={{ ...fieldBase, ...props.style }} />
  </div>
);

const Textarea = ({ label, ...props }) => (
  <div style={{ marginBottom: 16 }}>
    {label && <label style={labelStyle}>{label}</label>}
    <textarea {...props} style={{ ...fieldBase, resize: "vertical", minHeight: 80, ...props.style }} />
  </div>
);

const Btn = ({ children, variant = "primary", ...props }) => {
  const variants = {
    primary:   { background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", color: "#fff", border: "none" },
    secondary: { background: "rgba(255,255,255,0.08)", color: "#fff", border: "none" },
    danger:    { background: "rgba(255,71,87,0.12)", color: "#FF4757", border: "1px solid rgba(255,71,87,0.28)" },
    ghost:     { background: "transparent", color: "rgba(255,255,255,0.55)", border: "none" },
  };
  return (
    <button {...props} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600, width: "100%", fontFamily: "inherit", transition: "opacity 0.15s", ...variants[variant], ...props.style }}>
      {children}
    </button>
  );
};

// ─── AVATAR ───────────────────────────────────────────────────────────────────
const Avatar = ({ user, size = 36 }) => {
  const colors = ["#FF6B35", "#4ECDC4", "#A855F7", "#06B6D4", "#10B981"];
  const color = colors[(user?.id?.charCodeAt(1) || 0) % colors.length];
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.34, fontWeight: 700, color: "#fff", flexShrink: 0, letterSpacing: "-0.02em" }}>
      {user?.avatar || "??"}
    </div>
  );
};

const Badge = ({ count }) => {
  if (!count) return null;
  return (
    <div style={{ position: "absolute", top: -4, right: -4, background: "#FF4757", color: "#fff", borderRadius: 99, minWidth: 16, height: 16, fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px" }}>
      {count > 9 ? "9+" : count}
    </div>
  );
};

// ─── EVENT CARD ───────────────────────────────────────────────────────────────
const EventCard = ({ event, guests }) => {
  const guestUsers = (guests || MOCK_USERS).filter(u => event.guests.includes(u.id));
  return (
    <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, overflow: "hidden", transition: "border-color 0.2s" }}>
      <div style={{ height: 78, background: `linear-gradient(135deg, ${event.coverColor}20, ${event.coverColor}40)`, borderBottom: `2px solid ${event.coverColor}50`, display: "flex", alignItems: "center", padding: "0 16px" }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: event.coverColor, boxShadow: `0 0 10px ${event.coverColor}`, marginRight: 10, flexShrink: 0 }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{event.title}</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{event.date} · {event.time}</div>
        </div>
      </div>
      <div style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10 }}>
          <Icon name="location" size={12} color="rgba(255,255,255,0.35)" />
          <span style={{ fontSize: 12, color: "rgba(255,255,255,0.4)" }}>{event.location || "No location set"}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {guestUsers.slice(0, 4).map(g => <Avatar key={g.id} user={g} size={22} />)}
            {guestUsers.length > 4 && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 4 }}>+{guestUsers.length - 4}</span>}
            {guestUsers.length === 0 && <span style={{ fontSize: 11, color: "rgba(255,255,255,0.25)" }}>No guests yet</span>}
          </div>
          <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 7, padding: "4px 10px" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.45)", letterSpacing: "0.08em" }}>{event.inviteCode}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// SCREENS
// ════════════════════════════════════════════════════════════════════════════════

// ─── AUTH ─────────────────────────────────────────────────────────────────────
const AuthScreen = ({ onLogin, addToast, users,setUsers }) => {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "guest" });
  

  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = () => {
    if (mode === "login") {
      const user = users.find(u => u.email === form.email && u.password === form.password);
      if (!user) return addToast("Invalid credentials", "error");
      onLogin(user);
    } else {
      if (!form.name || !form.email || !form.password) return addToast("Fill all fields", "error");
      if (users.find(u => u.email === form.email)) return addToast("Email already registered", "error");
      const newUser = {
        id: `u${Date.now()}`, name: form.name, email: form.email, password: form.password,
        role: form.role, avatar: form.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase(),
      };
      setUsers(u => [...u, newUser]);
      addToast("Account created! Please sign in.", "success");
      setMode("login");
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080812", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative", overflow: "hidden" }}>
      {/* Background orbs */}
      <div style={{ position: "absolute", top: -120, left: -120, width: 480, height: 480, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.12) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "absolute", bottom: -160, right: -160, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* Left side — branding (visible on wider screens) */}
      <div style={{ display: "none", flex: 1, maxWidth: 480, padding: "0 48px", position: "relative", zIndex: 1 }} className="auth-branding">
        <div style={{ marginBottom: 32 }}>
          <div style={{ width: 72, height: 72, borderRadius: 22, background: "linear-gradient(135deg, #FF6B35, #FF3CAC)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 24, boxShadow: "0 20px 60px rgba(255,107,53,0.25)" }}>
            <Icon name="star" size={32} color="#fff" />
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: "-0.04em", lineHeight: 1.1, margin: "0 0 14px", fontFamily: "Syne, sans-serif" }}>Eventara</h1>
          <p style={{ color: "rgba(255,255,255,0.45)", fontSize: 17, lineHeight: 1.6, margin: 0 }}>Manage moments that matter — from guest lists to live updates.</p>
        </div>
        {[
          { icon: "users",    text: "Guest management & invite codes"  },
          { icon: "bell",     text: "Real-time updates & notifications" },
          { icon: "image",    text: "Shared media gallery"             },
          { icon: "map",      text: "Event location & navigation"      },
        ].map(f => (
          <div key={f.icon} style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,107,53,0.12)", border: "1px solid rgba(255,107,53,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Icon name={f.icon} size={16} color="#FF6B35" />
            </div>
            <span style={{ color: "rgba(255,255,255,0.55)", fontSize: 14 }}>{f.text}</span>
          </div>
        ))}
      </div>

      {/* Auth card */}
      <div style={{ width: "100%", maxWidth: 400, position: "relative", zIndex: 1 }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, background: "linear-gradient(135deg, #FF6B35, #FF3CAC)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px", boxShadow: "0 16px 48px rgba(255,107,53,0.3)" }}>
            <Icon name="star" size={26} color="#fff" />
          </div>
          <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", fontFamily: "Syne, sans-serif" }}>Eventara</h1>
          <p style={{ margin: "6px 0 0", color: "rgba(255,255,255,0.35)", fontSize: 13 }}>Manage moments that matter</p>
        </div>

        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", borderRadius: 12, padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "10px", borderRadius: 9, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: mode === m ? "rgba(255,107,53,0.9)" : "transparent", color: mode === m ? "#fff" : "rgba(255,255,255,0.38)", transition: "all 0.2s" }}>
              {m === "login" ? "Sign In" : "Sign Up"}
            </button>
          ))}
        </div>

        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: 24 }}>
          {mode === "signup" && (
            <>
              <Input label="Full Name" name="name" value={form.name} onChange={handle} placeholder="Arjun Mehta" />
              <div style={{ marginBottom: 16 }}>
                <label style={labelStyle}>Role</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {["guest", "admin"].map(r => (
                    <button key={r} onClick={() => setForm(f => ({ ...f, role: r }))} style={{ flex: 1, padding: "10px", borderRadius: 10, border: `1px solid ${form.role === r ? "#FF6B35" : "rgba(255,255,255,0.1)"}`, cursor: "pointer", fontSize: 13, fontWeight: 600, fontFamily: "inherit", background: form.role === r ? "rgba(255,107,53,0.12)" : "transparent", color: form.role === r ? "#FF6B35" : "rgba(255,255,255,0.38)" }}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
          <Input label="Email"    name="email"    value={form.email}    onChange={handle} placeholder="you@example.com" type="email" />
          <Input label="Password" name="password" value={form.password} onChange={handle} placeholder="••••••••"          type="password" />
          <Btn onClick={submit} style={{ marginTop: 4 }}>{mode === "login" ? "Sign In" : "Create Account"}</Btn>
        </div>

        <p style={{ textAlign: "center", marginTop: 18, color: "rgba(255,255,255,0.25)", fontSize: 12 }}>
          A Work By Ishan Sharma Guru
        </p>
      </div>

      {/* Show branding panel on wider screens via inline style hack */}
      <style>{`
        @media (min-width: 900px) {
          .auth-branding { display: block !important; }
        }
      `}</style>
    </div>
  );
};

// ─── ADMIN DASHBOARD ─────────────────────────────────────────────────────────
const AdminDashboard = ({ user, events, guests, updates, addToast, setEvents, setUpdates }) => {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ title: "", date: "", time: "", description: "", location: "" });

  const myEvents  = events.filter(e => e.adminId === user.id);
  const totalGuests  = [...new Set(myEvents.flatMap(e => e.guests))].length;
  const totalUpdates = updates.filter(u => myEvents.some(e => e.id === u.eventId)).length;
  const handle = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const createEvent = () => {
    if (!form.title || !form.date) return addToast("Title and date required", "error");
    const newEvent = {
      id: `e${Date.now()}`, title: form.title, date: form.date, time: form.time || "18:00",
      description: form.description, location: form.location,
      lat: 19.0760 + (Math.random() - 0.5) * 0.1, lng: 72.8777 + (Math.random() - 0.5) * 0.1,
      inviteCode: form.title.toUpperCase().replace(/\s/g, "").slice(0, 8) + Math.floor(Math.random() * 100),
      adminId: user.id, guests: [],
      coverColor: ["#FF6B35", "#A855F7", "#06B6D4", "#10B981"][Math.floor(Math.random() * 4)],
    };
    setEvents(ev => [...ev, newEvent]);
    setShowCreate(false);
    setForm({ title: "", date: "", time: "", description: "", location: "" });
    addToast("Event created! 🎉", "success");
  };

  return (
    <div style={{ padding: "0 0 80px" }}>
      <div style={{ padding: "28px 24px 16px" }}>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.38)", fontSize: 13 }}>Good evening,</p>
        <h2 style={{ margin: "2px 0 0", fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", fontFamily: "Syne, sans-serif" }}>{user.name} 👋</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, padding: "0 24px 20px" }}>
        {[
          { label: "Events",  value: myEvents.length,  icon: "calendar", color: "#FF6B35" },
          { label: "Guests",  value: totalGuests,       icon: "users",    color: "#A855F7" },
          { label: "Updates", value: totalUpdates,      icon: "bell",     color: "#06B6D4" },
        ].map(s => (
          <div key={s.label} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "16px 14px" }}>
            <Icon name={s.icon} size={18} color={s.color} />
            <div style={{ fontSize: 26, fontWeight: 800, color: "#fff", lineHeight: 1, marginTop: 8, fontFamily: "Syne, sans-serif" }}>{s.value}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: "0 24px 20px" }}>
        <Btn onClick={() => setShowCreate(true)}><Icon name="plus" size={16} color="#fff" /> Create New Event</Btn>
      </div>

      <div style={{ padding: "0 24px" }}>
        <h3 style={{ margin: "0 0 14px", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Events</h3>
        {myEvents.length === 0
          ? <div style={{ textAlign: "center", padding: "48px 0", color: "rgba(255,255,255,0.25)", fontSize: 14 }}>No events yet. Create one!</div>
          : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{myEvents.map(ev => <EventCard key={ev.id} event={ev} guests={guests} />)}</div>
        }
      </div>

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create Event">
        <Input label="Event Title" name="title" value={form.title} onChange={handle} placeholder="Zenith Product Launch" />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <Input label="Date" name="date" value={form.date} onChange={handle} type="date" />
          <Input label="Time" name="time" value={form.time} onChange={handle} type="time" />
        </div>
        <Input label="Location" name="location" value={form.location} onChange={handle} placeholder="Grand Hyatt, Mumbai" />
        <Textarea label="Description" name="description" value={form.description} onChange={handle} placeholder="Describe your event..." />
        <Btn onClick={createEvent}><Icon name="plus" size={15} color="#fff" /> Create Event</Btn>
      </Modal>
    </div>
  );
};

// ─── ADMIN GUESTS ─────────────────────────────────────────────────────────────
const AdminGuests = ({ user, events, guests, setEvents, addToast }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [showInvite, setShowInvite] = useState(false);

  const myEvents   = events.filter(e => e.adminId === user.id);
  const activeEvent = events.find(e => e.id === (selectedEvent || myEvents[0]?.id));
  const eventGuests = activeEvent ? guests.filter(g => activeEvent.guests.includes(g.id)) : [];

  const addGuest = () => {
    const g = guests.find(u => u.email === inviteEmail && u.role === "guest");
    if (!g) return addToast("Guest not found. They must register first.", "error");
    if (activeEvent.guests.includes(g.id)) return addToast("Already added!", "warning");
    setEvents(ev => ev.map(e => e.id === activeEvent.id ? { ...e, guests: [...e.guests, g.id] } : e));
    setInviteEmail(""); setShowInvite(false);
    addToast(`${g.name} added!`, "success");
  };

  const removeGuest = id => {
    setEvents(ev => ev.map(e => e.id === activeEvent.id ? { ...e, guests: e.guests.filter(g => g !== id) } : e));
    addToast("Guest removed", "success");
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(activeEvent?.inviteCode || "");
    addToast("Invite code copied!", "success");
  };

  return (
    <div style={{ padding: "0 0 80px" }}>
      <div style={{ padding: "28px 24px 16px" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", fontFamily: "Syne, sans-serif" }}>Guest Management</h2>
      </div>

      {myEvents.length > 1 && (
        <div style={{ padding: "0 24px 16px", display: "flex", gap: 8, overflowX: "auto" }}>
          {myEvents.map(ev => (
            <button key={ev.id} onClick={() => setSelectedEvent(ev.id)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 10, border: `1px solid ${(selectedEvent || myEvents[0]?.id) === ev.id ? ev.coverColor : "rgba(255,255,255,0.1)"}`, background: (selectedEvent || myEvents[0]?.id) === ev.id ? `${ev.coverColor}20` : "transparent", color: (selectedEvent || myEvents[0]?.id) === ev.id ? ev.coverColor : "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>
              {ev.title.slice(0, 18)}
            </button>
          ))}
        </div>
      )}

      {!activeEvent ? (
        <div style={{ textAlign: "center", padding: "60px 24px", color: "rgba(255,255,255,0.25)" }}>Create an event first</div>
      ) : (
        <>
          <div style={{ margin: "0 24px 20px", background: `linear-gradient(135deg, ${activeEvent.coverColor}12, ${activeEvent.coverColor}06)`, border: `1px solid ${activeEvent.coverColor}28`, borderRadius: 16, padding: 18 }}>
            <p style={{ margin: "0 0 6px", fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Invite Code</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: 26, fontWeight: 800, color: activeEvent.coverColor, letterSpacing: "0.12em", fontFamily: "Syne, sans-serif" }}>{activeEvent.inviteCode}</span>
              <button onClick={copyCode} style={{ background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 8, padding: "8px 14px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                <Icon name="copy" size={13} /> Copy
              </button>
            </div>
          </div>

          <div style={{ padding: "0 24px 16px" }}>
            <Btn onClick={() => setShowInvite(true)}><Icon name="plus" size={15} color="#fff" /> Add Guest</Btn>
          </div>

          <div style={{ padding: "0 24px" }}>
            <p style={{ margin: "0 0 12px", fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>{eventGuests.length} Guests</p>
            {eventGuests.length === 0
              ? <div style={{ textAlign: "center", padding: "32px", background: "rgba(255,255,255,0.03)", borderRadius: 14, color: "rgba(255,255,255,0.25)", fontSize: 14 }}>No guests yet</div>
              : <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {eventGuests.map(g => (
                    <div key={g.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 12 }}>
                      <Avatar user={g} size={40} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: "#fff" }}>{g.name}</div>
                        <div style={{ fontSize: 12, color: "rgba(255,255,255,0.3)" }}>{g.email}</div>
                      </div>
                      <button onClick={() => removeGuest(g.id)} style={{ background: "rgba(255,71,87,0.1)", border: "none", borderRadius: 8, padding: 8, color: "#FF4757", cursor: "pointer", display: "flex" }}>
                        <Icon name="trash" size={15} color="#FF4757" />
                      </button>
                    </div>
                  ))}
                </div>
            }
          </div>
        </>
      )}

      <Modal open={showInvite} onClose={() => setShowInvite(false)} title="Add Guest">
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.38)" }}>Enter the guest's registered email address.</p>
        <Input label="Guest Email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="guest@example.com" />
        <Btn onClick={addGuest}><Icon name="plus" size={15} color="#fff" /> Add to Event</Btn>
      </Modal>
    </div>
  );
};

// ─── UPDATES ─────────────────────────────────────────────────────────────────
const UpdatesScreen = ({ user, events, updates, setUpdates, addToast }) => {
  const [text, setText] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const myEvents = user.role === "admin"
    ? events.filter(e => e.adminId === user.id)
    : events.filter(e => e.guests.includes(user.id));

  const activeEventId = selectedEvent || myEvents[0]?.id;
  const relevantUpdates = updates.filter(u => u.eventId === activeEventId).sort((a, b) => new Date(b.time) - new Date(a.time));

  const postUpdate = () => {
    if (!text.trim()) return;
    if (!activeEventId) return addToast("Select an event first", "warning");
    setUpdates(u => [{ id: `n${Date.now()}`, eventId: activeEventId, authorId: user.id, text: text.trim(), time: new Date().toISOString(), read: [] }, ...u]);
    setText("");
    addToast("Update posted!", "success");
  };

  const markRead = id => setUpdates(u => u.map(up => up.id === id ? { ...up, read: [...new Set([...up.read, user.id])] } : up));
  const getUserById = id => MOCK_USERS.find(u => u.id === id) || { name: "Unknown", avatar: "??" };
  const fmt = iso => { const d = new Date(iso); return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) + " · " + d.toLocaleDateString([], { month: "short", day: "numeric" }); };

  return (
    <div style={{ padding: "0 0 80px" }}>
      <div style={{ padding: "28px 24px 16px" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", fontFamily: "Syne, sans-serif" }}>
          {user.role === "admin" ? "Post Updates" : "Notifications"}
        </h2>
      </div>

      {myEvents.length > 0 && (
        <div style={{ padding: "0 24px 16px", display: "flex", gap: 8, overflowX: "auto" }}>
          {myEvents.map(ev => (
            <button key={ev.id} onClick={() => setSelectedEvent(ev.id)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 10, border: `1px solid ${activeEventId === ev.id ? ev.coverColor : "rgba(255,255,255,0.1)"}`, background: activeEventId === ev.id ? `${ev.coverColor}20` : "transparent", color: activeEventId === ev.id ? ev.coverColor : "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              {ev.title.slice(0, 20)}
            </button>
          ))}
        </div>
      )}

      {user.role === "admin" && (
        <div style={{ padding: "0 24px 20px" }}>
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 16 }}>
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Post an update to all guests..." style={{ width: "100%", background: "transparent", border: "none", color: "#fff", fontSize: 14, outline: "none", fontFamily: "inherit", resize: "none", minHeight: 64, boxSizing: "border-box" }} />
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
              <button onClick={postUpdate} style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", border: "none", borderRadius: 10, padding: "10px 18px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
                <Icon name="send" size={13} color="#fff" /> Send Update
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ padding: "0 24px" }}>
        {relevantUpdates.length === 0
          ? <div style={{ textAlign: "center", padding: "48px", color: "rgba(255,255,255,0.25)", fontSize: 14 }}>No updates yet</div>
          : <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {relevantUpdates.map(upd => {
                const isUnread = !upd.read.includes(user.id);
                const author   = getUserById(upd.authorId);
                return (
                  <div key={upd.id} onClick={() => markRead(upd.id)} style={{ background: isUnread ? "rgba(255,107,53,0.07)" : "rgba(255,255,255,0.03)", border: `1px solid ${isUnread ? "rgba(255,107,53,0.22)" : "rgba(255,255,255,0.06)"}`, borderRadius: 16, padding: 16, cursor: "pointer" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                      <Avatar user={author} size={30} />
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "#fff" }}>{author.name}</span>
                        {author.role === "admin" && <span style={{ marginLeft: 6, background: "rgba(255,107,53,0.18)", color: "#FF6B35", fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "2px 6px" }}>ADMIN</span>}
                      </div>
                      {isUnread && <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#FF6B35", flexShrink: 0 }} />}
                    </div>
                    <p style={{ margin: "0 0 8px", fontSize: 14, color: "rgba(255,255,255,0.82)", lineHeight: 1.55 }}>{upd.text}</p>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.28)" }}>{fmt(upd.time)}</span>
                  </div>
                );
              })}
            </div>
        }
      </div>
    </div>
  );
};

// ─── MEDIA ────────────────────────────────────────────────────────────────────
const MediaScreen = ({ user, events, media, setMedia, addToast }) => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [lightbox, setLightbox] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [caption, setCaption] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  const myEvents = user.role === "admin"
    ? events.filter(e => e.adminId === user.id)
    : events.filter(e => e.guests.includes(user.id));

  const activeEventId = selectedEvent || myEvents[0]?.id;
  const eventMedia = media.filter(m => m.eventId === activeEventId).sort((a, b) => new Date(b.time) - new Date(a.time));

  const SAMPLES = [
    "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400",
  ];

  const uploadPhoto = () => {
    const url = previewUrl || SAMPLES[Math.floor(Math.random() * SAMPLES.length)];
    setMedia(m => [{ id: `m${Date.now()}`, eventId: activeEventId, authorId: user.id, type: "photo", url, caption: caption || "Shared a photo", time: new Date().toISOString() }, ...m]);
    setShowUpload(false); setCaption(""); setPreviewUrl("");
    addToast("Photo uploaded!", "success");
  };

  const getUserById = id => MOCK_USERS.find(u => u.id === id) || { name: "Unknown", avatar: "??" };

  return (
    <div style={{ padding: "0 0 80px" }}>
      <div style={{ padding: "28px 24px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", fontFamily: "Syne, sans-serif" }}>Gallery</h2>
        {activeEventId && (
          <button onClick={() => setShowUpload(true)} style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", border: "none", borderRadius: 12, padding: "10px 18px", color: "#fff", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, fontFamily: "inherit" }}>
            <Icon name="upload" size={14} color="#fff" /> Upload
          </button>
        )}
      </div>

      {myEvents.length > 0 && (
        <div style={{ padding: "0 24px 16px", display: "flex", gap: 8, overflowX: "auto" }}>
          {myEvents.map(ev => (
            <button key={ev.id} onClick={() => setSelectedEvent(ev.id)} style={{ flexShrink: 0, padding: "8px 14px", borderRadius: 10, border: `1px solid ${activeEventId === ev.id ? ev.coverColor : "rgba(255,255,255,0.1)"}`, background: activeEventId === ev.id ? `${ev.coverColor}20` : "transparent", color: activeEventId === ev.id ? ev.coverColor : "rgba(255,255,255,0.45)", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", whiteSpace: "nowrap" }}>
              {ev.title.slice(0, 18)}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding: "0 24px" }}>
        {eventMedia.length === 0
          ? <div style={{ textAlign: "center", padding: "60px 0", color: "rgba(255,255,255,0.25)" }}>
              <Icon name="image" size={40} color="rgba(255,255,255,0.12)" />
              <p style={{ marginTop: 12 }}>No photos yet. Be the first!</p>
            </div>
          : <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 7 }}>
              {eventMedia.map((item, i) => (
                <div key={item.id} onClick={() => setLightbox(item)} style={{ aspectRatio: "1", borderRadius: i === 0 ? "16px 6px 6px 6px" : 10, overflow: "hidden", cursor: "pointer", position: "relative" }}>
                  <img src={item.url} alt={item.caption} style={{ width: "100%", height: "100%", objectFit: "cover" }} loading="lazy" />
                  {i === 0 && <div style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(0,0,0,0.65)", borderRadius: 6, padding: "3px 8px" }}><span style={{ fontSize: 10, color: "#fff", fontWeight: 700 }}>LATEST</span></div>}
                </div>
              ))}
            </div>
        }
      </div>

      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.95)", zIndex: 2000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <button onClick={() => setLightbox(null)} style={{ position: "absolute", top: 20, right: 20, background: "rgba(255,255,255,0.08)", border: "none", borderRadius: 10, padding: 10, color: "#fff", cursor: "pointer", display: "flex" }}>
            <Icon name="x" size={20} />
          </button>
          <img src={lightbox.url} alt={lightbox.caption} style={{ maxWidth: "100%", maxHeight: "72vh", borderRadius: 16, objectFit: "contain" }} />
          <div style={{ marginTop: 18, textAlign: "center" }}>
            <p style={{ margin: 0, color: "#fff", fontSize: 15, fontWeight: 600 }}>{lightbox.caption}</p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 8 }}>
              <Avatar user={getUserById(lightbox.authorId)} size={24} />
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.45)" }}>{getUserById(lightbox.authorId).name}</span>
            </div>
          </div>
        </div>
      )}

      <Modal open={showUpload} onClose={() => setShowUpload(false)} title="Share a Photo">
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.38)" }}>Enter a photo URL or choose a sample image.</p>
        <Input label="Image URL (optional)" value={previewUrl} onChange={e => setPreviewUrl(e.target.value)} placeholder="https://..." />
        {previewUrl && <img src={previewUrl} alt="Preview" style={{ width: "100%", borderRadius: 12, marginBottom: 16, maxHeight: 200, objectFit: "cover" }} />}
        <Input label="Caption" value={caption} onChange={e => setCaption(e.target.value)} placeholder="Add a caption..." />
        <Btn onClick={uploadPhoto}><Icon name="upload" size={15} color="#fff" /> Upload Photo</Btn>
        <p style={{ margin: "16px 0 8px", fontSize: 11, color: "rgba(255,255,255,0.25)", textAlign: "center" }}>— or choose a sample —</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          {SAMPLES.map((url, i) => (
            <img key={i} src={url} onClick={() => setPreviewUrl(url)} style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 10, cursor: "pointer", border: `2px solid ${previewUrl === url ? "#FF6B35" : "transparent"}` }} />
          ))}
        </div>
      </Modal>
    </div>
  );
};

// ─── MAP ──────────────────────────────────────────────────────────────────────
const MapScreen = ({ user, events }) => {
  const myEvents = user.role === "admin"
    ? events.filter(e => e.adminId === user.id)
    : events.filter(e => e.guests.includes(user.id));

  const openMaps = ev => {
    const q = encodeURIComponent(ev.location || `${ev.lat},${ev.lng}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, "_blank");
  };

  return (
    <div style={{ padding: "0 0 80px" }}>
      <div style={{ padding: "28px 24px 16px" }}>
        <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", fontFamily: "Syne, sans-serif" }}>Event Locations</h2>
      </div>

      {myEvents.length === 0
        ? <div style={{ textAlign: "center", padding: "60px 24px", color: "rgba(255,255,255,0.25)" }}>No events to show</div>
        : <div style={{ padding: "0 24px", display: "flex", flexDirection: "column", gap: 16 }}>
            {myEvents.map(ev => (
              <div key={ev.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, overflow: "hidden" }}>
                <div style={{ height: 160, background: "linear-gradient(135deg, #0a0a1a, #111128)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {[...Array(8)].map((_, i) => <div key={`h${i}`} style={{ position: "absolute", top: `${i * 14}%`, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.035)" }} />)}
                  {[...Array(8)].map((_, i) => <div key={`v${i}`} style={{ position: "absolute", left: `${i * 14}%`, top: 0, bottom: 0, width: 1, background: "rgba(255,255,255,0.035)" }} />)}
                  <div style={{ position: "relative", zIndex: 2 }}>
                    <div style={{ width: 52, height: 52, borderRadius: "50%", background: `radial-gradient(circle, ${ev.coverColor}30, transparent 70%)`, position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", animation: "pulse 2s infinite" }} />
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: ev.coverColor, border: "3px solid #fff", boxShadow: `0 4px 20px ${ev.coverColor}80`, position: "relative", zIndex: 3 }} />
                  </div>
                  <div style={{ position: "absolute", bottom: 12, left: 12, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", borderRadius: 8, padding: "5px 10px" }}>
                    <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)" }}>📍 {ev.lat?.toFixed(4)}, {ev.lng?.toFixed(4)}</span>
                  </div>
                </div>
                <div style={{ padding: 18 }}>
                  <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#fff" }}>{ev.title}</h3>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 16 }}>
                    <Icon name="location" size={13} color="rgba(255,255,255,0.38)" />
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.45)" }}>{ev.location || "Location TBD"}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <button onClick={() => openMaps(ev)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px", borderRadius: 12, border: "none", background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", color: "#fff", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                      <Icon name="navigation" size={13} color="#fff" /> Navigate
                    </button>
                    <button onClick={() => openMaps(ev)} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "11px", borderRadius: 12, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "rgba(255,255,255,0.65)", cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit" }}>
                      <Icon name="map" size={13} /> Open Maps
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
      }
    </div>
  );
};

// ─── GUEST HOME ───────────────────────────────────────────────────────────────
const JoinEventScreen = ({ user, events, setEvents, addToast }) => {
  const [code, setCode] = useState("");
  const joinedEvents = events.filter(e => e.guests.includes(user.id));

  const join = () => {
    const event = events.find(e => e.inviteCode.toUpperCase() === code.trim().toUpperCase());
    if (!event) return addToast("Invalid invite code", "error");
    if (event.guests.includes(user.id)) return addToast("Already joined!", "warning");
    setEvents(ev => ev.map(e => e.id === event.id ? { ...e, guests: [...e.guests, user.id] } : e));
    setCode("");
    addToast(`Joined "${event.title}"! 🎉`, "success");
  };

  return (
    <div style={{ padding: "0 0 80px" }}>
      <div style={{ padding: "28px 24px 16px" }}>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.38)", fontSize: 13 }}>Welcome back,</p>
        <h2 style={{ margin: "2px 0 0", fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", fontFamily: "Syne, sans-serif" }}>{user.name} ✨</h2>
      </div>

      <div style={{ margin: "0 24px 24px", background: "linear-gradient(135deg, rgba(255,107,53,0.1), rgba(168,85,247,0.06))", border: "1px solid rgba(255,107,53,0.18)", borderRadius: 20, padding: 20 }}>
        <h3 style={{ margin: "0 0 4px", fontSize: 16, fontWeight: 700, color: "#fff" }}>Join an Event</h3>
        <p style={{ margin: "0 0 16px", fontSize: 13, color: "rgba(255,255,255,0.38)" }}>Enter the invite code shared by the organizer.</p>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="e.g. ZENITH25" onKeyDown={e => e.key === "Enter" && join()} style={{ flex: 1, background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "12px 14px", color: "#fff", fontSize: 15, outline: "none", fontFamily: "inherit", letterSpacing: "0.1em", fontWeight: 600 }} />
          <button onClick={join} style={{ background: "linear-gradient(135deg, #FF6B35, #FF8C5A)", border: "none", borderRadius: 10, padding: "0 22px", color: "#fff", cursor: "pointer", fontSize: 14, fontWeight: 700, fontFamily: "inherit" }}>Join</button>
        </div>
      </div>

      <div style={{ padding: "0 24px" }}>
        <h3 style={{ margin: "0 0 12px", fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Your Events ({joinedEvents.length})</h3>
        {joinedEvents.length === 0
          ? <div style={{ textAlign: "center", padding: "32px", background: "rgba(255,255,255,0.03)", borderRadius: 16, color: "rgba(255,255,255,0.25)", fontSize: 14 }}>
              No events yet. Try: <strong style={{ color: "rgba(255,107,53,0.6)" }}>ZENITH25</strong>
            </div>
          : <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>{joinedEvents.map(ev => <EventCard key={ev.id} event={ev} guests={MOCK_USERS} />)}</div>
        }
      </div>
    </div>
  );
};

// ─── PROFILE ──────────────────────────────────────────────────────────────────
const ProfileScreen = ({ user, onLogout }) => (
  <div style={{ padding: "0 0 80px" }}>
    <div style={{ padding: "28px 24px 16px" }}>
      <h2 style={{ margin: 0, fontSize: 24, fontWeight: 800, color: "#fff", letterSpacing: "-0.02em", fontFamily: "Syne, sans-serif" }}>Profile</h2>
    </div>
    <div style={{ padding: "0 24px" }}>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: 28, display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 20 }}>
        <Avatar user={user} size={76} />
        <h3 style={{ margin: "14px 0 4px", fontSize: 20, fontWeight: 700, color: "#fff", fontFamily: "Syne, sans-serif" }}>{user.name}</h3>
        <p style={{ margin: 0, color: "rgba(255,255,255,0.38)", fontSize: 14 }}>{user.email}</p>
        <div style={{ marginTop: 12, background: user.role === "admin" ? "rgba(255,107,53,0.12)" : "rgba(168,85,247,0.12)", border: `1px solid ${user.role === "admin" ? "rgba(255,107,53,0.28)" : "rgba(168,85,247,0.28)"}`, borderRadius: 8, padding: "4px 14px" }}>
          <span style={{ fontSize: 11, fontWeight: 700, color: user.role === "admin" ? "#FF6B35" : "#A855F7", textTransform: "uppercase", letterSpacing: "0.08em" }}>
            {user.role === "admin" ? "🛡️ Admin" : "✨ Guest"}
          </span>
        </div>
      </div>
      <Btn variant="danger" onClick={onLogout}><Icon name="logout" size={15} color="#FF4757" /> Sign Out</Btn>
    </div>
  </div>
);

// ─── SIDEBAR NAV (desktop) ────────────────────────────────────────────────────
const SidebarNav = ({ tab, setTab, role, unreadCount, user, onLogout }) => {
  const adminTabs = [
    { id: "home",    icon: "home",     label: "Dashboard" },
    { id: "guests",  icon: "users",    label: "Guests"    },
    { id: "updates", icon: "bell",     label: "Updates"   },
    { id: "media",   icon: "image",    label: "Media"     },
    { id: "map",     icon: "map",      label: "Map"       },
  ];
  const guestTabs = [
    { id: "home",    icon: "home",     label: "Home"     },
    { id: "updates", icon: "bell",     label: "Feed"     },
    { id: "media",   icon: "image",    label: "Gallery"  },
    { id: "map",     icon: "map",      label: "Location" },
  ];
  const tabs = role === "admin" ? adminTabs : guestTabs;

  return (
    <aside style={{ width: 220, minHeight: "100vh", background: "rgba(255,255,255,0.02)", borderRight: "1px solid rgba(255,255,255,0.05)", display: "flex", flexDirection: "column", padding: "24px 0 20px", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 100 }}>
      {/* Logo */}
      <div style={{ padding: "0 20px 28px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #FF6B35, #FF3CAC)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, boxShadow: "0 6px 20px rgba(255,107,53,0.3)" }}>
            <Icon name="star" size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 17, fontWeight: 800, color: "#fff", fontFamily: "Syne, sans-serif", letterSpacing: "-0.02em" }}>Eventara</span>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "16px 12px" }}>
        {tabs.map(t => {
          const active = tab === t.id;
          return (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", padding: "10px 12px", borderRadius: 11, border: "none", cursor: "pointer", fontFamily: "inherit", marginBottom: 4, background: active ? "rgba(255,107,53,0.12)" : "transparent", color: active ? "#FF6B35" : "rgba(255,255,255,0.4)", transition: "all 0.15s", position: "relative" }}>
              <div style={{ position: "relative" }}>
                <Icon name={t.icon} size={17} color={active ? "#FF6B35" : "rgba(255,255,255,0.35)"} />
                {t.id === "updates" && unreadCount > 0 && <Badge count={unreadCount} />}
              </div>
              <span style={{ fontSize: 14, fontWeight: active ? 700 : 500 }}>{t.label}</span>
              {active && <div style={{ position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)", width: 3, height: 22, background: "#FF6B35", borderRadius: "0 3px 3px 0" }} />}
            </button>
          );
        })}
      </nav>

      {/* User + logout */}
      <div style={{ padding: "16px 12px 0", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 11, background: "rgba(255,255,255,0.04)", marginBottom: 8 }}>
          <Avatar user={user} size={32} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.name}</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{user.role}</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", padding: "10px 12px", borderRadius: 11, border: "none", cursor: "pointer", fontFamily: "inherit", background: "transparent", color: "rgba(255,71,87,0.7)", fontSize: 13, fontWeight: 500 }}>
          <Icon name="logout" size={15} color="rgba(255,71,87,0.7)" /> Sign Out
        </button>
      </div>
    </aside>
  );
};

// ─── BOTTOM NAV (mobile) ──────────────────────────────────────────────────────
const BottomNav = ({ tab, setTab, role, unreadCount }) => {
  const adminTabs = [
    { id: "home",    icon: "home",     label: "Home"    },
    { id: "guests",  icon: "users",    label: "Guests"  },
    { id: "updates", icon: "bell",     label: "Updates" },
    { id: "media",   icon: "image",    label: "Media"   },
    { id: "map",     icon: "map",      label: "Map"     },
  ];
  const guestTabs = [
    { id: "home",    icon: "home",     label: "Home"     },
    { id: "updates", icon: "bell",     label: "Feed"     },
    { id: "media",   icon: "image",    label: "Gallery"  },
    { id: "map",     icon: "map",      label: "Location" },
  ];
  const tabs = role === "admin" ? adminTabs : guestTabs;

  return (
    <div style={{ position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(8,8,18,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", padding: "8px 8px 20px", zIndex: 100 }}>
      {tabs.map(t => {
        const active = tab === t.id;
        return (
          <button key={t.id} onClick={() => setTab(t.id)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4, background: "none", border: "none", cursor: "pointer", padding: "8px 0", position: "relative" }}>
            <div style={{ position: "relative" }}>
              <div style={{ width: 36, height: 36, borderRadius: 12, background: active ? "linear-gradient(135deg, #FF6B35, #FF8C5A)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
                <Icon name={t.icon} size={18} color={active ? "#fff" : "rgba(255,255,255,0.3)"} />
              </div>
              {t.id === "updates" && unreadCount > 0 && <Badge count={unreadCount} />}
            </div>
            <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#FF6B35" : "rgba(255,255,255,0.28)", fontFamily: "inherit" }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ════════════════════════════════════════════════════════════════════════════════
// ROOT APP
// ════════════════════════════════════════════════════════════════════════════════
export default function App() {
  const [allUsers, setAllUsers] = useState(MOCK_USERS);
  const [user,    setUser]    = useState(null);
  const [tab,     setTab]     = useState("home");
  const [events,  setEvents]  = useState(MOCK_EVENTS);
  const [updates, setUpdates] = useState(MOCK_UPDATES);
  const [media,   setMedia]   = useState(MOCK_MEDIA);
  const [toasts,  setToasts]  = useState([]);

  const addToast = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const removeToast = id => setToasts(t => t.filter(x => x.id !== id));

  const unreadCount = user ? updates.filter(u => {
    const mine = user.role === "admin"
      ? events.filter(e => e.adminId === user.id)
      : events.filter(e => e.guests.includes(user.id));
    return mine.some(e => e.id === u.eventId) && !u.read.includes(user.id);
  }).length : 0;

  if (!user) return (
    <>
      <Toast toasts={toasts} remove={removeToast} />
     <AuthScreen onLogin={setUser} addToast={addToast} users={allUsers} setUsers={setAllUsers} />
    </>
  );

  const screenProps = { user, events, setEvents, updates, setUpdates, media, setMedia, addToast };

  const screens = {
    home:    user.role === "admin"
               ? <AdminDashboard {...screenProps} guests={MOCK_USERS.filter(u => u.role === "guest")} />
               : <JoinEventScreen {...screenProps} />,
    guests:  <AdminGuests  {...screenProps} guests={MOCK_USERS} />,
    updates: <UpdatesScreen {...screenProps} />,
    media:   <MediaScreen  {...screenProps} />,
    map:     <MapScreen     user={user} events={events} />,
    profile: <ProfileScreen user={user} onLogout={() => { setUser(null); setTab("home"); }} />,
  };

  return (
    <>
      <style>{`
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px) } to { opacity:1; transform:translateY(0) } }
        @keyframes pulse { 0%,100% { transform:translate(-50%,-50%) scale(1); opacity:.6 } 50% { transform:translate(-50%,-50%) scale(1.8); opacity:0 } }
        @media (max-width: 768px) { .desktop-sidebar { display:none !important; } .mobile-nav { display:flex !important; } .desktop-main { margin-left:0 !important; } }
        @media (min-width: 769px) { .mobile-nav { display:none !important; } }
      `}</style>
      <Toast toasts={toasts} remove={removeToast} />

      <div style={{ display: "flex", minHeight: "100vh", background: "#080812" }}>
        {/* Desktop sidebar */}
        <div className="desktop-sidebar">
          <SidebarNav
            tab={tab} setTab={setTab} role={user.role}
            unreadCount={unreadCount} user={user}
            onLogout={() => { setUser(null); setTab("home"); }}
          />
        </div>

        {/* Main content */}
        <main className="desktop-main" style={{ flex: 1, marginLeft: 220, display: "flex", justifyContent: "center", minHeight: "100vh" }}>
          <div style={{ width: "100%", maxWidth: 600, position: "relative" }}>
            {screens[tab] || screens.home}
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="mobile-nav" style={{ display: "none" }}>
          <BottomNav tab={tab} setTab={setTab} role={user.role} unreadCount={unreadCount} />
        </nav>
      </div>
    </>
  );
}
