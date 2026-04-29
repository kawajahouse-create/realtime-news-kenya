import { useState, useEffect, useRef, useMemo } from "react";

/* ─────────────────────────── GLOBAL CSS ─────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@400;500&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#08090D;
  --surface:#10121A;
  --surface2:#161924;
  --border:#1E2230;
  --gold:#F0A500;
  --gold-dim:rgba(240,165,0,0.12);
  --red:#E63946;
  --blue:#4A90E2;
  --green:#34D399;
  --text:#F0EDE8;
  --muted:#6B7280;
  --muted2:#3A3F50;
  --serif:'Fraunces',Georgia,serif;
  --sans:'DM Sans',sans-serif;
  --mono:'DM Mono',monospace;
}
body{background:var(--bg);color:var(--text);font-family:var(--sans);overflow-x:hidden}
::-webkit-scrollbar{width:4px}
::-webkit-scrollbar-track{background:var(--bg)}
::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
input,textarea,button{font-family:var(--sans)}
input::placeholder,textarea::placeholder{color:var(--muted2)}

@keyframes fadeUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
@keyframes fadeIn{from{opacity:0}to{opacity:1}}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes spinRing{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes scaleIn{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}
@keyframes checkIn{from{stroke-dashoffset:40}to{stroke-dashoffset:0}}
`;

/* ─────────────────────────── ADMIN CREDENTIALS ──────────────────────────── */
const ADMIN_EMAIL    = "kawajahouse@gmail.com";
const ADMIN_PASSWORD = "Ultra@2026";

/* ─────────────────────────── LOGO ───────────────────────────────────────── */
function RealtimeLogo({ size = 36, showText = true }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, userSelect: "none" }}>
      <svg width={size} height={size} viewBox="0 0 36 36" fill="none">
        <circle cx="18" cy="18" r="17" stroke="var(--gold)" strokeWidth="1.5" />
        <path d="M9 27 Q18 6 27 27" stroke="var(--gold)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        <circle cx="18" cy="22" r="2.5" fill="var(--gold)" />
        <line x1="10" y1="27" x2="26" y2="27" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      {showText && (
        <div>
          <div style={{ fontFamily: "var(--serif)", fontWeight: 900, fontSize: size * 0.55, color: "var(--text)", letterSpacing: "-0.03em", lineHeight: 1 }}>
            REALTIME<span style={{ color: "var(--gold)" }}>.</span>NEWS
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: size * 0.28, color: "var(--gold)", letterSpacing: "0.15em", marginTop: 1 }}>KENYA</div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── SAMPLE DATA ────────────────────────────────── */
const SAMPLE_POSTS = [
  {
    id: 1, author: "Sarah Kimani", handle: "@sarahk", av: "SK", avColor: "#C0392B",
    type: "image", breaking: true,
    title: "Heavy floods submerge Ngong Road — vehicles trapped",
    body: "Flash floods have submerged sections of Ngong Road near Adams Arcade since 4PM. Kenya Red Cross teams deployed. Motorists advised to use alternative routes.",
    image: "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=700&q=80",
    location: "Ngong Road, Nairobi", time: "2 min ago",
    likes: 284, shares: 141, comments: 3, tags: ["flood", "nairobi", "weather"],
    bio: "Breaking news reporter covering Nairobi South. 6 years in the field.",
  },
  {
    id: 2, author: "James Omondi", handle: "@jomondi", av: "JO", avColor: "#2980B9",
    type: "article", breaking: true,
    title: "Protests erupt outside Parliament — hundreds demand cost-of-living action",
    body: "Demonstrators gathered outside Parliament buildings this afternoon. Police deployed in anti-riot gear. Some tear gas reported along Harambee Avenue.",
    location: "Parliament Rd, CBD", time: "19 min ago",
    likes: 512, shares: 318, comments: 5, tags: ["protests", "parliament", "politics"],
    bio: "Political desk at Realtime News Kenya. Covers Parliament and Statehouse.",
  },
  {
    id: 3, author: "Amina Hassan", handle: "@aminaH", av: "AH", avColor: "#27AE60",
    type: "video", breaking: true,
    title: "Fire engulfs Gikomba Market second floor — traders flee",
    body: "Fire engines from Pumwani and Central stations are responding. Traders are rushing to salvage goods. Cause of the fire is yet to be established.",
    thumbnail: "https://images.unsplash.com/photo-1587727153052-be85d4e3b12e?w=700&q=80",
    location: "Gikomba Market, Eastlands", time: "34 min ago",
    likes: 731, shares: 489, comments: 4, tags: ["fire", "gikomba", "emergency"],
    bio: "Eastlands correspondent. On the ground in Gikomba, Kamukunji, and Makadara.",
  },
  {
    id: 4, author: "David Mwangi", handle: "@dmwangi", av: "DM", avColor: "#8E44AD",
    type: "article", breaking: false,
    title: "SGR Nairobi–Mombasa service delayed 3 hours at Syokimau",
    body: "Passengers on the 10AM service have been stranded since 11:30AM. Kenya Railways cites a technical fault on the southern line. No compensation offered yet.",
    location: "SGR Terminus, Syokimau", time: "48 min ago",
    likes: 143, shares: 89, comments: 2, tags: ["sgr", "transport"],
    bio: "Transport & infrastructure reporter. Tracks SGR, roads, and matatu sector.",
  },
  {
    id: 5, author: "Grace Wanjiru", handle: "@gracew", av: "GW", avColor: "#D35400",
    type: "image", breaking: false,
    title: "8,000 runners take on the Nairobi Half-Marathon",
    body: "Roads closed along Uhuru Highway and Waiyaki Way until 2PM. Elite runners set a blistering pace through the CBD. Atmosphere electric.",
    image: "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?w=700&q=80",
    location: "Uhuru Highway, Nairobi", time: "1 hr ago",
    likes: 387, shares: 201, comments: 2, tags: ["marathon", "sports"],
    bio: "Sports & lifestyle desk. Loves long-distance running coverage.",
  },
];

const SAMPLE_COMMENTS = {
  1: [
    { id: 101, author: "Peter N.", av: "PN", avColor: "#16A085", text: "Just drove past — water is knee-deep near Prestige Plaza. Avoid completely.", time: "1 min ago" },
    { id: 102, author: "Lucy W.", av: "LW", avColor: "#8E44AD", text: "KURA should be held accountable. This drainage issue has been flagged 3 times this year.", time: "3 min ago" },
    { id: 103, author: "Ken O.", av: "KO", avColor: "#E67E22", text: "Route via Lang'ata Road is clear. Use Mbagathi Way as alternative.", time: "5 min ago" },
  ],
  2: [
    { id: 201, author: "Faith M.", av: "FM", avColor: "#C0392B", text: "Fully support this. Unga prices have doubled in 8 months.", time: "10 min ago" },
    { id: 202, author: "Brian K.", av: "BK", avColor: "#2980B9", text: "Police response seems disproportionate for a peaceful demonstration.", time: "14 min ago" },
    { id: 203, author: "Aisha O.", av: "AO", avColor: "#27AE60", text: "Any word on whether the CS will address the crowd?", time: "17 min ago" },
    { id: 204, author: "Njoroge T.", av: "NT", avColor: "#8E44AD", text: "Harambee Avenue is completely blocked. Matatus rerouting through city centre.", time: "18 min ago" },
    { id: 205, author: "Wambui R.", av: "WR", avColor: "#D35400", text: "Stay safe everyone. This is our right to demonstrate.", time: "19 min ago" },
  ],
  3: [
    { id: 301, author: "Musa A.", av: "MA", avColor: "#16A085", text: "My cousin has a stall there — has he been able to get anything out?", time: "20 min ago" },
    { id: 302, author: "Rehema J.", av: "RJ", avColor: "#C0392B", text: "Third fire this year at Gikomba. Something needs to change.", time: "25 min ago" },
    { id: 303, author: "Omar H.", av: "OH", avColor: "#2980B9", text: "Can someone confirm if section B is affected or only section A?", time: "30 min ago" },
    { id: 304, author: "Amina Hassan", av: "AH", avColor: "#27AE60", text: "UPDATE: Fire now confirmed to be spreading to the ground floor. All traders have evacuated.", time: "32 min ago" },
  ],
  4: [
    { id: 401, author: "Charles M.", av: "CM", avColor: "#E67E22", text: "Kenya Railways needs to compensate affected passengers. This is unacceptable.", time: "40 min ago" },
    { id: 402, author: "Diana K.", av: "DK", avColor: "#8E44AD", text: "I'm on this train. No announcement, no water, no AC. Very poor handling.", time: "45 min ago" },
  ],
  5: [
    { id: 501, author: "Simon L.", av: "SL", avColor: "#16A085", text: "Incredible atmosphere out there! Best year yet.", time: "50 min ago" },
    { id: 502, author: "Alice N.", av: "AN", avColor: "#C0392B", text: "Anyone know the lead time at the 10km mark?", time: "55 min ago" },
  ],
};

const TICKER = [
  "🔴 BREAKING: Flash floods on Ngong Road — use alternative routes",
  "🔴 BREAKING: Fire at Gikomba Market — fire engines on scene",
  "⚡ Protests outside Parliament — hundreds gathered, police deployed",
  "📍 SGR delayed 3 hours — Nairobi to Mombasa service affected",
  "🏃 Nairobi Half-Marathon underway — roads closed Uhuru Highway",
];

/* ─────────────────────────── ATOMS ──────────────────────────────────────── */
function Spinner() {
  return (
    <div style={{ width: 20, height: 20, position: "relative", display: "inline-block" }}>
      <div style={{ width: 20, height: 20, borderRadius: "50%", border: "2px solid var(--border)", borderTopColor: "var(--gold)", animation: "spinRing .8s linear infinite", position: "absolute" }} />
    </div>
  );
}

function Tag({ label, onClick }) {
  return (
    <span onClick={onClick} style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--mono)", background: "var(--surface2)", border: "1px solid var(--border)", padding: "2px 8px", borderRadius: 20, cursor: onClick ? "pointer" : "default", transition: "color .15s, border-color .15s" }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.color = "var(--gold)"; e.currentTarget.style.borderColor = "var(--gold)"; } }}
      onMouseLeave={e => { e.currentTarget.style.color = "var(--muted)"; e.currentTarget.style.borderColor = "var(--border)"; }}
    >#{label}</span>
  );
}

function TypeBadge({ type }) {
  const map = { article: ["✦", "#A78BFA"], image: ["◉", "#34D399"], video: ["▶", "#F87171"] };
  const [icon, color] = map[type] || ["✦", "var(--muted)"];
  return (
    <span style={{ fontSize: 9, fontFamily: "var(--mono)", color, background: color + "18", border: `1px solid ${color}33`, padding: "2px 7px", borderRadius: 3, letterSpacing: 1.2, textTransform: "uppercase", fontWeight: 500 }}>{icon} {type}</span>
  );
}

function Avatar({ av, avColor, size = 38, onClick }) {
  return (
    <div onClick={onClick} style={{ width: size, height: size, borderRadius: "50%", background: avColor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontWeight: 500, fontSize: size * 0.32, color: "#fff", flexShrink: 0, cursor: onClick ? "pointer" : "default", transition: "opacity .15s" }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.opacity = ".8"; }}
      onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
    >{av}</div>
  );
}

/* ─────────────────────────── COMMENTS PANEL ─────────────────────────────── */
function CommentsPanel({ post, comments, onAddComment, onClose }) {
  const [text, setText] = useState("");
  const bottomRef = useRef();

  const submit = () => {
    if (!text.trim()) return;
    onAddComment(post.id, text.trim());
    setText("");
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
  };

  return (
    <div style={{ borderTop: "1px solid var(--border)", background: "var(--bg)", animation: "slideDown .2s ease" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 22px", borderBottom: "1px solid var(--border)" }}>
        <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--gold)", letterSpacing: 2 }}>◎ {comments.length} COMMENT{comments.length !== 1 ? "S" : ""}</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 16 }}>✕</button>
      </div>
      <div style={{ maxHeight: 280, overflowY: "auto", padding: "14px 22px", display: "flex", flexDirection: "column", gap: 16 }}>
        {comments.length === 0 && <p style={{ color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 11, textAlign: "center", padding: "20px 0" }}>No comments yet. Be first.</p>}
        {comments.map(c => (
          <div key={c.id} style={{ display: "flex", gap: 10, animation: "fadeUp .3s ease" }}>
            <Avatar av={c.av} avColor={c.avColor} size={30} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 3 }}>
                <span style={{ fontWeight: 600, fontSize: 12 }}>{c.author}</span>
                <span style={{ color: "var(--muted2)", fontSize: 10, fontFamily: "var(--mono)" }}>{c.time}</span>
              </div>
              <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>{c.text}</p>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: "12px 22px", borderTop: "1px solid var(--border)", display: "flex", gap: 10 }}>
        <input value={text} onChange={e => setText(e.target.value)} onKeyDown={e => e.key === "Enter" && submit()} placeholder="Add a comment..."
          style={{ flex: 1, background: "var(--surface2)", border: "1px solid var(--border)", borderRadius: 6, padding: "9px 14px", color: "var(--text)", fontFamily: "var(--sans)", fontSize: 13, outline: "none", transition: "border-color .2s" }}
          onFocus={e => { e.target.style.borderColor = "var(--gold)"; }}
          onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
        />
        <button onClick={submit} disabled={!text.trim()} style={{ background: text.trim() ? "var(--gold)" : "var(--surface2)", border: "none", color: text.trim() ? "var(--bg)" : "var(--muted2)", cursor: text.trim() ? "pointer" : "not-allowed", borderRadius: 6, padding: "0 16px", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 1, fontWeight: 700, transition: "all .15s" }}>POST</button>
      </div>
    </div>
  );
}

/* ─────────────────────────── PROFILE MODAL ──────────────────────────────── */
function ProfileModal({ post, allPosts, onClose, onTagSearch }) {
  const authorPosts = allPosts.filter(p => p.author === post.author);
  const totalLikes = authorPosts.reduce((s, p) => s + p.likes, 0);
  const totalShares = authorPosts.reduce((s, p) => s + p.shares, 0);

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 300, padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", width: "min(520px, 96vw)", maxHeight: "88vh", overflowY: "auto", borderRadius: 10, animation: "scaleIn .25s ease" }}>
        <div style={{ height: 80, background: `linear-gradient(135deg, ${post.avColor}44, var(--surface2))`, position: "relative" }}>
          <button onClick={onClose} style={{ position: "absolute", top: 12, right: 14, background: "rgba(0,0,0,.4)", border: "none", color: "#fff", cursor: "pointer", fontSize: 16, width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
        </div>
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", gap: 14, marginTop: -26, marginBottom: 16 }}>
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: post.avColor, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontWeight: 700, fontSize: 22, color: "#fff", border: "3px solid var(--surface)", flexShrink: 0 }}>{post.av}</div>
            <div style={{ paddingBottom: 4 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 2 }}>{post.author}</div>
              <div style={{ color: "var(--muted)", fontSize: 12, fontFamily: "var(--mono)" }}>{post.handle}</div>
            </div>
          </div>
          {post.bio && <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7, marginBottom: 18, paddingBottom: 18, borderBottom: "1px solid var(--border)" }}>{post.bio}</p>}
          <div style={{ display: "flex", marginBottom: 22 }}>
            {[["Reports", authorPosts.length], ["Likes", totalLikes.toLocaleString()], ["Shares", totalShares.toLocaleString()]].map(([label, val]) => (
              <div key={label} style={{ flex: 1, textAlign: "center", padding: "12px 0", borderRight: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, color: "var(--gold)" }}>{val}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", letterSpacing: 1.2, marginTop: 2 }}>{label.toUpperCase()}</div>
              </div>
            ))}
          </div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--gold)", letterSpacing: 2, marginBottom: 12 }}>RECENT REPORTS</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {authorPosts.map(p => (
              <div key={p.id} style={{ background: "var(--surface2)", border: "1px solid var(--border)", borderLeft: p.breaking ? "3px solid var(--gold)" : "3px solid transparent", borderRadius: 6, padding: "12px 14px" }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 5 }}>
                  <TypeBadge type={p.type} />
                  <span style={{ color: "var(--muted2)", fontSize: 10, fontFamily: "var(--mono)" }}>{p.time}</span>
                  {p.breaking && <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--gold)", letterSpacing: 1.5 }}>● BREAKING</span>}
                </div>
                <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 14, lineHeight: 1.35, marginBottom: 6 }}>{p.title}</div>
                <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                  {p.tags.map(t => <Tag key={t} label={t} onClick={() => { onTagSearch(t); onClose(); }} />)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── TRENDING SIDEBAR ───────────────────────────── */
function TrendingSidebar({ posts, onTagSearch, onLocationSearch }) {
  const tagCounts = useMemo(() => {
    const counts = {};
    posts.forEach(p => p.tags.forEach(t => { counts[t] = (counts[t] || 0) + 1; }));
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [posts]);

  const locationCounts = useMemo(() => {
    const counts = {};
    posts.forEach(p => { counts[p.location] = (counts[p.location] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  }, [posts]);

  const breaking = posts.filter(p => p.breaking).slice(0, 3);

  return (
    <aside style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: "50%", background: "var(--red)", animation: "pulse 1.2s infinite" }} />
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--red)", letterSpacing: 2, fontWeight: 700 }}>BREAKING NOW</span>
        </div>
        {breaking.map((p, i) => (
          <div key={p.id} style={{ padding: "11px 16px", borderBottom: i < breaking.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", letterSpacing: 1, marginBottom: 4 }}>{p.time}</div>
            <div style={{ fontSize: 12, fontWeight: 600, lineHeight: 1.4 }}>{p.title}</div>
          </div>
        ))}
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden", marginBottom: 12 }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--gold)", letterSpacing: 2 }}>TRENDING TOPICS</span>
        </div>
        <div style={{ padding: "8px 0" }}>
          {tagCounts.map(([tag, count], i) => (
            <div key={tag} onClick={() => onTagSearch(tag)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", cursor: "pointer", transition: "background .12s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--surface2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted2)", width: 14 }}>{i + 1}</span>
                <span style={{ fontSize: 13, fontWeight: 500 }}>#{tag}</span>
              </div>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", background: "var(--surface2)", padding: "1px 7px", borderRadius: 10 }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
        <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
          <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--gold)", letterSpacing: 2 }}>ACTIVE LOCATIONS</span>
        </div>
        <div style={{ padding: "8px 0" }}>
          {locationCounts.map(([loc, count]) => (
            <div key={loc} onClick={() => onLocationSearch(loc)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 16px", cursor: "pointer", transition: "background .12s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "var(--surface2)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ color: "var(--gold)", fontSize: 11 }}>◈</span>
                <span style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.3 }}>{loc}</span>
              </div>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted2)" }}>{count}</span>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}

/* ─────────────────────────── POST CARD ──────────────────────────────────── */
function PostCard({ post, allPosts, comments, onAddComment, onOpenProfile, onTagSearch }) {
  const [liked, setLiked] = useState(false);
  const [showComments, setShowComments] = useState(false);

  return (
    <article style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)", borderLeft: post.breaking ? "3px solid var(--gold)" : "3px solid transparent", transition: "background .15s", animation: "fadeUp .4s ease both" }}
      onMouseEnter={e => { e.currentTarget.style.background = "var(--surface2)"; }}
      onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; }}
    >
      <div style={{ padding: "20px 22px" }}>
        {post.breaking && (
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--gold)", letterSpacing: 2.5, marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
            <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "var(--gold)", animation: "pulse 1.2s infinite" }} />
            BREAKING
          </div>
        )}
        <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
          <Avatar av={post.av} avColor={post.avColor} size={38} onClick={() => onOpenProfile(post)} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6, marginBottom: 3 }}>
              <span onClick={() => onOpenProfile(post)} style={{ fontWeight: 600, fontSize: 13.5, cursor: "pointer" }}
                onMouseEnter={e => { e.currentTarget.style.color = "var(--gold)"; }}
                onMouseLeave={e => { e.currentTarget.style.color = "var(--text)"; }}
              >{post.author}</span>
              <span style={{ color: "var(--muted)", fontSize: 12, fontFamily: "var(--mono)" }}>{post.handle}</span>
              <span style={{ color: "var(--muted2)", fontSize: 11 }}>· {post.time}</span>
              <TypeBadge type={post.type} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span style={{ color: "var(--gold)", fontSize: 11 }}>◈</span>
              <span style={{ color: "var(--muted)", fontSize: 11, fontFamily: "var(--mono)" }}>{post.location}</span>
            </div>
          </div>
        </div>
        <h3 style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 19, color: "var(--text)", lineHeight: 1.3, letterSpacing: "-.025em", marginBottom: 7 }}>{post.title}</h3>
        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.7, marginBottom: 14 }}>{post.body}</p>
        {post.image && (
          <div style={{ borderRadius: 6, overflow: "hidden", marginBottom: 14, border: "1px solid var(--border)" }}>
            <img src={post.image} alt="" style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block" }} />
          </div>
        )}
        {post.thumbnail && (
          <div style={{ position: "relative", borderRadius: 6, overflow: "hidden", marginBottom: 14, border: "1px solid var(--border)" }}>
            <img src={post.thumbnail} alt="" style={{ width: "100%", maxHeight: 260, objectFit: "cover", display: "block", filter: "brightness(.65)" }} />
            <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: "var(--bg)", boxShadow: "0 0 0 8px rgba(240,165,0,.2)", cursor: "pointer" }}>▶</div>
            </div>
            <span style={{ position: "absolute", bottom: 10, left: 12, fontFamily: "var(--mono)", fontSize: 9, color: "#fff", background: "#0009", padding: "2px 8px", borderRadius: 2, letterSpacing: 1.5 }}>VIDEO</span>
          </div>
        )}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
          {post.tags.map(t => <Tag key={t} label={t} onClick={() => onTagSearch(t)} />)}
        </div>
        <div style={{ display: "flex", gap: 22, borderTop: "1px solid var(--border)", paddingTop: 12 }}>
          {[
            { icon: liked ? "♥" : "♡", count: post.likes + (liked ? 1 : 0), act: () => setLiked(!liked), activeColor: "#F87171", i: 0 },
            { icon: "↗", count: post.shares, activeColor: "var(--blue)", i: 1 },
            { icon: "◎", count: comments.length, activeColor: "var(--gold)", i: 2, act: () => setShowComments(v => !v) },
          ].map(b => (
            <button key={b.i} onClick={b.act} style={{ background: "none", border: "none", cursor: "pointer", color: (b.i === 0 && liked) || (b.i === 2 && showComments) ? b.activeColor : "var(--muted)", fontFamily: "var(--mono)", fontSize: 13, display: "flex", alignItems: "center", gap: 6, transition: "color .15s", padding: 0 }}
              onMouseEnter={e => { e.currentTarget.style.color = b.activeColor; }}
              onMouseLeave={e => { e.currentTarget.style.color = (b.i === 0 && liked) || (b.i === 2 && showComments) ? b.activeColor : "var(--muted)"; }}
            >{b.icon} <span style={{ fontSize: 11 }}>{b.count.toLocaleString()}</span></button>
          ))}
          <button style={{ marginLeft: "auto", background: "none", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 9, padding: "3px 12px", borderRadius: 3, letterSpacing: 1.5, transition: "border-color .15s, color .15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
          >SHARE</button>
        </div>
      </div>
      {showComments && <CommentsPanel post={post} comments={comments} onAddComment={onAddComment} onClose={() => setShowComments(false)} />}
    </article>
  );
}

/* ─────────────────────────── COMPOSE MODAL ──────────────────────────────── */
function ComposeModal({ user, onClose, onPost }) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("article");
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();

  const handleFile = e => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => setPreview(ev.target.result);
    r.readAsDataURL(f);
    setType(f.type.startsWith("video") ? "video" : "image");
  };

  const gps = () => navigator.geolocation?.getCurrentPosition(
    p => setLocation(`${p.coords.latitude.toFixed(4)}, ${p.coords.longitude.toFixed(4)}`),
    () => setLocation("Location unavailable")
  );

  const publish = () => {
    if (!title.trim()) return;
    const av = user.email.slice(0, 2).toUpperCase();
    onPost({
      id: Date.now(), author: user.email.split("@")[0], handle: `@${user.email.split("@")[0]}`,
      av, avColor: "var(--gold)", type, breaking: false,
      title, body, location: location || "Unknown location",
      time: "just now", likes: 0, shares: 0, comments: 0, tags: [], bio: "Community reporter.",
      ...(preview && type === "image" ? { image: preview } : {}),
      ...(preview && type === "video" ? { thumbnail: preview } : {}),
    });
    onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: "var(--surface)", border: "1px solid var(--border)", width: "min(580px,96vw)", maxHeight: "92vh", overflowY: "auto", borderRadius: 8, animation: "scaleIn .25s ease" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 22px", borderBottom: "1px solid var(--border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <RealtimeLogo size={24} showText={false} />
            <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--gold)", letterSpacing: 2 }}>POST NEWS</span>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 20 }}>✕</button>
        </div>
        <div style={{ padding: "22px" }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 18 }}>
            {[["article", "✦ Article"], ["image", "◉ Photo"], ["video", "▶ Video"]].map(([v, l]) => (
              <button key={v} onClick={() => setType(v)} style={{ flex: 1, padding: "9px 0", borderRadius: 5, background: type === v ? "var(--gold)" : "var(--surface2)", border: `1px solid ${type === v ? "var(--gold)" : "var(--border)"}`, color: type === v ? "var(--bg)" : "var(--muted)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1, fontWeight: type === v ? 600 : 400 }}>{l}</button>
            ))}
          </div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Headline — what is happening right now?"
            style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "13px 15px", color: "var(--text)", fontFamily: "var(--serif)", fontSize: 18, fontWeight: 700, outline: "none", marginBottom: 12, transition: "border-color .2s" }}
            onFocus={e => { e.target.style.borderColor = "var(--gold)"; }} onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
          />
          <textarea value={body} onChange={e => setBody(e.target.value)} placeholder="Tell the full story..." rows={4}
            style={{ width: "100%", background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "13px 15px", color: "var(--muted)", resize: "none", fontFamily: "var(--sans)", fontSize: 13, outline: "none", lineHeight: 1.7, marginBottom: 12, transition: "border-color .2s" }}
            onFocus={e => { e.target.style.borderColor = "var(--gold)"; }} onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
          />
          {(type === "image" || type === "video") && (
            <div onClick={() => fileRef.current.click()} style={{ border: "2px dashed var(--border)", borderRadius: 6, padding: "28px", textAlign: "center", cursor: "pointer", marginBottom: 12, background: "var(--bg)", transition: "border-color .2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; }}
            >
              {preview
                ? <img src={preview} alt="" style={{ maxHeight: 150, maxWidth: "100%", borderRadius: 4, display: "block", margin: "0 auto" }} />
                : <><div style={{ fontSize: 30, marginBottom: 6 }}>{type === "video" ? "▶" : "◉"}</div><div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", letterSpacing: 1 }}>CLICK TO UPLOAD {type.toUpperCase()}</div></>
              }
            </div>
          )}
          <input ref={fileRef} type="file" accept={type === "video" ? "video/*" : "image/*"} style={{ display: "none" }} onChange={handleFile} />
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="◈  Tag a location..."
              style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 14px", color: "var(--text)", fontFamily: "var(--mono)", fontSize: 12, outline: "none", transition: "border-color .2s" }}
              onFocus={e => { e.target.style.borderColor = "var(--gold)"; }} onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
            />
            <button onClick={gps} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--blue)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 10, padding: "0 16px", borderRadius: 6, letterSpacing: 1, whiteSpace: "nowrap" }}>USE GPS</button>
          </div>
          <button onClick={publish} disabled={!title.trim()} style={{ width: "100%", padding: "14px", borderRadius: 6, cursor: title.trim() ? "pointer" : "not-allowed", background: title.trim() ? "var(--gold)" : "var(--surface2)", border: "none", color: title.trim() ? "var(--bg)" : "var(--muted2)", fontFamily: "var(--mono)", fontSize: 12, letterSpacing: 2, fontWeight: 700, transition: "all .2s" }}>PUBLISH TO FEED →</button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── ADMIN PANEL ────────────────────────────────── */
function AdminPanel({ posts, comments, viewers, onClose, onDeletePost, onDeleteComment, onToggleBreaking, onOpenProfile }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminSearch, setAdminSearch] = useState("");

  const totalComments = useMemo(() => Object.values(comments).reduce((s, a) => s + a.length, 0), [comments]);
  const totalLikes    = useMemo(() => posts.reduce((s, p) => s + p.likes, 0), [posts]);
  const breakingCount = useMemo(() => posts.filter(p => p.breaking).length, [posts]);

  const tagCounts = useMemo(() => {
    const c = {};
    posts.forEach(p => p.tags.forEach(t => { c[t] = (c[t] || 0) + 1; }));
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [posts]);

  const locationCounts = useMemo(() => {
    const c = {};
    posts.forEach(p => { c[p.location] = (c[p.location] || 0) + 1; });
    return Object.entries(c).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [posts]);

  const reporters = useMemo(() => {
    const map = {};
    posts.forEach(p => {
      if (!map[p.author]) map[p.author] = { author: p.author, handle: p.handle, av: p.av, avColor: p.avColor, bio: p.bio, posts: [], totalLikes: 0, totalShares: 0 };
      map[p.author].posts.push(p);
      map[p.author].totalLikes  += p.likes;
      map[p.author].totalShares += p.shares;
    });
    return Object.values(map).sort((a, b) => b.posts.length - a.posts.length);
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (!adminSearch.trim()) return posts;
    const q = adminSearch.toLowerCase();
    return posts.filter(p => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)));
  }, [posts, adminSearch]);

  const TABS = [["dashboard", "◈ Dashboard"], ["posts", "◉ Posts"], ["comments", "◎ Comments"], ["reporters", "✦ Reporters"]];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 200, background: "var(--bg)", overflowY: "auto", animation: "fadeIn .2s ease" }}>

      {/* Admin header */}
      <div style={{ position: "sticky", top: 0, zIndex: 10, background: "linear-gradient(to right,#0D0500,var(--surface))", borderBottom: "1px solid rgba(240,165,0,.25)", display: "flex", alignItems: "center", padding: "14px 24px", gap: 16 }}>
        <RealtimeLogo size={26} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--gold)", letterSpacing: 3 }}>ADMIN PANEL</div>
          <div style={{ fontFamily: "var(--sans)", fontSize: 12, color: "var(--muted)", marginTop: 2 }}>Realtime News Kenya — Control Center</div>
        </div>
        <button onClick={onClose} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 10, padding: "7px 18px", borderRadius: 4, letterSpacing: 1, transition: "border-color .15s, color .15s" }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--gold)"; e.currentTarget.style.color = "var(--gold)"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
        >← EXIT ADMIN</button>
      </div>

      {/* Tab bar */}
      <div style={{ display: "flex", borderBottom: "1px solid var(--border)", padding: "0 24px", background: "var(--surface)", position: "sticky", top: 57, zIndex: 9 }}>
        {TABS.map(([v, l]) => (
          <button key={v} onClick={() => setActiveTab(v)} style={{ background: "none", border: "none", borderBottom: activeTab === v ? "2px solid var(--gold)" : "2px solid transparent", color: activeTab === v ? "var(--text)" : "var(--muted)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 1, padding: "13px 20px", whiteSpace: "nowrap", transition: "all .15s" }}>{l}</button>
        ))}
      </div>

      {/* Content */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "28px 24px" }}>

        {/* ── DASHBOARD ── */}
        {activeTab === "dashboard" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            {/* Stat cards */}
            <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
              {[
                ["TOTAL POSTS",     posts.length,                "var(--gold)"],
                ["BREAKING",        breakingCount,               "var(--red)"],
                ["TOTAL COMMENTS",  totalComments,               "var(--blue)"],
                ["TOTAL LIKES",     totalLikes.toLocaleString(), "var(--green)"],
              ].map(([label, val, color]) => (
                <div key={label} style={{ flex: "1 1 180px", background: "var(--surface)", border: "1px solid var(--border)", borderTop: `3px solid ${color}`, borderRadius: 8, padding: "20px 22px" }}>
                  <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", letterSpacing: 2, marginBottom: 10 }}>{label}</div>
                  <div style={{ fontFamily: "var(--serif)", fontSize: 36, fontWeight: 900, color }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Live viewers */}
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 20 }}>
              <div style={{ display: "inline-block", width: 10, height: 10, borderRadius: "50%", background: "var(--blue)", animation: "pulse 1.2s infinite" }} />
              <div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", letterSpacing: 2, marginBottom: 4 }}>LIVE VIEWERS RIGHT NOW</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 900, color: "var(--blue)" }}>{viewers.toLocaleString()}</div>
              </div>
            </div>

            {/* Tags + Locations */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              <div style={{ flex: "1 1 300px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--gold)", letterSpacing: 2 }}>TRENDING TOPICS</span>
                </div>
                {tagCounts.map(([tag, count], i) => (
                  <div key={tag} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 16px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted2)", width: 16 }}>{i + 1}</span>
                      <span style={{ fontSize: 13, fontWeight: 500 }}>#{tag}</span>
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", background: "var(--surface2)", padding: "1px 8px", borderRadius: 10 }}>{count}</span>
                  </div>
                ))}
              </div>
              <div style={{ flex: "1 1 300px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                  <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--gold)", letterSpacing: 2 }}>ACTIVE LOCATIONS</span>
                </div>
                {locationCounts.map(([loc, count]) => (
                  <div key={loc} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 16px", borderBottom: "1px solid var(--border)" }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                      <span style={{ color: "var(--gold)" }}>◈</span>
                      <span style={{ fontSize: 12, color: "var(--muted)" }}>{loc}</span>
                    </div>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted2)" }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── POSTS ── */}
        {activeTab === "posts" && (
          <div style={{ animation: "fadeUp .3s ease" }}>
            <div style={{ position: "relative", marginBottom: 18 }}>
              <span style={{ position: "absolute", left: 13, top: "50%", transform: "translateY(-50%)", color: "var(--muted2)", fontSize: 13, pointerEvents: "none" }}>⌕</span>
              <input value={adminSearch} onChange={e => setAdminSearch(e.target.value)} placeholder="Search posts by title, author or tag..."
                style={{ width: "100%", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 6, padding: "10px 14px 10px 34px", color: "var(--text)", fontFamily: "var(--sans)", fontSize: 13, outline: "none", transition: "border-color .2s" }}
                onFocus={e => { e.target.style.borderColor = "var(--gold)"; }} onBlur={e => { e.target.style.borderColor = "var(--border)"; }}
              />
            </div>
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
              {filteredPosts.length === 0 && <div style={{ padding: 40, textAlign: "center", color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 11 }}>No posts match your search.</div>}
              {filteredPosts.map((post, i) => (
                <div key={post.id} style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 18px", borderBottom: i < filteredPosts.length - 1 ? "1px solid var(--border)" : "none", borderLeft: post.breaking ? "3px solid var(--gold)" : "3px solid transparent", background: "var(--surface)", transition: "background .12s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--surface2)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "var(--surface)"; }}
                >
                  <Avatar av={post.av} avColor={post.avColor} size={34} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: "var(--serif)", fontWeight: 700, fontSize: 14, lineHeight: 1.3, marginBottom: 4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{post.title}</div>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <TypeBadge type={post.type} />
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>{post.author}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted2)" }}>{post.time}</span>
                      <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)" }}>♡ {post.likes}</span>
                      {post.breaking && <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--gold)", letterSpacing: 1.5 }}>● BREAKING</span>}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => onToggleBreaking(post.id)} style={{ background: post.breaking ? "rgba(240,165,0,.15)" : "var(--surface2)", border: `1px solid ${post.breaking ? "var(--gold)" : "var(--border)"}`, color: post.breaking ? "var(--gold)" : "var(--muted)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 9, padding: "5px 10px", borderRadius: 4, letterSpacing: 1, transition: "all .15s" }}>
                      ⚡ {post.breaking ? "UNBREAK" : "BREAK"}
                    </button>
                    <button onClick={() => onOpenProfile(post)} style={{ background: "var(--surface2)", border: "1px solid var(--border)", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 9, padding: "5px 10px", borderRadius: 4, letterSpacing: 1, transition: "all .15s" }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--blue)"; e.currentTarget.style.color = "var(--blue)"; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--muted)"; }}
                    >👁 VIEW</button>
                    <button onClick={() => onDeletePost(post.id)} style={{ background: "rgba(230,57,70,.1)", border: "1px solid rgba(230,57,70,.3)", color: "var(--red)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 9, padding: "5px 10px", borderRadius: 4, letterSpacing: 1, transition: "all .15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "rgba(230,57,70,.2)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "rgba(230,57,70,.1)"; }}
                    >🗑 DELETE</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COMMENTS ── */}
        {activeTab === "comments" && (
          <div style={{ animation: "fadeUp .3s ease", display: "flex", flexDirection: "column", gap: 20 }}>
            {Object.entries(comments).filter(([, arr]) => arr.length > 0).map(([postId, commentArr]) => {
              const matchedPost = posts.find(p => String(p.id) === String(postId));
              return (
                <div key={postId} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, overflow: "hidden" }}>
                  <div style={{ padding: "12px 18px", background: "var(--surface2)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--gold)", letterSpacing: 1.5, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {matchedPost ? matchedPost.title : "[Deleted Post]"}
                    </span>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", flexShrink: 0 }}>{commentArr.length} comment{commentArr.length !== 1 ? "s" : ""}</span>
                  </div>
                  {commentArr.map((c, i) => (
                    <div key={c.id} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "12px 18px", borderBottom: i < commentArr.length - 1 ? "1px solid var(--border)" : "none" }}>
                      <Avatar av={c.av} avColor={c.avColor} size={30} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", gap: 8, alignItems: "baseline", marginBottom: 3 }}>
                          <span style={{ fontWeight: 600, fontSize: 12 }}>{c.author}</span>
                          <span style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted2)" }}>{c.time}</span>
                        </div>
                        <p style={{ color: "var(--muted)", fontSize: 13, lineHeight: 1.6 }}>{c.text}</p>
                      </div>
                      <button onClick={() => onDeleteComment(postId, c.id)} style={{ background: "rgba(230,57,70,.1)", border: "1px solid rgba(230,57,70,.3)", color: "var(--red)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 9, padding: "4px 10px", borderRadius: 4, letterSpacing: 1, flexShrink: 0, transition: "all .15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(230,57,70,.2)"; }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(230,57,70,.1)"; }}
                      >🗑 DEL</button>
                    </div>
                  ))}
                </div>
              );
            })}
            {Object.values(comments).every(a => a.length === 0) && (
              <div style={{ padding: 60, textAlign: "center", color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 11 }}>No comments yet.</div>
            )}
          </div>
        )}

        {/* ── REPORTERS ── */}
        {activeTab === "reporters" && (
          <div style={{ animation: "fadeUp .3s ease", display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(320px,1fr))", gap: 14 }}>
            {reporters.map(r => (
              <div key={r.author} style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, padding: "20px" }}>
                <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginBottom: 14 }}>
                  <Avatar av={r.av} avColor={r.avColor} size={48} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{r.author}</div>
                    <div style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)", marginBottom: r.bio ? 8 : 0 }}>{r.handle}</div>
                    {r.bio && <p style={{ color: "var(--muted2)", fontSize: 12, lineHeight: 1.5 }}>{r.bio}</p>}
                  </div>
                </div>
                <div style={{ display: "flex", borderTop: "1px solid var(--border)", paddingTop: 14 }}>
                  {[["Posts", r.posts.length, "var(--gold)"], ["Likes", r.totalLikes.toLocaleString(), "var(--red)"], ["Shares", r.totalShares.toLocaleString(), "var(--blue)"]].map(([label, val, color]) => (
                    <div key={label} style={{ flex: 1, textAlign: "center" }}>
                      <div style={{ fontFamily: "var(--serif)", fontSize: 20, fontWeight: 700, color }}>{val}</div>
                      <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--muted)", letterSpacing: 1, marginTop: 2 }}>{label.toUpperCase()}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

/* ─────────────────────────── MAIN APP ───────────────────────────────────── */
function NewsApp({ user, onLogout }) {
  const [posts, setPosts] = useState(SAMPLE_POSTS);
  const [comments, setComments] = useState(SAMPLE_COMMENTS);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [composing, setComposing] = useState(false);
  const [viewers, setViewers] = useState(3842);
  const [profilePost, setProfilePost] = useState(null);
  const [adminOpen, setAdminOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setViewers(v => v + Math.floor(Math.random() * 5 - 1)), 2500);
    return () => clearInterval(t);
  }, []);

  const addComment = (postId, text) => {
    const newComment = { id: Date.now(), author: user.email.split("@")[0], av: user.email.slice(0, 2).toUpperCase(), avColor: "var(--gold)", text, time: "just now" };
    setComments(prev => ({ ...prev, [postId]: [...(prev[postId] || []), newComment] }));
  };

  const addPost = p => {
    setPosts(prev => [p, ...prev]);
    setComments(prev => ({ ...prev, [p.id]: [] }));
  };

  const deletePost = postId => {
    setPosts(prev => prev.filter(p => p.id !== postId));
    setComments(prev => { const next = { ...prev }; delete next[postId]; return next; });
  };

  const deleteComment = (postId, commentId) => {
    setComments(prev => ({ ...prev, [postId]: (prev[postId] || []).filter(c => c.id !== commentId) }));
  };

  const toggleBreaking = postId => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, breaking: !p.breaking } : p));
  };

  const handleTagSearch      = tag => { setSearch(tag);  setFilter("all"); };
  const handleLocationSearch = loc => { setSearch(loc);  setFilter("all"); };

  const filtered = useMemo(() => {
    let result = posts;
    if (filter === "breaking") result = result.filter(p => p.breaking);
    else if (filter !== "all") result = result.filter(p => p.type === filter);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) || p.body.toLowerCase().includes(q) ||
        p.author.toLowerCase().includes(q) || p.location.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      );
    }
    return result;
  }, [posts, filter, search]);

  return (
    <>
      <style>{GLOBAL_CSS}</style>
      <div style={{ background: "var(--bg)", minHeight: "100vh" }}>

        {/* Header */}
        <header style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--bg)", borderBottom: "1px solid var(--border)" }}>
          <div style={{ maxWidth: 1080, margin: "0 auto", padding: "12px 16px", display: "flex", alignItems: "center", gap: 16 }}>
            <RealtimeLogo size={30} />
            <div style={{ flex: 1, maxWidth: 380, position: "relative" }}>
              <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: searchFocused ? "var(--gold)" : "var(--muted2)", fontSize: 13, transition: "color .2s", pointerEvents: "none" }}>⌕</span>
              <input value={search} onChange={e => setSearch(e.target.value)} onFocus={() => setSearchFocused(true)} onBlur={() => setSearchFocused(false)} placeholder="Search posts, reporters, locations..."
                style={{ width: "100%", background: "var(--surface)", border: `1px solid ${searchFocused ? "var(--gold)" : "var(--border)"}`, borderRadius: 20, padding: "8px 14px 8px 34px", color: "var(--text)", fontFamily: "var(--sans)", fontSize: 13, outline: "none", transition: "border-color .2s" }}
              />
              {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 14 }}>✕</button>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
                <span style={{ color: "var(--blue)" }}>{viewers.toLocaleString()}</span> live
              </span>
              {user.isAdmin && (
                <button onClick={() => setAdminOpen(true)} style={{ background: "transparent", border: "1px solid var(--gold)", color: "var(--gold)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 9, letterSpacing: 2, padding: "5px 12px", borderRadius: 4, fontWeight: 700, transition: "background .15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "var(--gold-dim)"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; }}
                >⚙ ADMIN</button>
              )}
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--mono)", fontWeight: 700, fontSize: 12, color: "var(--bg)", cursor: "pointer" }} title={user.email} onClick={onLogout}>
                {user.email.slice(0, 2).toUpperCase()}
              </div>
              <button onClick={() => setComposing(true)} style={{ background: "var(--gold)", border: "none", color: "var(--bg)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 1.5, padding: "8px 18px", borderRadius: 5, fontWeight: 700, transition: "opacity .15s" }}
                onMouseEnter={e => { e.currentTarget.style.opacity = ".85"; }}
                onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
              >+ POST</button>
            </div>
          </div>
          <div style={{ background: "var(--red)", height: 30, display: "flex", alignItems: "center", overflow: "hidden" }}>
            <div style={{ background: "var(--bg)", height: "100%", padding: "0 14px", display: "flex", alignItems: "center", flexShrink: 0 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--red)", letterSpacing: 2, fontWeight: 700 }}>LIVE</span>
            </div>
            <div style={{ display: "flex", animation: "marquee 38s linear infinite", whiteSpace: "nowrap" }}>
              {[...TICKER, ...TICKER].map((t, i) => (
                <span key={i} style={{ fontFamily: "var(--mono)", fontSize: 11, color: "#fff", padding: "0 28px", letterSpacing: .4 }}>{t}</span>
              ))}
            </div>
          </div>
        </header>

        {/* Body */}
        <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", gap: 20, padding: "0 16px", alignItems: "flex-start" }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid var(--border)" }}>
              {[["all", "All"], ["breaking", "🔴 Breaking"], ["article", "✦ Articles"], ["image", "◉ Photos"], ["video", "▶ Video"]].map(([v, l]) => (
                <button key={v} onClick={() => setFilter(v)} style={{ background: "none", border: "none", borderBottom: filter === v ? "2px solid var(--gold)" : "2px solid transparent", color: filter === v ? "var(--text)" : "var(--muted)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 1, padding: "13px 18px", whiteSpace: "nowrap", transition: "all .15s" }}>{l}</button>
              ))}
            </div>
            {search && (
              <div style={{ padding: "10px 22px", background: "var(--gold-dim)", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--gold)" }}>{filtered.length} result{filtered.length !== 1 ? "s" : ""} for "{search}"</span>
                <button onClick={() => setSearch("")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1 }}>CLEAR ✕</button>
              </div>
            )}
            {filtered.map(p => (
              <PostCard key={p.id} post={p} allPosts={posts} comments={comments[p.id] || []} onAddComment={addComment} onOpenProfile={setProfilePost} onTagSearch={handleTagSearch} />
            ))}
            {filtered.length === 0 && (
              <div style={{ padding: 60, textAlign: "center", color: "var(--muted)", fontFamily: "var(--mono)", fontSize: 12 }}>
                {search ? `No results for "${search}"` : "No posts in this category yet."}
              </div>
            )}
          </div>
          <div style={{ paddingTop: 12 }}>
            <TrendingSidebar posts={posts} onTagSearch={handleTagSearch} onLocationSearch={handleLocationSearch} />
          </div>
        </div>

        {/* FAB */}
        <button onClick={() => setComposing(true)} style={{ position: "fixed", bottom: 26, right: 26, width: 54, height: 54, borderRadius: "50%", background: "var(--gold)", border: "none", color: "var(--bg)", fontSize: 24, cursor: "pointer", boxShadow: "0 4px 24px rgba(240,165,0,.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 90, transition: "transform .2s, box-shadow .2s" }}
          onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.1)"; e.currentTarget.style.boxShadow = "0 6px 32px rgba(240,165,0,.55)"; }}
          onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(240,165,0,.4)"; }}
        >+</button>

        {composing   && <ComposeModal user={user} onClose={() => setComposing(false)} onPost={addPost} />}
        {profilePost && <ProfileModal post={profilePost} allPosts={posts} onClose={() => setProfilePost(null)} onTagSearch={handleTagSearch} />}
        {adminOpen   && (
          <AdminPanel
            posts={posts} comments={comments} viewers={viewers}
            onClose={() => setAdminOpen(false)}
            onDeletePost={deletePost} onDeleteComment={deleteComment}
            onToggleBreaking={toggleBreaking} onOpenProfile={setProfilePost}
          />
        )}
      </div>
    </>
  );
}

/* ─────────────────────────── AUTH SCREENS ───────────────────────────────── */
function AuthScreen({ onAuth }) {
  const [step, setStep] = useState("welcome");
  const [email, setEmail] = useState("");           // only set on submit, not on keypress
  const [emailErr, setEmailErr] = useState("");
  const [passwordErr, setPasswordErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [otpErr, setOtpErr] = useState("");
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [adminErr, setAdminErr] = useState("");
  const otpRefs          = useRef([]);
  const emailRef         = useRef();
  const passwordRef      = useRef();
  const adminEmailRef    = useRef();
  const adminPasswordRef = useRef();

  useEffect(() => {
    if (step !== "otp") return;
    setCountdown(60); setCanResend(false);
    const t = setInterval(() => {
      setCountdown(c => { if (c <= 1) { clearInterval(t); setCanResend(true); return 0; } return c - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [step]);

  const validateEmail = e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(e);

  const sendCode = async () => {
    const val  = emailRef.current?.value?.trim()    || "";
    const pass = passwordRef.current?.value?.trim() || "";
    let hasErr = false;
    if (!validateEmail(val))  { setEmailErr("Please enter a valid email address"); hasErr = true; }
    else setEmailErr("");
    if (pass.length < 6)      { setPasswordErr("Password must be at least 6 characters"); hasErr = true; }
    else setPasswordErr("");
    if (hasErr) return;
    setEmail(val);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1400));
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedCode(code);
    setLoading(false);
    setStep("otp");
  };

  const adminLogin = async () => {
    const ae = adminEmailRef.current?.value?.trim()    || "";
    const ap = adminPasswordRef.current?.value?.trim() || "";
    if (ae !== ADMIN_EMAIL || ap !== ADMIN_PASSWORD) {
      setAdminErr("Invalid admin credentials. Please try again."); return;
    }
    setAdminErr(""); setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    setLoading(false);
    setStep("success");
    await new Promise(r => setTimeout(r, 1800));
    onAuth({ email: ae, isAdmin: true });
  };

  const handleOtpKey = (i, e) => { if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus(); };
  const handleOtpChange = (i, val) => {
    const v = val.replace(/\D/g, "").slice(-1);
    const next = [...otp]; next[i] = v;
    setOtp(next); setOtpErr("");
    if (v && i < 5) otpRefs.current[i + 1]?.focus();
  };
  const handleOtpPaste = e => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) { setOtp(pasted.split("")); otpRefs.current[5]?.focus(); }
    e.preventDefault();
  };

  const verifyOtp = async () => {
    const entered = otp.join("");
    if (entered.length < 6) { setOtpErr("Please enter all 6 digits"); return; }
    if (entered !== generatedCode) { setOtpErr("Incorrect code. Please try again."); setOtp(["", "", "", "", "", ""]); otpRefs.current[0]?.focus(); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setStep("success");
    await new Promise(r => setTimeout(r, 1800));
    onAuth({ email, isAdmin: email === ADMIN_EMAIL });
  };

  const resend = () => {
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setGeneratedCode(code); setStep("otp"); setOtp(["", "", "", "", "", ""]);
  };

  const BgDecor = () => (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{ position: "absolute", top: -160, right: -160, width: 520, height: 520, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,165,0,.08) 0%, transparent 70%)" }} />
      <div style={{ position: "absolute", bottom: -200, left: -100, width: 600, height: 600, borderRadius: "50%", background: "radial-gradient(circle, rgba(240,165,0,.05) 0%, transparent 70%)" }} />
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: .04 }}>
        <defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--gold)" strokeWidth="0.5" /></pattern></defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );

  const Card = ({ children, extraStyle }) => (
    <div style={{ position: "relative", zIndex: 1, background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, padding: "40px 36px", width: "min(440px, 94vw)", boxShadow: "0 24px 80px rgba(0,0,0,.6)", animation: "scaleIn .3s ease", ...extraStyle }}>{children}</div>
  );

  /* WELCOME */
  if (step === "welcome") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", position: "relative", padding: 24 }}>
      <style>{GLOBAL_CSS}</style><BgDecor />
      <Card>
        <div style={{ textAlign: "center", marginBottom: 32, animation: "fadeUp .5s ease" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 18 }}><RealtimeLogo size={52} showText={false} /></div>
          <h1 style={{ fontFamily: "var(--serif)", fontSize: 32, fontWeight: 900, letterSpacing: "-.04em", color: "var(--text)", marginBottom: 4 }}>REALTIME<span style={{ color: "var(--gold)" }}>.</span>NEWS</h1>
          <div style={{ fontFamily: "var(--mono)", fontSize: 13, color: "var(--gold)", letterSpacing: "0.2em", marginBottom: 12 }}>KENYA</div>
          <p style={{ color: "var(--muted)", fontSize: 14, lineHeight: 1.6 }}>Real news. Real locations.<br />From people who are there.</p>
        </div>
        <button onClick={() => setStep("email")} style={{ width: "100%", padding: "14px 20px", borderRadius: 8, cursor: "pointer", background: "var(--gold)", border: "none", color: "var(--bg)", fontFamily: "var(--mono)", fontWeight: 700, fontSize: 13, letterSpacing: 1, transition: "opacity .15s" }}
          onMouseEnter={e => { e.currentTarget.style.opacity = ".88"; }}
          onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
        >GET STARTED →</button>
        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid var(--border)" }}>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {[["3.8K+", "Live now"], ["12K+", "Reports today"], ["190+", "Locations"]].map(([n, l]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 700, color: "var(--gold)" }}>{n}</div>
                <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", letterSpacing: 1 }}>{l.toUpperCase()}</div>
              </div>
            ))}
          </div>
        </div>
        {/* Subtle admin link */}
        <div style={{ textAlign: "center", marginTop: 22 }}>
          <button onClick={() => setStep("admin-login")} style={{ background: "none", border: "none", color: "var(--muted2)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 10, letterSpacing: 1, textDecoration: "underline" }}>Admin Login</button>
        </div>
      </Card>
    </div>
  );

  /* ADMIN LOGIN */
  if (step === "admin-login") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", position: "relative", padding: 24 }}>
      <style>{GLOBAL_CSS}</style><BgDecor />
      <Card>
        {/* Dark gold header accent */}
        <div style={{ background: "linear-gradient(135deg,#1a0800,var(--surface2))", margin: "-40px -36px 28px", padding: "22px 36px", borderBottom: "1px solid rgba(240,165,0,.2)", borderRadius: "12px 12px 0 0" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 9, color: "var(--gold)", letterSpacing: 3, marginBottom: 6 }}>SECURE ADMIN ACCESS</div>
          <div style={{ fontFamily: "var(--serif)", fontSize: 22, fontWeight: 900, color: "var(--text)" }}>Admin Portal</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)", marginTop: 3, letterSpacing: 1 }}>REALTIME NEWS KENYA</div>
        </div>
        <button onClick={() => { setStep("welcome"); setAdminErr(""); }} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, marginBottom: 22, padding: 0, letterSpacing: 1 }}>← BACK</button>
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--gold)", letterSpacing: 1.5, display: "block", marginBottom: 7 }}>ADMIN EMAIL</label>
          <input
            ref={adminEmailRef}
            defaultValue=""
            onKeyDown={e => e.key === "Enter" && adminLogin()}
            onFocus={e => { setAdminErr(""); e.target.style.borderColor = "var(--gold)"; }}
            onBlur={e => { e.target.style.borderColor = adminErr ? "var(--red)" : "var(--border)"; }}
            placeholder="admin@example.com"
            type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false}
            style={{ width: "100%", padding: "12px 14px", background: "var(--bg)", border: `1px solid ${adminErr ? "var(--red)" : "var(--border)"}`, borderRadius: 8, color: "var(--text)", fontFamily: "var(--mono)", fontSize: 13, outline: "none", transition: "border-color .2s" }}
          />
        </div>
        <div style={{ marginBottom: adminErr ? 10 : 22 }}>
          <label style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--gold)", letterSpacing: 1.5, display: "block", marginBottom: 7 }}>PASSWORD</label>
          <input
            ref={adminPasswordRef}
            defaultValue=""
            onKeyDown={e => e.key === "Enter" && adminLogin()}
            onFocus={e => { setAdminErr(""); e.target.style.borderColor = "var(--gold)"; }}
            onBlur={e => { e.target.style.borderColor = adminErr ? "var(--red)" : "var(--border)"; }}
            placeholder="••••••••••"
            type="password" autoComplete="current-password"
            style={{ width: "100%", padding: "12px 14px", background: "var(--bg)", border: `1px solid ${adminErr ? "var(--red)" : "var(--border)"}`, borderRadius: 8, color: "var(--text)", fontFamily: "var(--mono)", fontSize: 13, outline: "none", transition: "border-color .2s" }}
          />
        </div>
        {adminErr && <p style={{ color: "var(--red)", fontSize: 12, fontFamily: "var(--mono)", marginBottom: 16 }}>{adminErr}</p>}
        <button onClick={adminLogin} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: 8, background: "var(--gold)", border: "none", color: "var(--bg)", cursor: "pointer", fontFamily: "var(--mono)", fontWeight: 700, fontSize: 12, letterSpacing: 1.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: loading ? .7 : 1 }}>
          {loading ? <><Spinner /> AUTHENTICATING…</> : "ACCESS ADMIN PANEL →"}
        </button>
      </Card>
    </div>
  );

  /* EMAIL ENTRY */
  if (step === "email") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", position: "relative", padding: 24 }}>
      <style>{GLOBAL_CSS}</style><BgDecor />
      <Card>
        <button onClick={() => setStep("welcome")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, marginBottom: 24, padding: 0, letterSpacing: 1 }}>← BACK</button>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}><RealtimeLogo size={36} showText={false} /></div>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Enter your email</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, textAlign: "center", marginBottom: 28, lineHeight: 1.6 }}>We'll send a 6-digit code to verify it's you.</p>
        {/* Email */}
        <div style={{ position: "relative", marginBottom: 6 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>✉</span>
          <input
            ref={emailRef}
            defaultValue=""
            onKeyDown={e => e.key === "Enter" && passwordRef.current?.focus()}
            onFocus={e => { setEmailErr(""); e.target.style.borderColor = "var(--gold)"; }}
            onBlur={e => { e.target.style.borderColor = emailErr ? "var(--red)" : "var(--border)"; }}
            placeholder="yourname@email.com"
            type="email" inputMode="email" autoComplete="email" autoCapitalize="none" spellCheck={false}
            style={{ width: "100%", padding: "14px 14px 14px 42px", background: "var(--bg)", border: `1px solid ${emailErr ? "var(--red)" : "var(--border)"}`, borderRadius: 8, color: "var(--text)", fontFamily: "var(--mono)", fontSize: 14, outline: "none", transition: "border-color .2s" }}
          />
        </div>
        {emailErr && <p style={{ color: "var(--red)", fontSize: 12, fontFamily: "var(--mono)", marginBottom: 8 }}>{emailErr}</p>}

        {/* Password */}
        <div style={{ position: "relative", marginBottom: 6, marginTop: emailErr ? 0 : 12 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16, pointerEvents: "none" }}>🔒</span>
          <input
            ref={passwordRef}
            defaultValue=""
            onKeyDown={e => e.key === "Enter" && sendCode()}
            onFocus={e => { setPasswordErr(""); e.target.style.borderColor = "var(--gold)"; }}
            onBlur={e => { e.target.style.borderColor = passwordErr ? "var(--red)" : "var(--border)"; }}
            placeholder="Create a password (min 6 chars)"
            type="password" autoComplete="new-password"
            style={{ width: "100%", padding: "14px 14px 14px 42px", background: "var(--bg)", border: `1px solid ${passwordErr ? "var(--red)" : "var(--border)"}`, borderRadius: 8, color: "var(--text)", fontFamily: "var(--mono)", fontSize: 14, outline: "none", transition: "border-color .2s" }}
          />
        </div>
        {passwordErr && <p style={{ color: "var(--red)", fontSize: 12, fontFamily: "var(--mono)", marginBottom: 8 }}>{passwordErr}</p>}

        <button onClick={sendCode} disabled={loading} style={{ width: "100%", padding: "14px", marginTop: 16, borderRadius: 8, background: "var(--gold)", border: "none", color: "var(--bg)", cursor: "pointer", fontFamily: "var(--mono)", fontWeight: 700, fontSize: 12, letterSpacing: 1.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: loading ? .7 : 1 }}>
          {loading ? <><Spinner /> SENDING CODE…</> : "SEND VERIFICATION CODE →"}
        </button>
      </Card>
    </div>
  );

  /* OTP */
  if (step === "otp") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)", position: "relative", padding: 24 }}>
      <style>{GLOBAL_CSS}</style><BgDecor />
      <Card>
        <button onClick={() => setStep("email")} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, marginBottom: 24, padding: 0, letterSpacing: 1 }}>← CHANGE EMAIL</button>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
          <div style={{ width: 60, height: 60, borderRadius: "50%", background: "var(--gold-dim)", border: "1px solid var(--gold)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>✉</div>
        </div>
        <h2 style={{ fontFamily: "var(--serif)", fontSize: 26, fontWeight: 700, textAlign: "center", marginBottom: 8 }}>Check your inbox</h2>
        <p style={{ color: "var(--muted)", fontSize: 13, textAlign: "center", marginBottom: 6, lineHeight: 1.6 }}>
          Code sent to <strong style={{ color: "var(--text)", fontFamily: "var(--mono)", fontSize: 13 }}>{email}</strong>
        </p>
        <div style={{ background: "var(--gold-dim)", border: "1px dashed rgba(240,165,0,.3)", borderRadius: 6, padding: "10px 14px", marginBottom: 20, textAlign: "center" }}>
          <div style={{ fontFamily: "var(--mono)", fontSize: 10, color: "var(--gold)", letterSpacing: 1.5, marginBottom: 4 }}>⚠ DEMO — YOUR CODE IS</div>
          <div style={{ fontFamily: "var(--mono)", fontSize: 26, fontWeight: 700, color: "var(--gold)", letterSpacing: 8 }}>{generatedCode}</div>
        </div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", marginBottom: 10 }} onPaste={handleOtpPaste}>
          {otp.map((d, i) => (
            <input key={i} ref={el => otpRefs.current[i] = el} value={d} onChange={e => handleOtpChange(i, e.target.value)} onKeyDown={e => handleOtpKey(i, e)} maxLength={1} inputMode="numeric"
              style={{ width: 48, height: 58, textAlign: "center", borderRadius: 8, background: "var(--bg)", border: `2px solid ${d ? "var(--gold)" : otpErr ? "var(--red)" : "var(--border)"}`, color: "var(--text)", fontFamily: "var(--mono)", fontSize: 24, fontWeight: 700, outline: "none", transition: "border-color .15s, transform .1s", transform: d ? "scale(1.04)" : "scale(1)" }}
              onFocus={e => { if (!otpErr) e.target.style.borderColor = "var(--gold)"; }}
            />
          ))}
        </div>
        {otpErr && <p style={{ color: "var(--red)", fontSize: 12, fontFamily: "var(--mono)", textAlign: "center", marginBottom: 8 }}>{otpErr}</p>}
        <div style={{ textAlign: "center", marginBottom: 18, fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)" }}>
          {canResend
            ? <button onClick={resend} style={{ background: "none", border: "none", color: "var(--gold)", cursor: "pointer", fontFamily: "var(--mono)", fontSize: 11, letterSpacing: 1 }}>RESEND CODE</button>
            : <>Resend in <span style={{ color: "var(--text)", fontWeight: 700 }}>{countdown}s</span></>}
        </div>
        <button onClick={verifyOtp} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: 8, background: "var(--gold)", border: "none", color: "var(--bg)", cursor: "pointer", fontFamily: "var(--mono)", fontWeight: 700, fontSize: 12, letterSpacing: 1.5, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, opacity: loading ? .7 : 1 }}>
          {loading ? <><Spinner /> VERIFYING…</> : "VERIFY & ENTER →"}
        </button>
      </Card>
    </div>
  );

  /* SUCCESS */
  if (step === "success") return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg)" }}>
      <style>{GLOBAL_CSS}</style>
      <div style={{ textAlign: "center", animation: "scaleIn .4s ease" }}>
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "var(--gold)", margin: "0 auto 20px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 0 0 20px rgba(240,165,0,.1)" }}>
          <svg width="36" height="36" viewBox="0 0 40 40">
            <polyline points="8,20 17,30 32,12" fill="none" stroke="var(--bg)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" style={{ strokeDasharray: 40, strokeDashoffset: 0, animation: "checkIn .5s ease .1s both" }} />
          </svg>
        </div>
        <div style={{ fontFamily: "var(--serif)", fontSize: 28, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>Verified!</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 12, color: "var(--muted)", letterSpacing: 1 }}>ENTERING REALTIME NEWS KENYA…</div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}><Spinner /></div>
      </div>
    </div>
  );
}

/* ─────────────────────────── ROOT ───────────────────────────────────────── */
export default function App() {
  const [user, setUser] = useState(null);
  if (!user) return <AuthScreen onAuth={setUser} />;
  return <NewsApp user={user} onLogout={() => setUser(null)} />;
}
